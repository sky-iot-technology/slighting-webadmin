# Permissions Service — UI Workflow

Base URL: `http://permissions:9040` (qua nginx: `https://<domain>/`)
Auth: Tất cả request cần `Authorization: Bearer <token>`
Content-Type: `application/json`

---

## Tổng quan 2 loại role

| Loại | Scope | Dùng khi nào |
|---|---|---|
| **Management Role** | Domain hoặc Org | Admin cấp quyền hàng loạt cho nhiều entity cùng loại |
| **Entity Role** | Một entity cụ thể | Cấp quyền chi tiết trên 1 đối tượng (1 storage, 1 device...) |

---

## 1. Management Role — Domain-scoped

Cấp quyền cho user trên **tất cả entity cùng loại trong một domain**.

### Bước 1: Lấy available actions cho từng entity type

```
GET /{entityType}/any-id/roles/available-actions
```

> `any-id` có thể là bất kỳ giá trị hợp lệ — chỉ dùng để lấy danh sách action.

```
GET /storage/any-id/roles/available-actions
→ ["create", "view", "list", "update", "update_tags", "delete"]

GET /device/any-id/roles/available-actions
→ ["create", "view", "list", "update", ...]

GET /group/any-id/roles/available-actions
→ ["read", "update", "delete", "membership", ...]
```

### Bước 2: Tạo Management Role domain-scoped

```
POST /management-roles
{
  "name": "editor",
  "domain_id": "domain-01",
  "permissions": [
    {"entity_type": "storage", "actions": ["view", "list", "update"]},
    {"entity_type": "device",  "actions": ["view", "list"]},
    {"entity_type": "group",   "actions": ["read"]}
  ]
}
→ 201 Created
→ {"id": "role-xxx", "name": "editor", "domain_id": "domain-01", ...}
```

> **Validation**: phải có đúng một trong `domain_id` hoặc `org_id`.

### Bước 3A: Gán user KHÔNG scope (domain-wide)

User có quyền trên **tất cả entity cùng loại trong domain**.

```
POST /management-roles/role-xxx/members
{
  "members": [
    {"user_id": "user-01"}
  ]
}
→ 200 OK

SpiceDB relations được tạo:
  domain:domain-01#storage_view@user:user-01
  domain:domain-01#storage_list@user:user-01
  domain:domain-01#device_view@user:user-01
  domain:domain-01#group_read@user:user-01

→ user-01 thấy TẤT CẢ storage, device, group trong domain-01
```

### Bước 3B: Gán user CÓ scope (giới hạn theo cây group)

User chỉ có quyền trên entity được chỉ định và **descendants** của nó.

```
POST /management-roles/role-xxx/members
{
  "members": [
    {"user_id": "user-01", "scope_entity_type": "group", "scope_entity_id": "group-1.2"}
  ]
}
→ 200 OK

SpiceDB relations được tạo:
  // device: scoped theo group qua relation client_* (device = client trong SpiceDB)
  group:group-1.2#client_read@user:user-01
  group:group-1.2#subgroup_client_read@user:user-01   ← kế thừa xuống device của group con

  // group: entity-level scoped
  group:group-1.2#read@user:user-01
  group:group-1.2#subgroup_read@user:user-01   ← kế thừa xuống con

  // storage: chưa có quan hệ scoped theo group trong schema → vẫn domain-level
  domain:domain-01#storage_view@user:user-01

→ user-01 thấy:
  ✓ device thuộc group-1.2 và subgroups (CÓ scope — không còn thấy device ngoài group)
  ✓ group-1.2 và subgroups (có scope)
  ✗ device thuộc group-1.1 (cha) / group-2.0 (ngang cấp) — không thấy
  ✗ group-1.1 (cha) — không thấy
  ✗ group-2.0 (ngang cấp) — không thấy

> **Lưu ý**: với entity `device`/`device_control`, scope theo group được neo trên
> object group (`client_*` + `subgroup_client_*`) nên user chỉ thấy device trong
> phạm vi group đó (kể cả khi gọi list KHÔNG kèm param group). Trước đây các quyền
> này bị ghi domain-wide gây lộ toàn bộ device — đã sửa. Các entity chưa có quan hệ
> group-scoped trong schema (vd `storage`) tạm thời vẫn ở domain-level.
```

---

## 2. Management Role — Org-scoped

Cấp quyền cho user trên **tất cả entity cùng loại trong một organization**.
Dùng khi user cần quyền trên nhiều domain trong cùng một org.

### Tạo Management Role org-scoped

```
POST /management-roles
{
  "name": "org-admin",
  "org_id": "org-01",
  "permissions": [
    {"entity_type": "domain",  "actions": ["update", "read", "enable", "disable"]},
    {"entity_type": "storage", "actions": ["create", "view", "list", "update", "delete"]},
    {"entity_type": "device",  "actions": ["create", "view", "list", "update"]}
  ]
}
→ 201 Created
→ {"id": "role-yyy", "name": "org-admin", "org_id": "org-01", ...}
```

### Gán user vào org-scoped role

```
POST /management-roles/role-yyy/members
{
  "members": [
    {"user_id": "user-02"}
  ]
}
→ 200 OK

SpiceDB relations được tạo:
  organization:org-01#domain_update@user:user-02
  organization:org-01#storage_create@user:user-02
  ...

→ user-02 có quyền trên entity thuộc TẤT CẢ domain trong org-01
```

> **Lưu ý**: org-scoped role dùng `organization:{orgID}#...` thay vì `domain:{domainID}#...` trong SpiceDB.

### List roles theo scope

```
// List theo domain
GET /management-roles?domain_id=domain-01&limit=20&offset=0
→ {"roles": [...domain-scoped roles...], "total": 5}

// List theo org
GET /management-roles?org_id=org-01&limit=20&offset=0
→ {"roles": [...org-scoped roles...], "total": 3}
```

---

## 3. Entity Role (quyền chi tiết trên 1 entity)

Role gắn trực tiếp vào 1 entity cụ thể. Dùng khi cần quyền chính xác trên 1 đối tượng.

### Tạo role cho storage "main-bucket"

```
POST /storage/storage-main-bucket/roles
{
  "name": "admin",
  "actions": ["create", "view", "update", "delete"],
  "members": ["user-03"]
}
→ 201 Created
→ SpiceDB: storage:storage-main-bucket#create@user:user-03 ...
```

### Quản lý entity role

```
GET    /storage/storage-main-bucket/roles                        → list roles
GET    /storage/storage-main-bucket/roles/{roleID}               → view role
PUT    /storage/storage-main-bucket/roles/{roleID}               → update name
DELETE /storage/storage-main-bucket/roles/{roleID}               → delete + xóa SpiceDB

POST   /storage/storage-main-bucket/roles/{roleID}/actions       → add actions
GET    /storage/storage-main-bucket/roles/{roleID}/actions       → list actions
POST   /storage/storage-main-bucket/roles/{roleID}/actions/delete → remove actions

POST   /storage/storage-main-bucket/roles/{roleID}/members       → add members
GET    /storage/storage-main-bucket/roles/{roleID}/members       → list members
POST   /storage/storage-main-bucket/roles/{roleID}/members/delete → remove members
```

Tương tự cho tất cả entity types: `device`, `group`, `channel`, `client`, `schedule`, `rule`, `report`, `domain`, `organization`.

---

## 4. Kiểm tra quyền (Policy)

### Check permissions của user

```
POST /policies/permissions
{
  "policy": {
    "subject": "user-01",
    "subject_type": "platform",
    "subject_kind": "users",
    "object": "storage-abc",
    "object_type": "storage",
    "object_kind": "storage"
  }
}
→ {"permissions": ["view", "list", "update"]}
```

UI dùng kết quả này để:
- Ẩn/hiện nút Edit, Delete
- Disable field nếu không có quyền update

### Tra cứu

```
GET /policies/objects   → "user-01 có quyền trên những object nào?"
GET /policies/subjects  → "ai có quyền trên storage-abc?"
```

---

## 5. UI Scenarios

### Màn hình: Tạo Management Role cho Domain

```
┌─────────────────────────────────────────────────────────┐
│  Tạo Management Role                                    │
│                                                         │
│  Scope: ◉ Domain  ○ Organization                        │
│  Domain: [hcm                  ▼]                       │
│  Name:   [viewer                ]                       │
│                                                         │
│  Permissions:                                           │
│  ┌──────────┬──────────────────────────────────────┐   │
│  │ storage  │ ☑ view  ☑ list  ☐ create  ☐ delete  │   │
│  │ device   │ ☑ view  ☑ list  ☐ update  ☐ delete  │   │
│  │ group    │ ☑ read  ☐ update  ☐ delete           │   │
│  └──────────┴──────────────────────────────────────┘   │
│                                                         │
│  [Tạo Role]                                             │
└─────────────────────────────────────────────────────────┘

API calls:
1. GET /storage/any/roles/available-actions → ["create","view","list","update","delete"]
2. GET /device/any/roles/available-actions  → [...]
3. GET /group/any/roles/available-actions   → [...]
4. POST /management-roles
   {"name":"viewer", "domain_id":"hcm", "permissions":[...]}
```

### Màn hình: Tạo Management Role cho Organization

```
┌─────────────────────────────────────────────────────────┐
│  Tạo Management Role                                    │
│                                                         │
│  Scope: ○ Domain  ◉ Organization                        │
│  Org: [Lemais Corp            ▼]                        │
│  Name: [org-admin              ]                        │
│                                                         │
│  Permissions:                                           │
│  ┌──────────┬──────────────────────────────────────┐   │
│  │ domain   │ ☑ read  ☑ update  ☑ enable  ☑ disable│   │
│  │ storage  │ ☑ view  ☑ list  ☑ create  ☑ delete  │   │
│  └──────────┴──────────────────────────────────────┘   │
│                                                         │
│  [Tạo Role]                                             │
└─────────────────────────────────────────────────────────┘

API call:
POST /management-roles
{"name":"org-admin", "org_id":"org-01", "permissions":[...]}
```

### Màn hình: Gán user vào role (có scope group)

```
┌─────────────────────────────────────────────────────────┐
│  Gán Member vào Role "viewer"                            │
│                                                         │
│  User: [user-01                   ]                     │
│                                                         │
│  ☐ Giới hạn scope (chỉ thấy entity được chọn trở xuống) │
│    Entity Type: [group     ▼]                           │
│    Entity ID:   [group-1.2 ▼]                           │
│                                                         │
│  [Thêm Member]                                           │
└─────────────────────────────────────────────────────────┘

API call (unscoped):
POST /management-roles/role-xxx/members
{"members": [{"user_id": "user-01"}]}

API call (scoped to group):
POST /management-roles/role-xxx/members
{"members": [{"user_id": "user-01", "scope_entity_type": "group", "scope_entity_id": "group-1.2"}]}
```

---

## 6. API Reference

| Method | Endpoint | Body/Query | Mô tả |
|---|---|---|---|
| **Management Roles** | | | |
| POST | `/management-roles` | `{name, domain_id\|org_id, permissions[]}` | Tạo role |
| GET | `/management-roles` | `?domain_id=...` hoặc `?org_id=...` | List roles theo scope |
| GET | `/management-roles/{id}` | — | View role |
| PUT | `/management-roles/{id}` | `{name}` | Update role name |
| DELETE | `/management-roles/{id}` | — | Delete role + SpiceDB |
| POST | `/management-roles/{id}/permissions` | `{permissions[]}` | Thêm permissions |
| DELETE | `/management-roles/{id}/permissions` | `{permissions[]}` | Xóa permissions |
| POST | `/management-roles/{id}/members` | `{members[{user_id, scope?}]}` | Thêm members |
| GET | `/management-roles/{id}/members` | — | List members |
| DELETE | `/management-roles/{id}/members` | `{members[]}` | Xóa members |
| **Entity Roles** | | | |
| POST | `/{type}/{id}/roles` | `{name, actions[], members[]}` | Tạo entity role |
| GET | `/{type}/{id}/roles` | `?limit&offset` | List entity roles |
| GET | `/{type}/{id}/roles/{roleId}` | — | View entity role |
| PUT | `/{type}/{id}/roles/{roleId}` | `{name}` | Update role name |
| DELETE | `/{type}/{id}/roles/{roleId}` | — | Delete entity role |
| GET | `/{type}/{id}/roles/available-actions` | — | Lấy danh sách actions |
| POST | `/{type}/{id}/roles/{roleId}/actions` | `{actions[]}` | Thêm actions |
| GET | `/{type}/{id}/roles/{roleId}/actions` | — | List actions |
| POST | `/{type}/{id}/roles/{roleId}/actions/delete` | `{actions[]}` | Xóa actions |
| POST | `/{type}/{id}/roles/{roleId}/members` | `{members[]}` | Thêm members |
| GET | `/{type}/{id}/roles/{roleId}/members` | `?limit&offset` | List members |
| POST | `/{type}/{id}/roles/{roleId}/members/delete` | `{members[]}` | Xóa members |
| **Policies** | | | |
| POST | `/policies` | `{policy{}}` | Add policy |
| POST | `/policies/batch` | `{policies[]}` | Add nhiều policies |
| POST | `/policies/delete` | `{policies[]}` | Delete policies |
| POST | `/policies/delete-filter` | `{policy{}}` | Delete theo filter |
| GET | `/policies/objects` | `{policy{}, limit}` | List objects của subject |
| GET | `/policies/subjects` | `{policy{}, limit}` | List subjects của object |
| POST | `/policies/permissions` | `{policy{}}` | Check permissions |

---

## 7. Entity types hợp lệ

| entityType | SpiceDB definition | Ghi chú |
|---|---|---|
| `storage` | `definition storage` | |
| `device` | `definition device` | |
| `schedule` | `definition schedule` | |
| `rule` | `definition rule` | |
| `report` | `definition report` | |
| `group` | `definition group` | Hỗ trợ scope + subgroup |
| `client` | `definition client` | |
| `channel` | `definition channel` | |
| `domain` | `definition domain` | |
| `organization` | `definition organization` | Mới thêm — org-level role mgmt |

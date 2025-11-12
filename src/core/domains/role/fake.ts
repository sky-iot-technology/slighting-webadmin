import { Role } from './type';

export const fakeRoles: Role[] = [
  {
    id: 'c8b6f2d0-1111-4a2b-9e0d-9a2f35ad8a01',
    name: 'Quản trị viên hệ thống',
    createdAt: '2025-11-01T08:30:00Z',
    status: 'enabled',
    note: 'Có toàn quyền truy cập và cấu hình hệ thống'
  },
  {
    id: 'a2e9c3b1-2222-4f45-8423-8f32bb73cd10',
    name: 'Trưởng phòng nhân sự',
    createdAt: '2025-11-02T09:15:00Z',
    status: 'enabled',
    note: 'Quản lý nhân sự và phân quyền nhân viên'
  },
  {
    id: 'b4f5a0c3-3333-49e8-b91a-4cf9ea50aa33',
    name: 'Nhân viên hành chính',
    createdAt: '2025-11-03T10:00:00Z',
    status: 'enabled',
    note: 'Xử lý công việc hành chính, giấy tờ nội bộ'
  },
  {
    id: 'e8b2a3c4-4444-4b62-bf12-2cf6a7dbbc44',
    name: 'Trưởng nhóm kỹ thuật',
    createdAt: '2025-11-04T10:45:00Z',
    status: 'enabled',
    note: 'Giám sát bảo trì và hỗ trợ kỹ thuật cho thiết bị'
  },
  {
    id: 'f9d0b4e5-5555-4c71-9240-1af5d6decd55',
    name: 'Kỹ thuật viên bảo trì',
    createdAt: '2025-11-05T11:20:00Z',
    status: 'enabled',
    note: 'Thực hiện kiểm tra, bảo dưỡng thiết bị định kỳ'
  },
  {
    id: 'd2a7e8f9-6666-48e2-82c3-0bd5f7efde66',
    name: 'Nhân viên kế toán',
    createdAt: '2025-11-06T11:55:00Z',
    status: 'enabled',
    note: 'Quản lý công nợ, chi phí và hóa đơn nội bộ'
  },
  {
    id: 'a4c9f0b2-7777-45d5-96a1-9cd6e8ceff77',
    name: 'Trưởng phòng kinh doanh',
    createdAt: '2025-11-07T12:30:00Z',
    status: 'enabled',
    note: 'Theo dõi doanh số, báo cáo doanh thu hàng tháng'
  },
  {
    id: 'e3b8c1d4-8888-48e9-b7f2-3ef9f8ceaa88',
    name: 'Nhân viên kinh doanh',
    createdAt: '2025-11-08T13:05:00Z',
    status: 'enabled',
    note: 'Tư vấn khách hàng, thực hiện hợp đồng bán hàng'
  },
  {
    id: 'b5d7e2f8-9999-45f3-a6b1-4cf7e9cdcc99',
    name: 'Nhân viên kho',
    createdAt: '2025-11-09T14:10:00Z',
    status: 'enabled',
    note: 'Quản lý xuất nhập kho, kiểm kê hàng hóa'
  },
  {
    id: 'f1a2b3c4-aaaa-4d1e-913f-6cf8f9aebbaa',
    name: 'Nhân viên bảo vệ',
    createdAt: '2025-11-10T15:00:00Z',
    status: 'enabled',
    note: 'Đảm bảo an ninh, trật tự khu vực làm việc'
  }
];

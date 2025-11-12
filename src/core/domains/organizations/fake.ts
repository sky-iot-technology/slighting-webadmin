import { Department, Unit } from './type';

export const units: Unit[] = [
  {
    id: 'u-001',
    name: 'Trung tâm Bảo trì Khu vực 1',
    address: '12 Nguyễn Văn Cừ, Quận 5, TP.HCM',
    note: 'Phụ trách các tuyến trung tâm thành phố'
  },
  {
    id: 'u-002',
    name: 'Trung tâm Bảo trì Khu vực 2',
    address: '45 Lê Lợi, Quận 1, TP.HCM',
    note: 'Giám sát hệ thống chiếu sáng khu vực trung tâm'
  },
  {
    id: 'u-003',
    name: 'Trạm Bảo trì Khu công nghiệp Tân Bình',
    address: '18/3 Đường CN1, KCN Tân Bình, TP.HCM',
    note: 'Theo dõi thiết bị chiếu sáng công nghiệp'
  },
  {
    id: 'u-004',
    name: 'Trạm Bảo trì Khu vực Đông',
    address: '69 Xa Lộ Hà Nội, TP.Thủ Đức',
    note: 'Chịu trách nhiệm khu vực Thủ Đức - Quận 9'
  },
  {
    id: 'u-005',
    name: 'Trung tâm Quản lý Thiết bị Công cộng',
    address: '100 Điện Biên Phủ, Quận Bình Thạnh',
    note: 'Theo dõi hoạt động các tủ điện công cộng'
  },
  {
    id: 'u-006',
    name: 'Trung tâm Giám sát Tự động',
    address: '33 Nguyễn Thị Minh Khai, Quận 3',
    note: 'Điều hành và giám sát hệ thống từ xa'
  },
  {
    id: 'u-007',
    name: 'Trạm Bảo trì Khu vực Tây',
    address: '25 Hậu Giang, Quận 6, TP.HCM',
    note: 'Phụ trách khu vực Bình Tân và Quận 6'
  },
  {
    id: 'u-008',
    name: 'Trung tâm Kỹ thuật Điện – Chiếu sáng',
    address: '222 Nguyễn Văn Linh, Quận 7',
    note: 'Bộ phận chuyên trách về kỹ thuật chiếu sáng đô thị'
  },
  {
    id: 'u-009',
    name: 'Trạm Bảo trì Khu vực Bắc',
    address: '15 Quốc Lộ 13, Quận 12, TP.HCM',
    note: 'Phụ trách hệ thống phía Bắc thành phố'
  },
  {
    id: 'u-010',
    name: 'Trung tâm Dữ liệu & Phân tích Thiết bị',
    address: '7 Lý Tự Trọng, Quận 1, TP.HCM',
    note: 'Thu thập và phân tích dữ liệu thiết bị chiếu sáng'
  }
];

export const departments: Department[] = [
  {
    id: 'd-001',
    name: 'Phòng Kế hoạch',
    unitId: 'u-001',
    note: 'Lập kế hoạch bảo trì định kỳ cho khu vực 1'
  },
  {
    id: 'd-002',
    name: 'Phòng Kỹ thuật',
    unitId: 'u-002',
    note: 'Giám sát kỹ thuật hệ thống chiếu sáng khu vực trung tâm'
  },
  {
    id: 'd-003',
    name: 'Phòng Vận hành',
    unitId: 'u-003',
    note: 'Điều phối hoạt động bảo trì trong khu công nghiệp Tân Bình'
  },
  {
    id: 'd-004',
    name: 'Phòng An toàn điện',
    unitId: 'u-004',
    note: 'Theo dõi và kiểm tra quy trình an toàn khu vực Thủ Đức'
  },
  {
    id: 'd-005',
    name: 'Phòng Nhân sự',
    unitId: 'u-005',
    note: 'Quản lý nhân sự và đào tạo cho Trung tâm Quản lý Thiết bị Công cộng'
  },
  {
    id: 'd-006',
    name: 'Phòng Tài chính – Kế toán',
    unitId: 'u-006',
    note: 'Theo dõi chi phí vận hành và lập báo cáo tài chính định kỳ'
  },
  {
    id: 'd-007',
    name: 'Phòng CNTT & Giám sát hệ thống',
    unitId: 'u-007',
    note: 'Phát triển phần mềm và giám sát dữ liệu vận hành khu vực Tây'
  },
  {
    id: 'd-008',
    name: 'Phòng Vật tư',
    unitId: 'u-008',
    note: 'Quản lý vật tư và linh kiện thay thế tại khu vực Quận 7'
  },
  {
    id: 'd-009',
    name: 'Phòng Nghiên cứu & Phát triển',
    unitId: 'u-009',
    note: 'Đề xuất công nghệ mới và cải tiến thiết bị khu vực Bắc'
  },
  {
    id: 'd-010',
    name: 'Phòng Quan hệ khách hàng',
    unitId: 'u-010',
    note: 'Tiếp nhận phản hồi và hỗ trợ khách hàng tại trung tâm dữ liệu'
  }
];

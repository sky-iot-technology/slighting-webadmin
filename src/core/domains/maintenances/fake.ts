import { Maintenance, WorkOrder } from './types';

export const fakeMaintenances: Maintenance[] = [
  {
    id: '1',
    serial_number: 'CAB-001',
    name: 'Mất kết nối tủ điện',
    priority: 'high',
    time: '2025-11-06 08:12',
    timeSpend: '1h 25m',
    sendBy: 'Nguyễn Văn A',
    status: 'in_progress',
    method: 'auto',
    lat: 10.776389,
    lng: 106.700806
  },
  {
    id: '2',
    serial_number: 'CAB-002',
    name: 'Cảnh báo nhiệt độ cao',
    priority: 'critical',
    time: '2025-11-06 09:33',
    timeSpend: '40m',
    sendBy: 'Trần Thị B',
    status: 'new',
    method: 'manual',
    lat: 10.7805,
    lng: 106.695
  },
  {
    id: '3',
    serial_number: 'CAB-003',
    name: 'Tủ điện offline',
    priority: 'medium',
    time: '2025-11-06 07:50',
    timeSpend: '2h 10m',
    sendBy: 'Lê Văn C',
    status: 'resolved',
    method: 'auto',
    lat: 10.7739,
    lng: 106.706
  },
  {
    id: '4',
    serial_number: 'CAB-004',
    name: 'Quạt làm mát không hoạt động',
    priority: 'low',
    time: '2025-11-06 11:05',
    timeSpend: '50m',
    sendBy: 'Phạm Minh D',
    status: 'new',
    method: 'manual',
    lat: 10.7712,
    lng: 106.7035
  },
  {
    id: '5',
    serial_number: 'CAB-005',
    name: 'Điện áp bất thường',
    priority: 'high',
    time: '2025-11-06 10:22',
    timeSpend: '1h 10m',
    sendBy: 'Ngô Văn E',
    status: 'in_progress',
    method: 'auto',
    lat: 10.781,
    lng: 106.707
  },
  {
    id: '6',
    serial_number: 'CAB-006',
    name: 'Cảnh báo mở cửa tủ điện',
    priority: 'medium',
    time: '2025-11-06 06:58',
    timeSpend: '35m',
    sendBy: 'Hoàng Thị F',
    status: 'resolved',
    method: 'manual',
    lat: 10.7698,
    lng: 106.711
  },
  {
    id: '7',
    serial_number: 'CAB-007',
    name: 'Sensor độ ẩm lỗi',
    priority: 'low',
    time: '2025-11-06 12:44',
    timeSpend: '25m',
    sendBy: 'Vũ Anh G',
    status: 'new',
    method: 'auto',
    lat: 10.7841,
    lng: 106.7045
  },
  {
    id: '8',
    serial_number: 'CAB-008',
    name: 'Tủ điện không phản hồi tín hiệu',
    priority: 'critical',
    time: '2025-11-06 13:27',
    timeSpend: '3h 05m',
    sendBy: 'Nguyễn Thị H',
    status: 'in_progress',
    method: 'auto',
    lat: 10.7752,
    lng: 106.698
  },
  {
    id: '9',
    serial_number: 'CAB-009',
    name: 'Mất điện đột ngột',
    priority: 'critical',
    time: '2025-11-06 14:02',
    timeSpend: '2h 40m',
    sendBy: 'Đặng Văn I',
    status: 'resolved',
    method: 'manual',
    lat: 10.7775,
    lng: 106.709
  },
  {
    id: '10',
    serial_number: 'CAB-010',
    name: 'Nhiệt độ cảm biến vượt ngưỡng',
    priority: 'high',
    time: '2025-11-06 15:18',
    timeSpend: '1h 15m',
    sendBy: 'Lâm Thị J',
    status: 'new',
    method: 'auto',
    lat: 10.7823,
    lng: 106.713
  }
];

export const fakeWorkOrders: WorkOrder[] = [
  {
    id: '1',
    jobName: 'Kiểm tra tủ điện khu A1',
    alertName: 'Cảnh báo mất kết nối',
    priority: 'Cao',
    status: 'Đang xử lý',
    startTime: '2025-11-06 08:15',
    handlingUnit: 'Đội điện trung tâm',
    executor: 'Nguyễn Văn A',
    supervisionStatus: 'Đang giám sát'
  },
  {
    id: '2',
    jobName: 'Thay cảm biến nhiệt độ',
    alertName: 'Nhiệt độ vượt ngưỡng',
    priority: 'Rất cao',
    status: 'Mới tạo',
    startTime: '2025-11-06 09:20',
    handlingUnit: 'Phòng kỹ thuật 2',
    executor: 'Trần Thị B',
    supervisionStatus: 'Chưa giám sát'
  },
  {
    id: '3',
    jobName: 'Bảo trì đèn đường số 12',
    alertName: 'Đèn không sáng',
    priority: 'Trung bình',
    status: 'Đang xử lý',
    startTime: '2025-11-05 15:40',
    handlingUnit: 'Đội bảo trì chi nhánh 1',
    executor: 'Lê Văn C',
    supervisionStatus: 'Đang giám sát'
  },
  {
    id: '4',
    jobName: 'Cập nhật phần mềm tủ điều khiển',
    alertName: 'Lỗi firmware',
    priority: 'Thấp',
    status: 'Hoàn thành',
    startTime: '2025-11-04 10:00',
    handlingUnit: 'Tổ IT hệ thống',
    executor: 'Phạm Đức D',
    supervisionStatus: 'Đã nghiệm thu'
  },
  {
    id: '5',
    jobName: 'Kiểm tra bộ nguồn dự phòng',
    alertName: 'Nguồn phụ không hoạt động',
    priority: 'Cao',
    status: 'Đang xử lý',
    startTime: '2025-11-06 07:55',
    handlingUnit: 'Đội kỹ thuật khu vực B',
    executor: 'Ngô Thị E',
    supervisionStatus: 'Đang giám sát'
  },
  {
    id: '6',
    jobName: 'Thay thế cảm biến ánh sáng',
    alertName: 'Không nhận tín hiệu ánh sáng',
    priority: 'Trung bình',
    status: 'Mới tạo',
    startTime: '2025-11-05 13:30',
    handlingUnit: 'Phòng kỹ thuật chi nhánh 2',
    executor: 'Đinh Văn F',
    supervisionStatus: 'Chưa giám sát'
  },
  {
    id: '7',
    jobName: 'Bảo dưỡng tủ điều khiển trung tâm',
    alertName: 'Hiệu suất xử lý giảm',
    priority: 'Cao',
    status: 'Đang xử lý',
    startTime: '2025-11-06 11:10',
    handlingUnit: 'Đội điện khu vực C',
    executor: 'Võ Minh G',
    supervisionStatus: 'Đang giám sát'
  },
  {
    id: '8',
    jobName: 'Cập nhật cấu hình cảnh báo',
    alertName: 'Dữ liệu cảnh báo lỗi',
    priority: 'Thấp',
    status: 'Hoàn thành',
    startTime: '2025-11-03 14:45',
    handlingUnit: 'Tổ giám sát hệ thống',
    executor: 'Bùi Thị H',
    supervisionStatus: 'Đã nghiệm thu'
  },
  {
    id: '9',
    jobName: 'Kiểm tra kết nối mạng nội bộ',
    alertName: 'Mất tín hiệu LAN',
    priority: 'Rất cao',
    status: 'Mới tạo',
    startTime: '2025-11-06 10:05',
    handlingUnit: 'Phòng CNTT',
    executor: 'Nguyễn Thanh I',
    supervisionStatus: 'Chưa giám sát'
  },
  {
    id: '10',
    jobName: 'Hiệu chỉnh cảm biến khói',
    alertName: 'Cảnh báo giả định',
    priority: 'Trung bình',
    status: 'Hoàn thành',
    startTime: '2025-11-05 09:25',
    handlingUnit: 'Đội bảo trì khu D',
    executor: 'Phan Quốc K',
    supervisionStatus: 'Đã nghiệm thu'
  }
];

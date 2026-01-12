export const maintenance = {
  maintenance_management: 'Quản lý bảo trì',
  alert: 'Cảnh báo',
  work_order: 'Giao việc',
  create_work_order: 'Tạo công việc',
  create_work_order_title: 'Tạo công việc: {{measurement}}',
  work_order_history: 'Lịch sử giao việc',

  // Table Headers & Content
  device_id: 'Mã thiết bị',
  warning_name: 'Tên cảnh báo',
  priority: 'Ưu tiên',
  warning_time: 'Thời gian gửi cảnh báo',
  duration: 'Thời gian kéo dài',
  sender: 'Người gửi',
  process_status: 'Trạng thái xử lý',
  handler: 'Người xử lý',
  end_time: 'Thời gian kết thúc',
  action: 'Thao tác',
  actions: {
    view_work_order: 'Xem giao việc',
    view_location: 'Xem vị trí xử lý',
    process: 'Xử lý',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
    delete: 'Xóa',
    detail: 'Chi tiết',
    edit: 'Sửa',
    history: 'Lịch sử'
  },
  system: 'Hệ thống',
  placeholder_warning_name: 'Tìm tên cảnh báo',
  start_time: 'Thời gian bắt đầu',

  work_order_name: 'Tên công việc',
  unit_handling: 'Đơn vị xử lý',
  supervisor_status: 'Trạng thái giám sát',
  placeholder_work_order_name: 'Tìm tên công việc',

  // Forms & Dialogs
  description: 'Mô tả',
  select_unit_handling: 'Chọn đơn vị xử lý',
  supervisor: 'Người giám sát',
  select_supervisor: 'Chọn người giám sát',
  executor: 'Người thực hiện',
  select_executor: 'Chọn người thực hiện',
  expected_start_date: 'Ngày bắt đầu dự kiến',
  expected_end_date: 'Ngày hoàn thành dự kiến',
  attachments: 'Tập tin đính kèm',
  cancel: 'Hủy',
  confirm: 'Xác nhận',
  enter_work_order_name: 'Nhập tên công việc',
  enter_description: 'Nhập mô tả',

  device_info: 'Thông tin thiết bị',
  update_progress: 'Cập nhật tiến độ',
  progress_status: 'Trạng thái tiến độ',
  note: 'Ghi chú',
  enter_note: 'Nhập ghi chú',
  start_date: 'Ngày bắt đầu',
  end_date: 'Ngày kết thúc',
  images: 'Hình ảnh',
  confirm_progress: 'Xác nhận tiến độ',
  close: 'Đóng',
  update: 'Cập nhật',
  updating: 'Đang cập nhật',

  device_code: 'Mã thiết bị',
  branch: 'Chi nhánh',
  completion_progress: 'Tiến độ hoàn thành',
  in_charge: 'Phụ trách',

  team_support: 'Team Support',
  team_technical: 'Team Technical',

  severity: {
    high: 'Cao',
    medium: 'Trung bình',
    low: 'Thấp'
  },
  alarm_status: {
    active: 'Đang xử lý',
    open: 'Chưa xử lý',
    resolved: 'Đã xử lý',
    ignored: 'Bỏ qua'
  },
  work_order_status: {
    open: 'Chưa xử lý',
    process: 'Đang xử lý',
    completed: 'Đã xử lý',
    closed: 'Đã đóng'
  },
  work_order_action: {
    open: 'Chưa xử lý',
    forward: 'Chuyển giao',
    comfirmed: 'Xác nhận hoàn thành',
    cancel: 'Đã hủy'
  }
} as const;

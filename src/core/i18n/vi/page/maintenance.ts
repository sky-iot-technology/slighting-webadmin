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
  },
  validation: {
    assigned_by_required: 'Người giám sát không được để trống',
    assignee_id_required: 'Người được giao không được để trống',
    work_order_name_required: 'Tên công việc không được để trống',
    remarks_required: 'Mô tả không được để trống',
    department_required: 'Đơn vị không được để trống',
    start_date_required: 'Vui lòng nhập ngày bắt đầu',
    end_date_required: 'Vui lòng nhập ngày hoàn thành',
    end_date_invalid: 'Ngày hoàn thành phải lớn hơn hoặc bằng ngày bắt đầu',
    file_max: 'Chỉ được tải lên tối đa 5 tập tin',
    file_size_max: 'File không vượt quá 5MB',
    id_required: 'Mã không được bỏ trống',
    image_max: 'Chỉ được tối đa 5 hình ảnh (bao gồm cả file cũ và mới)',
    total_size_max: 'Tổng dung lượng file tải lên không vượt quá 5MB',
    status_required: 'Vui lòng chọn trạng thái thiết bị',
    action_required: 'Vui lòng chọn trạng thái xử lý'
  }
} as const;

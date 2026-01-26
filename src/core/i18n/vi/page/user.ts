export const user = {
  // Table Headers
  name: 'Tên',
  unit: 'Đơn vị',
  department: 'Bộ phận',
  role: 'Vai trò',
  branch: 'Chi nhánh',
  status: 'Trạng thái',
  actions: 'Thao tác',
  search_placeholder: 'Tìm kiếm',

  // Actions
  view: 'Chi tiết',
  edit: 'Sửa',
  delete: 'Xóa',
  add: 'Thêm',

  // Dialog Titles
  add_title: 'Thêm người dùng',
  edit_title: 'Chỉnh sửa người dùng',
  view_title: 'Thông tin người dùng',
  change_password_title: 'Đổi mật khẩu',

  // Form Sections
  personal_info: 'Thông tin cá nhân',
  account_info: 'Thông tin tài khoản',

  // Form Labels
  first_name: 'Họ',
  last_name: 'Tên',
  phone: 'Số điện thoại',
  email: 'Email',
  role_label: 'Vai trò',
  branch_label: 'Chi nhánh',
  unit_label: 'Đơn vị',
  department_label: 'Bộ phận',
  address: 'Địa chỉ',
  note: 'Ghi chú',
  username: 'Tài khoản',
  password: 'Mật khẩu',
  confirm_password: 'Nhập lại mật khẩu',
  new_password: 'Mật khẩu mới',
  confirm_new_password: 'Xác nhận mật khẩu mới',

  // Placeholders
  enter_first_name: 'Nhập họ',
  enter_last_name: 'Nhập tên',
  enter_phone: 'Nhập số điện thoại',
  enter_email: 'Nhập email',
  select_role: 'Chọn vai trò',
  select_unit: 'Chọn đơn vị xử lý',
  select_department: 'Chọn bộ phận',
  enter_address: 'Nhập địa chỉ',
  enter_note: 'Nhập ghi chú',
  enter_username: 'Nhập tài khoản',
  enter_password: 'Nhập mật khẩu',
  re_enter_password: 'Nhập lại mật khẩu',
  enter_new_password: 'Nhập mật khẩu mới',
  re_enter_new_password: 'Xác nhận mật khẩu mới',
  loading: 'Đang tải...',

  // Buttons
  cancel: 'Hủy',
  save: 'Lưu',
  close: 'Đóng',
  update: 'Cập nhật',
  reset_password: 'Reset mật khẩu',
  change_password: 'Đổi mật khẩu',
  validation: {
    first_name_required: 'Vui lòng nhập tên',
    last_name_required: 'Vui lòng nhập họ',
    email_invalid: 'Email không hợp lệ',
    role_required: 'Vui lòng chọn vai trò',
    group_required: 'Vui lòng chọn nhóm',
    username_required: 'Vui lòng nhập username',
    password_min: 'Mật khẩu tối thiểu 6 ký tự',
    password_confirm_mismatch: 'Xác nhận mật khẩu không đúng',
    unit_required: 'Vui lòng chọn ít nhất 1 đơn vị',
    password_not_match: 'Mật khẩu không khớp'
  },
  modal: {
    delete: {
      title: 'Xóa Người Dùng',
      description: 'Bạn có chắc chắn muốn xóa người dùng: {{name}} ?'
    }
  }
} as const;

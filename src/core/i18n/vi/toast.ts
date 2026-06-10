export const toast = {
  logout_success: 'Đăng xuất thành công!',
  update_profile_success: 'Cập nhật thông tin thành công!',
  update_profile_failed: 'Cập nhật thông tin thất bại. Vui lòng thử lại.',

  upload_avatar_success: 'Cập nhật ảnh đại diện thành công!',
  upload_avatar_failed: 'Tải ảnh đại diện thất bại, vui lòng thử lại',

  delete_avatar_success: 'Xóa ảnh đại diện thành công!',
  delete_avatar_failed: 'Không thể xóa ảnh đại diện!',
  // auth
  login_success: 'Đăng nhập thành công!',
  login_failed_user_info:
    'Đăng nhập thành công nhưng không thể lấy thông tin người dùng',
  login_failed: 'Đăng nhập thất bại. Vui lòng thử lại.',
  signup_success: 'Đăng ký thành công! Vui lòng đăng nhập.',
  signup_failed: 'Đăng ký thất bại. Vui lòng thử lại.',
  token_refresh_failed: 'Làm mới token thất bại',

  // calendar
  create_calendar_success: 'Tạo lịch thành công!',
  create_calendar_failed: 'Tạo lịch thất bại',
  delete_calendar_success: 'Xóa lịch thành công',
  delete_calendar_failed: 'Xóa lịch thất bại',
  delete_multi_calendar_success: 'Đã xoá {{count}} lịch',
  delete_multi_calendar_success_single: 'Lịch đã được xoá',
  delete_multi_calendar_failed: 'Xoá lịch bảo trì thất bại',
  update_calendar_success: 'Cập nhật lịch thành công!',
  update_calendar_failed: 'Cập nhật lịch thất bại',

  // device
  request_sent_success: 'Gửi yêu cầu thành công!',
  set_light_failed: 'Thiết lập trạng thái đèn thất bại',
  set_brightness_failed: 'Thiết lập độ sáng thất bại',
  create_device_success: 'Tạo thiết bị thành công!',
  create_device_failed: 'Tạo thiết bị thất bại',
  set_parent_success: 'Thiết lập nhóm cha thành công!',
  set_parent_failed: 'Thiết lập nhóm cha thất bại',
  delete_parent_success: 'Xóa nhóm cha thiết bị thành công',
  delete_parent_failed: 'Xóa nhóm thất bại',
  sync_devices_success: 'Đồng bộ thiết bị đã được khởi tạo!',
  sync_devices_failed: 'Không thể đồng bộ thiết bị',
  update_device_success: 'Cập nhật thiết bị thành công!',
  update_device_failed: 'Không thể cập nhật thiết bị',
  remove_device_from_group_success: 'Xóa thiết bị khỏi nhóm thành công!',
  remove_device_from_group_failed: 'Không thể xóa thiết bị khỏi nhóm',
  delete_device_success: 'Xóa thiết bị thành công!',
  delete_device_failed: 'Không thể xóa thiết bị',

  // group
  create_group_success: 'Tạo nhóm thành công!',
  create_group_failed: 'Tạo nhóm thất bại',
  delete_group_success: 'Xóa nhóm thành công',
  delete_group_failed: 'Xóa nhóm thất bại',
  update_group_success: 'Cập nhật nhóm thành công!',
  update_group_failed: 'Cập nhật nhóm thất bại',
  update_device_parent_success: 'Cập nhật nhóm cha thiết bị thành công!',
  update_device_parent_failed: 'Cập nhật nhóm cha thiết bị thất bại',

  // product
  create_product_success: 'Tạo sản phẩm thành công!',
  create_product_failed: 'Tạo sản phẩm thất bại',
  update_product_success: 'Cập nhật sản phẩm thành công!',
  update_product_failed: 'Cập nhật sản phẩm thất bại',
  delete_product_success: 'Xóa sản phẩm thành công!',
  delete_product_failed: 'Xóa sản phẩm thất bại',

  // role
  create_role_success: 'Tạo vai trò thành công!',
  create_role_failed: 'Tạo vai trò thất bại',
  update_role_success: 'Cập nhật vai trò thành công!',
  update_role_failed: 'Cập nhật vai trò thất bại',
  delete_role_success: 'Xóa vai trò thành công',
  delete_role_failed: 'Xóa vai trò thất bại',

  // ota
  create_ota_success: 'Tạo OTA thành công!',
  create_ota_failed: 'Tạo OTA thất bại',
  delete_ota_success: 'Xóa OTA thành công',
  delete_ota_failed: 'Xóa OTA thất bại',
  update_ota_success: 'Cập nhật OTA thành công!',
  update_ota_failed: 'Cập nhật OTA thất bại',
  send_ota_request_success: 'Gửi yêu cầu OTA thành công!',
  send_ota_request_failed: 'Gửi yêu cầu OTA thất bại',
  ota_failed: 'Cập nhật OTA thất bại',

  // alarm
  acknowledge_alarm_success: 'Xác nhận cảnh báo thành công!',
  acknowledge_alarm_failed: 'Xác nhận cảnh báo thất bại',
  complete_alarm_success: 'Hoàn thành cảnh báo thành công!',
  complete_alarm_failed: 'Hoàn thành cảnh báo thất bại',
  delete_alarm_success: 'Xóa cảnh báo thành công',
  delete_alarm_failed: 'Xóa cảnh báo thất bại',
  delete_alarms_success: 'Xóa các cảnh báo thành công',
  delete_alarms_failed: 'Xóa các cảnh báo thất bại',

  // user
  update_password_success: 'Cập nhật mật khẩu thành công!',
  update_password_failed: 'Cập nhật mật khẩu thất bại',
  create_user_success: 'Tạo người dùng thành công!',
  create_user_failed: 'Tạo người dùng thất bại',
  update_user_success: 'Cập nhật người dùng thành công!',
  update_user_failed: 'Cập nhật người dùng thất bại',
  delete_user_success: 'Xóa người dùng thành công',
  delete_user_failed: 'Xóa người dùng thất bại',

  // tag
  create_tag_success: 'Tạo thẻ thành công!',
  create_tag_failed: 'Tạo thẻ thất bại',
  update_tag_success: 'Cập nhật thẻ thành công!',
  update_tag_failed: 'Cập nhật thẻ thất bại',

  // workorder
  create_work_order_success: 'Tạo công việc thành công!',
  create_work_order_failed: 'Tạo công việc thất bại',
  update_work_order_success: 'Cập nhật công việc thành công!',
  update_work_order_failed: 'Cập nhật công việc thất bại',
  delete_work_order_success: 'Xóa công việc thành công',
  delete_work_order_failed: 'Xóa công việc thất bại'
} as const;

export const toast = {
  logout_success: 'Signed out successfully!',
  update_profile_success: 'Profile updated successfully!',
  update_profile_failed: 'Failed to update profile. Please try again.',

  upload_avatar_success: 'Profile picture updated successfully!',
  upload_avatar_failed: 'Failed to upload profile picture. Please try again.',

  delete_avatar_success: 'Profile picture deleted successfully!',
  delete_avatar_failed: 'Unable to delete profile picture!',
  // auth
  login_success: 'Login successfully!',
  login_failed_user_info: 'Login successful but failed to fetch user info',
  login_failed: 'Login failed. Please try again.',
  signup_success: 'Sign up successfully! Please login.',
  signup_failed: 'Sign up failed. Please try again.',
  token_refresh_failed: 'Token refresh failed',

  // calendar
  create_calendar_success: 'Calendar created successfully!',
  create_calendar_failed: 'Failed to create calendar',
  delete_calendar_success: 'Calendar deleted successfully',
  delete_calendar_failed: 'Failed to delete calendar',
  delete_multi_calendar_success: 'Deleted {{count}} calendars',
  delete_multi_calendar_success_single: 'Calendar deleted successfully',
  delete_multi_calendar_failed: 'Failed to delete calendars',
  update_calendar_success: 'Calendar update successfully!',
  update_calendar_failed: 'Failed to update calendar',

  // device
  request_sent_success: 'Request sent successfully!',
  set_light_failed: 'Failed to set state light',
  set_brightness_failed: 'Failed to set brightness light',
  create_device_success: 'Device created successfully!',
  create_device_failed: 'Failed to create device',
  set_parent_success: 'Set devices parent successfully!',
  set_parent_failed: 'Failed to set devices parent',
  delete_parent_success: 'Delete Device Parent successfully',
  delete_parent_failed: 'Failed to delete Group',
  sync_devices_success: 'Sync devices initialized!',
  sync_devices_failed: 'Failed to sync devices',
  update_device_success: 'Device updated successfully!',
  update_device_failed: 'Failed to update device',
  remove_device_from_group_success: 'Remove device from group successfully!',
  remove_device_from_group_failed: 'Failed to remove device from group',
  delete_device_success: 'Device deleted successfully!',
  delete_device_failed: 'Failed to delete device',

  // group
  create_group_success: 'Group created successfully!',
  create_group_failed: 'Failed to create group',
  delete_group_success: 'Group deleted successfully',
  delete_group_failed: 'Failed to delete Group',
  update_group_success: 'Group update successfully!',
  update_group_failed: 'Failed to update Group',
  update_device_parent_success: 'Update device parent successfully!',
  update_device_parent_failed: 'Failed to update device parent',

  // product
  create_product_success: 'Product created successfully!',
  create_product_failed: 'Failed to create product',
  update_product_success: 'Product updated successfully!',
  update_product_failed: 'Failed to update product',
  delete_product_success: 'Product deleted successfully!',
  delete_product_failed: 'Failed to delete product',

  // role
  create_role_success: 'Role created successfully!',
  create_role_failed: 'Failed to create role',
  update_role_success: 'Role updated successfully!',
  update_role_failed: 'Failed to update role',
  delete_role_success: 'Role deleted successfully',
  delete_role_failed: 'Failed to delete Role',

  // ota
  create_ota_success: 'Ota created successfully!',
  create_ota_failed: 'Failed to create ota',
  delete_ota_success: 'Ota deleted successfully',
  delete_ota_failed: 'Failed to delete Ota',
  update_ota_success: 'Ota update successfully!',
  update_ota_failed: 'Failed to update Ota',
  send_ota_request_success: 'Send ota request successfully!',
  send_ota_request_failed: 'Failed to send OTA request',
  ota_failed: 'OTA update failed',

  // alarm
  acknowledge_alarm_success: 'Acknowleged alarm successfully!',
  acknowledge_alarm_failed: 'Failed to acknowleged alarm',
  complete_alarm_success: 'Completed alarm successfully!',
  complete_alarm_failed: 'Failed to completed alarm',
  delete_alarm_success: 'Alarm deleted successfully',
  delete_alarm_failed: 'Failed to delete alarm',
  delete_alarms_success: 'Alarms deleted successfully',
  delete_alarms_failed: 'Failed to delete alarms',

  // user
  update_password_success: 'Update password successfully!',
  update_password_failed: 'Failed to update password',
  create_user_success: 'User created successfully!',
  create_user_failed: 'Failed to create user',
  update_user_success: 'User updated successfully!',
  update_user_failed: 'Failed to update user',
  delete_user_success: 'User deleted successfully',
  delete_user_failed: 'Failed to delete user',

  // tag
  create_tag_success: 'Tag created successfully!',
  create_tag_failed: 'Failed to create tag',
  update_tag_success: 'Tag updated successfully!',
  update_tag_failed: 'Failed to updated tag',

  // workorder
  create_work_order_success: 'Create WorkOrder successfully!',
  create_work_order_failed: 'Failed to create WorkOrder',
  update_work_order_success: 'Update WorkOrder successfully!',
  update_work_order_failed: 'Failed to update WorkOrder',
  delete_work_order_success: 'Work Order deleted successfully',
  delete_work_order_failed: 'Failed to delete work order'
} as const;

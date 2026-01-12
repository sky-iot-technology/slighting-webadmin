export const setting = {
  appearance: 'Giao diện',
  notification: 'Thông báo',
  security: 'Bảo mật',
  system: 'Hệ thống',
  modal: {
    title: 'Cài đặt'
  },
  tab: {
    display: {
      title: 'Chế độ hiển thị',
      light: 'Sáng',
      dark: 'Tối',
      language: 'Ngôn ngữ',
      change_language: 'Thay đổi ngôn ngữ',
      vi: 'Tiếng Việt',
      en: 'Tiếng Anh'
    },
    alert: {
      method_title: 'Phương thức thông báo',
      method_desc: 'Chọn cách nhận thông báo từ hệ thống',
      gmail: 'Gmail',
      sms: 'SMS',
      notification: 'Thông báo',
      type_title: 'Loại thông báo',
      type_desc: 'Chọn sự kiện nào sẽ gửi thông báo',
      maintenance: 'Cảnh báo bảo trì',
      periodic_maintenance: 'Cảnh báo bảo trì định kỳ',
      abnormal_login: 'Cảnh báo đăng nhập bất thường'
    },
    secure: {
      '2fa_title': 'Xác thực 2 yếu tố',
      activate_2fa: 'Kích hoạt 2FA',
      activated: 'Kích hoạt',
      password_title: 'Mật khẩu',
      change_password_desc: 'Thay đổi mật khẩu',
      change_password_btn: 'Đổi mật khẩu'
    },
    system: {
      title: 'Thông tin hệ thống',
      version: 'Phiên bản phần mềm',
      device_count: 'Số lượng đèn được quản lý'
    }
  }
} as const;

export const setting = {
  appearance: 'Appearance',
  notification: 'Notification',
  security: 'Security',
  system: 'System',
  modal: {
    title: 'Settings'
  },
  tab: {
    display: {
      title: 'Display Mode',
      light: 'Light',
      dark: 'Dark',
      language: 'Language',
      change_language: 'Change Language',
      vi: 'Vietnamese',
      en: 'English'
    },
    alert: {
      method_title: 'Notification Method',
      method_desc: 'Choose how to receive system notifications',
      gmail: 'Gmail',
      sms: 'SMS',
      notification: 'Notification',
      type_title: 'Notification Type',
      type_desc: 'Choose events to receive notifications for',
      maintenance: 'Maintenance Alert',
      periodic_maintenance: 'Periodic Maintenance Alert',
      abnormal_login: 'Abnormal Login Alert'
    },
    secure: {
      '2fa_title': 'Two-Factor Authentication',
      activate_2fa: 'Activate 2FA',
      activated: 'Activated',
      password_title: 'Password',
      change_password_desc: 'Change Password',
      change_password_btn: 'Change Password'
    },
    system: {
      title: 'System Information',
      version: 'Software Version',
      device_count: 'Managed Devices Count'
    }
  }
} as const;

export const products = {
  status: {
    online: 'Online',
    offline: 'Offline',
    total: 'Tổng'
  },
  message: {
    sync_initiated: 'Đồng bộ thiết bị đã được khởi tạo'
  },
  table: {
    id: 'ID',
    name: 'Tên thiết bị',
    type: 'Loại thiết bị',
    status: 'Trạng thái',
    branch: 'Chi nhánh',
    condition: 'Tình trạng',
    online_time: 'Thời gian online',
    activation_date: 'Ngày kích hoạt',
    warning: 'Cảnh báo',
    address: 'Địa chỉ',
    action: 'Thao tác',
    warning_val: {
      yes: 'Có',
      no: 'Không'
    },
    status_val: {
      online: 'Online',
      offline: 'Offline'
    }
  },
  placeholder: {
    search_device: 'Tìm kiếm thiết bị'
  },
  action: {
    view: 'Chi tiết',
    delete: 'Xóa'
  },
  modal: {
    delete: {
      title: 'Xoá thiết bị',
      description: 'Bạn có chắc chắn muốn xoá thiết bị này?'
    }
  },
  form: {
    label: {
      id: 'Mã thiết bị',
      name: 'Tên thiết bị',
      type: 'Loại thiết bị',
      favorite_group: 'Nhóm yêu thích',
      coordinates: 'Kinh độ & Vĩ độ',
      branch: 'Chi nhánh',
      address: 'Địa chỉ',
      note: 'Ghi chú',
      product_info: 'Thông tin sản phẩm',
      serial: 'Serial',
      installation_date: 'Ngày lắp đặt',
      warranty_date: 'Ngày áp dụng bảo hành',
      manufacturer: 'Nhà sản xuất',
      warranty_expiration: 'Ngày hết hạn bảo hành'
    },
    placeholder: {
      id: 'Nhập mã thiết bị',
      name: 'Nhập tên thiết bị',
      type: 'Chọn loại thiết bị',
      favorite_group: 'Chọn nhóm thiết bị',
      lat: 'Vĩ độ',
      lon: 'Kinh độ',
      branch: 'Chọn chi nhánh',
      address: 'Địa chỉ',
      note: 'Ghi chú',
      serial: 'Nhập số serial thiết bị',
      manufacturer: 'Nhà sản xuất',
      date: 'Chọn ngày...'
    },
    button: {
      map_location: 'Vị trí bản đồ',
      cancel: 'Huỷ',
      save: 'Lưu',
      saving: 'Đang lưu...'
    },
    sheet: {
      title: 'Chọn vị trí bản đồ'
    }
  },
  button: {
    add: 'Thêm'
  },
  detail: {
    tabs: {
      overview: 'Tổng quan',
      activity: 'Hoạt động',
      analytics: 'Phân tích',
      schedule: 'Quản lý lịch',
      maintenance: 'Vận hành và bảo trì'
    },
    overview: {
      label: {
        id: 'Mã thiết bị',
        name: 'Tên thiết bị',
        type: 'Loại thiết bị',
        serial: 'Serial',
        manufacturer: 'Nhà sản xuất',
        status: 'Trạng thái thiết bị',
        location: 'Vị trí bản đồ',
        change_image: 'Đổi ảnh',
        add_image: 'Thêm ảnh'
      },
      placeholder: {
        name: 'Tên thiết bị',
        id: 'Mã thiết bị',
        type: 'Chọn loại thiết bị'
      },
      validation: {
        name_min: 'Tên thiết bị phải có ít nhất 2 ký tự',
        type_required: 'Loại thiết bị không được bỏ trống',
        branch_required: 'Chi nhánh không được bỏ trống',
        serial_required: 'Serial không được bỏ trống',
        lat_invalid: 'Vĩ độ phải là số trong khoảng -90 đến 90',
        lon_invalid: 'Kinh độ phải là số trong khoảng -180 đến 180'
      },
      sheet: {
        title: 'Chọn vị trí bản đồ'
      },
      section: {
        device_info: 'Thông tin thiết bị',
        product_info: 'Thông tin sản phẩm',
        attributes: 'Thông số thiết bị'
      },
      button: {
        view_reminders: 'Xem lời nhắc',
        edit: 'Chỉnh sửa',
        cancel: 'Hủy',
        save: 'Lưu',
        saving: 'Đang lưu...'
      }
    },
    activity: {
      select_all: 'Tất cả thiết bị',
      sync: 'Đồng bộ',
      table: {
        device: 'Thiết bị',
        status: 'Trạng thái thiết bị',
        action: 'Hành động',
        empty: 'Không có thiết bị nào'
      },
      history: {
        title: 'Lịch sử hoạt động',
        empty: 'Không có lịch sử hoạt động'
      },
      status: {
        on: 'Bật',
        off: 'Tắt'
      }
    },
    reminders: {
      title: 'Quản lý lời nhắc',
      no_date: 'Chưa có ngày',
      select_reminder: 'Chọn lời nhắc...',
      days_before: 'ngày trước',
      days_after: 'ngày sau',
      no_reminders_hint: 'Chưa có lời nhắc nào. Vui lòng tạo lời nhắc trước.',
      list_title: 'Danh sách lời nhắc',
      add_button: 'Thêm lời nhắc',
      edit_title: 'Chỉnh sửa lời nhắc',
      create_title: 'Thêm mới lời nhắc',
      form: {
        name: 'Tên lời nhắc',
        name_placeholder: 'Nhập tên lời nhắc',
        days_before_label: 'Số ngày trước',
        days_before_placeholder: 'Số ngày trước khi nhắc',
        days_after_label: 'Số ngày sau',
        days_after_placeholder: 'Số ngày sau khi nhắc',
        description: 'Mô tả',
        description_placeholder: 'Nhập mô tả'
      },
      status: {
        loading: 'Đang tải...',
        empty: 'Chưa có lời nhắc nào'
      },
      confirm_delete: 'Bạn có chắc chắn muốn xóa lời nhắc này?'
    },
    maintenance: {
      tabs: {
        alert: 'Cảnh báo',
        workorder: 'Giao việc'
      },
      button: {
        create_workorder: 'Tạo công việc'
      },
      title: {
        detail: 'Chi tiết công việc',
        update: 'Cập nhật công việc',
        create: 'Tạo công việc'
      }
    },
    analysis: {
      stats: {
        power: 'Điện năng tiêu thụ',
        brightness: 'Độ sáng trung bình',
        uptime: 'Thời gian hoạt động',
        efficiency: 'Hiệu suất'
      },
      period: {
        today: 'Hôm nay',
        days7: '7 ngày',
        days30: '30 ngày',
        days90: '90 ngày',
        all: 'Tất cả'
      },
      button: {
        export: 'Xuất báo cáo'
      }
    }
  }
};

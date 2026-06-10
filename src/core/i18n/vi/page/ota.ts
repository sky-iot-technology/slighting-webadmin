export const ota = {
  button: {
    add: 'Thêm mới',
    cancel: 'Hủy',
    save: 'Lưu',
    saving: 'Đang lưu',
    download: 'Tải xuống',
    sync: 'Đồng bộ',
    syncing: 'Đang đồng bộ'
  },
  table: {
    name: 'Tên model',
    category: 'Loại thiết bị',
    version: 'Phiên bản',
    description: 'Mô tả',
    created_at: 'Thời gian tạo',
    action: 'Thao tác'
  },
  placeholder: {
    search: 'Tìm tên model',
    name: 'Nhập tên Firmware',
    category: 'Chọn loại thiết bị',
    version: 'Nhập phiên bản',
    description: 'Nhập mô tả'
  },
  label: {
    name: 'Tên Firmware',
    category: 'Loại thiết bị',
    version: 'Phiên bản',
    description: 'Mô tả',
    file: 'Tải tệp đính kèm'
  },
  title: {
    add: 'Thêm mới Firmware',
    edit: 'Chỉnh sửa Firmware',
    sync: 'Đồng bộ'
  },
  action: {
    sync: 'Đồng bộ',
    edit: 'Sửa',
    delete: 'Xóa'
  },
  sync: {
    tabs: {
      items: 'Thiết bị',
      groups: 'Chi nhánh'
    },
    warning: {
      select_device: 'Vui lòng chọn ít nhất 1 thiết bị',
      select_group: 'Vui lòng chọn ít nhất 1 chi nhánh'
    },
    table: {
      name: 'Tên thiết bị',
      version: 'Phiên bản',
      status: 'Trạng thái',
      updating: 'Đang cập nhật firmware',
      failed: 'Cập nhật firmware thất bại'
    }
  },
  validation: {
    name_required: 'Tên OTA không được để trống',
    category_required: 'Loại thiết bị không được để trống',
    version_required: 'Phiên bản không được để trống',
    file_required: 'Vui lòng chọn tệp OTA',
    file_size_max: 'File không vượt quá 5MB',
    file_invalid: 'File không hợp lệ'
  },
  modal: {
    delete: {
      title: 'Xóa OTA',
      description: 'Bạn có chắc chắn muốn xoá OTA {{name}} ?'
    }
  }
};

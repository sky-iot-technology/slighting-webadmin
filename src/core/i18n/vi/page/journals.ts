export const journals = {
  operation: {
    client_sync: 'Đồng bộ với thiết bị',
    client_query: 'Query xuống thiết bị',
    client_execute: 'Điều khiển xuống thiết bị',
    client_schedule_sync: 'Đồng bộ lịch với thiết bị',
    client_schedule_sync_all:
      'Gửi lại toàn bộ lịch đang có trên server cho thiết bị',
    client_schedule_clean: 'Xoá toàn bộ lịch xuống thiết bị',
    client_schedule_add: 'Thêm lịch xuống thiết bị',
    client_schedule_update: 'Cập nhật lịch xuống thiết bị',
    client_schedule_remove: 'Xoá lịch xuống thiết bị'
  },
  command: {
    on_off: 'Bật/Tắt',
    brightness: 'Độ sáng',
    ota: 'OTA'
  },
  on: 'Bật',
  off: 'Tắt'
} as const;

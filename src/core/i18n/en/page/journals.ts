export const journals = {
  operation: {
    client_sync: 'Sync with device',
    client_query: 'Query to device',
    client_execute: 'Execute command to device',
    client_schedule_sync: 'Sync schedule with device',
    client_schedule_sync_all: 'Resend all schedules on server to device',
    client_schedule_clean: 'Clear all schedules on device',
    client_schedule_add: 'Add schedule to device',
    client_schedule_update: 'Update schedule on device',
    client_schedule_remove: 'Remove schedule from device'
  },
  command: {
    on_off: 'On/Off',
    brightness: 'Brightness',
    ota: 'OTA'
  },
  on: 'On',
  off: 'Off'
} as const;

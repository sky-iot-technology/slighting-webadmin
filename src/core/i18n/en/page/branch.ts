export const branch = {
  detail: 'Detail',
  devices: 'Devices',
  config: 'Config',
  sort: 'Sort',
  newest: 'Newest',
  oldest: 'Oldest',
  device_code: 'Device Code',
  device_name: 'Device Name',
  device_type: 'Device Type',
  status: 'Status',
  online: 'Online',
  offline: 'Offline',
  device_status: 'Device Status',
  enabled: 'Enabled',
  disabled: 'Disabled',
  enable: 'Enable',
  disable: 'Disable',
  branch_group: 'Branch Group',
  warranty_expired: 'Warranty Expired',
  action: 'Action',
  parent_branch: 'Parent Branch',
  branch_name: 'Branch Name',
  enter_branch_name: 'Enter branch name',
  description: 'Description',
  enter_description: 'Enter description',
  lat_long: 'Latitude & Longitude',
  longitude: 'Longitude',
  latitude: 'Latitude',
  select_map_location: 'Select Location',
  cancel: 'Cancel',
  save: 'Save',
  add_branch: 'Add Branch',
  add_multiple_devices: 'Add Multiple Devices',
  search_device: 'Search device...',
  select_device: 'Select Device',
  selected_device: 'Selected Device',
  code: 'Code',
  add: 'Add',
  current_branch: 'Current Branch',
  selected: 'Selected',
  table: {
    action: {
      view: 'View',
      edit: 'Edit',
      move: 'Move',
      delete: 'Delete',
      title: 'Edit Branch',
      moveTitle: 'Move Branch'
    }
  },
  branch_info: 'Branch Information',
  branch_label: 'Branch',
  region: 'Region',
  note: 'Note',
  created_at: 'Created At',
  updated_at: 'Last Updated',
  device_count: '{{count}} devices',
  all: 'All',
  validation: {
    name_required: 'Branch name is required',
    lat_min: 'Latitude must be ≥ -90',
    lat_max: 'Latitude must be ≤ 90',
    long_min: 'Longitude must be ≥ -180',
    long_max: 'Longitude must be ≤ 180'
  },
  modal: {
    delete: {
      title: 'Delete Branch',
      description: 'Are you sure you want to delete branch {{name}} ?'
    },
    delete2: {
      title: 'Delete Device From Branches',
      description:
        'Are you sure you want to delete device {{name}} from {{branch}}?'
    }
  }
} as const;

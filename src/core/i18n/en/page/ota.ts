export const ota = {
  button: {
    add: 'Add New',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving',
    download: 'Download',
    sync: 'Sync',
    syncing: 'Syncing'
  },
  table: {
    name: 'Model Name',
    category: 'Device Type',
    version: 'Version',
    description: 'Description',
    created_at: 'Created At',
    action: 'Actions'
  },
  placeholder: {
    search: 'Search model name',
    name: 'Enter Firmware Name',
    category: 'Select Device Type',
    version: 'Enter Version',
    description: 'Enter Description'
  },
  label: {
    name: 'Firmware Name',
    category: 'Device Type',
    version: 'Version',
    description: 'Description',
    file: 'Upload Attachment'
  },
  title: {
    add: 'Add New Firmware',
    edit: 'Edit Firmware',
    sync: 'Sync'
  },
  action: {
    sync: 'Sync',
    edit: 'Edit',
    delete: 'Delete'
  },
  sync: {
    tabs: {
      items: 'Devices',
      groups: 'Branches'
    },
    warning: {
      select_device: 'Please select at least 1 device',
      select_group: 'Please select at least 1 branch'
    },
    table: {
      name: 'Device Name',
      version: 'Version',
      status: 'Status',
      updating: 'Updating firmware',
      failed: 'Firmware update failed'
    }
  },
  validation: {
    name_required: 'OTA name is required',
    category_required: 'Device type is required',
    version_required: 'Version is required',
    file_required: 'Please select an OTA file',
    file_size_max: 'File must not exceed 5MB',
    file_invalid: 'Invalid file'
  },
  modal: {
    delete: {
      title: 'Delete OTA',
      description: 'Are you sure you want to delete OTA {{name}} ?'
    }
  }
};

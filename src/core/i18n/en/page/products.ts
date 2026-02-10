export const products = {
  status: {
    online: 'Online',
    offline: 'Offline',
    total: 'Total'
  },
  message: {
    sync_initiated: 'Device synchronization initiated'
  },
  table: {
    id: 'ID',
    name: 'Device Name',
    type: 'Device Type',
    status: 'Status',
    branch: 'Branch',
    condition: 'Condition',
    online_time: 'Online Time',
    activation_date: 'Activation Date',
    warning: 'Warning',
    address: 'Address',
    action: 'Action',
    warning_val: {
      yes: 'Yes',
      no: 'No'
    },
    status_val: {
      online: 'Online',
      offline: 'Offline'
    }
  },
  placeholder: {
    search_device: 'Search device'
  },
  action: {
    view: 'View',
    delete: 'Delete'
  },
  modal: {
    delete: {
      title: 'Delete Device',
      description: 'Are you sure you want to delete device {{name}}?'
    }
  },
  new: {
    add_product: 'Add Product'
  },
  form: {
    label: {
      id: 'Device ID',
      name: 'Device Name',
      type: 'Device Type',
      favorite_group: 'Favorite Group',
      coordinates: 'Longitude & Latitude',
      branch: 'Branch',
      address: 'Address',
      note: 'Note',
      product_info: 'Product Information',
      serial: 'Serial',
      installation_date: 'Installation Date',
      warranty_date: 'Warranty Effective Date',
      manufacturer: 'Manufacturer',
      warranty_expiration: 'Warranty Expiration Date'
    },
    placeholder: {
      id: 'Enter device ID',
      name: 'Enter device name',
      type: 'Select device type',
      favorite_group: 'Select device group',
      lat: 'Latitude',
      lon: 'Longitude',
      branch: 'Select branch',
      address: 'Address',
      note: 'Note',
      serial: 'Enter device serial number',
      manufacturer: 'Manufacturer',
      date: 'Select date...'
    },
    button: {
      map_location: 'Map Location',
      cancel: 'Cancel',
      save: 'Save',
      saving: 'Saving...'
    },
    sheet: {
      title: 'Select Map Location'
    }
  },
  button: {
    add: 'Add'
  },
  detail: {
    tabs: {
      overview: 'Overview',
      activity: 'Activity',
      analytics: 'Analytics',
      schedule: 'Schedule',
      maintenance: 'Maintenance'
    },
    overview: {
      label: {
        id: 'Device ID',
        name: 'Device Name',
        type: 'Device Type',
        serial: 'Serial',
        manufacturer: 'Manufacturer',
        status: 'Device Status',
        location: 'Map Location',
        change_image: 'Change Image',
        add_image: 'Add Image'
      },
      placeholder: {
        name: 'Device Name',
        id: 'Device ID',
        type: 'Select Device Type'
      },
      validation: {
        name_min: 'Device name must be at least 2 characters',
        type_required: 'Device type is required',
        branch_required: 'Branch is required',
        serial_required: 'Serial is required',
        lat_invalid: 'Latitude must be between -90 and 90',
        lon_invalid: 'Longitude must be between -180 and 180',
        id_required: 'ID is required',
        image_size: 'Max file size is 5MB',
        image_type: 'Invalid image type'
      },
      sheet: {
        title: 'Select Map Location'
      },
      section: {
        device_info: 'Device Information',
        product_info: 'Product Information',
        attributes: 'Device Attributes'
      },
      button: {
        view_reminders: 'View Reminders',
        edit: 'Edit',
        cancel: 'Cancel',
        save: 'Save',
        saving: 'Saving...'
      }
    },
    activity: {
      select_all: 'All Devices',
      sync: 'Sync',
      table: {
        device: 'Device',
        status: 'Device Status',
        action: 'Action',
        empty: 'No devices found'
      },
      history: {
        title: 'Activity History',
        empty: 'No activity history'
      },
      status: {
        on: 'On',
        off: 'Off'
      }
    },

    reminders: {
      title: 'Reminder Management',
      no_date: 'No date',
      select_reminder: 'Select reminder...',
      days_before: 'days before',
      days_after: 'days after',
      no_reminders_hint: 'No reminders yet. Please create a reminder first.',
      list_title: 'Reminder List',
      add_button: 'Add Reminder',
      edit_title: 'Edit Reminder',
      create_title: 'New Reminder',
      form: {
        name: 'Reminder Name',
        name_placeholder: 'Enter reminder name',
        days_before_label: 'Days Before',
        days_before_placeholder: 'Days before reminder',
        days_after_label: 'Days After',
        days_after_placeholder: 'Days after reminder',
        description: 'Description',
        description_placeholder: 'Enter description'
      },
      status: {
        loading: 'Loading...',
        empty: 'No reminders yet'
      },
      confirm_delete: 'Are you sure you want to delete this reminder?'
    },
    maintenance: {
      tabs: {
        alert: 'Alerts',
        workorder: 'Work Orders'
      },
      button: {
        create_workorder: 'Create Work Order'
      },
      title: {
        detail: 'Work Order Detail',
        update: 'Update Work Order',
        create: 'Create Work Order'
      }
    },
    analysis: {
      stats: {
        power: 'Power Consumption',
        brightness: 'Average Brightness',
        uptime: 'Uptime',
        efficiency: 'Efficiency'
      },
      period: {
        today: 'Today',
        days7: '7 Days',
        days30: '30 Days',
        days90: '90 Days',
        all: 'All'
      },
      button: {
        export: 'Export Report'
      }
    }
  },
  sensor: {
    active_e: 'Energy Consumption',
    active_p: 'Active Power',
    battery: 'Battery Voltage',
    frequency: 'Frequency',
    humidity: 'Humidity',
    input: 'Input Status',
    irms: 'RMS Current',
    power_factor: 'Power Factor',
    temperature: 'Temperature',
    thdi: 'Total Harmonic Distortion of Current (THDi)',
    thdv: 'Total Harmonic Distortion of Voltage (THDv)',
    vrms: 'RMS Voltage'
  }
};

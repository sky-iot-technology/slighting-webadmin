export const maintenance = {
  maintenance_management: 'Maintenance Management',
  alert: 'Alerts',
  work_order: 'Work Orders',
  create_work_order: 'Create Work Order',
  create_work_order_title: 'Create Work Order: {{measurement}}',
  work_order_history: 'Work Order History',

  // Table Headers & Content
  device_id: 'Device ID',
  warning_name: 'Alert Name',
  priority: 'Priority',
  warning_time: 'Alert Time',
  duration: 'Duration',
  sender: 'Sender',
  process_status: 'Process Status',
  handler: 'Handler',
  end_time: 'End Time',
  action: 'Action',
  actions: {
    view_work_order: 'View Work Order',
    view_location: 'View Location',
    process: 'Process',
    processing: 'Processing',
    completed: 'Completed',
    delete: 'Delete',
    detail: 'Detail',
    edit: 'Edit',
    history: 'History'
  },
  system: 'System',
  placeholder_warning_name: 'Search alert name',
  start_time: 'Start Time',

  work_order_name: 'Work Order Name',
  unit_handling: 'Handling Unit',
  supervisor_status: 'Supervisor Status',
  placeholder_work_order_name: 'Search work order name',

  // Forms & Dialogs
  description: 'Description',
  select_unit_handling: 'Select handling unit',
  supervisor: 'Supervisor',
  select_supervisor: 'Select supervisor',
  executor: 'Assignee',
  select_executor: 'Select assignee',
  expected_start_date: 'Expected Start Date',
  expected_end_date: 'Expected Completion Date',
  attachments: 'Attachments',
  cancel: 'Cancel',
  confirm: 'Confirm',
  enter_work_order_name: 'Enter work order name',
  enter_description: 'Enter description',

  device_info: 'Device Information',
  update_progress: 'Update Progress',
  progress_status: 'Progress Status',
  note: 'Note',
  enter_note: 'Enter note',
  start_date: 'Start Date',
  end_date: 'End Date',
  images: 'Images',
  confirm_progress: 'Confirm Progress',
  close: 'Close',
  update: 'Update',
  updating: 'Updating',

  device_code: 'Device Code',
  branch: 'Branch',
  completion_progress: 'Completion Progress',
  in_charge: 'In Charge',

  team_support: 'Team Support',
  team_technical: 'Team Technical',

  severity: {
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  },
  alarm_status: {
    active: 'Processing',
    open: 'Unprocessed',
    resolved: 'Resolved',
    ignored: 'Ignored'
  },
  work_order_status: {
    open: 'Unprocessed',
    process: 'Processing',
    completed: 'Processed',
    closed: 'Closed'
  },
  work_order_action: {
    open: 'Unprocessed',
    forward: 'Forward',
    comfirmed: 'Confirm Completion',
    cancel: 'Cancelled'
  }
} as const;

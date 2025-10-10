import { Calendar } from '@/core/domains/calendars/types';

export const calendars: Calendar[] = [
  {
    id: '1',
    name: 'Bảo trì hệ thống trung tâm',
    type: 'Theo lịch',
    time: '08:00 - 12:00',
    status: 'active',
    startDate: '2025-10-01T08:00:00Z',
    endDate: '2025-10-01T12:00:00Z',
    createdDate: '2025-09-29T09:00:00Z',
    children: [
      {
        id: '1-1',
        name: 'Khu vực A',
        type: 'Theo lịch',
        time: '06:00',
        status: 'active',
        startDate: '2025-10-01',
        endDate: '2025-10-10',
        createdDate: '2025-09-25'
      },
      {
        id: '1-2',
        name: 'Khu vực B',
        type: 'Theo lịch',
        time: '07:00',
        status: 'active',
        startDate: '2025-10-05',
        endDate: '2025-10-15',
        createdDate: '2025-09-26'
      }
    ]
  },
  {
    id: '2',
    name: 'Kiểm tra đèn khu A',
    type: 'Theo lịch',
    time: '14:00 - 17:00',
    status: 'pending',
    startDate: '2025-10-05T14:00:00Z',
    endDate: '2025-10-05T17:00:00Z',
    createdDate: '2025-10-03T08:30:00Z'
  },
  {
    id: '3',
    name: 'Xử lý sự cố server trung tâm',
    type: 'Khẩn cấp',
    time: '09:00 - 18:00',
    status: 'inactive',
    startDate: '2025-11-01T09:00:00Z',
    endDate: '2025-11-01T18:00:00Z',
    createdDate: '2025-10-30T10:15:00Z'
  },
  {
    id: '4',
    name: 'Vệ sinh tủ điện khu B',
    type: 'Theo lịch',
    time: '07:30 - 10:00',
    status: 'active',
    startDate: '2025-10-10T07:30:00Z',
    endDate: '2025-10-10T10:00:00Z',
    createdDate: '2025-10-08T09:10:00Z'
  },
  {
    id: '5',
    name: 'Kiểm định cảm biến nhiệt độ',
    type: 'Theo lịch',
    time: '13:00 - 17:30',
    status: 'pending',
    startDate: '2025-10-12T13:00:00Z',
    endDate: '2025-10-12T17:30:00Z',
    createdDate: '2025-10-10T09:20:00Z'
  },
  {
    id: '6',
    name: 'Cập nhật phần mềm điều khiển',
    type: 'Theo lịch',
    time: '09:00 - 11:30',
    status: 'inactive',
    startDate: '2025-10-15T09:00:00Z',
    endDate: '2025-10-15T11:30:00Z',
    createdDate: '2025-10-13T10:00:00Z'
  },
  {
    id: '7',
    name: 'Sửa khẩn cấp tủ điện khu C',
    type: 'Khẩn cấp',
    time: '08:30 - 16:30',
    status: 'active',
    startDate: '2025-10-18T08:30:00Z',
    endDate: '2025-10-18T16:30:00Z',
    createdDate: '2025-10-17T09:00:00Z'
  },
  {
    id: '8',
    name: 'Bảo hành hệ thống đèn khu D',
    type: 'Theo lịch',
    time: '10:00 - 14:00',
    status: 'active',
    startDate: '2025-10-20T10:00:00Z',
    endDate: '2025-10-20T14:00:00Z',
    createdDate: '2025-10-18T15:00:00Z'
  },
  {
    id: '9',
    name: 'Kiểm tra cảm biến ánh sáng',
    type: 'Theo lịch',
    time: '09:00 - 12:00',
    status: 'pending',
    startDate: '2025-10-22T09:00:00Z',
    endDate: '2025-10-22T12:00:00Z',
    createdDate: '2025-10-20T10:00:00Z'
  },
  {
    id: '10',
    name: 'Thay thế module khẩn cấp',
    type: 'Khẩn cấp',
    time: '08:00 - 15:00',
    status: 'inactive',
    startDate: '2025-10-25T08:00:00Z',
    endDate: '2025-10-25T15:00:00Z',
    createdDate: '2025-10-24T09:00:00Z'
  },
  {
    id: '11',
    name: 'Bảo trì tủ điện khu E',
    type: 'Theo lịch',
    time: '13:30 - 17:00',
    status: 'active',
    startDate: '2025-10-27T13:30:00Z',
    endDate: '2025-10-27T17:00:00Z',
    createdDate: '2025-10-25T11:30:00Z'
  },
  {
    id: '12',
    name: 'Sự cố cảm biến chuyển động',
    type: 'Khẩn cấp',
    time: '08:30 - 11:00',
    status: 'pending',
    startDate: '2025-10-29T08:30:00Z',
    endDate: '2025-10-29T11:00:00Z',
    createdDate: '2025-10-28T08:00:00Z'
  },
  {
    id: '13',
    name: 'Bảo dưỡng máy chủ trung tâm',
    type: 'Theo lịch',
    time: '09:00 - 13:00',
    status: 'active',
    startDate: '2025-11-03T09:00:00Z',
    endDate: '2025-11-03T13:00:00Z',
    createdDate: '2025-11-01T09:00:00Z'
  },
  {
    id: '14',
    name: 'Cập nhật firmware thiết bị điều khiển',
    type: 'Theo lịch',
    time: '08:00 - 11:30',
    status: 'inactive',
    startDate: '2025-11-05T08:00:00Z',
    endDate: '2025-11-05T11:30:00Z',
    createdDate: '2025-11-04T08:00:00Z'
  },
  {
    id: '15',
    name: 'Sửa chữa camera khẩn cấp',
    type: 'Khẩn cấp',
    time: '13:00 - 17:00',
    status: 'pending',
    startDate: '2025-11-07T13:00:00Z',
    endDate: '2025-11-07T17:00:00Z',
    createdDate: '2025-11-06T09:00:00Z'
  },
  {
    id: '16',
    name: 'Bảo trì phần mềm giám sát',
    type: 'Theo lịch',
    time: '09:00 - 12:00',
    status: 'active',
    startDate: '2025-11-09T09:00:00Z',
    endDate: '2025-11-09T12:00:00Z',
    createdDate: '2025-11-08T10:00:00Z'
  },
  {
    id: '17',
    name: 'Kiểm định nguồn điện dự phòng',
    type: 'Theo lịch',
    time: '14:00 - 18:00',
    status: 'inactive',
    startDate: '2025-11-12T14:00:00Z',
    endDate: '2025-11-12T18:00:00Z',
    createdDate: '2025-11-11T09:00:00Z'
  },
  {
    id: '18',
    name: 'Vệ sinh cảm biến khu F',
    type: 'Theo lịch',
    time: '08:00 - 10:00',
    status: 'active',
    startDate: '2025-11-15T08:00:00Z',
    endDate: '2025-11-15T10:00:00Z',
    createdDate: '2025-11-13T10:00:00Z'
  },
  {
    id: '19',
    name: 'Kiểm tra tủ điều khiển trung tâm',
    type: 'Theo lịch',
    time: '10:30 - 15:00',
    status: 'pending',
    startDate: '2025-11-18T10:30:00Z',
    endDate: '2025-11-18T15:00:00Z',
    createdDate: '2025-11-17T08:00:00Z'
  },
  {
    id: '20',
    name: 'Khắc phục sự cố cảm biến nhiệt độ',
    type: 'Khẩn cấp',
    time: '09:00 - 11:00',
    status: 'active',
    startDate: '2025-11-20T09:00:00Z',
    endDate: '2025-11-20T11:00:00Z',
    createdDate: '2025-11-19T09:00:00Z'
  }
];

export interface Reminder {
  id: string;
  created_by: string;
  name: string;
  description?: string;
  domain_id: string;
  before: number;
  after: number;
  created_at: string;
  updated_at: string;
}

export interface ReminderListResponseDto {
  reminder?: Reminder[];
  total?: number;
}

// API might return array directly or wrapped in object
export type ReminderResponse = Reminder[] | ReminderListResponseDto;

export interface CreateReminderDto {
  name: string;
  description?: string;
  before: number;
  after: number;
}

export interface UpdateReminderDto extends Partial<CreateReminderDto> {}

export const formatDateTimeString = (
  dateTimeString?: string | null
): string => {
  if (!dateTimeString) return '-';
  const date = new Date(dateTimeString);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  const space = '\u00A0\u00A0';
  return `${d}/${m}/${y} ${space} ${Number(h)}:${min}`;
};

export function toDateOnlyString(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function normalizeStartEndDate(
  startDateISO: string,
  endDateISO: string
): { startDate: string; endDate: string } {
  const start = new Date(startDateISO);
  const end = new Date(endDateISO);
  const now = new Date();

  // ✅ compare LOCAL date (theo nhận thức user)
  const isSameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const isToday =
    start.getFullYear() === now.getFullYear() &&
    start.getMonth() === now.getMonth() &&
    start.getDate() === now.getDate();

  // ✅ CASE 1: start === end → end = cuối ngày
  if (isSameDay) {
    end.setUTCHours(23, 59, 59, 999);

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString()
    };
  }

  // ✅ CASE 2: start là hôm nay → copy time start → end
  if (isToday) {
    end.setUTCHours(
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    );
    start.setUTCHours(
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    );
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString()
    };
  }

  return {
    startDate: startDateISO,
    endDate: endDateISO
  };
}

export const CARD_FIELDS = {
  card1: [
    'work_order_name',
    'department',
    'assignee_id',
    'description',
    'start_date',
    'end_date'
  ] as const,

  card2: ['work_order_status', 'assignee_content'] as const,

  card3: ['action', 'remarks'] as const
};

export function pickAllowedFields<T extends object>(
  values: T,
  allowedKeys: readonly (keyof T)[]
): Partial<T> {
  return Object.fromEntries(
    allowedKeys
      .filter((k) => values[k] !== undefined)
      .map((k) => [k, values[k]])
  ) as Partial<T>;
}

export function diffTimeBetween(startAt: string, endAt?: string): string {
  const start = new Date(startAt).getTime();
  const end = endAt ? new Date(endAt).getTime() : Date.now();

  const diffMs = end - start;
  if (diffMs <= 0) return '0p';

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);

  // < 1 phút
  if (totalMinutes < 1) {
    return `${totalSeconds}s`;
  }

  // < 1 giờ → chỉ phút
  if (totalMinutes < 60) {
    return `${totalMinutes}p`;
  }

  // < 1 ngày → giờ + phút (5h18p)
  if (totalHours < 24) {
    const hours = totalHours;
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}p` : `${hours}h`;
  }

  // >= 1 ngày
  return `${days} ngày`;
}

import { Device } from '@/core/domains/devices';
import { LanguageKey } from '@/core/i18n/locales';
export function getSensorAttributes(data: Device) {
  if (!data || !Array.isArray(data.devices)) {
    return null;
  }
  const sensor = data.devices.find(
    (d) => d.type === 'lms.devices.types.SENSOR'
  );
  if (!sensor?.last_state) return null;
  return {
    electric: sensor.last_state.active_e,
    temperature: sensor.last_state.temperature
  };
}

export function diffTimeHMS(
  updatedAt: string,
  t?: (key: LanguageKey, params?: any) => string
): string {
  const end = Date.now();
  const start = new Date(updatedAt).getTime();
  const diffMs = end - start;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30); // gần đúng
  const years = Math.floor(days / 365);
  if (t) {
    if (seconds < 60) return t('general.seconds_ago', { count: seconds });
    if (minutes < 60) return t('general.minutes_ago', { count: minutes });
    if (hours < 24) return t('general.hours_ago', { count: hours });
    if (days < 7) return t('general.days_ago', { count: days });
    if (weeks < 5) return t('general.weeks_ago', { count: weeks });
    if (months < 12) return t('general.months_ago', { count: months });
    return t('general.years_ago', { count: years });
  }
  if (seconds < 60) return `${seconds} giây trước`;
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  if (weeks < 5) return `${weeks} tuần trước`;
  if (months < 12) return `${months} tháng trước`;
  return `${years} năm trước`;
}

import { Device } from '@/core/domains/devices';

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

export function diffTimeHMS(updatedAt: string) {
  const end = new Date().getTime();
  const start = new Date(updatedAt).getTime();

  const diffMs = end - start;
  const minutes = Math.floor(diffMs / 1000 / 60);

  return minutes;
}

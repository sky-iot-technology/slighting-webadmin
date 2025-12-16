import { Device, DeviceListResponseDto } from '@/core/domains/devices';
import { authenticatedApi } from '@/core/shared/api';

type DeviceListener = (device: Device) => void;
type DoneListener = () => void;
type ErrorListener = (error: unknown) => void;

class DeviceDataLayer {
  private deviceListeners = new Set<DeviceListener>();
  private doneListeners = new Set<DoneListener>();
  private errorListeners = new Set<ErrorListener>();

  private aborted = false;

  onDevice(cb: DeviceListener) {
    this.deviceListeners.add(cb);
    return () => this.deviceListeners.delete(cb);
  }

  onDone(cb: DoneListener) {
    this.doneListeners.add(cb);
    return () => this.doneListeners.delete(cb);
  }

  onError(cb: ErrorListener) {
    this.errorListeners.add(cb);
    return () => this.errorListeners.delete(cb);
  }

  async load(params: { group?: string; limit?: number }) {
    this.aborted = false;

    const limit = params.limit ?? 10;
    let offset = 0;
    let total = Infinity;

    try {
      while (!this.aborted && offset < total) {
        const res = await authenticatedApi.get<DeviceListResponseDto>(
          '/devices/things',
          {
            params: {
              offset,
              limit,
              group: params.group
            }
          }
        );

        const devices = res.devices ?? [];
        total = res.total ?? 0;

        for (const device of devices) {
          if (this.aborted) return;
          this.deviceListeners.forEach((cb) => cb(device));
        }

        offset += devices.length;

        // Nếu API trả ít hơn limit → hết data
        if (devices.length < limit) break;
      }
      this.doneListeners.forEach((cb) => cb());
    } catch (err) {
      this.errorListeners.forEach((cb) => cb(err));
    }
  }

  stop() {
    this.aborted = true;
  }
}

export const deviceDataLayer = new DeviceDataLayer();

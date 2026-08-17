import {
  Device,
  DeviceListResponseDto,
  GetDevicesParamsDto
} from '@/core/domains/devices';
import { authenticatedApi } from '@/core/shared/api';
import axios from 'axios';

type DeviceListener = (device: Device) => void;
type DoneListener = () => void;
type ErrorListener = (error: unknown) => void;

export class DeviceDataLayer {
  private deviceListeners = new Set<DeviceListener>();
  private doneListeners = new Set<DoneListener>();
  private errorListeners = new Set<ErrorListener>();

  private abortController: AbortController | null = null;

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

  async load(params?: GetDevicesParamsDto) {
    // Abort any active loading session first
    this.stop();

    // Create a new AbortController for the current load session
    const controller = new AbortController();
    this.abortController = controller;

    const { limit = 100, ...restParams } = params ?? {};
    let offset = 0;
    let total = Infinity;

    try {
      while (!controller.signal.aborted && offset < total) {
        const res = await authenticatedApi.get<DeviceListResponseDto>(
          '/devices/clients',
          {
            params: {
              offset,
              limit,
              ...restParams
            },
            signal: controller.signal
          }
        );

        if (controller.signal.aborted) return;

        const devices = res.devices ?? [];
        total = res.total ?? 0;

        for (const device of devices) {
          if (controller.signal.aborted) return;
          this.deviceListeners.forEach((cb) => cb(device));
        }

        offset += devices.length;

        // If the API returns fewer devices than the limit, or no devices, we've loaded all of them
        if (devices.length < limit || devices.length === 0) break;
      }

      if (!controller.signal.aborted) {
        this.doneListeners.forEach((cb) => cb());
      }
    } catch (err) {
      if (axios.isCancel(err) || (err as any)?.name === 'CanceledError') {
        // Request was cancelled, ignore
        return;
      }
      if (!controller.signal.aborted) {
        this.errorListeners.forEach((cb) => cb(err));
      }
    } finally {
      if (this.abortController === controller) {
        this.abortController = null;
      }
    }
  }

  stop() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

export const deviceDataLayer = new DeviceDataLayer();

import { Device, DeviceFeatureProps } from '@/core/domains/devices/types';
import type { FeatureCollection, Feature, Point } from 'geojson';
import { LayerProps } from '@goongmaps/goong-map-react';

export const createDeivcesGeoJSON = (
  devices: Device[]
): FeatureCollection<Point, DeviceFeatureProps> => {
  return {
    type: 'FeatureCollection',
    features: devices.map((device): Feature<Point, DeviceFeatureProps> => {
      const controllable = (device.devices || []).filter(
        (d) =>
          d.type === 'lms.devices.types.LIGHT' ||
          d.type === 'lms.devices.types.SWITCH'
      );
      const activeCount = controllable.filter(
        (d) => d.last_state?.on === true
      ).length;
      const total = controllable.length;
      const statusDots = `${activeCount}/${total}`;

      const lat = device.location?.lat ?? device.device_info?.lat ?? 0;
      const lon = device.location?.lon ?? device.device_info?.lon ?? 0;

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        },
        properties: {
          id: device.id,
          type: device.type,
          name: device.name,
          lon: lon,
          lat: lat,
          online: device.device_info.online ? 'online' : 'offline',
          light_state: activeCount > 0 ? 'on' : 'off',
          status_dots: statusDots
        }
      };
    })
  };
};

export const clusterLayer: LayerProps = {
  id: 'devices-clusters',
  type: 'circle',
  source: 'devices-source',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#51bbd6',
      100,
      '#f1f075',
      750,
      '#f28cb1'
    ],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
  }
};

export const clusterCountLayer: LayerProps = {
  id: 'devices-cluster-count',
  type: 'symbol',
  source: 'devices-source',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['Roboto Regular'],
    'text-size': 14,
    'text-allow-overlap': true,
    'text-ignore-placement': true
  },
  paint: {
    'text-color': '#000000'
  }
};

export const deviceStatusDotsLayer: LayerProps = {
  id: 'device-status-dots',
  type: 'symbol',
  source: 'devices-source',
  filter: [
    'all',
    ['!', ['has', 'point_count']],
    // ['==', ['get', 'type'], 'lms.devices.types.STL_CABINET'],
    ['==', ['get', 'online'], 'online']
  ],
  layout: {
    'text-field': ['get', 'status_dots'],
    'text-font': ['Roboto Regular'],
    'text-size': 16,
    'text-anchor': 'bottom',
    'text-offset': [0, -4.5],
    'text-allow-overlap': true,
    'text-ignore-placement': true,
    'text-letter-spacing': 0.2
  },
  paint: {
    'text-color': [
      'case',
      ['==', ['get', 'light_state'], 'on'],
      '#4ade80',
      '#e2e8f0'
    ],
    'text-halo-color': '#000000',
    'text-halo-width': 2
  }
};

export const unclusteredPointLayer: LayerProps = {
  id: 'devices-unclustered',
  type: 'symbol',
  source: 'devices-source',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': [
      'case',
      //light online on
      [
        'all',
        ['==', ['get', 'type'], 'lms.devices.types.STL_SMART'],
        ['==', ['get', 'online'], 'online'],
        ['==', ['get', 'light_state'], 'on']
      ],
      'light-online-on',
      //light online off
      [
        'all',
        ['==', ['get', 'type'], 'lms.devices.types.STL_SMART'],
        ['==', ['get', 'online'], 'online']
      ],
      'light-online',
      //light offline
      ['==', ['get', 'type'], 'lms.devices.types.STL_SMART'],
      'light-offline',
      //cabinet online on
      [
        'all',
        ['==', ['get', 'type'], 'lms.devices.types.STL_CABINET'],
        ['==', ['get', 'online'], 'online'],
        ['==', ['get', 'light_state'], 'on']
      ],
      'cabinet-online',
      //cabinet online off
      [
        'all',
        ['==', ['get', 'type'], 'lms.devices.types.STL_CABINET'],
        ['==', ['get', 'online'], 'online']
      ],
      'cabinet-online',
      'cabinet-offline'
    ],
    'icon-size': 0.5,
    'icon-allow-overlap': true,

    'icon-anchor': 'bottom',
    visibility: 'visible',
    'text-field': ['step', ['zoom'], '', 14, ['get', 'name']],
    'text-font': ['Roboto Regular'],
    'text-size': 12,
    'text-offset': [0, 0.4],
    'text-anchor': 'top',
    'text-allow-overlap': true,
    'text-ignore-placement': true
  },
  paint: {
    'icon-opacity': 1,
    'text-color': '#0f172a',
    'text-halo-color': '#ffffff',
    'text-halo-width': 2
  }
};

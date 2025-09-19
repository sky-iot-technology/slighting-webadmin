import { Device } from '@/core/domains/devices/types';
import type { FeatureCollection, Feature, Point } from 'geojson';
import { LayerProps } from '@goongmaps/goong-map-react';

export const createDeivcesGeoJSON = (
  devices: Device[]
): FeatureCollection<Point, Device> => {
  return {
    type: 'FeatureCollection',
    features: devices.map(
      (device): Feature<Point, Device> => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [device.longitude, device.latitude]
        },
        properties: {
          ...device
        }
      })
    )
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
    'text-size': 12
  },
  paint: {}
};

export const unclusteredPointLayer: LayerProps = {
  id: 'devices-unclustered',
  type: 'symbol',
  source: 'devices-source',
  filter: ['!', ['has', 'point_count']],
  // paint: {
  //   'circle-color': '#11b4da',
  //   'circle-radius': 4,
  //   'circle-stroke-width': 1,
  //   'circle-stroke-color': '#fff'
  // }
  layout: {
    'icon-image': [
      'case',
      ['==', ['get', 'online'], true],
      'cabinet-online',
      'cabinet-offline'
    ],
    'icon-size': 0.5,
    'icon-allow-overlap': true,
    'icon-anchor': 'bottom',
    visibility: 'visible'
  },
  paint: {
    'icon-opacity': 1
  }
};

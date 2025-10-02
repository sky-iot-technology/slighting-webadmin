import { MapRef } from '@goongmaps/goong-map-react';
import { useEffect, useRef } from 'react';
import {
  clusterCountLayer,
  clusterLayer,
  createDeivcesGeoJSON,
  unclusteredPointLayer
} from '../config/map-layers';

const loadIcons = (map: any) => {
  const load = (id: string, url: string) => {
    if (map.hasImage(id)) return;

    map.loadImage(url, (error: any, image: any) => {
      if (error || !image) {
        console.error(`Error loading ${id}:`, error);
        return;
      }
      if (!map.hasImage(id)) {
        map.addImage(id, image);
      }
    });
  };

  load('cabinet-online', '/assets/images/cabinet-online.png');
  load('cabinet-offline', '/assets/images/cabinet-offline.png');
  load('cabinet-warning', '/assets/images/cabinet-warning.png');
};

export const useMapLayers = (
  mapRef: React.RefObject<MapRef | null>,
  devices: any[]
) => {
  const isSourceInitialized = useRef(false);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const devicesGeoJSON = createDeivcesGeoJSON(devices);

    const updateMapData = () => {
      try {
        if (!isSourceInitialized.current) {
          // Tải icon chỉ khi source được tạo lần đầu
          loadIcons(map);
          map.addSource('devices-source', {
            type: 'geojson',
            data: devicesGeoJSON,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
          });

          map.addLayer(clusterLayer as any);
          map.addLayer(clusterCountLayer as any);
          map.addLayer(unclusteredPointLayer as any);

          isSourceInitialized.current = true;
        } else {
          // Cập nhật dữ liệu trong source hiện có
          const existingSource = map.getSource('devices-source') as any;
          if (existingSource) {
            existingSource.setData(devicesGeoJSON);
          }
        }
      } catch (error) {
        console.error('❌ Error in updateMapData:', error);
      }
    };

    if (map.isStyleLoaded()) {
      updateMapData();
    } else {
      const loadHandler = () => {
        updateMapData();
      };
      map.once('load', loadHandler);

      return () => {
        map.off('load', loadHandler);
      };
    }
  }, [mapRef, devices]);
};

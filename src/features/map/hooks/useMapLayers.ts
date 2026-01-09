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
  load('light-online', '/assets/images/light-online.png');
  load('light-offline', '/assets/images/light-offline.png');
};

export const useMapLayers = (
  mapRef: React.RefObject<MapRef | null>,
  devices: any[],
  regionId?: string
) => {
  const isSourceInitialized = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const devicesGeoJSON = createDeivcesGeoJSON(devices);

    const updateMapData = () => {
      try {
        const existingSource = map.getSource('devices-source') as any;
        if (!isSourceInitialized.current) {
          if (existingSource) {
            existingSource.setData(devicesGeoJSON);
            isSourceInitialized.current = true;
            return;
          }

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

    // const tryLoad = (attempt = 0) => {
    //   if (map.isStyleLoaded()) {
    //     updateMapData();
    //   } else if (attempt < 20) {
    //     timeoutRef.current = setTimeout(() => tryLoad(attempt + 1), 300);
    //   } else {
    //     console.warn('⚠️ Map style not ready after 3s, skipping addSource');
    //   }
    // };

    // if (map.isStyleLoaded()) {
    //   updateMapData();
    // } else {
    //   map.once('load', updateMapData);
    //   tryLoad(); // dự phòng khi load ko bắn (tab switching)
    // }

    // // cleanup
    // return () => {
    //   if (timeoutRef.current) clearTimeout(timeoutRef.current);
    //   map.off('load', updateMapData);
    // };

    const handleStyleReady = () => {
      if (map.isStyleLoaded()) updateMapData();
    };
    map.once('styledata', handleStyleReady);
    map.once('idle', handleStyleReady);
    if (map.isStyleLoaded()) handleStyleReady();
    return () => {
      map.off('styledata', handleStyleReady);
      map.off('idle', handleStyleReady);
    };
  }, [mapRef, devices, regionId]);
};

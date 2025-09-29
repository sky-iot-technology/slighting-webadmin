import { Device } from '@/core/domains/devices/types';
import { MapRef } from '@goongmaps/goong-map-react';
import type { Map as MapboxMap } from 'mapbox-gl';
import { useCallback, useEffect, useState } from 'react';
import {
  clusterCountLayer,
  clusterLayer,
  createDeivcesGeoJSON,
  unclusteredPointLayer
} from '../config/map-layers';

export const useMapLayers = (
  mapRef: React.RefObject<MapRef | null>,
  devices: Device[]
) => {
  // useEffect(() => {
  //   const map: MapboxMap | undefined = mapRef.current?.getMap();
  //   if (!map) return;

  //   console.log('data update', devices);
  //   const initializeMap = () => {

  //     try {
  //       loadIcons(map);

  //       //add source devices
  //       console.log("Updating devices on map", devices.length);
  //       const devicesGeoJSON = createDeivcesGeoJSON(devices);
  //       if (map.getSource('devices-source')) {
  //         (map.getSource('devices-source') as any).setData(devicesGeoJSON);
  //         console.log("Updated existing devices-source with", devices.length);
  //       } else {
  //         //add new source
  //         console.log("Adding new devices-source with", devices.length);
  //         map.addSource('devices-source', {
  //           type: 'geojson',
  //           data: devicesGeoJSON,
  //           cluster: true,
  //           clusterMaxZoom: 30,
  //           clusterRadius: 50
  //         });
  //         //add layers
  //         if (!map.getLayer('devices-clusters')) {
  //           map.addLayer(clusterLayer as any);
  //         }
  //         if (!map.getLayer('devices-cluster-count')) {
  //           map.addLayer(clusterCountLayer as any);
  //         }
  //         if (!map.getLayer('devices-unclustered')) {
  //           map.addLayer(unclusteredPointLayer as any);
  //         }
  //       }
  //       setTimeout(() => {
  //         if (map.style) {
  //           map.triggerRepaint();
  //         }
  //       }, 100);
  //     } catch (error) {
  //       console.error('Error in loadIcons:', error);
  //     }
  //   };

  //   if (map.isStyleLoaded()) {
  //     initializeMap();
  //   } else {
  //     map.once('load', initializeMap);
  //   }

  //   return () => {
  //     map?.off("load", initializeMap);
  //   };
  // }, [devices, mapRef]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    console.log(
      '🔄 useMapLayers effect running with',
      devices.length,
      'devices'
    );
    console.log('🗺️ Map style loaded:', map.isStyleLoaded());

    const updateMapData = () => {
      try {
        loadIcons(map);

        const devicesGeoJSON = createDeivcesGeoJSON(devices);
        console.log('📊 GeoJSON features:', devicesGeoJSON.features.length);

        const existingSource = map.getSource('devices-source') as any;
        if (existingSource) {
          existingSource.setData(devicesGeoJSON);
          console.log(
            '🔄 Updated existing source with',
            devices.length,
            'devices'
          );
        } else {
          //if not exists
          map.addSource('devices-source', {
            type: 'geojson',
            data: devicesGeoJSON,
            cluster: true,
            clusterMaxZoom: 30,
            clusterRadius: 50
          });

          map.addLayer(clusterLayer as any);
          map.addLayer(clusterCountLayer as any);
          map.addLayer(unclusteredPointLayer as any);

          console.log(
            '✅ Created new source and layers with',
            devices.length,
            'devices'
          );
        }
        // Force map update
        setTimeout(() => {
          map.triggerRepaint();
          console.log('🎨 Map repainted');
        }, 100);
      } catch (error) {
        console.error('❌ Error in initializeMap:', error);
      }
    };

    if (map.isStyleLoaded()) {
      console.log('✅ Map is ready, updating immediately');
      // Dùng setTimeout để tránh race condition
      setTimeout(updateMapData, 0);
    } else {
      console.log('⏳ Map not ready, setting up load listener');

      // Sử dụng 'once' để tránh memory leak, và thêm fallback timeout
      const loadHandler = () => {
        console.log('🗺️ Map load event fired');
        updateMapData();
      };

      map.once('load', loadHandler);

      // Fallback: Nếu sau 2s mà load event không fire, thử chạy anyway
      const fallbackTimeout = setTimeout(() => {
        console.log('⏰ Fallback: Load event timeout, trying to update anyway');
        map.off('load', loadHandler); // Remove listener để tránh chạy 2 lần
        // if (map.isStyleLoaded()) {
        //   updateMapData();
        // }
        updateMapData();
      }, 2000);

      return () => {
        clearTimeout(fallbackTimeout);
        map.off('load', loadHandler);
      };
    }
  }, [devices, mapRef]);
};

const loadIcons = (map: MapboxMap) => {
  const load = (id: string, url: string) => {
    if (map.hasImage(id)) return;

    map.loadImage(url, (error, image) => {
      if (error || !image) {
        console.error(`Error loading ${id}:`, error);
        return;
      }
      if (!map.hasImage(id)) {
        map.addImage(id, image);
        console.log(`${id} loaded successfully`);
      }
    });
  };

  load('cabinet-online', '/assets/images/cabinet-online.png');
  load('cabinet-offline', '/assets/images/cabinet-offline.png');
};

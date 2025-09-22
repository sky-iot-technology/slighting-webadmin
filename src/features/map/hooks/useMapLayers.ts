import { Device } from '@/core/domains/devices/types';
import { MapRef } from '@goongmaps/goong-map-react';
import type { Map as MapboxMap } from 'mapbox-gl';
import { useEffect } from 'react';
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
  useEffect(() => {
    const map: MapboxMap | undefined = mapRef.current?.getMap();
    if (!map) return;

    const initializeMap = () => {
      try {
        //1. Load Icon
        if (map.hasImage('cabinet-online')) {
          map.removeImage('cabinet-online');
        }
        if (map.hasImage('cabinet-offline')) {
          map.removeImage('cabinet-offline');
        }

        map.loadImage(
          '/assets/images/cabinet-online.png',
          (error: any, onlineImage: any) => {
            if (error || !onlineImage) {
              console.error('Error loading image:', error);
              return;
            }
            map.addImage('cabinet-online', onlineImage);
            console.log('cabinet-online loaded successfully');

            map.loadImage(
              '/assets/images/cabinet-offline.png',
              (error: any, offlineImage: any) => {
                if (error || !offlineImage) {
                  console.error('Error loading offline image:', error);
                  return;
                }
                map.addImage('cabinet-offline', offlineImage);
                console.log('cabinet-offline loaded successfully');
              }
            );

            //add source devices
            const devicesGeoJSON = createDeivcesGeoJSON(devices);
            if (map.getSource('devices-source')) {
              (map.getSource('devices-source') as any).setData(devicesGeoJSON);
            } else {
              //add new source
              map.addSource('devices-source', {
                type: 'geojson',
                data: devicesGeoJSON,
                cluster: true,
                clusterMaxZoom: 30,
                clusterRadius: 50
              });
              //add layers
              if (!map.getLayer('devices-clusters')) {
                map.addLayer(clusterLayer as any);
              }
              if (!map.getLayer('devices-cluster-count')) {
                map.addLayer(clusterCountLayer as any);
              }
              if (!map.getLayer('devices-unclustered')) {
                map.addLayer(unclusteredPointLayer as any);
              }
            }

            setTimeout(() => {
              if (map.style) {
                map.triggerRepaint();
              }
            }, 100);
          }
        );
      } catch (error) {
        console.error('Error in loadIcons:', error);
      }
    };

    if (map.isStyleLoaded()) {
      initializeMap();
    } else {
      map.once('load', initializeMap); // Sử dụng once thay vì on
    }

    return () => {
      if (map) {
        map.off('load', initializeMap);
        const layersToRemove = [
          'devices-clusters',
          'devices-cluster-count',
          'devices-unclustered'
        ];

        layersToRemove.forEach((layerId) => {
          try {
            if (map.getLayer(layerId)) {
              map.removeLayer(layerId);
            }
          } catch (error) {
            console.debug(`Layer ${layerId} already removed`);
          }
        });

        const sourcesToRemove = ['devices-source'];
        sourcesToRemove.forEach((sourceId) => {
          try {
            if (map.getSource(sourceId)) {
              map.removeSource(sourceId);
            }
          } catch (error) {
            console.debug(`Source ${sourceId} already removed`);
          }
        });
      }
      const imagesToRemove = ['cabinet-online', 'cabinet-offline'];
      imagesToRemove.forEach((imageId) => {
        try {
          if (map.hasImage(imageId)) {
            map.removeImage(imageId);
          }
        } catch (error) {
          console.debug(`Image ${imageId} already removed`);
        }
      });
    };
  }, [devices, mapRef]);
};

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

// export const useMapLayers = (
//   mapRef: React.RefObject<MapRef | null>,
//   devices: any[],
//   regionId?: string,
//   mapStyle?: string
// ) => {
//   const isSourceInitialized = useRef(false);

//   useEffect(() => {
//     const map = mapRef.current?.getMap();
//     if (!map) return;

//     // Reset initialization flag when mapStyle changes
//     isSourceInitialized.current = false;

//     const devicesGeoJSON = createDeivcesGeoJSON(devices);

//     const updateMapData = () => {
//       try {
//         const existingSource = map.getSource('devices-source') as any;

//         if (!isSourceInitialized.current) {
//           // Remove existing layers and source if they exist (cleanup from previous style)
//           // Must remove layers BEFORE removing source, in reverse order of creation
//           const layersToRemove = [
//             'devices-unclustered',
//             'devices-cluster-count',
//             'devices-clusters'
//           ];

//           layersToRemove.forEach(layerId => {
//             if (map.getLayer(layerId)) {
//               map.removeLayer(layerId);
//             }
//           });

//           if (existingSource) {
//             map.removeSource('devices-source');
//           }

//           // Load icons
//           loadIcons(map);

//           // Add source and layers
//           map.addSource('devices-source', {
//             type: 'geojson',
//             data: devicesGeoJSON,
//             cluster: true,
//             clusterMaxZoom: 14,
//             clusterRadius: 50
//           });

//           map.addLayer(clusterLayer as any);
//           map.addLayer(clusterCountLayer as any);
//           map.addLayer(unclusteredPointLayer as any);

//           isSourceInitialized.current = true;
//         } else {
//           // Update data in existing source
//           if (existingSource) {
//             existingSource.setData(devicesGeoJSON);
//           }
//         }
//       } catch (error) {
//         console.error('❌ Error in updateMapData:', error);
//       }
//     };

//     const handleStyleReady = () => {
//       if (map.isStyleLoaded()) {
//         updateMapData();
//       }
//     };

//     // Listen for style changes (theme switching)
//     map.once('styledata', handleStyleReady);
//     map.once('idle', handleStyleReady);

//     // Initialize immediately if style is already loaded
//     if (map.isStyleLoaded()) {
//       handleStyleReady();
//     }

//     return () => {
//       map.off('styledata', handleStyleReady);
//       map.off('idle', handleStyleReady);
//     };
//   }, [mapRef, devices, regionId, mapStyle]); // mapStyle dependency is crucial
// };

export const useMapLayers = (
  mapRef: React.RefObject<MapRef | null>,
  devices: any[],
  regionId?: string,
  mapStyle?: string
) => {
  const isSourceInitialized = useRef(false);

  useEffect(() => {
    const map = mapRef.current?.getMap();

    if (!map) {
      return;
    }

    // Reset when style changes
    isSourceInitialized.current = false;

    const devicesGeoJSON = createDeivcesGeoJSON(devices);

    const updateMapData = () => {
      try {
        const source = map.getSource('devices-source') as any;

        const shouldInit = !isSourceInitialized.current || !source;

        // ================= INIT =================
        if (shouldInit) {
          isSourceInitialized.current = false;

          const layers = [
            'devices-unclustered',
            'devices-cluster-count',
            'devices-clusters'
          ];

          layers.forEach((id) => {
            if (map.getLayer(id)) {
              map.removeLayer(id);
            }
          });

          if (map.getSource('devices-source')) {
            map.removeSource('devices-source');
          }

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

          return;
        }

        source.setData(devicesGeoJSON);
      } catch (e) {
        console.error('🔥 updateMapData error:', e);
      }
    };

    const handleStyleReady = () => {
      if (map.isStyleLoaded()) {
        updateMapData();
      } else {
        console.warn('⚠️ Style not ready yet');
      }
    };

    map.once('style.load', handleStyleReady);
    map.once('idle', handleStyleReady);

    if (map.isStyleLoaded()) {
      handleStyleReady();
    }

    return () => {
      map.off('style.load', handleStyleReady);
      map.off('idle', handleStyleReady);
    };
  }, [mapRef, devices, regionId, mapStyle]);
};

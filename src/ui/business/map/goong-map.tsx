'use client';

import ReactMapGL, {
  FlyToInterpolator,
  MapEvent,
  MapRef,
  Marker,
  Popup,
  ScaleControl,
  ViewportProps,
  WebMercatorViewport
} from '@goongmaps/goong-map-react';
import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Device } from '@/core/domains/devices';
import { Loader2 } from 'lucide-react';
import { useMapLayers } from '@/features/map/hooks/useMapLayers';
import { useMapResize } from '@/features/map/hooks/useMapResize';
import {
  mapControllerProps,
  scaleControlProps
} from '@/features/map/config/map-controls';
import Cabinet_info_panel from '@/features/map/components/cabinet_info_panel';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { Button } from '@/ui/components/ui/button';
import { DeviceHoverCard } from '@/features/map/components/device-hover-card';
import { useTranslation } from '@/core/domains/language/useTranslation';
import { useTheme } from 'next-themes';

const MAP_STYLE_LIGHT = 'https://tiles.goong.io/assets/goong_map_web.json';

const MAP_STYLE_DARK = 'https://tiles.goong.io/assets/goong_map_dark.json';

type SelectedRegion = { id: string; name: string } | null;

type GoongMapProps = {
  selectedRegion: SelectedRegion | null;
  devices?: Device[];
  isLoading: boolean;
  isFetching: boolean;
  selectedDevice: { device: Device | null; ts: number } | null;

  /** ✅ optional render for popup */
  renderPopup?: (id: string | number, onClose: () => void) => React.ReactNode;
  hover?: boolean;
};

type FitBoundsOptions = {
  zoom?: number;
  saveLastViewport?: boolean;
};

export default function GoongMap({
  selectedRegion = null,
  devices = [],
  isLoading = false,
  isFetching = false,
  selectedDevice = null,
  renderPopup,
  hover = false
}: GoongMapProps) {
  const { t } = useTranslation();
  const { theme, resolvedTheme } = useTheme();

  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapStyle, setMapStyle] = useState(MAP_STYLE_LIGHT);
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [viewport, setViewport] = useState<ViewportProps>({
    longitude: 106.700981,
    latitude: 10.776889,
    zoom: 5
  });
  const [lastViewport, setLastViewport] = useState<ViewportProps>({});
  const [popupInfo, setPopupInfo] = useState<number | string | null>(null);
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [needsInitialization, setNeedsInitialization] = useState(true);

  const mapRef = useRef<MapRef | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const nextStyle =
      resolvedTheme === 'dark' ? MAP_STYLE_DARK : MAP_STYLE_LIGHT;

    if (nextStyle !== mapStyle) {
      setMapStyle(nextStyle);
    }
  }, [resolvedTheme, mapStyle]);

  useMapLayers(mapRef, devices, selectedRegion?.id, mapStyle);

  const handleViewportChange = useCallback((options: ViewportProps) => {
    setViewport((prev) => ({ ...prev, ...options }));
    setTransitionDuration(0);
  }, []);

  const flyToDevice = useCallback((id: string, lon: number, lat: number) => {
    if (!lon || !lat) return;

    setPopupInfo(id);

    setViewport((prev) => ({
      ...prev,
      longitude: lon,
      latitude: lat,
      zoom: 16,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.4 })
    }));
    setTransitionDuration(600);
  }, []);

  const fitBoundsToDevices = useCallback(
    (devices: Device[], options: FitBoundsOptions = {}): boolean => {
      if (!devices.length) return false;

      const devicesWithCoords = devices.filter((d) => {
        const lon = d.device_info?.lon;
        const lat = d.device_info?.lat;

        return (
          typeof lon === 'number' &&
          typeof lat === 'number' &&
          Number.isFinite(lon) &&
          Number.isFinite(lat) &&
          lon >= -180 &&
          lon <= 180 &&
          lat >= -90 &&
          lat <= 90
        );
      });
      if (!devicesWithCoords.length) return false;

      const longs = devicesWithCoords.map((d) => d.device_info.lon);
      const lats = devicesWithCoords.map((d) => d.device_info.lat);

      const container = mapContainerRef.current;
      if (!container) return false;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      if (!width || !height) {
        return false;
      }
      const { longitude, latitude, zoom } = new WebMercatorViewport({
        width,
        height
      }).fitBounds(
        [
          [Math.min(...longs), Math.min(...lats)],
          [Math.max(...longs), Math.max(...lats)]
        ],
        { padding: 100 }
      );

      const nextZoom = options.zoom ?? zoom;
      setViewport((prev) => ({
        ...prev,
        longitude,
        latitude,
        zoom: nextZoom || zoom,
        transitionInterpolator: new FlyToInterpolator({ speed: 1.4 }),
        transitionEasing: (t) => t
      }));
      setTransitionDuration(600);

      if (options.saveLastViewport) {
        setLastViewport((prev) => ({
          ...prev,
          longitude,
          latitude,
          zoom: nextZoom || zoom,
          transitionInterpolator: new FlyToInterpolator({ speed: 1.4 }),
          transitionEasing: (t) => t
        }));
        setTransitionDuration(600);
      }
      return true;
    },
    [setViewport, setTransitionDuration]
  );

  /**
   * Safely query features without crashing if style is loading or layers missing.
   * Look Before You Leap: We filter layers using map.getLayer(id) to ensure we never query a missing layer.
   */
  const safeQueryFeatures = (point: [number, number]) => {
    try {
      const map = mapRef.current?.getMap();
      if (!map || !map.isStyleLoaded()) return [];

      const validLayers = ['devices-clusters', 'devices-unclustered'].filter(
        (id) => !!map.getLayer(id)
      );
      if (validLayers.length === 0) return [];

      return map.queryRenderedFeatures(point, {
        layers: validLayers
      });
    } catch (e) {
      // Squelch errors during style transition
      return [];
    }
  };

  const onClick = (event: MapEvent) => {
    if (renderPopup) return;

    // Manual query to be safe
    const features = safeQueryFeatures(event.point);
    if (!features?.length) return;

    const map = mapRef.current?.getMap();
    if (!map) return;

    const feature = features[0];
    if (feature.layer.id === 'devices-unclustered') {
      const { id, lon, lat } = feature.properties;
      flyToDevice(id, lon, lat);
    } else if (feature.layer.id === 'devices-clusters') {
      const clusterId = feature.properties.cluster_id;
      const source = map.getSource('devices-source') as any;

      source.getClusterLeaves(clusterId, 500, 0, (err: any, leaves: any[]) => {
        if (err) return;
        const ids = leaves.map((leaf) => leaf.properties.id);
        const selectedDevices = devices.filter((d) => ids.includes(d.id));
        if (!selectedDevices.length) return;
        fitBoundsToDevices(selectedDevices);
      });
    }
  };

  useEffect(() => {
    if (
      needsInitialization &&
      !isLoading &&
      !isFetching &&
      devices.length > 0
    ) {
      const devicesWithCoords = devices.filter((x) => {
        const lon = x.device_info?.lon;
        const lat = x.device_info?.lat;

        return (
          typeof lon === 'number' &&
          typeof lat === 'number' &&
          !Number.isNaN(lon) &&
          !Number.isNaN(lat) &&
          lon >= -180 &&
          lon <= 180 &&
          lat >= -90 &&
          lat <= 90
        );
      });

      if (devicesWithCoords.length === 0) {
        setNeedsInitialization(false);
        return;
      }
      const success = fitBoundsToDevices(devicesWithCoords, {
        zoom: devicesWithCoords.length === 1 ? 14 : undefined,
        saveLastViewport: true
      });
      if (success) {
        setTransitionDuration(1000);
        setNeedsInitialization(false);
        setPopupInfo(null);
      }
    } else if (
      needsInitialization &&
      !isLoading &&
      !isFetching &&
      devices.length === 0
    ) {
      setNeedsInitialization(false);
    }
  }, [devices, needsInitialization, isLoading, isFetching, fitBoundsToDevices]);

  useEffect(() => {
    setNeedsInitialization(true);
  }, [selectedRegion?.id, devices]);

  useEffect(() => {
    if (selectedDevice?.device) {
      const { lon, lat } = selectedDevice.device.device_info ?? {};
      if (lon && lat) {
        flyToDevice(String(selectedDevice.device.id), lon, lat);
      }
    }
  }, [selectedDevice, flyToDevice]);

  useMapResize(mapContainerRef, mapRef, setViewport);

  const safeAnchor = useMemo(() => {
    if (!hoverInfo?.feature?.properties) return 'bottom';
    const { lat, lon } = hoverInfo.feature.properties;
    const centerLat = viewport.latitude ?? 0;
    const centerLon = viewport.longitude ?? 0;

    const v = lat > centerLat ? 'top' : 'bottom';
    const h = lon > centerLon ? 'right' : 'left';
    return `${v}-${h}`;
  }, [hoverInfo, viewport]);

  return (
    <div
      ref={mapContainerRef}
      className='absolute inset-0'
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <ReactMapGL
        {...mapControllerProps}
        {...viewport}
        // DISABLED AUTO-INTERACTIVITY to prevent internal library crash
        interactiveLayerIds={[]}
        ref={mapRef}
        mapStyle={mapStyle}
        onViewportChange={handleViewportChange}
        scrollZoom={true}
        transitionDuration={transitionDuration}
        onClick={(e) => {
          setPopupInfo(null);
          onClick(e);
        }}
        onHover={(event) => {
          // Manual safe query
          const { srcEvent } = event;
          const features = safeQueryFeatures(event.point);
          const hoveredFeature = features && features[0];

          if (
            hoveredFeature &&
            hoveredFeature.layer.id === 'devices-unclustered'
          ) {
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }
            setHoverInfo({
              feature: hoveredFeature,
              x: (srcEvent as MouseEvent).offsetX,
              y: (srcEvent as MouseEvent).offsetY
            });
          } else {
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }
            hoverTimeoutRef.current = setTimeout(() => {
              setHoverInfo(null);
            }, 50);
          }
        }}
        onLoad={(evt: any) => {
          const map = evt.target;
          map.on('idle', () => {
            setIsMapLoading(false);
          });
        }}
        getCursor={(state: any) => {
          return state.isDragging
            ? 'grabbing'
            : state.isHovering
              ? 'pointer'
              : 'grab';
        }}
      >
        {/* <ScaleControl {...scaleControlProps} /> */}
        {hoverInfo && hover && (
          <Popup
            tipSize={5}
            anchor={safeAnchor as any}
            longitude={hoverInfo.feature.properties.lon}
            latitude={hoverInfo.feature.properties.lat}
            closeButton={false}
            className='z-50 [&_.mapboxgl-popup-content]:!bg-transparent [&_.mapboxgl-popup-content]:!p-0 [&_.mapboxgl-popup-content]:!shadow-none [&_.mapboxgl-popup-tip]:!hidden [&.mapboxgl-popup-anchor-bottom-left]:!-mt-[25px] [&.mapboxgl-popup-anchor-bottom-left]:!ml-[15px] [&.mapboxgl-popup-anchor-bottom-right]:!-mt-[25px] [&.mapboxgl-popup-anchor-bottom-right]:!-ml-[15px] [&.mapboxgl-popup-anchor-top-left]:!mt-[10px] [&.mapboxgl-popup-anchor-top-left]:!ml-[15px] [&.mapboxgl-popup-anchor-top-right]:!mt-[10px] [&.mapboxgl-popup-anchor-top-right]:!-ml-[15px]'
            offsetLeft={0}
            offsetTop={0}
            dynamicPosition={false}
            sortByDepth={true}
            captureScroll={false}
            captureDrag={true}
            captureClick={true}
            captureDoubleClick={true}
            capturePointerMove={false}
          >
            <DeviceHoverCard
              featureProperties={hoverInfo.feature.properties}
              onMouseEnter={() => {
                if (hoverTimeoutRef.current) {
                  clearTimeout(hoverTimeoutRef.current);
                }
              }}
              onMouseLeave={() => {
                hoverTimeoutRef.current = setTimeout(() => {
                  setHoverInfo(null);
                }, 50);
              }}
              onMouseMove={() => {
                if (hoverTimeoutRef.current) {
                  clearTimeout(hoverTimeoutRef.current);
                }
              }}
            />
          </Popup>
        )}
      </ReactMapGL>

      {(isLoading || isFetching) && (
        <div className='animate-fade-in absolute top-4 right-4 z-10'>
          <div className='flex items-center gap-2 rounded-md bg-white p-2 shadow-md'>
            <Loader2 className='text-primary h-6 w-6 animate-spin' />
            <span className='text-primary text-sm'>{t('general.loading')}</span>
          </div>
        </div>
      )}

      {isMapLoading && (
        <div className='absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm'>
          <Skeleton className='h-[100%] w-[100%] rounded-[8px]' />
          <div className='absolute flex flex-col items-center'>
            <Loader2 className='text-primary h-6 w-6 animate-spin' />
          </div>
        </div>
      )}

      {devices.length === 0 && !isLoading && !isFetching && (
        <div className='animate-fade-in absolute top-4 right-4 z-10'>
          <div className='rounded-md bg-white p-2 shadow-md'>
            <span className='text-sm text-gray-700'>
              {t('map.device_alert')}
            </span>
          </div>
        </div>
      )}

      {popupInfo && (
        <div className='absolute top-[80px] right-1.5 z-10 lg:top-[34px]'>
          {renderPopup ? (
            renderPopup(popupInfo, () => {
              setPopupInfo(null);
              setViewport(lastViewport);
              setTransitionDuration(1000);
            })
          ) : (
            <Cabinet_info_panel
              id={popupInfo}
              onOpenChange={() => {
                setPopupInfo(null);
                setViewport(lastViewport);
                setTransitionDuration(1000);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

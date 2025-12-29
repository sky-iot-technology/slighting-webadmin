'use client';

import ReactMapGL, {
  FlyToInterpolator,
  MapEvent,
  MapRef,
  Marker,
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

const mapStyleDefault = 'https://tiles.goong.io/assets/goong_map_web.json';
type SelectedRegion = { id: string; name: string } | null;

type GoongMapProps = {
  selectedRegion: SelectedRegion | null;
  devices?: Device[];
  isLoading: boolean;
  isFetching: boolean;
  selectedDevice: { device: Device | null; ts: number } | null;

  /** ✅ optional render for popup */
  renderPopup?: (id: string | number, onClose: () => void) => React.ReactNode;
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
  renderPopup
}: GoongMapProps) {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapStyle, setMapStyle] = useState(mapStyleDefault);
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [viewport, setViewport] = useState<ViewportProps>({
    longitude: 106.700981,
    latitude: 10.776889,
    zoom: 5
  });
  const [lastViewport, setLastViewport] = useState<ViewportProps>({});
  const [popupInfo, setPopupInfo] = useState<number | string | null>(null);
  const [needsInitialization, setNeedsInitialization] = useState(true);

  const mapRef = useRef<MapRef | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

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
    (devices: Device[], options: FitBoundsOptions = {}) => {
      if (!devices.length) return;

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
      if (!devicesWithCoords.length) return;

      const longs = devicesWithCoords.map((d) => d.device_info.lon);
      const lats = devicesWithCoords.map((d) => d.device_info.lat);

      const container = mapContainerRef.current;
      if (!container) return;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      if (!width || !height) {
        return;
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
    },
    [setViewport, setTransitionDuration]
  );

  const onClick = (event: MapEvent) => {
    if (renderPopup) return;
    if (!event.features?.length) return;

    const map = mapRef.current?.getMap();
    if (!map || !map.getLayer('devices-unclustered')) return;

    const feature = event.features[0];
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
      fitBoundsToDevices(devicesWithCoords, {
        zoom: devicesWithCoords.length === 1 ? 14 : undefined,
        saveLastViewport: true
      });
      setTransitionDuration(1000);
      setNeedsInitialization(false);
    } else if (
      needsInitialization &&
      !isLoading &&
      !isFetching &&
      devices.length === 0
    ) {
      setNeedsInitialization(false);
    }
  }, [devices, needsInitialization, isLoading, isFetching]);

  useEffect(() => {
    setNeedsInitialization(true);
  }, [selectedRegion?.id]);

  useEffect(() => {
    if (selectedDevice?.device) {
      const { lon, lat } = selectedDevice.device.device_info ?? {};
      if (lon && lat) {
        flyToDevice(String(selectedDevice.device.id), lon, lat);
      }
    }
  }, [selectedDevice, flyToDevice]);

  useMapLayers(mapRef, devices, selectedRegion?.id);
  useMapResize(mapContainerRef, mapRef, setViewport);

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
        interactiveLayerIds={
          !isMapLoading ? ['devices-clusters', 'devices-unclustered'] : []
        }
        ref={mapRef}
        mapStyle={mapStyle}
        onViewportChange={handleViewportChange}
        scrollZoom={true}
        transitionDuration={transitionDuration}
        onClick={(e) => {
          setPopupInfo(null);
          onClick(e);
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
        <ScaleControl {...scaleControlProps} />
      </ReactMapGL>

      {(isLoading || isFetching) && (
        <div className='animate-fade-in absolute top-4 right-4 z-10'>
          <div className='flex items-center gap-2 rounded-md bg-white p-2 shadow-md'>
            <Loader2 className='text-primary h-6 w-6 animate-spin' />
            <span className='text-primary text-sm'>Đang tải thiết bị...</span>
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
              Không có thiết bị trong khu vực này
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

'use client';

import ReactMapGL, {
  FlyToInterpolator,
  MapEvent,
  MapRef,
  ScaleControl,
  ViewportProps,
  WebMercatorViewport
} from '@goongmaps/goong-map-react';
import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { mapControllerProps, scaleControlProps } from '../config/map-controls';
import CabinetInfoPanel from './cabinet_info_panel';
import { useMapResize } from '../hooks/useMapResize';
import { useMapLayers } from '../hooks/useMapLayers';
import { Device } from '@/core/domains/devices';
import { Loader2 } from 'lucide-react';

const mapStyleDefault = 'https://tiles.goong.io/assets/goong_light_v2.json';
type SelectedRegion = { id: string; name: string } | null;

type GoongMapProps = {
  selectedRegion: SelectedRegion;
  devices: any[];
  isLoading: boolean;
  isFetching: boolean;
  selectedDevice: { device: Device | null; ts: number } | null;
};

export default function GoongMap({
  selectedRegion,
  devices,
  isLoading,
  isFetching,
  selectedDevice
}: GoongMapProps) {
  const [mapStyle, setMapStyle] = useState(mapStyleDefault);
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [viewport, setViewport] = useState<ViewportProps>({
    longitude: 106.700981,
    latitude: 10.776889,
    zoom: 5
  });
  const [lastViewport, setLastViewport] = useState<ViewportProps>({});
  const [isScrollZoom, setIsScrollZoom] = useState(true);
  const [popupInfo, setPopupInfo] = useState<number | string | null>(null);
  const [needsInitialization, setNeedsInitialization] = useState(true);

  const mapRef = useRef<MapRef | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const handleGetCursor = useCallback(
    ({ isHovering, isDragging }: any) =>
      isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab',
    []
  );

  const handleViewportChange = useCallback((options: ViewportProps) => {
    setViewport((prev) => ({ ...prev, ...options }));
    setTransitionDuration(0);
  }, []);

  const flyToDevice = useCallback((id: string, lon: number, lat: number) => {
    if (!lon || !lat) return;

    setPopupInfo(id);
    setIsScrollZoom(false);

    setViewport((prev) => ({
      ...prev,
      longitude: lon,
      latitude: lat,
      zoom: 16,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.4 })
    }));
    setTransitionDuration(600);
  }, []);

  const onClick = (event: MapEvent) => {
    if (!event.features?.length) return;

    const map = mapRef.current?.getMap();
    if (!map || !map.getLayer('devices-unclustered')) return;

    const feature = event.features[0];
    if (feature.layer.id === 'devices-unclustered') {
      const { id, lon, lat } = feature.properties;
      flyToDevice(id, lon, lat);
    }
  };

  useEffect(() => {
    if (
      needsInitialization &&
      !isLoading &&
      !isFetching &&
      devices.length > 0
    ) {
      const devicesWithCoords = devices.filter(
        (x) => x.device_info?.lon && x.device_info?.lat
      );

      if (devicesWithCoords.length === 0) {
        setNeedsInitialization(false);
        return;
      }

      const longs = devicesWithCoords.map((x) => x.device_info.lon);
      const lats = devicesWithCoords.map((x) => x.device_info.lat);

      const { longitude, latitude, zoom } = new WebMercatorViewport({
        width: window.innerWidth,
        height: window.innerHeight
      }).fitBounds(
        [
          [Math.min(...longs), Math.min(...lats)],
          [Math.max(...longs), Math.max(...lats)]
        ],
        {
          padding: 100
        }
      );

      const newViewport: ViewportProps = {
        longitude,
        latitude,
        zoom: devicesWithCoords.length === 1 ? 14 : zoom,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: (t) => t
      };

      setViewport((prev) => ({
        ...prev,
        ...newViewport
      }));
      setLastViewport((prev) => ({
        ...prev,
        ...newViewport
      }));
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
    if (selectedRegion) {
      setNeedsInitialization(true);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedDevice?.device) {
      const { lon, lat } = selectedDevice.device.device_info ?? {};
      if (lon && lat) {
        flyToDevice(String(selectedDevice.device.id), lon, lat);
      }
    }
  }, [selectedDevice, flyToDevice]);

  useMapLayers(mapRef, devices);
  useMapResize(mapContainerRef, setViewport);

  return (
    <div
      ref={mapContainerRef}
      className='relative h-[calc(100dvh-52px)] w-full overflow-x-hidden overflow-y-auto'
    >
      <ReactMapGL
        {...mapControllerProps}
        {...viewport}
        interactiveLayerIds={
          mapRef.current?.getMap().getLayer('devices-clusters')
            ? ['devices-clusters', 'devices-unclustered']
            : []
        }
        ref={mapRef}
        mapStyle={mapStyle}
        getCursor={handleGetCursor}
        onViewportChange={handleViewportChange}
        scrollZoom={isScrollZoom}
        transitionDuration={transitionDuration}
        onClick={(e) => {
          setIsScrollZoom(true);
          setPopupInfo(null);
          onClick(e);
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
        <div className='absolute top-[34px] right-1.5 z-10'>
          <CabinetInfoPanel
            id={popupInfo}
            onOpenChange={() => {
              setPopupInfo(null);
              setViewport(lastViewport);
              setTransitionDuration(1000);
            }}
          />
        </div>
      )}
    </div>
  );
}

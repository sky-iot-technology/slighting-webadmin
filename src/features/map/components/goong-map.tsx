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
import MapMarker from './map-marker';
import {
  mapControllerProps,
  navigationControlProps,
  scaleControlProps
} from '../config/map-controls';
import CabinetInfoPanel from './cabinet_info_panel';
import { useMapResize } from '../hooks/useMapResize';
import { useMapLayers } from '../hooks/useMapLayers';
import { useGetDevices } from '@/core/domains/devices';
import { Skeleton } from '@/ui/components/ui/skeleton';
import MapFilter from './map-filter';
import { useGetGroups } from '@/core/domains/groups';

const mapStyleDefault = 'https://tiles.goong.io/assets/goong_light_v2.json';

export default function GoongMap() {
  const [mapStyle, setmapStyle] = useState(mapStyleDefault);
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [viewport, setViewport] = useState<ViewportProps>();
  const [lastViewport, setLastViewport] = useState<ViewportProps>();

  const [isScrollZoom, setisScrollZoom] = useState(true);
  const [popupInfo, setPopupInfo] = useState<number | string | null>(null);
  const [needsInitialization, setNeedsInitialization] = useState(true);

  const mapRef = useRef<MapRef | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [selectedRegion, setSelectedRegion] = useState<string>();

  const { data, isLoading, isFetching, error } = useGetDevices(
    { group: selectedRegion },
    { enabled: !!selectedRegion }
  );

  const devices = data?.devices ?? [];

  const {
    data: regions,
    isLoading: isRegionsLoading,
    error: regionError
  } = useGetGroups({
    root_group: true
  });

  useEffect(() => {
    if (regions?.groups?.length && !selectedRegion) {
      setSelectedRegion(String(regions.groups[1].id));
    }
  }, [selectedRegion, regions]);

  const handleRegionChange = useCallback((regionId: string) => {
    setPopupInfo(null);
    setSelectedRegion(regionId);
    setNeedsInitialization(true);
  }, []);

  const handleGetCursor = useCallback(
    ({ isHovering, isDragging }: any) =>
      isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab',
    []
  );

  const handleViewportChange = useCallback((options: ViewportProps) => {
    onChangeView(options);
  }, []);

  const onChangeView = (options: ViewportProps) => {
    setViewport((pre) => ({ ...pre, ...options }));
    setTransitionDuration(0);
  };

  // const flyToMarker = useCallback((device: Device) => {
  //   const vp = new WebMercatorViewport({
  //     ...viewport,
  //     width: window.innerWidth,
  //     height: window.innerHeight,
  //   })
  //   const {longitude, latitude, zoom} = vp.fitBounds(
  //     [
  //       [device.longitude - 0.01, device.latitude - 0.01],
  //       [device.longitude + 0.01, device.latitude + 0.01],
  //     ],
  //     { padding: 40 }
  //   )

  //   setViewport({
  //     ...viewport,
  //     longitude,
  //     latitude,
  //     zoom,
  //     transitionInterpolator: new FlyToInterpolator(),
  //     transitionEasing: (t) => t * (2 - t),
  //   });
  //   setTransitionDuration(500)
  // }, [viewport, setViewport])

  const onClick = (event: MapEvent) => {
    if (!event.features?.length) return;

    const map = mapRef.current?.getMap();
    if (!map || !map.getLayer('devices-unclustered')) return;

    const feature = event.features[0];

    if (feature.layer.id === 'devices-unclustered') {
      const deviceData = feature.properties;

      setPopupInfo(deviceData.id);
      setisScrollZoom(false);

      setViewport({
        ...viewport,
        longitude: deviceData.lon,
        latitude: deviceData.lat,
        zoom: 16,
        transitionInterpolator: new FlyToInterpolator()
      });
      setTransitionDuration(1000);
    }
  };

  useEffect(() => {
    if (needsInitialization && devices.length > 0 && !isLoading) {
      const devicesWithCoords = devices.filter(
        (x) => x.device_info.lon && x.device_info.lat
      );

      const longs = devicesWithCoords.map((x) => x.device_info.lon);
      const lats = devicesWithCoords.map((x) => x.device_info.lat);

      const { longitude, latitude, zoom } = new WebMercatorViewport({
        width: window.innerWidth,
        height: window.innerHeight
      })?.fitBounds(
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
      setViewport((pre) => ({
        ...pre,
        ...newViewport
      }));
      setLastViewport((pre) => ({
        ...pre,
        ...newViewport
      }));
      setTransitionDuration(1000);
      setNeedsInitialization(false);
    }
  }, [devices, needsInitialization, isLoading]);

  useMapLayers(mapRef, devices);
  useMapResize(mapContainerRef, setViewport);

  if (isLoading || isRegionsLoading) {
    return (
      <div className='relative h-[calc(100dvh-52px)] w-full overflow-hidden'>
        <Skeleton className='h-full w-full rounded-none' />
        <div className='absolute top-[15px] left-[9px]'>
          <div className='bg-map-filter flex rounded-lg px-1 py-1'>
            <Skeleton className='bg-background mr-0.5 h-[26px] w-[160px] rounded-md text-xs sm:h-[28px] sm:w-[180px] md:h-[30px] md:w-[217px]' />

            <Skeleton className='relative ml-0.5 h-[26px] w-[160px] rounded-md text-xs sm:h-[28px] sm:w-[180px] md:h-[30px] md:w-[217px]' />
          </div>
        </div>
      </div>
    );
  }

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
          setisScrollZoom(true);
          setPopupInfo(null);
          onClick(e);
        }}
      >
        {/* <MapMarker data={devices} onClick={(device) => {
          setPopupInfo(device)
          setisScrollZoom(false)
          flyToMarker(device)
        }}/> */}
        {/* <NavigationControl {...navigationControlProps} showCompass={true} showZoom={true}/> */}
        <ScaleControl {...scaleControlProps} />
      </ReactMapGL>

      <MapFilter
        groups={regions?.groups}
        selected={selectedRegion}
        onRegionChange={handleRegionChange}
      />

      {popupInfo && (
        <div className='absolute top-[34px] right-1.5'>
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

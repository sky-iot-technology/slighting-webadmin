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
import { Device } from '../../../core/domains/devices/types';
import {
  mapControllerProps,
  navigationControlProps,
  scaleControlProps
} from '../config/map-controls';
import CabinetInfoPanel from './cabinet_info_panel';
import { useMapResize } from '../hooks/useMapResize';
import { useMapLayers } from '../hooks/useMapLayers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { Search } from 'lucide-react';
import Image from 'next/image';

const mapStyleDefault = 'https://tiles.goong.io/assets/goong_light_v2.json';

const devices: Device[] = [
  {
    id: '1',
    name: 'Quận 1',
    longitude: 106.700981,
    latitude: 10.776889,
    online: true
  },
  {
    id: '2',
    name: 'Quận 3',
    longitude: 106.686722,
    latitude: 10.78402,
    online: false
  },
  {
    id: '3',
    name: 'Quận 5',
    longitude: 106.668331,
    latitude: 10.754459,
    online: true
  },
  {
    id: '4',
    name: 'Quận 7',
    longitude: 106.721752,
    latitude: 10.737622,
    online: false
  },
  {
    id: '5',
    name: 'Quận 10',
    longitude: 106.668511,
    latitude: 10.774236,
    online: true
  },
  {
    id: '6',
    name: 'Quận 11',
    longitude: 106.650104,
    latitude: 10.762622,
    online: false
  },
  {
    id: '7',
    name: 'Quận 12',
    longitude: 106.635085,
    latitude: 10.85945,
    online: true
  },
  {
    id: '8',
    name: 'Bình Thạnh',
    longitude: 106.713066,
    latitude: 10.801465,
    online: false
  },
  {
    id: '9',
    name: 'Phú Nhuận',
    longitude: 106.678337,
    latitude: 10.797256,
    online: true
  },
  {
    id: '10',
    name: 'Tân Bình',
    longitude: 106.652709,
    latitude: 10.80194,
    online: false
  },
  {
    id: '11',
    name: 'Tân Phú',
    longitude: 106.635944,
    latitude: 10.790051,
    online: true
  },
  {
    id: '12',
    name: 'Gò Vấp',
    longitude: 106.665497,
    latitude: 10.83874,
    online: false
  },
  {
    id: '13',
    name: 'Thủ Đức',
    longitude: 106.760292,
    latitude: 10.849345,
    online: true
  },
  {
    id: '14',
    name: 'Bình Tân',
    longitude: 106.606689,
    latitude: 10.765976,
    online: false
  },
  {
    id: '15',
    name: 'Nhà Bè',
    longitude: 106.739349,
    latitude: 10.695496,
    online: true
  },
  {
    id: '16',
    name: 'Hóc Môn',
    longitude: 106.590614,
    latitude: 10.89158,
    online: false
  },
  {
    id: '17',
    name: 'Củ Chi',
    longitude: 106.495056,
    latitude: 11.00644,
    online: true
  },
  {
    id: '18',
    name: 'Bình Chánh',
    longitude: 106.543121,
    latitude: 10.71331,
    online: false
  },
  {
    id: '19',
    name: 'Cần Giờ',
    longitude: 106.954346,
    latitude: 10.41667,
    online: true
  },
  {
    id: '20',
    name: 'Quận 4',
    longitude: 106.706562,
    latitude: 10.764366,
    online: false
  }
  // { id: '21', name: 'New York - Times Square', longitude: -73.985130, latitude: 40.758896, online: true },
];

export default function GoongMap() {
  const [mapStyle, setmapStyle] = useState(mapStyleDefault);
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [viewport, setViewport] = useState<ViewportProps>({});
  const currrentOptions = useRef<ViewportProps>(null);
  const [isScrollZoom, setisScrollZoom] = useState(true);
  const [popupInfo, setPopupInfo] = useState<Device | null>(null);
  const [initialized, setInitialized] = useState(false);

  const mapRef = useRef<MapRef | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const handleGetCursor = useCallback(
    ({ isHovering, isDragging }: any) =>
      isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab',
    []
  );

  const handleViewportChange = useCallback((options: ViewportProps) => {
    onChangeView(options);
  }, []);

  const onChangeView = (options: ViewportProps) => {
    currrentOptions.current = options;
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
      setPopupInfo(deviceData);
      setisScrollZoom(false);

      setViewport({
        ...viewport,
        longitude: deviceData.longitude,
        latitude: deviceData.latitude,
        zoom: 16,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: (t) => t * (2 - t)
      });
      setTransitionDuration(1000);
    }
  };

  useEffect(() => {
    if (!initialized && devices.length > 0) {
      const longs = devices
        .filter((x) => x.longitude && x.latitude)
        .map((x) => x.longitude);
      const lats = devices
        .filter((x) => x.longitude && x.latitude)
        .map((x) => x.latitude);
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
      setViewport((pre) => ({
        ...pre,
        longitude,
        latitude,
        zoom,
        transitionInterpolator: new FlyToInterpolator()
      }));
      setTransitionDuration(1000);
      setInitialized(true);
    }
  }, [devices, initialized, viewport]);

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
      <div className='absolute top-[15px] left-[9px]'>
        <div className='bg-map-filter flex rounded-lg px-1 py-1'>
          <Select>
            <SelectTrigger className='bg-background mr-0.5 !h-[26px] w-[160px] text-xs sm:!h-[28px] sm:w-[180px] md:!h-[30px] md:w-[217px]'>
              <SelectValue placeholder='Select a country' />
            </SelectTrigger>
            <SelectContent defaultValue={'hcm'}>
              <SelectItem value='hcm'>Hồ Chí Minh</SelectItem>
              <SelectItem value='hn'>Hà nội</SelectItem>
              <SelectItem value='hue'>Huế</SelectItem>
              <SelectItem value='daklak'>Đắt Lắk</SelectItem>
            </SelectContent>
          </Select>

          <div className='relative ml-0.5 h-[26px] w-[160px] rounded-md text-xs sm:h-[28px] sm:w-[180px] md:h-[30px] md:w-[217px]'>
            <Image
              src={'/assets/icons/search.svg'}
              alt='search'
              width={12}
              height={12}
              className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform'
            />
            <input
              placeholder='Tìm kiếm khu vực & thiết bị'
              className='border-input bg-background text-foreground placeholder:text-muted-foreground h-full w-full rounded-md border pr-3 pl-7 focus:ring-0 focus:outline-none'
            />
          </div>
        </div>
      </div>

      {popupInfo && (
        <div className='absolute top-[34px] right-1.5'>
          <CabinetInfoPanel onOpenChange={() => setPopupInfo(null)} />
        </div>
      )}
    </div>
  );
}

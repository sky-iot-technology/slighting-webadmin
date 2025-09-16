'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactMapGL, {
  MapRef,
  Marker,
  NavigationControl,
  ScaleControl,
  ViewportProps
} from '@goongmaps/goong-map-react';
import { MapContext } from '../../context/context';
import { Skeleton } from '@/ui/components/ui/skeleton';
import MapMarker from '../../map-marker';

type MapComponentProps = {
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  children?: React.ReactNode;
};

type CursorState = {
  isHovering: boolean;
  isDragging: boolean;
  isLoaded: boolean;
};

type Device = {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
};

const devices: Device[] = [
  {
    id: '1',
    name: 'New York',
    longitude: -73.9385,
    latitude: 40.6643
  },
  {
    id: '2',
    name: 'Los Angeles',
    longitude: -118.4108,
    latitude: 34.0194
  },
  {
    id: '3',
    name: 'Chicago',
    longitude: -87.6818,
    latitude: 41.8376
  },
  {
    id: '4',
    name: 'Houston',
    longitude: -95.3863,
    latitude: 29.7805
  },
  {
    id: '5',
    name: 'Phoenix',
    longitude: -112.088,
    latitude: 33.5722
  },
  {
    id: '6',
    name: 'Philadelphia',
    longitude: -75.1333,
    latitude: 40.0094
  },
  {
    id: '7',
    name: 'San Antonio',
    longitude: -98.5251,
    latitude: 29.4724
  },
  {
    id: '8',
    name: 'San Diego',
    longitude: -117.135,
    latitude: 32.8153
  },
  {
    id: '9',
    name: 'Dallas',
    longitude: -96.7967,
    latitude: 32.7757
  },
  {
    id: '10',
    name: 'San Jose',
    longitude: -121.8193,
    latitude: 37.2969
  },
  {
    id: '11',
    name: 'Austin',
    longitude: -97.756,
    latitude: 30.3072
  },
  {
    id: '12',
    name: 'Jacksonville',
    longitude: -81.6613,
    latitude: 30.337
  },
  {
    id: '13',
    name: 'San Francisco',
    longitude: -122.4193,
    latitude: 37.7751
  },
  {
    id: '14',
    name: 'Columbus',
    longitude: -82.985,
    latitude: 39.9848
  },
  {
    id: '15',
    name: 'Indianapolis',
    longitude: -86.1459,
    latitude: 39.7767
  },
  {
    id: '16',
    name: 'Fort Worth',
    longitude: -97.3463,
    latitude: 32.7795
  },
  {
    id: '17',
    name: 'Charlotte',
    longitude: -80.8307,
    latitude: 35.2087
  },
  {
    id: '18',
    name: 'Seattle',
    longitude: -122.3509,
    latitude: 47.6205
  },
  {
    id: '19',
    name: 'Denver',
    longitude: -104.8806,
    latitude: 39.7618
  },
  {
    id: '20',
    name: 'El Paso',
    longitude: -106.427,
    latitude: 31.8484
  }
];

export default function MapProvider({
  initialViewState,
  children
}: MapComponentProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isScrollZoom, setisScrollZoom] = useState(true);
  const currrentOptions = useRef<ViewportProps | null>(null);

  const navigationControlProps = {
    style: {
      top: 0,
      right: 0,
      padding: '10px'
    }
  };

  const scaleControlProps = {
    style: { bottom: 36, left: 0, padding: '10px' }
  };

  const mapControllerProps = {
    goongApiAccessToken: process.env.NEXT_PUBLIC_API_KEY_GOONGMAP,
    width: '100%',
    height: '100%',
    touchAction: 'auto'
  };

  const [viewport, setViewport] = useState<ViewportProps>({
    ...initialViewState,
    bearing: 0,
    pitch: 0
  });

  const handleGetCursor = useCallback(
    ({ isHovering, isDragging }: CursorState) =>
      isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default',
    []
  );

  // const handleViewportChange = useCallback((options: ViewportProps) => {
  //     onChangeView(options);
  // }, []);

  // const onChangeView = (options: ViewportProps) => {
  //     currrentOptions.current = options;
  //     setViewport((pre) => ({ ...pre, ...options }));
  // };

  return (
    // <div className="z-[1000]">
    //   <MapContext.Provider value={{ map: map.current! }}>
    //     {children}
    //   </MapContext.Provider>
    //   {!loaded && (
    //     <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-[1000]">
    //       <div className="text-lg font-medium">Loading map...</div>
    //     </div>
    //   )}
    // </div>
    <div className='h-full w-full'>
      <MapContext.Provider value={{ map: mapRef.current! }}>
        <ReactMapGL
          ref={mapRef}
          mapStyle={'https://tiles.goong.io/assets/goong_light_v2.json'}
          {...mapControllerProps}
          {...viewport}
          getCursor={handleGetCursor}
          onViewportChange={setViewport}
          scrollZoom={isScrollZoom}
          onResize={() => {}}
          onClick={() => {
            setisScrollZoom(true);
          }}
          attributionControl={false}
          transitionDuration={0}
          onTransitionStart={() => {}}
          onLoad={() => setLoaded(true)}
        >
          {children}

          <NavigationControl
            {...navigationControlProps}
            showCompass={true}
            showZoom={true}
          />
          <ScaleControl {...scaleControlProps} />

          <MapMarker data={devices} />
          <Marker longitude={-73.9385} latitude={40.6643}>
            <div
              style={{
                background: 'red',
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)'
              }}
            />
          </Marker>

          <Marker longitude={-118.4108} latitude={34.0194}>
            <div
              style={{
                background: 'blue',
                width: 25,
                height: 25,
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)'
              }}
            />
          </Marker>
        </ReactMapGL>

        {!loaded && (
          <div className='bg-background/80 absolute inset-0 z-[1000] flex items-center justify-center'>
            <div className='flex flex-col items-center gap-4'>
              <Skeleton className='h-12 w-12 rounded-full' />
              <Skeleton className='h-6 w-40' />
            </div>
          </div>
        )}
      </MapContext.Provider>
    </div>
  );
}

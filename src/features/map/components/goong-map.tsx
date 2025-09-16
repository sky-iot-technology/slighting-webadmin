'use client';

import ReactMapGL, {
  Marker,
  NavigationControl,
  ScaleControl,
  ViewportProps
} from '@goongmaps/goong-map-react';
import { useCallback, useRef, useState } from 'react';
import MapMarker from './map-marker';

const mapStyleDefault = 'https://tiles.goong.io/assets/goong_light_v2.json';
type CursorState = {
  isHovering: boolean;
  isDragging: boolean;
  isRotating?: boolean;
  inTransition?: boolean;
};

export default function GoongMap() {
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

    clickRadius: 20,
    center: [0, 0],
    width: '100%',
    height: '100%',
    touchAction: 'auto'
  };

  const [mapStyle, setmapStyle] = useState(mapStyleDefault);
  const [viewport, setViewport] = useState<ViewportProps>({
    latitude: 10.7805152,
    longitude: 106.7075194,
    zoom: 14,
    bearing: 0,
    pitch: 0
  });
  const currrentOptions = useRef<ViewportProps | null>(null);
  const [isScrollZoom, setisScrollZoom] = useState(true);
  const handleGetCursor = useCallback(
    ({ isHovering, isDragging }: CursorState) =>
      isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default',
    []
  );

  const handleViewportChange = useCallback((options: ViewportProps) => {
    onChangeView(options);
  }, []);

  const onChangeView = (options: ViewportProps) => {
    currrentOptions.current = options;
    setViewport((pre) => ({ ...pre, ...options }));
  };

  return (
    <div
      className='relative w-full flex-1'
      style={{ width: '100%', height: '400px' }}
    >
      <ReactMapGL
        {...mapControllerProps}
        {...viewport}
        mapStyle={mapStyle}
        getCursor={handleGetCursor}
        onViewportChange={handleViewportChange}
        scrollZoom={isScrollZoom}
        onResize={() => {}}
        onClick={() => {
          setisScrollZoom(true);
        }}
        attributionControl={false}
        transitionDuration={0}
        onTransitionStart={() => {}}
        reuseMaps={true}
      >
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

        <NavigationControl
          {...navigationControlProps}
          showCompass={true}
          showZoom={true}
        />
        <ScaleControl {...scaleControlProps} />
      </ReactMapGL>
    </div>
  );
}

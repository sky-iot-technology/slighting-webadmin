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
import { Loader2, MapPin } from 'lucide-react';
import { useMapResize } from '@/features/map/hooks/useMapResize';
import {
  mapControllerProps,
  scaleControlProps
} from '@/features/map/config/map-controls';

import mapStyleDefault from '@/core/shared/constants/map-styles/marker_light.json';

type GoongMapProps = {
  lat?: number;
  long?: number;
  disabled?: boolean;
  onSelectLocation?: (coords: { lat: number; long: number }) => void;
};

export default function GoongMapMarker({
  lat,
  long,
  disabled = false,
  onSelectLocation
}: GoongMapProps) {
  const [mapStyle, setMapStyle] = useState(mapStyleDefault);
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [viewport, setViewport] = useState<ViewportProps>({
    longitude: 106.700981,
    latitude: 10.776889,
    zoom: 5
  });
  const [isScrollZoom, setIsScrollZoom] = useState(true);

  const [selectedMarker, setSelectedMarker] = useState<{
    lat: number;
    long: number;
  } | null>(null);

  const mapRef = useRef<MapRef | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const handleGetCursor = useCallback(
    ({ isHovering, isDragging }: any) => {
      if (disabled)
        return isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grabbing';
      return isDragging ? 'grabbing' : isHovering ? 'pointer' : 'crosshair';
    },
    [disabled]
  );

  useEffect(() => {
    if (lat && long) {
      setViewport((prev) => ({
        ...prev,
        latitude: lat,
        longitude: long,
        zoom: prev.zoom && prev.zoom > 5 ? prev.zoom : 14,
        transitionInterpolator: new FlyToInterpolator({ speed: 1.2 })
      }));
      setSelectedMarker({ lat, long });
    }
  }, [lat, long]);

  const handleViewportChange = useCallback((options: ViewportProps) => {
    setViewport((prev) => ({ ...prev, ...options }));
    setTransitionDuration(0);
  }, []);

  const handleClick = (e: MapEvent) => {
    if (disabled) return;
    const { lngLat } = e;
    const [lon, lat] = lngLat;
    const coords = { lat, long: lon };
    setSelectedMarker(coords);
    onSelectLocation?.(coords);
  };

  useMapResize(mapContainerRef, mapRef, setViewport);
  return (
    <div
      ref={mapContainerRef}
      className='absolute inset-0 cursor-crosshair overflow-hidden'
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
        onViewportChange={handleViewportChange}
        scrollZoom={isScrollZoom}
        transitionDuration={transitionDuration}
        onClick={handleClick}
        getCursor={handleGetCursor}
        onLoad={(evt: any) => {
          const map = evt.target;
          map.on('style.load', () => {
            if (map.getLayer('poi-tree')) {
              map.removeLayer('poi-tree');
            }
          });
        }}
      >
        {selectedMarker && (
          <Marker
            latitude={selectedMarker.lat}
            longitude={selectedMarker.long}
            offsetLeft={-12}
            offsetTop={-24}
          >
            <MapPin className='h-6 w-6 text-red-500 drop-shadow-md' />
          </Marker>
        )}
        <ScaleControl {...scaleControlProps} />
      </ReactMapGL>
    </div>
  );
}

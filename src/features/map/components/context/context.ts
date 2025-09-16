import { createContext, useContext } from 'react';
import type { MapRef } from '@goongmaps/goong-map-react';

interface MapContextType {
  map: MapRef;
}

export const MapContext = createContext<MapContextType | null>(null);

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
}

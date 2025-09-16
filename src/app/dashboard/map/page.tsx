'use client';
import CabinetInfoPanel from '@/features/map/components/cabinet_info_panel';
import GoongMap from '@/features/map/components/goong-map';
import MapProvider from '@/features/map/components/lib/map/provider';
import PageContainer from '@/ui/components/layout/page-container';
import { Marker } from '@goongmaps/goong-map-react';
import { useEffect, useRef, useState } from 'react';

export default function Page() {
  const [open, setOpen] = useState(true);
  return (
    // <MapProvider
    //     initialViewState={{
    //         latitude: 10.7805152,
    //         longitude: 106.7075194,
    //         zoom: 14,
    //     }}
    //   >
    //   </MapProvider>
    <GoongMap />
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactMapGL, {
  NavigationControl,
  ScaleControl
} from '@goongmaps/goong-map-react';

export default function GoongMap() {
  const accessToken = process.env.NEXT_PUBLIC_API_KEY_GOONGMAP as string;
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

  console.log('typeof accessToken:', typeof accessToken);

  if (!accessToken) {
    return (
      <div className='flex h-[500px] w-full items-center justify-center bg-red-100'>
        <p className='text-red-600'>
          Thiếu API key (NEXT_PUBLIC_API_KEY_GOONGMAP)
        </p>
      </div>
    );
  }
  const handleGetCursor = useCallback(
    ({ isHovering, isDragging }: any) =>
      isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default',
    []
  );

  return (
    <div className='h-[500px] w-full'>
      <ReactMapGL
        latitude={16.10165433114301}
        longitude={106.44921943985075}
        zoom={5}
        width='100%'
        height='100%'
        goongApiAccessToken={accessToken}
        mapStyle='https://tiles.goong.io/assets/goong_light_v2.json'
        getCursor={(state) => 'dsadasdsa'}
        onResize={() => {}}
      >
        <NavigationControl {...navigationControlProps} />
        <ScaleControl {...scaleControlProps} />
      </ReactMapGL>
    </div>
  );
}

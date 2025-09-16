import { Marker } from '@goongmaps/goong-map-react';
import Image from 'next/image';
import React from 'react';

type Device = {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
};

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

function DeviceMarker({ data }: { data: Device[] }) {
  return data.map((d, index) => {
    console.log('Marker at:', d.longitude, d.latitude);
    return (
      <Marker
        key={`marker-${index}-${d.id}`}
        longitude={d.longitude}
        latitude={d.latitude}
      >
        <div
          style={{
            background: 'red',
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '2px solid white'
          }}
        />
      </Marker>
    );
  });
}

export default React.memo(DeviceMarker);

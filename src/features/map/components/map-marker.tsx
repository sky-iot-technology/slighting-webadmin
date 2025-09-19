import { Marker } from '@goongmaps/goong-map-react';
import React from 'react';
import { Device } from '../../../core/domains/devices/types';
import Image from 'next/image';

type deviceMarkerProps = {
  data: Device[];
  onClick: (device: Device) => void;
};

function DeviceMarker({ data, onClick }: deviceMarkerProps) {
  return data.map((d, index) => {
    return (
      <Marker
        key={`marker-${index}-${d.id}`}
        longitude={d.longitude}
        latitude={d.latitude}
        offsetLeft={0}
        offsetTop={0}
        className=''
      >
        {d.online ? (
          <Image
            alt='cabinet-online'
            src={'/assets/icons/cabinet-online.svg'}
            width={30}
            height={30}
            onClick={() => onClick(d)}
            className='cursor-pointer'
          />
        ) : (
          <Image
            alt='cabinet-offline'
            src={'/assets/icons/cabinet-offline.svg'}
            width={30}
            height={30}
            onClick={() => onClick(d)}
            className='cursor-pointer'
          />
        )}
      </Marker>
    );
  });
}

export default React.memo(DeviceMarker);

export const navigationControlProps = {
  style: {
    top: 0,
    right: 0,
    padding: '10px'
  }
};

export const scaleControlProps = {
  style: { bottom: 36, left: 0, padding: '10px' }
};

export const mapControllerProps = {
  goongApiAccessToken: process.env.NEXT_PUBLIC_API_KEY_GOONGMAP,
  width: '100%',
  height: '100%',
  touchAction: 'none',
  attributionControl: false,
  reuseMaps: true,
  dragPan: { inertia: 200 }
};

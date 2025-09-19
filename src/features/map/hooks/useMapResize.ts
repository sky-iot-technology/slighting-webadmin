import { useEffect } from 'react';

export const useMapResize = (
  mapContainerRef: React.RefObject<HTMLDivElement | null>,
  setViewport: any
) => {
  if (mapContainerRef) {
    useEffect(() => {
      const handleResize = () => {
        setViewport((prev: any) => ({
          ...prev,
          width: mapContainerRef.current?.offsetWidth,
          height: mapContainerRef.current?.offsetHeight
        }));
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }, [mapContainerRef, setViewport]);
  }
};

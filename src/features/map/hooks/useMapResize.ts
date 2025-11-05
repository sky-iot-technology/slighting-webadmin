import { useEffect } from 'react';

export const useMapResize = (
  mapContainerRef: React.RefObject<HTMLDivElement | null>,
  mapRef: React.RefObject<any>,
  setViewport: any
) => {
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setViewport((prev: any) => ({
          ...prev,
          width,
          height
        }));

        if (mapRef.current) {
          mapRef.current.resize?.();
        }
      }
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [mapContainerRef, mapRef, setViewport]);
};

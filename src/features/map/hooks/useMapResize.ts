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
        if (width === 0 || height === 0) return;

        setViewport((prev: any) => ({
          ...prev,
          width,
          height
        }));

        if (mapRef.current && width > 0 && height > 0) {
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

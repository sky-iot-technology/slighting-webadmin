import { useEffect } from 'react';

export const useMapResize = (
  mapContainerRef: React.RefObject<HTMLDivElement | null>,
  setViewport: any
) => {
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setViewport((prev: any) => ({
          ...prev,
          width: entry.contentRect.width,
          height: entry.contentRect.height
        }));
      }
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      if (mapContainerRef.current) {
        resizeObserver.unobserve(mapContainerRef.current);
      }
    };
  }, [mapContainerRef, setViewport]);
};

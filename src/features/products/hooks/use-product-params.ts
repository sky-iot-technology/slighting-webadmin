import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

const STORAGE_KEY = 'product_listing_params';

export function useProductParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const currentString = searchParams.toString();
    const storedString = localStorage.getItem(STORAGE_KEY);

    // If we have no params in URL, try to restore
    if (!currentString && storedString) {
      router.replace(`?${storedString}`);
      // We are not ready yet, waiting for router replace to trigger update
    } else {
      // Either we have params, or no stored params. We are ready.
      setIsReady(true);
    }
  }, []); // Run only once on mount

  // Sync to local storage
  useEffect(() => {
    // Only sync if we are "ready" (meaning initial restore logic is done)
    if (!isReady) return;

    const currentString = searchParams.toString();
    if (currentString) {
      localStorage.setItem(STORAGE_KEY, currentString);
    } else {
      // If empty, we should probably clear storage so "Clear Filters" works.
      // However, if we clear storage, next visit gets no defaults.
      // But that is expected behavior if I left the page with no filters.
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [searchParams, isReady]);

  // If we just triggered a replace, we wait for the next render with new params.
  // However, next/navigation router.replace might not trigger a full remount,
  // but it will trigger a searchParams update.
  useEffect(() => {
    if (!isReady && searchParams.toString()) {
      setIsReady(true);
    }
  }, [searchParams, isReady]);

  return { isReady };
}

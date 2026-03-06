import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

function filterParams(searchParams: URLSearchParams, allowed: string[]) {
  const filtered = new URLSearchParams();

  allowed.forEach((key) => {
    const value = searchParams.get(key);
    if (value) filtered.set(key, value);
  });

  return filtered.toString();
}

export function useProductParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [params, setParams] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const ALLOWED_PARAMS = ['status', 'type', 'parent_group_id'];

  useEffect(() => {
    const saved =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('productParams')
        : null;
    const filteredString = filterParams(searchParams, ALLOWED_PARAMS);

    if (!isReady) {
      if (filteredString) {
        setParams(filteredString);
        if (typeof window !== 'undefined')
          sessionStorage.setItem('productParams', filteredString);
        setIsReady(true);
      } else if (saved) {
        router.replace(`?${saved}`);
      } else {
        setIsReady(true);
      }
    } else {
      setParams(filteredString || null);
      if (filteredString) {
        if (typeof window !== 'undefined')
          sessionStorage.setItem('productParams', filteredString);
      } else {
        if (typeof window !== 'undefined')
          sessionStorage.removeItem('productParams');
      }
    }
  }, [searchParams, isReady, router]);

  return { isReady };
}

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode
} from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

type BreadcrumbsContextType = {
  customBreadcrumbs: BreadcrumbItem[] | null;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[] | null) => void;
  customContent: ReactNode | null;
  setCustomContent: (content: ReactNode | null) => void;
};

const BreadcrumbsContext = createContext<BreadcrumbsContextType | undefined>(
  undefined
);

export function BreadcrumbsProvider({ children }: { children: ReactNode }) {
  const [customBreadcrumbs, setCustomBreadcrumbs] = useState<
    BreadcrumbItem[] | null
  >(null);
  const [customContent, setCustomContentState] = useState<ReactNode | null>(
    null
  );

  const setBreadcrumbs = useCallback((breadcrumbs: BreadcrumbItem[] | null) => {
    setCustomBreadcrumbs(breadcrumbs);
  }, []);

  const setCustomContent = useCallback((content: ReactNode | null) => {
    setCustomContentState(content);
  }, []);

  return (
    <BreadcrumbsContext.Provider
      value={{
        customBreadcrumbs,
        setBreadcrumbs,
        customContent,
        setCustomContent
      }}
    >
      {children}
    </BreadcrumbsContext.Provider>
  );
}

export function useBreadcrumbsContext() {
  const context = useContext(BreadcrumbsContext);
  if (context === undefined) {
    throw new Error(
      'useBreadcrumbsContext must be used within a BreadcrumbsProvider'
    );
  }
  return context;
}

// Optional hook for useBreadcrumbs that doesn't throw if context is not available
export function useBreadcrumbsContextOptional() {
  return useContext(BreadcrumbsContext);
}

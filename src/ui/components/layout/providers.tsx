'use client';
import React from 'react';
import { ActiveThemeProvider } from '../active-theme';
import QueryProvider from '../providers/query-provider';
import { AuthInitializer } from './auth-initializer';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <QueryProvider>
        <ActiveThemeProvider initialTheme={activeThemeValue}>
          <AuthInitializer />
          {children}
        </ActiveThemeProvider>
      </QueryProvider>
    </>
  );
}

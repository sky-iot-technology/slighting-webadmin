'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useSidebar } from '@/ui/components/ui/sidebar';
import { useLanguageStore } from '@/core/domains/language/store';
import { useAuthStore } from '@/core/domains/auth/store';
import { useGetUIPreferences, subscribeToSSE } from '../hooks';
import { uiPreferencesApi } from '../api';
import { useQueryClient } from '@tanstack/react-query';
import { UI_PREFERENCES_QUERY_KEY } from '../hooks';

export function UIPreferencesInitializer() {
  const { data: prefs, isSuccess } = useGetUIPreferences();
  const { theme, setTheme } = useTheme();
  const { open, setOpen } = useSidebar();
  const { language } = useLanguageStore();
  const { domainId, accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  const appliedTheme = useRef<string | undefined>(undefined);
  const appliedLanguage = useRef<string | undefined>(undefined);
  const appliedSidebar = useRef<boolean | undefined>(undefined);

  const isApplyingFromServer = useRef(false);

  const isPendingPUT = useRef(false);

  useEffect(() => {
    if (!isSuccess || !prefs) return;

    if (isPendingPUT.current) return;

    let didApplySomething = false;

    if (prefs.theme && prefs.theme !== appliedTheme.current) {
      appliedTheme.current = prefs.theme;
      if (theme !== prefs.theme) {
        didApplySomething = true;
        setTheme(prefs.theme);
      }
    }

    if (prefs.language && prefs.language !== appliedLanguage.current) {
      appliedLanguage.current = prefs.language;
      if (language !== prefs.language) {
        didApplySomething = true;
        useLanguageStore.setState({ language: prefs.language });
      }
    }

    if (
      prefs.sidebar_collapsed !== undefined &&
      prefs.sidebar_collapsed !== appliedSidebar.current
    ) {
      appliedSidebar.current = prefs.sidebar_collapsed;
      const isCollapsed = !open;
      if (isCollapsed !== prefs.sidebar_collapsed) {
        didApplySomething = true;
        setOpen(!prefs.sidebar_collapsed);
      }
    }

    if (didApplySomething) {
      isApplyingFromServer.current = true;
    }
  }, [isSuccess, prefs, theme, setTheme, language, open, setOpen]);

  useEffect(() => {
    if (!isSuccess || !prefs) return;

    if (isApplyingFromServer.current) {
      isApplyingFromServer.current = false;
      return;
    }

    if (!theme) return;

    const isCollapsed = !open;
    const themeDiffers = theme !== appliedTheme.current;
    const languageDiffers = language !== appliedLanguage.current;
    const sidebarDiffers = isCollapsed !== appliedSidebar.current;

    if (themeDiffers || languageDiffers || sidebarDiffers) {
      if (themeDiffers) appliedTheme.current = theme;
      if (languageDiffers) appliedLanguage.current = language;
      if (sidebarDiffers) appliedSidebar.current = isCollapsed;

      isPendingPUT.current = true;

      uiPreferencesApi
        .update({
          theme: (theme || prefs.theme) as any,
          language: (language || prefs.language) as any,
          sidebar_collapsed: isCollapsed,
          default_domain_id: domainId || undefined
        })
        .then((updatedPrefs) => {
          isPendingPUT.current = false;
          queryClient.setQueryData(UI_PREFERENCES_QUERY_KEY, updatedPrefs);
        })
        .catch((err: any) => {
          isPendingPUT.current = false;
          console.error('Failed to sync preferences:', err);
        });
    }
  }, [theme, language, open, isSuccess, prefs, domainId, queryClient]);

  // 3. Connect to SSE events
  useEffect(() => {
    if (!domainId) return;

    const unsubscribe = subscribeToSSE(domainId, (event, data) => {
      if (
        event === 'ui.preferences_updated' ||
        event === 'ui.preferences_update' ||
        event === 'preferences_updated'
      ) {
        queryClient.invalidateQueries({ queryKey: UI_PREFERENCES_QUERY_KEY });
      } else if (event === 'theme_updated') {
        queryClient.invalidateQueries({ queryKey: ['ui-theme', domainId] });
      } else if (event === 'features_updated') {
        queryClient.invalidateQueries({ queryKey: ['ui-features', domainId] });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [domainId, accessToken, queryClient]);

  return null;
}

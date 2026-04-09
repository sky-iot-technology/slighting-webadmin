export const cookieUtils = {
  // Set secure HTTP-only cookies
  setAuthCookies: (accessToken: string, refreshToken: string) => {
    const isSecure = process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true';
    const sameSite =
      (process.env.NEXT_PUBLIC_COOKIE_SAMESITE as 'strict' | 'lax' | 'none') ||
      'strict';

    // Access token - short lived (15 minutes)
    document.cookie = `access_token=${accessToken}; path=/; max-age=900; ${isSecure ? 'secure;' : ''} samesite=${sameSite}`;

    // Refresh token - longer lived (7 days)
    document.cookie = `refresh_token=${refreshToken}; path=/; max-age=604800; ${isSecure ? 'secure;' : ''} samesite=${sameSite}`;
  },

  // Get tokens from cookies
  getAccessToken: (): string | null => {
    if (typeof document === 'undefined') return null;

    const row = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='));
    return row
      ? decodeURIComponent(row.substring('access_token='.length))
      : null;
  },

  getRefreshToken: (): string | null => {
    if (typeof document === 'undefined') return null;

    const row = document.cookie
      .split('; ')
      .find((row) => row.startsWith('refresh_token='));
    return row
      ? decodeURIComponent(row.substring('refresh_token='.length))
      : null;
  },

  // Clear auth cookies
  clearAuthCookies: () => {
    if (typeof document === 'undefined') return;

    document.cookie =
      'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie =
      'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  },

  // Check if user has valid tokens
  hasValidTokens: (): boolean => {
    const accessToken = cookieUtils.getAccessToken();
    const refreshToken = cookieUtils.getRefreshToken();
    return !!(accessToken && refreshToken);
  }
};

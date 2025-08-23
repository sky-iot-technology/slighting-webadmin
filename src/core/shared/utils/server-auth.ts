import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface AuthCheckResult {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

/**
 * Check authentication status on the server side
 * @returns AuthCheckResult with authentication status and tokens
 */
export async function checkServerAuth(): Promise<AuthCheckResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value || null;
  const refreshToken = cookieStore.get('refresh_token')?.value || null;

  return {
    isAuthenticated: !!(accessToken && refreshToken),
    accessToken,
    refreshToken,
  };
}

/**
 * Require authentication - redirects to sign-in if not authenticated
 * @param redirectTo Optional redirect path after successful auth check
 */
export async function requireAuth(redirectTo?: string): Promise<AuthCheckResult> {
  const auth = await checkServerAuth();
  
  if (!auth.isAuthenticated) {
    redirect('/auth/sign-in');
  }

  // If redirectTo is specified and user is authenticated, redirect there
  if (redirectTo) {
    redirect(redirectTo);
  }

  return auth;
}

/**
 * Redirect authenticated users away from auth pages
 * @param redirectTo Where to redirect authenticated users (default: dashboard)
 */
export async function redirectIfAuthenticated(redirectTo: string = '/dashboard/overview'): Promise<void> {
  const auth = await checkServerAuth();
  
  if (auth.isAuthenticated) {
    redirect(redirectTo);
  }
}

import { checkServerAuth } from '@/core/shared/utils/server-auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  // Check authentication status
  const auth = await checkServerAuth();

  if (auth.isAuthenticated) {
    // User is authenticated, redirect to dashboard
    redirect('/dashboard/overview');
  } else {
    // User is not authenticated, redirect to sign-in
    redirect('/auth/sign-in');
  }
}

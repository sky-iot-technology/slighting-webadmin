import SignInViewPage from '@/features/auth/components/sign-in-view';
import GoongMap from '@/features/map/components/goong-map';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Sign In',
  description: 'Sign In page for authentication.'
};

export default async function Page() {
  return <GoongMap />;
  return <SignInViewPage />;
}

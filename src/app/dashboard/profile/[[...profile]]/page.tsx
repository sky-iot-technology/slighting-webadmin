import ProfilePage from '@/features/profile/components/profile-page';
import PageContainer from '@/ui/components/layout/page-container';

export const metadata = {
  title: 'Dashboard : Profile'
};

export default async function Page() {
  return (
    <PageContainer scrollable={true}>
      <ProfilePage />
    </PageContainer>
  );
}

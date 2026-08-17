import AppSidebar from '@/ui/components/layout/app-sidebar';
import Header from '@/ui/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/ui/components/ui/sidebar';
import { ProtectedRoute } from '@/core/shared/components/protected-route';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { BootstrapProviders } from './bootstrap/bootstrap-providers';
import { BreadcrumbsProvider } from '@/core/shared/context/breadcrumbs-context';
import { RBACGuard } from '@/core/shared/components/rbac-guard';
import { UIPreferencesInitializer } from '@/core/domains/ui-preferences/components/preferences-initializer';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <ProtectedRoute>
      <BreadcrumbsProvider>
        <RBACGuard>
          <SidebarProvider defaultOpen={defaultOpen}>
            <UIPreferencesInitializer />
            <BootstrapProviders />
            <AppSidebar />
            <SidebarInset>
              <Header />
              {/* page main content */}
              {children}
              {/* page main content ends */}
            </SidebarInset>
          </SidebarProvider>
        </RBACGuard>
      </BreadcrumbsProvider>
    </ProtectedRoute>
  );
}

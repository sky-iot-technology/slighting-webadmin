'use client';

import { usePermissionStore } from '@/core/domains/permissions';
import { PermissionGuard } from '@/core/domains/permissions/components/permission-guard';
import { withPermission } from '@/core/domains/permissions/hocs/with-permission';
import { useEffect } from 'react';

// A mock component wrapped with HOC
const AdminOnlyFeature = withPermission(
  () => (
    <div className='rounded border border-green-500 bg-green-50 p-4'>
      <h3 className='font-bold text-green-700'>HOC Protected Content</h3>
      <p>
        You can see this because you have 'test_module' : 'admin_action'
        permission.
      </p>
    </div>
  ),
  'test_module',
  'admin_action'
);

export default function PermissionTestPage() {
  const { setPermissions, clearPermissions, ui } = usePermissionStore();

  // Setup initial permissions for testing
  useEffect(() => {
    // Grant 'view' but NOT 'admin_action' initially
    setPermissions({
      test_module: new Set(['view'])
    });

    return () => {
      clearPermissions();
    };
  }, [setPermissions, clearPermissions]);

  const grantAdmin = () => {
    setPermissions({
      test_module: new Set(['view', 'admin_action'])
    });
  };

  const revokeAll = () => {
    setPermissions({
      test_module: new Set([])
    });
  };

  return (
    <div className='space-y-8 p-8'>
      <h1 className='text-2xl font-bold'>Permission Guard Verification</h1>

      <div className='space-x-4'>
        <button
          onClick={grantAdmin}
          className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
        >
          Grant Admin Action
        </button>
        <button
          onClick={revokeAll}
          className='rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600'
        >
          Revoke All
        </button>
      </div>

      <div className='rounded bg-gray-100 p-4'>
        <h2 className='mb-2 font-semibold'>
          Current Permissions (test_module):
        </h2>
        <pre>
          {JSON.stringify(Array.from(ui['test_module'] || []), null, 2)}
        </pre>
      </div>

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>1. Component Guard Test</h2>

        <PermissionGuard
          module='test_module'
          action='view'
          fallback={
            <div className='text-red-500'>You cannot see the view content.</div>
          }
        >
          <div className='rounded border border-blue-500 bg-blue-50 p-4'>
            <h3 className='font-bold text-blue-700'>View Content</h3>
            <p>Visible if you have 'view' permission.</p>
          </div>
        </PermissionGuard>

        <PermissionGuard
          module='test_module'
          action='admin_action'
          fallback={
            <div className='rounded border border-red-200 bg-red-50 p-4 text-red-500'>
              You lack 'admin_action' permission.
            </div>
          }
        >
          <div className='rounded border border-purple-500 bg-purple-50 p-4'>
            <h3 className='font-bold text-purple-700'>Admin Action Content</h3>
            <p>Visible ONLY if you have 'admin_action'.</p>
          </div>
        </PermissionGuard>
      </section>

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>2. HOC Test</h2>
        <AdminOnlyFeature />
      </section>
    </div>
  );
}

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/ui/components/ui/dialog';
import { useState } from 'react';
import { Icons } from '@/ui/components/icons';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/ui/components/ui/sidebar';
import { ActiveStateIcon } from '@/ui/components/layout/app-sidebar';
import { DisplaySetting } from '../tab/display';
import { AlertSetting } from '../tab/alert';
import { SecureSetting } from '../tab/secure';
import { SystemSetting } from '../tab/system';
import { useTranslation } from '@/core/domains/language/useTranslation';

export function SettingModal({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState('display');
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='max-w-[300px] rounded-[4px] p-0 sm:max-w-[600px] md:!max-w-[705px]'
        hideCloseButton
      >
        <DialogHeader className='hidden'>
          <DialogTitle className='text-sm font-bold'>
            {t('setting.modal.title' as any)}
          </DialogTitle>
        </DialogHeader>

        <div className='flex max-h-[75vh] flex-col overflow-y-auto md:h-[435px] md:flex-row'>
          <div className='w-full p-3 md:w-[216px]'>
            <div>
              <h2 className='mb-3 text-sm font-bold'>{t('navbar.settings')}</h2>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === 'display'}
                  onClick={() => setActiveTab('display')}
                >
                  <ActiveStateIcon>
                    <Icons.display />
                  </ActiveStateIcon>
                  <span>{t('setting.appearance')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === 'alert'}
                  onClick={() => setActiveTab('alert')}
                >
                  <ActiveStateIcon>
                    <Icons.alertSetting />
                  </ActiveStateIcon>
                  <span>{t('setting.notification')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === 'security'}
                  onClick={() => setActiveTab('security')}
                >
                  <ActiveStateIcon>
                    <Icons.shield />
                  </ActiveStateIcon>
                  <span>{t('setting.security')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === 'system'}
                  onClick={() => setActiveTab('system')}
                >
                  <ActiveStateIcon>
                    <Icons.system />
                  </ActiveStateIcon>
                  <span>{t('setting.system')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>

          {/* Content Panel */}
          <div className='bg-muted flex-1 md:max-w-[486px]'>
            {activeTab === 'alert' && <AlertSetting />}
            {activeTab === 'display' && <DisplaySetting />}
            {activeTab === 'security' && <SecureSetting />}
            {activeTab === 'system' && <SystemSetting />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

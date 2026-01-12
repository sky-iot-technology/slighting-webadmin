import { Button } from '@/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/ui/components/ui/tabs';
import { useEffect, useState } from 'react';
import DeviceTab from '../tab/device-tab';
import DeviceRegionTab from '../tab/deviceRegion-tab';
import { ExecuteOtaResponse, OtaData, useExcuteOta } from '@/core/domains/ota';
import { toast } from 'sonner';
import { RequestWatcher } from '../RequestWatcher';

type SyncDeviceProps = {
  data: OtaData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

import { useTranslation } from '@/core/domains/language/useTranslation';

export default function SyncDeviceDialog({
  data,
  open,
  onOpenChange
}: SyncDeviceProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('devices');

  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  //requestId[]
  const [syncListRequestId, setSyncListRequestId] = useState<
    { id: string; requestId: string }[]
  >([]);
  const [doneRequestIds, setDoneRequestIds] = useState<Set<string>>(new Set());

  const [pending, setPending] = useState(false);

  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const TabClassName = `
        relative
        !h-[38px]
        !shadow-none
        px-3
        font-bold
        data-[state=active]:text-primary
        data-[state=active]:bg-white
        data-[state=active]:after:content-['']
        data-[state=active]:after:absolute
        data-[state=active]:after:left-0
        data-[state=active]:after:bottom-0
        data-[state=active]:after:h-[0.5px]
        data-[state=active]:after:w-full
        data-[state=active]:after:bg-primary
   `;
  const { mutate: executeOta, isPending } = useExcuteOta();
  const handleExecuteOta = async () => {
    if (isPending) return;
    if (activeTab === 'devices' && selectedDevices.length === 0) {
      toast.warning(t('ota.sync.warning.select_device' as any));
      return;
    }

    if (activeTab === 'groups' && selectedGroups.length === 0) {
      toast.warning(t('ota.sync.warning.select_group' as any));
      return;
    }
    executeOta(
      {
        device_ids: activeTab === 'devices' ? selectedDevices : selectedGroups,
        command: {
          execution: [
            {
              command: 'lms.devices.commands.Ota',
              params: {
                ota: {
                  ...data.info
                }
              }
            }
          ]
        }
      },
      {
        onSuccess: (data: ExecuteOtaResponse) => {
          setSyncListRequestId(
            data.request_ids.map((item) => {
              return { id: item.id, requestId: item.request_id };
            })
          );
        }
      }
    );
    setPending(true);
  };

  useEffect(() => {
    if (syncListRequestId.length === 0) return;

    const total = syncListRequestId.length;
    const done = doneRequestIds.size;

    if (done === total) {
      setPending(false);
    }
  }, [doneRequestIds, syncListRequestId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>{t('ota.title.sync' as any)}</DialogTitle>
      <DialogDescription className='hidden'>
        {t('ota.title.sync' as any)}
      </DialogDescription>
      <DialogContent
        className='flex w-[800px] !max-w-[85vw] flex-col gap-4 rounded-lg bg-white p-4'
        hideCloseButton
      >
        <h2 className='flex justify-between text-center text-[16px] font-bold sm:text-left'>
          <div>
            {t('ota.title.sync' as any)}{' '}
            <span className='text-primary'>{data.name}</span>
          </div>
          <span className='text-calendar-radio-green'>{data.info.version}</span>
        </h2>

        <div className='flex w-full gap-4'>
          <div className='flex h-[330px] min-w-0 flex-1 flex-col rounded-[8px] sm:h-[400px]'>
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className='w-full flex-shrink-0 !bg-transparent sm:w-auto'
            >
              <TabsList className='flex w-full !bg-transparent text-[12px]'>
                <TabsTrigger value='devices' className={TabClassName}>
                  {t('ota.sync.tabs.items' as any)}
                </TabsTrigger>
                <TabsTrigger value='groups' className={TabClassName}>
                  {t('ota.sync.tabs.groups' as any)}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className='flex h-full w-full min-w-0 overflow-x-auto'>
              {activeTab === 'devices' ? (
                <DeviceTab
                  id={data.id}
                  onSelectionChange={setSelectedDevices}
                  progressMap={progressMap}
                />
              ) : (
                <DeviceRegionTab
                  id={data.id}
                  onSelectionChange={setSelectedGroups}
                  progressMap={progressMap}
                />
              )}
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <Button
            variant='outline'
            className='h-[30px] w-[64px] rounded-[4px]'
            onClick={() => onOpenChange(false)}
          >
            {t('ota.button.cancel' as any)}
          </Button>
          <Button
            className='bg-primary h-[30px] w-[100px] rounded-[4px] text-white'
            onClick={handleExecuteOta}
            disabled={isPending || pending}
          >
            {isPending || pending
              ? t('ota.button.syncing' as any)
              : t('ota.button.sync' as any)}
          </Button>
        </div>
      </DialogContent>
      {syncListRequestId.map(({ id, requestId }) => (
        <RequestWatcher
          key={requestId}
          requestId={requestId}
          pollInterval={3000}
          onProgress={(progress) => {
            setProgressMap((prev) => ({
              ...prev,
              [id]: progress
            }));
          }}
          onDone={(status) => {
            console.log('OTA done', id, requestId, status);
            setProgressMap((prev) => {
              const next = { ...prev };
              delete next[id];
              return next;
            });
            setDoneRequestIds((prev) => {
              const next = new Set(prev);
              next.add(requestId);
              return next;
            });
          }}
        />
      ))}
    </Dialog>
  );
}

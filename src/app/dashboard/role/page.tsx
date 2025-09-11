import LightControl from '@/features/map/components/light-control';
import PageContainer from '@/ui/components/layout/page-container';
import { Avatar } from '@/ui/components/ui/avatar';
import { Badge } from '@/ui/components/ui/badge';
import { Button } from '@/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import { Separator } from '@/ui/components/ui/separator';
import { Slider } from '@/ui/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/ui/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/ui/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { IconDeviceImacBolt, IconX } from '@tabler/icons-react';
import Image from 'next/image';

export default function page() {
  return (
    <PageContainer>
      <div className='flex w-[370px] flex-col rounded-xl bg-white'>
        <div className='my-2 ml-[20px] flex h-[67px] items-center gap-2.5'>
          <div className='relative flex-shrink-0'>
            <Avatar className='h-[50px] w-[50px]'>
              <div className='bg-muted flex h-full w-full items-center justify-center rounded-full'>
                <IconDeviceImacBolt className='text-muted-foreground h-7 w-7' />
              </div>
            </Avatar>
            <span className='border-background absolute top-0 right-1 block h-3 w-3 rounded-full border-2 bg-green-500' />
          </div>
          <div className='mr-auto flex flex-col items-start'>
            <p className='lead-[30px] text-map-title text-base font-extrabold'>
              Thiết bị 936
            </p>
            <p className='text-muted-foreground text-xs leading-5'>
              8378927482936
            </p>
          </div>
          <div className='mr-[16px] justify-center'>
            <IconX width={20} height={20} />
          </div>
        </div>
        <Separator />
        <Tabs defaultValue='info' className='gap-0'>
          <TabsList className='bg-background h-[50px] w-full rounded-none px-0 py-0'>
            <TabsTrigger
              value='info'
              className='group data-[state=active]:text-primary data-[state=active]:bg-background rounded-none data-[state=active]:shadow-none'
            >
              <div className='flex flex-col items-center justify-center gap-[3px]'>
                <Image
                  src='/assets/icons/info.svg'
                  alt='info'
                  width={11}
                  height={13}
                  className='group-data-[state=active]:hidden'
                />
                <Image
                  src='/assets/icons/info-active.svg'
                  alt='info'
                  width={11}
                  height={13}
                  className='hidden group-data-[state=active]:block'
                />
                <p>Thông tin</p>
              </div>
            </TabsTrigger>
          </TabsList>
          <Separator />

          <TabsContent
            value='info'
            className='flex flex-col gap-1.5 pt-1.5 pr-[5px] pl-1.5 [&_span]:py-1'
          >
            <Card className='bg-map-background @container/card gap-0 rounded-lg p-0'>
              <CardHeader className='gap-0 pr-[5px] pb-[4px] pl-[15px]'>
                <CardTitle className='mt-1 pt-1 text-xs font-bold'>
                  Thông tin thiết bị
                </CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col p-0 px-[15px] pb-[4px]'>
                <div className='pr-[5px]'>
                  <div className='flex items-center justify-between text-xs leading-[22px]'>
                    <span className='text-foreground'>Vĩ độ:</span>
                    <span className='text-foreground font-medium'>
                      10.832945
                    </span>
                  </div>

                  <div className='flex items-center justify-between text-xs leading-[22px]'>
                    <span className='text-foreground'>Kinh độ:</span>
                    <span className='text-foreground font-medium'>
                      106.7338941
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardContent className='![&_span]:py-0 mx-1.5 mb-1.5 p-0'>
                <LightControl />
              </CardContent>
            </Card>
          </TabsContent>
          {/* <Card className="@container/card gap-0 p-0 rounded-lg bg-map-background">
                            <CardHeader className='pl-[15px] pb-[4px] pr-[5px] gap-0'>
                                <CardTitle className="text-xs font-bold mt-1 pt-1">Thông tin thiết bị</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 flex flex-col px-[15px] pb-[4px]">
                                <div className="pr-[5px]">
                                    <div className="flex items-center justify-between text-xs leading-[22px]">
                                        <span className="text-foreground">Vĩ độ:</span>
                                        <span className="text-foreground font-medium">10.832945</span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs leading-[22px]">
                                        <span className="text-foreground">Kinh độ:</span>
                                        <span className="text-foreground font-medium">106.7338941</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardContent className="p-0 mx-1.5 mb-1.5">
                                <LightControl />
                            </CardContent>
                        </Card> */}
        </Tabs>
      </div>
    </PageContainer>
  );
}

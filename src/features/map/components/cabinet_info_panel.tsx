import PageContainer from '@/ui/components/layout/page-container';
import { Avatar } from '@/ui/components/ui/avatar';
import { Button } from '@/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import { Separator } from '@/ui/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/ui/components/ui/tabs';
import { IconDeviceImacBolt, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import { BrightnessGraph } from './brightness-graph';
import LightControl from './light-control';

type InfoModalProps = {
  onOpenChange: (v: boolean) => void;
};

export default function CabinetInfoPanel(props: InfoModalProps) {
  // if (!props.open) return null;
  return (
    <div className='bg-background flex max-h-[calc(100dvh-140px)] flex-col overflow-y-auto rounded-xl sm:w-[300px] md:w-[370px]'>
      <div className='bg-background sticky top-0 z-10'>
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
            <p className='text-map-title text-base leading-[30px] font-extrabold'>
              Thiết bị 936
            </p>
            <p className='text-muted-foreground text-xs leading-5'>
              8378927482936
            </p>
          </div>
          <div className='mr-[16px] justify-center'>
            <Button variant={'ghost'} onClick={() => props.onOpenChange(false)}>
              <IconX width={20} height={20} />
            </Button>
          </div>
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
          <TabsTrigger
            value='operation'
            className='group data-[state=active]:text-primary data-[state=active]:bg-background rounded-none data-[state=active]:shadow-none'
          >
            <div className='flex flex-col items-center justify-center gap-[3px]'>
              <Image
                src='/assets/icons/operation.svg'
                alt='info'
                width={13}
                height={13.5}
                className='group-data-[state=active]:hidden'
              />
              <Image
                src='/assets/icons/operation-active.svg'
                alt='info'
                width={13}
                height={13.5}
                className='hidden group-data-[state=active]:block'
              />
              <p>Bảo trì & Vận hành</p>
            </div>
          </TabsTrigger>
        </TabsList>

        <Separator />

        <TabsContent
          value='operation'
          className='bg-map-background flex flex-col gap-1.5 pt-1.5 pr-[5px] pl-1.5 [&_[data-slot=card]]:shadow-none [&_span]:py-1'
        >
          <Card className='@container/card gap-0 rounded-lg p-0 px-[15px]'>
            <CardHeader className='gap-0 p-0 pr-[5px] pb-[4px]'>
              <CardTitle className='mt-1 pt-1 text-xs font-bold'>
                Thông Tin Vận Hành
              </CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='text-foreground flex flex-col pr-[5px] pb-[4px] text-xs leading-[22px]'>
                <div className='flex items-center justify-between'>
                  <span>Ngày kích hoạt:</span>
                  <span className='font-medium'>01/09/2025</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span>Ngày hết hạn bảo hành:</span>
                  <span className='font-medium'>01/09/2027</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='@container/card gap-0 rounded-lg p-0 px-[15px]'>
            <CardHeader className='gap-0 p-0 pb-0.5'>
              <CardTitle className='mt-1 pt-1 text-xs font-bold'>
                Thông Tin Bảo trì
              </CardTitle>
            </CardHeader>
            <CardContent className='text-foreground p-0 text-xs leading-[22px] [&_span]:py-1'>
              <div className='mb-0.5 flex flex-col pr-[5px]'>
                <div className='flex items-center justify-between'>
                  <span>Bảo trì lần cuối:</span>
                  <span className='font-medium'>06/07/2025</span>
                </div>
              </div>

              <div className='flex flex-col pr-[5px] pb-[4px]'>
                <div className='mb-0.5 flex items-center font-bold'>
                  <span>Bảo trì định kỳ tiếp theo</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span>Ngày:</span>
                  <span className='font-medium'>01/09/2025</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span>Loại:</span>
                  <span className='font-medium'>Bảo trì định kỳ 6 tháng </span>
                </div>

                <div className='flex items-center justify-between'>
                  <span>Nội dung:</span>
                  <span className='font-medium'>Kiểm tra kết nối</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='@container/card gap-0 rounded-lg p-0 px-[15px] [&_span]:py-1'>
            <CardHeader className='gap-0 p-0 pb-[4px]'>
              <CardTitle className='mt-1 pt-1 text-xs font-bold'>
                Thống kê cảnh báo
              </CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='text-foregroun flex flex-col pr-[5px] pb-1 text-xs leading-[20px]'>
                <div className='flex items-center justify-between'>
                  <span>Tổng cảnh báo:</span>
                  <span className='font-medium'>2</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span>Đã xử lý:</span>
                  <span className='font-medium'>1</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span>Đang xử lý:</span>
                  <span className='font-medium'>1</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant='default' className='mx-auto my-6 mb-6 h-9 text-xs'>
            Báo cáo sự cố
          </Button>
        </TabsContent>

        <TabsContent
          value='info'
          className='flex h-full flex-col gap-1.5 overflow-y-auto pt-1.5 pr-[7px] pl-[9px] [&_[data-slot=card]]:shadow-none'
        >
          <Card className='bg-map-background @container/card gap-0 rounded-lg p-0'>
            <CardHeader className='gap-0 pr-[5px] pb-[4px] pl-[15px]'>
              <CardTitle className='mt-1 pt-1 text-xs font-bold'>
                Thông tin thiết bị
              </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col p-0 px-[15px] pb-[4px]'>
              <div className='pr-[5px] [&_span]:py-1'>
                <div className='flex items-center justify-between text-xs leading-[22px]'>
                  <span className='text-foreground'>Vĩ độ:</span>
                  <span className='text-foreground font-medium'>10.832945</span>
                </div>

                <div className='flex items-center justify-between text-xs leading-[22px]'>
                  <span className='text-foreground'>Kinh độ:</span>
                  <span className='text-foreground font-medium'>
                    106.7338941
                  </span>
                </div>
              </div>
            </CardContent>
            <CardContent className='mx-1.5 mb-1.5 p-0'>
              <LightControl />
            </CardContent>
          </Card>

          <Card className='bg-map-background @container/card gap-0 rounded-lg p-0 [&_span]:py-1'>
            <CardHeader className='gap-0 pr-[5px] pb-0.5 pl-[15px]'>
              <CardTitle className='mt-1 pt-1 text-xs font-bold'>
                Kết nối
              </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col p-0 px-[15px] pb-[4px] text-xs leading-[22px]'>
              <div className='text-foreground pr-[5px]'>
                <div className='flex items-center justify-between'>
                  <span>Loại kết nối:</span>
                  <span className='font-medium'>Viettel</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span>RSSI:</span>
                  <div className='flex items-center justify-center gap-1'>
                    {/* <Image src={"/assets/icons/wifiGood.svg"} alt="wifiGood" width={13.13} height={9.84} className="h-[21px] w-[21px] pb-1"/>
                                            <span className="font-medium text-map-control-button-success">Tốt</span> */}
                    {/* <Image src={"/assets/icons/wifiMedium.svg"} alt="wifiMedium" width={13.13} height={9.84} className="h-5 w-5"/>
                                            <span className="font-medium text-map-control-button-danger">Trung bình</span> */}
                    <Image
                      src={'/assets/icons/wifiWeak.svg'}
                      alt='wifiWeak'
                      width={13.13}
                      height={9.84}
                      className='h-5 w-5'
                    />
                    <span className='text-map-control-button-destructive font-medium'>
                      Yếu
                    </span>
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <span>Lần cuối online:</span>
                  <span className='font-medium'>2 phút trước</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-map-background @container/card gap-0 rounded-lg p-0 [&_span]:py-1'>
            <CardHeader className='gap-0 pr-[5px] pb-[4px] pl-[15px]'>
              <CardTitle className='mt-1 pt-1 text-xs font-bold'>
                Thông số hiện tại
              </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col p-0 px-[15px] pb-[4px] text-xs leading-[22px]'>
              <div className='text-foreground pr-[5px]'>
                <div className='flex items-center justify-between'>
                  <span>Điện áp tiêu thụ (kWh):</span>
                  <span className='font-medium'>80</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span>Nhiệt độ (°C):</span>
                  <span className='font-medium'>28</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <BrightnessGraph />
        </TabsContent>
      </Tabs>
    </div>
  );
}

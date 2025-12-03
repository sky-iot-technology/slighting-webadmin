import { Badge } from '@/ui/components/ui/badge';
import { Button } from '@/ui/components/ui/button';

export function SecureSetting() {
  return (
    <div className='p-4'>
      <h2 className='mb-2 text-sm font-bold'>Xác thực 2 yếu tố</h2>
      <div className='mb-4 flex items-center justify-between rounded-[8px] bg-white p-4'>
        <span className='text-sm font-medium'>Kích hoạt 2FA</span>
        <Badge className='bg-primary/5 text-primary rounded-[4px]'>
          Kích hoạt
        </Badge>
      </div>
      <h2 className='mb-2 text-sm font-bold'>Mật khẩu</h2>
      <div className='flex items-center justify-between rounded-[8px] bg-white p-4'>
        <span className='text-sm font-medium'>Thay đổi mật khẩu</span>
        <Button
          variant={'secondary'}
          className='bg-muted-foreground/20 h-10 w-[90px] cursor-pointer text-xs'
        >
          Đổi mật khẩu
        </Button>
      </div>
    </div>
  );
}

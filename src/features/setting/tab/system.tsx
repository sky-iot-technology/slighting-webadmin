import { Badge } from '@/ui/components/ui/badge';

export function SystemSetting() {
  return (
    <div className='p-4'>
      <h2 className='mb-2 text-sm font-bold'>Thông tin hệ thống</h2>
      <div className='mb-4 flex flex-col gap-4 rounded-[8px] bg-white p-4 text-sm'>
        <div className='flex items-center justify-between'>
          <span>Phiên bản phần mềm:</span>
          <span>v2.0.2</span>
        </div>
        <div className='flex justify-between'>
          <span>Số lượng đèn được quản lý</span>
          <span>1.247 đèn</span>
        </div>
      </div>
    </div>
  );
}

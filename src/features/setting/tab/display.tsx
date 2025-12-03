import { cn } from '@/lib/utils';
import { Label } from '@/ui/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/ui/components/ui/radio-group';
import Image from 'next/image';

// export function DisplaySetting() {
//     return (
//         <div className="p-4">
//             <h2 className="text-sm font-bold mb-2">Chế độ hiển thị</h2>
//             <RadioGroup defaultValue="light"
//                 className={cn(
//                     "p-4 bg-white rounded-[8px] mb-4 grid gap-4 [&_[data-state=checked]]:border-calendar-radio-green [&_[data-state=checked]]:bg-calendar-radio-green [&_[data-state=unchecked]]:border-calendar-radio-gray [&_[data-state=unchecked]]:bg-calendar-radio-gray [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:fill-white [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:stroke-white",
//                     "grid-cols-1 sm:grid-cols-2" // responsive
//                 )}
//             >
//                 {/* LIGHT */}
//                 <Label
//                     htmlFor="light"
//                     className={cn(
//                         "cursor-pointer flex flex-col gap-4",
//                         "transition-all",
//                     )}
//                 >

//                     <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden">
//                         <Image
//                             src="/assets/icons/light.svg"
//                             alt="light"
//                             fill
//                             className="object-contain"
//                         />
//                     </div>
//                     <div className="flex items-start gap-2 justify-between">
//                         <RadioGroupItem id="light" value="light" />
//                         <span className="text-sm font-medium">Sáng</span>
//                     </div>
//                 </Label>

//                 {/* DARK */}
//                 <Label
//                     htmlFor="dark"
//                     className={cn(
//                         "cursor-pointer flex flex-col gap-4",
//                         "transition-all",
//                     )}
//                 >

//                     <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden">
//                         <Image
//                             src="/assets/icons/dark.svg"
//                             alt="dark"
//                             fill
//                             className="object-contain"
//                         />
//                     </div>
//                     <div className="flex items-start gap-2 justify-between">
//                         <RadioGroupItem id="dark" value="dark" />
//                         <span className="text-sm font-medium">Tối</span>
//                     </div>
//                 </Label>
//             </RadioGroup>
//             <h2 className="text-sm font-bold mb-2">Ngôn ngữ</h2>
//             <div className="bg-white rounded-[8px] flex justify-between p-4 items-baseline">
//                 <span className="text-sm font-medium">Thay đổi ngôn ngữ</span>
//                 <RadioGroup
//                     defaultValue="vi"
//                     className={cn('flex !gap-10',
//                         `[&_[data-state=checked]]:border-calendar-radio-green [&_[data-state=checked]]:bg-calendar-radio-green [&_[data-state=unchecked]]:border-calendar-radio-gray [&_[data-state=unchecked]]:bg-calendar-radio-gray flex gap-3.5 [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:fill-white [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:stroke-white`
//                     )}
//                 >
//                     <div className='flex items-center space-x-2'>
//                         <RadioGroupItem value='vi' id='vi' className="cursor-pointer"/>
//                         <Label htmlFor='vi' className="cursor-pointer text-sm font-medium">Tiếng Việt</Label>
//                     </div>
//                     <div className='flex items-center space-x-2'>
//                         <RadioGroupItem value='eng' id='eng' className="cursor-pointer"/>
//                         <Label htmlFor='eng' className="cursor-pointer text-sm font-medium">Tiếng Anh</Label>
//                     </div>
//                 </RadioGroup>
//             </div>
//         </div>
//     );
// }

export function DisplaySetting() {
  return (
    <div className='w-full p-4'>
      <h2 className='mb-2 text-sm font-bold'>Chế độ hiển thị</h2>

      {/* CARD LIGHT/DARK */}
      <RadioGroup
        defaultValue='light'
        className={cn(
          '[&_[data-state=checked]]:border-calendar-radio-green [&_[data-state=checked]]:bg-calendar-radio-green [&_[data-state=unchecked]]:border-calendar-radio-gray [&_[data-state=unchecked]]:bg-calendar-radio-gray mb-4 grid gap-4 rounded-[8px] bg-white p-4 [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:fill-white [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:stroke-white',
          'grid-cols-1 sm:grid-cols-2'
        )}
      >
        {/* LIGHT */}
        <Label
          htmlFor='light'
          className='flex cursor-pointer flex-col gap-3 rounded-md p-2 transition'
        >
          <div className='relative aspect-[16/9] w-full overflow-hidden rounded-md'>
            <Image
              src='/assets/icons/light.svg'
              alt='light'
              fill
              className='object-contain'
            />
          </div>

          <div className='flex items-center justify-between gap-2'>
            <span className='text-sm font-medium'>Sáng</span>
            <RadioGroupItem id='light' value='light' />
          </div>
        </Label>

        {/* DARK */}
        <Label
          htmlFor='dark'
          className='flex cursor-pointer flex-col gap-3 rounded-md p-2 transition'
        >
          <div className='relative aspect-[16/9] w-full overflow-hidden rounded-md'>
            <Image
              src='/assets/icons/dark.svg'
              alt='dark'
              fill
              className='object-contain'
            />
          </div>

          <div className='flex items-center justify-between gap-2'>
            <span className='text-sm font-medium'>Tối</span>
            <RadioGroupItem id='dark' value='dark' />
          </div>
        </Label>
      </RadioGroup>

      {/* LANGUAGE */}
      <h2 className='mb-2 text-sm font-bold'>Ngôn ngữ</h2>

      <div className='flex flex-col gap-3 rounded-[8px] bg-white p-4'>
        <span className='text-sm font-medium'>Thay đổi ngôn ngữ</span>

        <RadioGroup
          defaultValue='vi'
          className='[&_[data-state=checked]]:border-calendar-radio-green [&_[data-state=checked]]:bg-calendar-radio-green [&_[data-state=unchecked]]:border-calendar-radio-gray [&_[data-state=unchecked]]:bg-calendar-radio-gray flex flex-wrap gap-4 [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:fill-white [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:stroke-white'
        >
          <div className='flex items-center gap-2'>
            <RadioGroupItem value='vi' id='vi' />
            <Label htmlFor='vi' className='cursor-pointer text-sm font-medium'>
              Tiếng Việt
            </Label>
          </div>

          <div className='flex items-center gap-2'>
            <RadioGroupItem value='eng' id='eng' />
            <Label htmlFor='eng' className='cursor-pointer text-sm font-medium'>
              Tiếng Anh
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

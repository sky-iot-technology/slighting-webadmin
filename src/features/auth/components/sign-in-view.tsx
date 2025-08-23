import { ModeToggle } from '@/ui/components/layout/ThemeToggle/theme-toggle';
import { Metadata } from 'next';
import Image from 'next/image';
import { SignInForm } from './sign-in-form';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignInViewPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {/* Left side - Background image */}
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900'></div>
      </div>

      {/* Right side - Login form */}
      <div className='flex h-full items-center justify-center bg-gradient-to-b from-white from-70% to-blue-300 p-4 lg:p-8 dark:from-gray-900 dark:to-blue-900'>
        <div className='flex w-full max-w-md flex-col space-y-6'>
          <Image
            src='/assets/images/logo.png'
            alt='logo'
            width={100}
            height={100}
            className='mx-auto'
          />
          <SignInForm />
        </div>
      </div>
      <div className='absolute top-4 right-4'>
        <ModeToggle />
      </div>
    </div>
  );
}

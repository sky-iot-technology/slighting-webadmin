import { buttonVariants } from '@/ui/components/ui/button';
import { cn } from '@/lib/utils';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { IconStar } from '@tabler/icons-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { SignInForm } from './sign-in-form';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignInViewPage({ stars }: { stars: number }) {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/auth/sign-up'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 hidden md:top-8 md:right-8'
        )}
      >
        Đăng ký
      </Link>
      
      {/* Left side - Background image */}
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900'>
          {/* City street background - using CSS gradients to simulate the design */}
          <div className='absolute inset-0 opacity-20'>
            <div className='h-full w-full bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%),radial-gradient(circle_at_40%_80%,rgba(120,219,255,0.3),transparent_50%)]'></div>
          </div>
          
          {/* Street lights effect */}
          <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-200/20 to-transparent'></div>
          
          {/* Moon */}
          <div className='absolute top-8 left-8 w-16 h-16 bg-yellow-200/30 rounded-full blur-sm'></div>
        </div>
        
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <div className='w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center mr-3'>
            <svg
              className='w-5 h-5 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 10V3L4 14h7v7l9-11h-7z'
              />
            </svg>
          </div>
          Citisys
        </div>
        
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;Hệ thống quản lý hiện đại, an toàn và dễ sử dụng cho doanh nghiệp của bạn.&rdquo;
            </p>
            <footer className='text-sm'>Citisys Team</footer>
          </blockquote>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className='flex h-full items-center justify-center p-4 lg:p-8 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-900'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          {/* github link */}
          <Link
            className={cn('group inline-flex hover:text-yellow-200')}
            target='_blank'
            href={'https://github.com/kiranism/next-shadcn-dashboard-starter'}
          >
            <div className='flex items-center'>
              <GitHubLogoIcon className='size-4' />
              <span className='ml-1 inline'>Star on GitHub</span>{' '}
            </div>
            <div className='ml-2 flex items-center gap-1 text-sm md:flex'>
              <IconStar
                className='size-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300'
                fill='currentColor'
              />
              <span className='font-display font-medium'>{stars}</span>
            </div>
          </Link>
          
          <SignInForm />

          <p className='text-muted-foreground px-8 text-center text-sm'>
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <Link
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Điều khoản sử dụng
            </Link>{' '}
            và{' '}
            <Link
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Chính sách bảo mật
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

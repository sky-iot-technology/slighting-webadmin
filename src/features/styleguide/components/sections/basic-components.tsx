'use client';

import { AspectRatio } from '@/ui/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/components/ui/avatar';
import { Badge } from '@/ui/components/ui/badge';
import { Button } from '@/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import { Heading } from '@/ui/components/ui/heading';
import { Separator } from '@/ui/components/ui/separator';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { Code } from 'lucide-react';

export function BasicComponents() {
  return (
    <div className='space-y-8'>
      <div>
        <h2 className='mb-4 text-2xl font-bold'>Basic Components</h2>
        <p className='text-muted-foreground mb-6'>
          Fundamental building blocks for creating user interfaces
        </p>
      </div>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Button
          </CardTitle>
          <CardDescription>
            Clickable elements for user interactions
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-2'>
            <Button variant='default'>Default</Button>
            <Button variant='destructive'>Destructive</Button>
            <Button variant='outline'>Outline</Button>
            <Button variant='secondary'>Secondary</Button>
            <Button variant='ghost'>Ghost</Button>
            <Button variant='link'>Link</Button>
          </div>

          <div className='flex flex-wrap gap-2'>
            <Button size='sm'>Small</Button>
            <Button size='default'>Default</Button>
            <Button size='lg'>Large</Button>
          </div>

          <div className='flex flex-wrap gap-2'>
            <Button disabled>Disabled</Button>
            <Button>
              <Code className='mr-2 h-4 w-4' />
              With Icon
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Badge
          </CardTitle>
          <CardDescription>
            Small labels for status, categories, or counts
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-2'>
            <Badge variant='default'>Default</Badge>
            <Badge variant='secondary'>Secondary</Badge>
            <Badge variant='destructive'>Destructive</Badge>
            <Badge variant='outline'>Outline</Badge>
          </div>

          <div className='flex flex-wrap gap-2'>
            <Badge className='bg-blue-500 hover:bg-blue-600'>Custom Blue</Badge>
            <Badge className='bg-green-500 hover:bg-green-600'>Success</Badge>
            <Badge className='bg-yellow-500 hover:bg-yellow-600'>Warning</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Cards */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Card
          </CardTitle>
          <CardDescription>
            Containers for organizing content and actions
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  This is the card content area where you can put any content.
                </p>
              </CardContent>
            </Card>

            <Card className='border-dashed'>
              <CardHeader>
                <CardTitle>Dashed Border</CardTitle>
                <CardDescription>Custom styling example</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Cards can have custom borders and styling.</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Separators */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Separator
          </CardTitle>
          <CardDescription>
            Visual dividers to separate content sections
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-4'>
            <p>Content above separator</p>
            <Separator />
            <p>Content below separator</p>
          </div>

          <div className='flex items-center space-x-4'>
            <span>Left content</span>
            <Separator orientation='vertical' className='h-4' />
            <span>Right content</span>
          </div>
        </CardContent>
      </Card>

      {/* Avatars */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Avatar
          </CardTitle>
          <CardDescription>User profile pictures and initials</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <Avatar>
              <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src='https://github.com/vercel.png' alt='@vercel' />
              <AvatarFallback>VE</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>

          <div className='flex items-center space-x-4'>
            <Avatar className='h-16 w-16'>
              <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className='h-12 w-12'>
              <AvatarImage src='https://github.com/vercel.png' alt='@vercel' />
              <AvatarFallback>VE</AvatarFallback>
            </Avatar>
            <Avatar className='h-8 w-8'>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>

      {/* Aspect Ratio */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Aspect Ratio
          </CardTitle>
          <CardDescription>
            Maintain consistent width-to-height ratios
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <p className='text-sm font-medium'>16:9 Ratio</p>
              <AspectRatio ratio={16 / 9} className='bg-muted rounded-lg'>
                <div className='flex h-full items-center justify-center'>
                  <span className='text-muted-foreground'>16:9 Content</span>
                </div>
              </AspectRatio>
            </div>

            <div className='space-y-2'>
              <p className='text-sm font-medium'>1:1 Ratio</p>
              <AspectRatio ratio={1} className='bg-muted rounded-lg'>
                <div className='flex h-full items-center justify-center'>
                  <span className='text-muted-foreground'>1:1 Content</span>
                </div>
              </AspectRatio>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Skeleton
          </CardTitle>
          <CardDescription>Loading placeholders for content</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-3'>
            <Skeleton className='h-4 w-[250px]' />
            <Skeleton className='h-4 w-[200px]' />
            <Skeleton className='h-4 w-[300px]' />
          </div>

          <div className='flex items-center space-x-4'>
            <Skeleton className='h-12 w-12 rounded-full' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[250px]' />
              <Skeleton className='h-4 w-[200px]' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heading */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Heading
          </CardTitle>
          <CardDescription>
            Typography components for consistent text hierarchy
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Heading
              title='Heading 1 - Main Title'
              description='Main page title'
            />
            <Heading
              title='Heading 2 - Section Title'
              description='Section description'
            />
            <Heading
              title='Heading 3 - Subsection'
              description='Subsection description'
            />
            <Heading
              title='Heading 4 - Minor Section'
              description='Minor section description'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

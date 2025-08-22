'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/ui/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/ui/components/ui/alert-dialog';
import { Progress } from '@/ui/components/ui/progress';
import { Badge } from '@/ui/components/ui/badge';
import { Button } from '@/ui/components/ui/button';
import { Skeleton } from '@/ui/components/ui/skeleton';
import {
  Code,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Loader2,
  Bell,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

export function FeedbackComponents() {
  return (
    <div className='space-y-8'>
      <div>
        <h2 className='mb-4 text-2xl font-bold'>Feedback Components</h2>
        <p className='text-muted-foreground mb-6'>
          Alerts, progress indicators, and status feedback components
        </p>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Alert
          </CardTitle>
          <CardDescription>
            Contextual feedback messages for users
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Alert>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              This is a default alert with an info icon and description.
            </AlertDescription>
          </Alert>

          <Alert variant='destructive'>
            <XCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              This is a destructive alert for error messages and warnings.
            </AlertDescription>
          </Alert>

          <Alert className='border-green-200 bg-green-50 text-green-800'>
            <CheckCircle className='h-4 w-4' />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              This is a success alert with custom styling.
            </AlertDescription>
          </Alert>

          <Alert className='border-blue-200 bg-blue-50 text-blue-800'>
            <Info className='h-4 w-4' />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is an informational alert with custom styling.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Alert Dialogs */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Alert Dialog
          </CardTitle>
          <CardDescription>
            Modal dialogs for important actions and confirmations
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-4'>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='outline'>Show Alert Dialog</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='destructive'>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete your account? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Progress
          </CardTitle>
          <CardDescription>
            Visual indicators for progress and completion
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Upload Progress</span>
              <span className='text-muted-foreground text-sm'>75%</span>
            </div>
            <Progress value={75} className='w-full' />
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Task Completion</span>
              <span className='text-muted-foreground text-sm'>45%</span>
            </div>
            <Progress value={45} className='w-full' />
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>System Load</span>
              <span className='text-muted-foreground text-sm'>90%</span>
            </div>
            <Progress value={90} className='w-full' />
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>
                Indeterminate Progress
              </span>
            </div>
            <Progress value={undefined} className='w-full' />
          </div>
        </CardContent>
      </Card>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Loading States
          </CardTitle>
          <CardDescription>
            Various loading indicators and skeleton components
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <h4 className='font-medium'>Spinners</h4>
            <div className='flex items-center gap-4'>
              <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Loading...
              </Button>
              <Button variant='outline' disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing
              </Button>
              <div className='flex items-center gap-2'>
                <Loader2 className='text-primary h-6 w-6 animate-spin' />
                <span className='text-muted-foreground text-sm'>
                  Loading data...
                </span>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <h4 className='font-medium'>Skeleton Loading</h4>
            <div className='space-y-3'>
              <div className='flex items-center space-x-4'>
                <Skeleton className='h-12 w-12 rounded-full' />
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-[250px]' />
                  <Skeleton className='h-4 w-[200px]' />
                </div>
              </div>
              <Skeleton className='h-4 w-[300px]' />
              <Skeleton className='h-4 w-[280px]' />
              <Skeleton className='h-4 w-[320px]' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Badges */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Status Indicators
          </CardTitle>
          <CardDescription>
            Badges and indicators for different states and statuses
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <h4 className='font-medium'>Status Badges</h4>
            <div className='flex flex-wrap gap-2'>
              <Badge variant='default'>Active</Badge>
              <Badge variant='secondary'>Pending</Badge>
              <Badge variant='destructive'>Error</Badge>
              <Badge variant='outline'>Draft</Badge>
            </div>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>Custom Status Badges</h4>
            <div className='flex flex-wrap gap-2'>
              <Badge className='bg-green-500 hover:bg-green-600'>Online</Badge>
              <Badge className='bg-yellow-500 hover:bg-yellow-600'>Away</Badge>
              <Badge className='bg-red-500 hover:bg-red-600'>Offline</Badge>
              <Badge className='bg-blue-500 hover:bg-blue-600'>Busy</Badge>
            </div>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>Priority Badges</h4>
            <div className='flex flex-wrap gap-2'>
              <Badge className='bg-red-100 text-red-800 hover:bg-red-200'>
                High Priority
              </Badge>
              <Badge className='bg-yellow-100 text-yellow-800 hover:bg-yellow-200'>
                Medium Priority
              </Badge>
              <Badge className='bg-green-100 text-green-800 hover:bg-green-200'>
                Low Priority
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toast Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Toast Notifications
          </CardTitle>
          <CardDescription>
            Non-intrusive notifications for user feedback
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-4'>
            <Button
              onClick={() =>
                toast('My first toast', {
                  description: 'This is a description',
                  action: {
                    label: 'Undo',
                    onClick: () => console.log('Undo')
                  }
                })
              }
            >
              <Bell className='mr-2 h-4 w-4' />
              Show Toast
            </Button>
          </div>

          <div className='bg-muted/50 rounded-lg border p-4'>
            <p className='text-muted-foreground text-sm'>
              Toast notifications appear in the top-right corner and
              automatically disappear after a few seconds. They can include
              actions and are non-blocking.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Interactive Feedback
          </CardTitle>
          <CardDescription>
            Components that provide immediate user feedback
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <Button
                onClick={() => alert('Button clicked!')}
                className='transition-all hover:scale-105 active:scale-95'
              >
                Click Me
              </Button>

              <Button
                variant='outline'
                onClick={() => alert('Outline button clicked!')}
                className='hover:bg-primary hover:text-primary-foreground transition-all'
              >
                Hover Effect
              </Button>
            </div>

            <div className='bg-muted/50 rounded-lg border p-4'>
              <p className='text-muted-foreground text-sm'>
                Interactive feedback includes hover states, active states, and
                immediate visual responses to user actions. These help users
                understand that their interactions are being registered.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

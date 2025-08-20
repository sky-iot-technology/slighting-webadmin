'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Code, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  bio: z.string().optional(),
  notifications: z.boolean(),
  theme: z.enum(['light', 'dark', 'system'])
});

export function FormComponents() {
  const [showPassword, setShowPassword] = useState(false);
  const [sliderValue, setSliderValue] = useState([50]);
  const [otpValue, setOtpValue] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      bio: '',
      notifications: true,
      theme: 'system'
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='mb-4 text-2xl font-bold'>Form Components</h2>
        <p className='text-muted-foreground mb-6'>
          Input controls and form elements for user data collection
        </p>
      </div>

      {/* Basic Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Input & Label
          </CardTitle>
          <CardDescription>Basic text input fields with labels</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' placeholder='Enter your email' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='username'>Username</Label>
              <Input id='username' placeholder='Enter username' />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter password'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Textarea */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Textarea
          </CardTitle>
          <CardDescription>
            Multi-line text input for longer content
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='bio'>Bio</Label>
            <Textarea
              id='bio'
              placeholder='Tell us about yourself...'
              className='min-h-[100px]'
            />
          </div>
        </CardContent>
      </Card>

      {/* Checkbox */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Checkbox
          </CardTitle>
          <CardDescription>Boolean input for yes/no selections</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <Checkbox id='terms' />
            <Label htmlFor='terms'>I agree to the terms and conditions</Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox id='newsletter' />
            <Label htmlFor='newsletter'>Subscribe to newsletter</Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox id='marketing' />
            <Label htmlFor='marketing'>Allow marketing emails</Label>
          </div>
        </CardContent>
      </Card>

      {/* Radio Group */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Radio Group
          </CardTitle>
          <CardDescription>
            Single selection from multiple options
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <RadioGroup defaultValue='option-one'>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='option-one' id='option-one' />
              <Label htmlFor='option-one'>Option One</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='option-two' id='option-two' />
              <Label htmlFor='option-two'>Option Two</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='option-three' id='option-three' />
              <Label htmlFor='option-three'>Option Three</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Switch */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Switch
          </CardTitle>
          <CardDescription>Toggle switch for boolean values</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='airplane-mode'>Airplane Mode</Label>
            <Switch id='airplane-mode' />
          </div>

          <div className='flex items-center justify-between'>
            <Label htmlFor='wifi'>Wi-Fi</Label>
            <Switch id='wifi' defaultChecked />
          </div>

          <div className='flex items-center justify-between'>
            <Label htmlFor='bluetooth'>Bluetooth</Label>
            <Switch id='bluetooth' />
          </div>
        </CardContent>
      </Card>

      {/* Slider */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Slider
          </CardTitle>
          <CardDescription>Range input for numeric values</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label>Volume: {sliderValue}</Label>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
              className='w-full'
            />
          </div>

          <div className='space-y-2'>
            <Label>Brightness: {sliderValue}</Label>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={5}
              className='w-full'
            />
          </div>
        </CardContent>
      </Card>

      {/* Select */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Select
          </CardTitle>
          <CardDescription>
            Dropdown selection from predefined options
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label>Country</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Select a country' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='us'>United States</SelectItem>
                  <SelectItem value='uk'>United Kingdom</SelectItem>
                  <SelectItem value='ca'>Canada</SelectItem>
                  <SelectItem value='au'>Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Language</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Select a language' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='en'>English</SelectItem>
                  <SelectItem value='es'>Spanish</SelectItem>
                  <SelectItem value='fr'>French</SelectItem>
                  <SelectItem value='de'>German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Form */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Complete Form with Validation
          </CardTitle>
          <CardDescription>
            Example of a complete form using React Hook Form and Zod validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter username' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter email'
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter password'
                        type='password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Tell us about yourself...'
                        className='min-h-[100px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='notifications'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Email notifications
                      </FormLabel>
                      <FormDescription>
                        Receive emails about your account activity.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='theme'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a theme' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='light'>Light</SelectItem>
                        <SelectItem value='dark'>Dark</SelectItem>
                        <SelectItem value='system'>System</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Toggle Components */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Toggle Components
          </CardTitle>
          <CardDescription>
            Toggle buttons and toggle groups for state switching
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <h4 className='font-medium'>Single Toggle</h4>
            <div className='flex items-center gap-4'>
              <Toggle aria-label='Toggle bold'>
                <Bold className='h-4 w-4' />
              </Toggle>
              <Toggle aria-label='Toggle italic'>
                <Italic className='h-4 w-4' />
              </Toggle>
              <Toggle aria-label='Toggle underline'>
                <Underline className='h-4 w-4' />
              </Toggle>
            </div>
          </div>

          <div className='space-y-4'>
            <h4 className='font-medium'>Toggle Group</h4>
            <ToggleGroup type='single' aria-label='Text alignment'>
              <ToggleGroupItem value='left' aria-label='Left aligned'>
                <AlignLeft className='h-4 w-4' />
              </ToggleGroupItem>
              <ToggleGroupItem value='center' aria-label='Center aligned'>
                <AlignCenter className='h-4 w-4' />
              </ToggleGroupItem>
              <ToggleGroupItem value='right' aria-label='Right aligned'>
                <AlignRight className='h-4 w-4' />
              </ToggleGroupItem>
              <ToggleGroupItem value='justify' aria-label='Justify aligned'>
                <AlignJustify className='h-4 w-4' />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className='bg-muted/50 rounded-lg border p-4'>
            <p className='text-muted-foreground text-sm'>
              Toggle components are perfect for toolbar interfaces, text
              editors, and any UI that needs to switch between different states
              or modes. Toggle groups ensure only one option can be active at a
              time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

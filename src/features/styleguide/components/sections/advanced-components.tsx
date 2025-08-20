'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Italic,
  Menu,
  Settings,
  Underline
} from 'lucide-react';
import { useState } from 'react';

export function AdvancedComponents() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='mb-4 text-2xl font-bold'>Advanced Components</h2>
        <p className='text-muted-foreground mb-6'>
          Complex and specialized components for advanced use cases
        </p>
      </div>

      {/* Accordion */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Accordion
          </CardTitle>
          <CardDescription>
            Collapsible content sections for organizing information
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem value='item-1'>
              <AccordionTrigger>
                What is an accordion component?
              </AccordionTrigger>
              <AccordionContent>
                An accordion is a vertically stacked set of interactive headings
                that each contain a title, content snippet, or thumbnail
                representing a section of content. The headings function as
                controls that enable users to reveal or hide their associated
                content.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2'>
              <AccordionTrigger>
                When should I use an accordion?
              </AccordionTrigger>
              <AccordionContent>
                Accordions are useful when you want to toggle between hiding and
                showing large amounts of content. They help organize content
                into logical sections and reduce the amount of information
                visible at once.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
              <AccordionTrigger>Are accordions accessible?</AccordionTrigger>
              <AccordionContent>
                Yes! Our accordion component is built with accessibility in
                mind. It supports keyboard navigation, screen readers, and
                follows ARIA best practices for expandable content sections.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className='bg-muted/50 rounded-lg border p-4'>
            <p className='text-muted-foreground text-sm'>
              Accordions are perfect for FAQs, product specifications, and any
              content that can be organized into logical, collapsible sections.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Calendar
          </CardTitle>
          <CardDescription>
            Date picker calendar component for selecting dates
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-col items-center space-y-4'>
            <Calendar
              mode='single'
              selected={date}
              onSelect={setDate}
              className='rounded-md border'
            />
            <div className='text-center'>
              <p className='text-muted-foreground text-sm'>Selected date:</p>
              <p className='font-medium'>
                {date ? date.toLocaleDateString() : 'No date selected'}
              </p>
            </div>
          </div>

          <div className='bg-muted/50 rounded-lg border p-4'>
            <p className='text-muted-foreground text-sm'>
              The calendar component provides a full month view with date
              selection capabilities. It&apos;s perfect for date inputs,
              scheduling interfaces, and any application requiring date
              selection.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Drawer */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Drawer
          </CardTitle>
          <CardDescription>
            Side drawer component that slides in from the edges
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-4'>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant='outline'>
                  <Menu className='mr-2 h-4 w-4' />
                  Open Drawer
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className='mx-auto w-full max-w-sm'>
                  <DrawerHeader>
                    <DrawerTitle>Drawer Title</DrawerTitle>
                    <DrawerDescription>
                      This is a drawer component that slides up from the bottom
                      on mobile devices.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className='p-4'>
                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='name'>Name</Label>
                        <Input id='name' placeholder='Enter your name' />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input id='email' placeholder='Enter your email' />
                      </div>
                    </div>
                  </div>
                  <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                      <Button variant='outline'>Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>

            <Button variant='outline' onClick={() => setIsOpen(true)}>
              <Settings className='mr-2 h-4 w-4' />
              Settings Drawer
            </Button>
          </div>

          <div className='bg-muted/50 rounded-lg border p-4'>
            <p className='text-muted-foreground text-sm'>
              Drawers are perfect for mobile-first interfaces and provide a
              native app-like experience. They can slide in from any edge and
              contain forms, navigation, or additional content.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Modal
          </CardTitle>
          <CardDescription>
            Modal dialog component for focused user interactions
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Modal
            title='Modal Title'
            description='Modal Description'
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <div className='bg-muted/50 rounded-lg border p-4'>
              <p className='text-muted-foreground text-sm'>
                Modals create a focused, overlay experience that temporarily
                suspends the main application to focus on a specific task or
                piece of content.
              </p>
            </div>
          </Modal>

          <div className='bg-muted/50 rounded-lg border p-4'>
            <p className='text-muted-foreground text-sm'>
              Modals create a focused, overlay experience that temporarily
              suspends the main application to focus on a specific task or piece
              of content.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Toggle
          </CardTitle>
          <CardDescription>
            Toggle button components for state switching
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
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

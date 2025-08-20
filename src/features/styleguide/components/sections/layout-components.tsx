'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronRight, Code, GripVertical } from 'lucide-react';
import { useState } from 'react';

export function LayoutComponents() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='mb-4 text-2xl font-bold'>Layout Components</h2>
        <p className='text-muted-foreground mb-6'>
          Structural and layout components for organizing content
        </p>
      </div>

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
            <p>Content above horizontal separator</p>
            <Separator />
            <p>Content below horizontal separator</p>
          </div>

          <div className='flex items-center space-x-4'>
            <span>Left content</span>
            <Separator orientation='vertical' className='h-4' />
            <span>Right content</span>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div className='text-center'>
              <h4 className='font-semibold'>Section 1</h4>
              <p className='text-muted-foreground text-sm'>
                Content for section 1
              </p>
            </div>
            <Separator orientation='vertical' className='h-16' />
            <div className='text-center'>
              <h4 className='font-semibold'>Section 2</h4>
              <p className='text-muted-foreground text-sm'>
                Content for section 2
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resizable Panels */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Resizable Panels
          </CardTitle>
          <CardDescription>
            Panels that can be resized by dragging their boundaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResizablePanelGroup
            direction='horizontal'
            className='min-h-[200px] rounded-lg border'
          >
            <ResizablePanel defaultSize={50}>
              <div className='flex h-full items-center justify-center p-6'>
                <div className='text-center'>
                  <h4 className='font-semibold'>Left Panel</h4>
                  <p className='text-muted-foreground text-sm'>
                    Drag the handle to resize
                  </p>
                  <div className='mt-2 flex items-center justify-center'>
                    <GripVertical className='text-muted-foreground h-4 w-4' />
                  </div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <div className='flex h-full items-center justify-center p-6'>
                <div className='text-center'>
                  <h4 className='font-semibold'>Right Panel</h4>
                  <p className='text-muted-foreground text-sm'>
                    This panel can also be resized
                  </p>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>

          <div className='bg-muted/50 mt-4 rounded-lg border p-4'>
            <p className='text-muted-foreground text-sm'>
              Resizable panels are useful for creating adjustable layouts like
              code editors, file managers, or dashboard layouts where users need
              to customize the space allocation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Collapsible */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Collapsible
          </CardTitle>
          <CardDescription>
            Expandable and collapsible content sections
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Collapsible
            open={isCollapsibleOpen}
            onOpenChange={setIsCollapsibleOpen}
          >
            <CollapsibleTrigger asChild>
              <Button variant='ghost' className='w-full justify-between p-4'>
                <span className='font-medium'>Click to expand/collapse</span>
                {isCollapsibleOpen ? (
                  <ChevronDown className='h-4 w-4' />
                ) : (
                  <ChevronRight className='h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='space-y-2'>
              <div className='bg-muted/50 rounded-lg border p-4'>
                <h4 className='mb-2 font-semibold'>Collapsible Content</h4>
                <p className='text-muted-foreground text-sm'>
                  This content can be shown or hidden by clicking the trigger
                  above. It&apos;s useful for organizing information into
                  expandable sections.
                </p>
                <div className='mt-3 space-y-2'>
                  <div className='flex items-center gap-2'>
                    <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                    <span className='text-sm'>Feature 1</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='h-2 w-2 rounded-full bg-green-500'></div>
                    <span className='text-sm'>Feature 2</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                    <span className='text-sm'>Feature 3</span>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Grid Layouts */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Grid Layouts
          </CardTitle>
          <CardDescription>
            Responsive grid systems for organizing content
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <h4 className='font-medium'>Responsive Grid (1-2-4 columns)</h4>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='rounded-lg border p-4 text-center'>
                  <div className='bg-primary mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full'>
                    <span className='text-primary-foreground font-bold'>
                      {i + 1}
                    </span>
                  </div>
                  <h5 className='font-medium'>Grid Item {i + 1}</h5>
                  <p className='text-muted-foreground text-sm'>
                    Responsive content
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>Auto-fit Grid</h4>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='rounded-lg border p-3 text-center'>
                  <span className='text-sm font-medium'>Auto Item {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>Masonry-like Grid</h4>
            <div className='columns-1 gap-4 space-y-4 md:columns-2 lg:columns-3'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`break-inside-avoid rounded-lg border p-4 ${
                    i % 3 === 0 ? 'h-24' : i % 3 === 1 ? 'h-32' : 'h-20'
                  }`}
                >
                  <h5 className='font-medium'>Masonry Item {i + 1}</h5>
                  <p className='text-muted-foreground text-sm'>
                    This item has variable height to demonstrate masonry layout.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spacing and Layout Utilities */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Spacing & Layout Utilities
          </CardTitle>
          <CardDescription>Common spacing and layout patterns</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <h4 className='font-medium'>Spacing Examples</h4>
            <div className='space-y-2'>
              <div className='rounded bg-blue-100 p-2'>p-2 (8px padding)</div>
              <div className='rounded bg-green-100 p-4'>p-4 (16px padding)</div>
              <div className='rounded bg-purple-100 p-6'>
                p-6 (24px padding)
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <h4 className='font-medium'>Margin Examples</h4>
            <div className='space-y-2'>
              <div className='m-2 rounded bg-orange-100 p-2'>
                m-2 (8px margin)
              </div>
              <div className='m-4 rounded bg-pink-100 p-2'>
                m-4 (16px margin)
              </div>
              <div className='m-6 rounded bg-indigo-100 p-2'>
                m-6 (24px margin)
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <h4 className='font-medium'>Flexbox Layouts</h4>
            <div className='space-y-2'>
              <div className='flex items-center justify-between rounded bg-gray-100 p-2'>
                <span>Left content</span>
                <span>Right content</span>
              </div>
              <div className='flex items-center justify-center rounded bg-gray-100 p-2'>
                <span>Centered content</span>
              </div>
              <div className='flex items-center gap-4 rounded bg-gray-100 p-2'>
                <span>Item 1</span>
                <span>Item 2</span>
                <span>Item 3</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

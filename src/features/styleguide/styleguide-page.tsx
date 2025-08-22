'use client';

import { Badge } from '@/ui/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import { Input } from '@/ui/components/ui/input';
import { ScrollArea } from '@/ui/components/ui/scroll-area';
import { Separator } from '@/ui/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/components/ui/tabs';
import { Search } from 'lucide-react';
import { useState } from 'react';

import { BasicComponents } from './components/sections/basic-components';
import { DataDisplayComponents } from './components/sections/data-display-components';
import { FeedbackComponents } from './components/sections/feedback-components';
import { FormComponents } from './components/sections/form-components';
import { LayoutComponents } from './components/sections/layout-components';
import { OverlayComponents } from './components/sections/overlay-components';
import PageContainer from '@/ui/components/layout/page-container';
import { NavigationComponents } from './components/sections/navigation-components';
import { AdvancedComponents } from './components/sections/advanced-components';

const componentCategories = [
  {
    id: 'basic',
    title: 'Basic Components',
    description: 'Fundamental building blocks',
    count: 10
  },
  {
    id: 'form',
    title: 'Form Components',
    description: 'Input controls and form elements',
    count: 12
  },
  {
    id: 'navigation',
    title: 'Navigation',
    description: 'Menus, breadcrumbs, and navigation',
    count: 6
  },
  {
    id: 'data-display',
    title: 'Data Display',
    description: 'Tables, charts, and data visualization',
    count: 25
  },
  {
    id: 'feedback',
    title: 'Feedback',
    description: 'Alerts, progress, and status indicators',
    count: 7
  },
  {
    id: 'layout',
    title: 'Layout',
    description: 'Structural and layout components',
    count: 5
  },
  {
    id: 'overlay',
    title: 'Overlay',
    description: 'Modals, dialogs, and overlays',
    count: 8
  },
  {
    id: 'advanced',
    title: 'Advanced Components',
    description: 'Complex and specialized components',
    count: 8
  }
];

export function StyleguidePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const filteredCategories = componentCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer scrollable={true}>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='mb-4 flex items-center gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600'>
              <span className='text-xl font-bold text-white'>UI</span>
            </div>
            <div>
              <h1 className='text-4xl font-bold tracking-tight'>Styleguide</h1>
              <p className='text-muted-foreground text-lg'>
                Complete showcase of all available UI components
              </p>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <div className='relative max-w-md flex-1'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
              <Input
                placeholder='Search components...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>
            <Badge variant='secondary' className='text-sm'>
              {componentCategories.reduce((acc, cat) => acc + cat.count, 0)}{' '}
              Components
            </Badge>
          </div>
        </div>

        <Separator className='mb-8' />

        {/* Component Categories Grid */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredCategories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeTab === category.id ? 'ring-primary ring-2' : ''
              }`}
              onClick={() => setActiveTab(category.id)}
            >
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>{category.title}</CardTitle>
                  <Badge variant='outline'>{category.count}</Badge>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Component Showcase */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='mb-8 grid w-full grid-cols-8'>
            {componentCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className='text-xs'
              >
                {category.title.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className='h-[1000px] rounded-lg border p-6'>
            <TabsContent value='basic' className='mt-0'>
              <BasicComponents />
            </TabsContent>

            <TabsContent value='form' className='mt-0'>
              <FormComponents />
            </TabsContent>

            <TabsContent value='navigation' className='mt-0'>
              <NavigationComponents />
            </TabsContent>

            <TabsContent value='data-display' className='mt-0'>
              <DataDisplayComponents />
            </TabsContent>

            <TabsContent value='feedback' className='mt-0'>
              <FeedbackComponents />
            </TabsContent>

            <TabsContent value='layout' className='mt-0'>
              <LayoutComponents />
            </TabsContent>

            <TabsContent value='overlay' className='mt-0'>
              <OverlayComponents />
            </TabsContent>

            <TabsContent value='advanced' className='mt-0'>
              <AdvancedComponents />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </PageContainer>
  );
}

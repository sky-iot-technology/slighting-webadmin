'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from '@/components/ui/menubar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger
} from '@/components/ui/sidebar';
import {
  Code,
  ChevronRight,
  Home,
  FileText,
  Settings,
  User,
  Search,
  Plus,
  Download,
  Share,
  Edit,
  Trash2,
  Menu
} from 'lucide-react';
import Link from 'next/link';

export function NavigationComponents() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='mb-4 text-2xl font-bold'>Navigation Components</h2>
        <p className='text-muted-foreground mb-6'>
          Menus, breadcrumbs, and navigation components
        </p>
      </div>

      {/* Breadcrumb */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Breadcrumb
          </CardTitle>
          <CardDescription>
            Navigation breadcrumbs for hierarchical navigation
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>
                  <Home className='h-4 w-4' />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/dashboard/products'>
                  Products
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit Product</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className='bg-muted/50 rounded-lg border p-4'>
            <p className='text-muted-foreground text-sm'>
              Breadcrumbs help users understand their current location within a
              website&apos;s hierarchy and provide quick navigation to parent
              pages.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Menubar */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Menubar
          </CardTitle>
          <CardDescription>
            Horizontal menu bar for application navigation
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <Plus className='mr-2 h-4 w-4' />
                  New File
                  <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  <FileText className='mr-2 h-4 w-4' />
                  Open
                  <MenubarShortcut>⌘O</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  <Download className='mr-2 h-4 w-4' />
                  Save
                  <MenubarShortcut>⌘S</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <Edit className='mr-2 h-4 w-4' />
                  Edit
                  <MenubarShortcut>⌘E</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                  <MenubarShortcut>⌘D</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Toggle Sidebar</MenubarItem>
                <MenubarItem>Toggle Fullscreen</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <div className='bg-muted/50 rounded-lg border p-4'>
            <p className='text-muted-foreground text-sm'>
              Menubars provide a traditional desktop application navigation
              experience with dropdown menus and keyboard shortcuts.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Menu */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Navigation Menu
          </CardTitle>
          <CardDescription>
            Accessible navigation menu with dropdown support
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className='grid w-[400px] gap-3 p-6 lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                    <li className='row-span-3'>
                      <NavigationMenuLink asChild>
                        <Link
                          className='from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md'
                          href='/'
                        >
                          <div className='mt-4 mb-2 text-lg font-medium'>
                            UI Components
                          </div>
                          <p className='text-muted-foreground text-sm leading-tight'>
                            Beautiful, accessible components built with Radix UI
                            and Tailwind CSS.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className='hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none'
                          href='/docs'
                        >
                          <div className='text-sm leading-none font-medium'>
                            Introduction
                          </div>
                          <p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>
                            Build high-quality, accessible design systems and
                            web apps.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className='hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none'
                          href='/docs/installation'
                        >
                          <div className='text-sm leading-none font-medium'>
                            Installation
                          </div>
                          <p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>
                            How to install dependencies and structure your app.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className='grid w-[500px] gap-3 p-4 lg:grid-cols-[.75fr_1fr]'>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className='hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none'
                          href='/docs/components/accordion'
                        >
                          <div className='text-sm leading-none font-medium'>
                            Accordion
                          </div>
                          <p className='text-muted-foreground text-sm leading-snug'>
                            Collapsible content sections.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className='hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none'
                          href='/docs/components/button'
                        >
                          <div className='text-sm leading-none font-medium'>
                            Button
                          </div>
                          <p className='text-muted-foreground text-sm leading-snug'>
                            Interactive button elements.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Documentation
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className='bg-muted/50 rounded-lg border p-4'>
            <p className='text-muted-foreground text-sm'>
              Navigation menus provide rich dropdown navigation with support for
              complex layouts, images, and descriptions. They&apos;re fully
              accessible and keyboard navigable.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Pagination
          </CardTitle>
          <CardDescription>Page navigation for large datasets</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-4'>
            <h4 className='font-medium'>Basic Pagination</h4>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href='#' />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href='#' isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href='#'>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href='#'>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href='#' />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <div className='space-y-4'>
            <h4 className='font-medium'>Advanced Pagination</h4>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href='#' />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href='#'>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href='#' isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href='#'>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href='#'>4</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href='#'>5</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href='#'>20</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href='#' />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <div className='bg-muted/50 rounded-lg border p-4'>
            <p className='text-muted-foreground text-sm'>
              Pagination components help users navigate through large sets of
              data by breaking them into manageable pages with clear navigation
              controls.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

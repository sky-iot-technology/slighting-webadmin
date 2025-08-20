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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import {
  Code,
  Settings,
  User,
  Mail,
  Calendar,
  Search,
  MoreHorizontal,
  Plus,
  Download,
  Share,
  Edit,
  Trash2,
  Info,
  Copy
} from 'lucide-react';

export function OverlayComponents() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='mb-4 text-2xl font-bold'>Overlay Components</h2>
        <p className='text-muted-foreground mb-6'>
          Modals, dialogs, and overlay components for user interactions
        </p>
      </div>

      {/* Dialog */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Dialog
          </CardTitle>
          <CardDescription>
            Modal dialogs for important actions and forms
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-4'>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline'>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='name' className='text-right'>
                      Name
                    </Label>
                    <Input
                      id='name'
                      defaultValue='John Doe'
                      className='col-span-3'
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='username' className='text-right'>
                      Username
                    </Label>
                    <Input
                      id='username'
                      defaultValue='@johndoe'
                      className='col-span-3'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type='submit'>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant='destructive'>Delete Account</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant='outline'>Cancel</Button>
                  <Button variant='destructive'>Delete Account</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Sheet */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Sheet
          </CardTitle>
          <CardDescription>
            Side panels that slide in from the edges
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-4'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline'>
                  <Settings className='mr-2 h-4 w-4' />
                  Settings
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Settings</SheetTitle>
                  <SheetDescription>
                    Manage your account settings and preferences.
                  </SheetDescription>
                </SheetHeader>
                <div className='grid gap-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='theme'>Theme</Label>
                    <select id='theme' className='w-full rounded border p-2'>
                      <option>Light</option>
                      <option>Dark</option>
                      <option>System</option>
                    </select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='language'>Language</Label>
                    <select id='language' className='w-full rounded border p-2'>
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline'>
                  <User className='mr-2 h-4 w-4' />
                  Profile
                </Button>
              </SheetTrigger>
              <SheetContent side='right'>
                <SheetHeader>
                  <SheetTitle>User Profile</SheetTitle>
                  <SheetDescription>
                    View and edit your profile information.
                  </SheetDescription>
                </SheetHeader>
                <div className='grid gap-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input id='email' defaultValue='john@example.com' />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='bio'>Bio</Label>
                    <textarea
                      id='bio'
                      className='min-h-[100px] w-full rounded border p-2'
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      {/* Popover */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Popover
          </CardTitle>
          <CardDescription>
            Floating content that appears on hover or click
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-4'>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline'>
                  <Calendar className='mr-2 h-4 w-4' />
                  Pick a date
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <div className='p-4'>
                  <h4 className='mb-2 font-medium'>Calendar</h4>
                  <p className='text-muted-foreground text-sm'>
                    Date picker content would go here.
                  </p>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline'>
                  <Info className='mr-2 h-4 w-4' />
                  More Info
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-80'>
                <div className='grid gap-4'>
                  <div className='space-y-2'>
                    <h4 className='leading-none font-medium'>Dimensions</h4>
                    <p className='text-muted-foreground text-sm'>
                      Set the dimensions for the layer.
                    </p>
                  </div>
                  <div className='grid gap-2'>
                    <div className='grid grid-cols-3 items-center gap-4'>
                      <Label htmlFor='width'>Width</Label>
                      <Input
                        id='width'
                        defaultValue='100%'
                        className='col-span-2 h-8'
                      />
                    </div>
                    <div className='grid grid-cols-3 items-center gap-4'>
                      <Label htmlFor='maxWidth'>Max. width</Label>
                      <Input
                        id='maxWidth'
                        defaultValue='300px'
                        className='col-span-2 h-8'
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Hover Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Hover Card
          </CardTitle>
          <CardDescription>Rich previews that appear on hover</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-4'>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant='link' className='p-0'>
                  @johndoe
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className='w-80'>
                <div className='flex justify-between space-x-4'>
                  <div className='space-y-1'>
                    <h4 className='text-sm font-semibold'>@johndoe</h4>
                    <p className='text-muted-foreground text-sm'>
                      Full-stack developer working on modern web applications.
                    </p>
                    <div className='flex items-center pt-2'>
                      <Calendar className='mr-2 h-4 w-4 opacity-70' />
                      <span className='text-muted-foreground text-xs'>
                        Joined December 2021
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant='outline'>
                  <Mail className='mr-2 h-4 w-4' />
                  Contact Info
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className='w-80'>
                <div className='space-y-2'>
                  <h4 className='text-sm font-semibold'>Contact Information</h4>
                  <div className='space-y-1'>
                    <p className='text-sm'>Email: john@example.com</p>
                    <p className='text-sm'>Phone: +1 (555) 123-4567</p>
                    <p className='text-sm'>Location: San Francisco, CA</p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardContent>
      </Card>

      {/* Tooltip */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Tooltip
          </CardTitle>
          <CardDescription>Small popups that appear on hover</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <TooltipProvider>
            <div className='flex flex-wrap gap-4'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='outline'>Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a tooltip</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='outline'>
                    <Info className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click for more information</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='outline'>
                    <Settings className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Configure settings</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Command */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Command
          </CardTitle>
          <CardDescription>
            Command palette for quick actions and navigation
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Command className='rounded-lg border shadow-md'>
            <CommandInput placeholder='Type a command or search...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading='Suggestions'>
                <CommandItem>
                  <Calendar className='mr-2 h-4 w-4' />
                  <span>Calendar</span>
                </CommandItem>
                <CommandItem>
                  <Search className='mr-2 h-4 w-4' />
                  <span>Search</span>
                </CommandItem>
                <CommandItem>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Settings</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CardContent>
      </Card>

      {/* Dropdown Menu */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Dropdown Menu
          </CardTitle>
          <CardDescription>
            Contextual menus that appear on click
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Edit className='mr-2 h-4 w-4' />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className='mr-2 h-4 w-4' />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className='mr-2 h-4 w-4' />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='text-red-600'>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <Plus className='mr-2 h-4 w-4' />
                  Create
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Create New</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Document</DropdownMenuItem>
                <DropdownMenuItem>Spreadsheet</DropdownMenuItem>
                <DropdownMenuItem>Presentation</DropdownMenuItem>
                <DropdownMenuItem>Folder</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='h-5 w-5' />
            Context Menu
          </CardTitle>
          <CardDescription>
            Right-click context menus for additional actions
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <ContextMenu>
            <ContextMenuTrigger className='flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm'>
              Right-click on this area to see the context menu
            </ContextMenuTrigger>
            <ContextMenuContent className='w-64'>
              <ContextMenuLabel>Actions</ContextMenuLabel>
              <ContextMenuSeparator />
              <ContextMenuItem>
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </ContextMenuItem>
              <ContextMenuItem>
                <Copy className='mr-2 h-4 w-4' />
                Copy
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>
                <Share className='mr-2 h-4 w-4' />
                Share
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem className='text-red-600'>
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          <div className='bg-muted/50 rounded-lg border p-4'>
            <p className='text-muted-foreground text-sm'>
              Context menus provide quick access to actions related to the
              clicked element. They&apos;re commonly used in file managers, text
              editors, and other applications.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

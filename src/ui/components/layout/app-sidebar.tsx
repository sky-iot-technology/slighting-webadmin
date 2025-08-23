'use client';

import { Button } from '@/ui/components/ui/button';
import { ScrollArea } from '@/ui/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/ui/components/ui/sheet';
import { useUser, useLogout } from '@/core/domains/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, UserCircle, LogOut, Kanban, Users, Settings, BarChart3 } from 'lucide-react';

export default function AppSidebar() {
  const [open, setOpen] = useState(false);
  const user = useUser();
  const logoutMutation = useLogout();
  const router = useRouter();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navigation = [
    { name: 'Tổng quan', href: '/dashboard/overview', icon: BarChart3 },
    { name: 'Kanban', href: '/dashboard/kanban', icon: Kanban },
    { name: 'Sản phẩm', href: '/dashboard/product', icon: Users },
    { name: 'Cài đặt', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pl-1 pr-0">
          <div className="flex h-full flex-col gap-y-5 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <BarChart3 className="h-8 w-auto" />
            </div>
            <ScrollArea className="h-full py-6">
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-x-3 rounded-md px-2 py-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                            onClick={() => {
                              router.push(item.href);
                              setOpen(false);
                            }}
                          >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {item.name}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="mt-auto">
                    <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                      <UserCircle className="h-8 w-8 shrink-0" />
                      <span className="sr-only">Your profile</span>
                      <span aria-hidden="true">
                        {user?.name || user?.username || 'User'}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-x-3 rounded-md px-2 py-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5 shrink-0" />
                      Đăng xuất
                    </Button>
                  </li>
                </ul>
              </nav>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

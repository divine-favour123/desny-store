'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  if (!pathname.startsWith('/admin') || pathname === '/admin/login' || pathname === '/admin') return null;

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <aside
        className={cn(
          'bg-white border-r h-screen sticky top-0 transition-all duration-300 z-40 flex flex-col',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen
            ? 'translate-x-0 fixed inset-y-0 left-0'
            : 'max-lg:-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {!collapsed && <span className="font-bold text-xl tracking-tight">ADMIN PANEL</span>}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center p-3 rounded-lg text-sm font-medium transition-colors',
                pathname === item.href ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
              )}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={20} className={cn(!collapsed && 'mr-3')} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className={cn('w-full justify-start text-red-600', !collapsed && 'px-4')}
            onClick={async () => {
              await authClient.signOut();
              window.location.href = '/admin/login';
            }}
          >
            <LogOut size={20} className={cn(!collapsed && 'mr-3')} />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

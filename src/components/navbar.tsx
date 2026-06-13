'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, LogOut, Package, User } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/components/cart-context';
import { authClient } from '@/lib/auth-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const pathname = usePathname();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  if (pathname.startsWith('/admin')) return null;

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-black">DESNY</span>
            <span className="text-xs font-bold text-white bg-black px-2 py-0.5 rounded-full tracking-widest">STORE</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}
                className={`text-sm font-semibold transition-colors relative group ${
                  isActive(link.href) ? 'text-black' : 'text-gray-400 hover:text-black'
                }`}>
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-200 ${
                  isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/cart" className="relative p-2 text-gray-500 hover:text-black transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-black text-white bg-black rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-black hover:bg-gray-800 transition-colors">
                    {session.user.name.charAt(0).toUpperCase()}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <p className="text-sm font-bold">{session.user.name}</p>
                    <p className="text-xs text-gray-500 font-normal">{session.user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" /> My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 cursor-pointer"
                    onClick={async () => { await authClient.signOut(); window.location.reload(); }}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/account/signin"
                className="text-sm font-bold px-4 py-2 rounded-full border-2 border-black text-black hover:bg-black hover:text-white transition-all">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Right */}
          <div className="md:hidden flex items-center gap-3">
            <Link href="/cart" className="relative p-2 text-gray-500">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-black text-white bg-black rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-500 hover:text-black">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}
                className={`block px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive(link.href) ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
            <div className="border-t my-2" />
            {session ? (
              <>
                <div className="px-3 py-2">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-bold">{session.user.name}</p>
                </div>
                <Link href="/my-orders"
                  className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}>
                  <Package className="h-4 w-4" /> My Orders
                </Link>
                <button
                  onClick={async () => { await authClient.signOut(); window.location.reload(); }}
                  className="w-full flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <Link href="/account/signin"
                className="block px-3 py-3 rounded-xl text-sm font-bold text-center bg-black text-white"
                onClick={() => setIsMenuOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/components/cart-context';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import AdminSidebar from '@/components/admin-sidebar';
import { Toaster } from '@/components/ui/sonner';
import { useState } from 'react';
import { SupabaseAuthListener } from '@/components/supabase-auth-listener';
import { usePathname } from 'next/navigation';

function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthListener />
      <CartProvider>
        <Layout>{children}</Layout>
        <Toaster position="top-center" richColors />
      </CartProvider>
    </QueryClientProvider>
  );
}

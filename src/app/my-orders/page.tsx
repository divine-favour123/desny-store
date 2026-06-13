'use client';

import { useQuery } from '@tanstack/react-query';
import { Package, Clock, Truck, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

function OrderDate({ date }: { date: string }) {
  const [formatted, setFormatted] = useState('');
  useEffect(() => {
    setFormatted(format(new Date(date), 'MMM dd, yyyy'));
  }, [date]);
  return <span className="font-medium">{formatted}</span>;
}

export default function MyOrdersPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isSessionPending && !session) {
      router.push('/account/signin?callbackUrl=/my-orders');
    }
  }, [session, isSessionPending, router, mounted]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      const res = await fetch('/api/orders', {
        headers: s?.access_token ? { 'Authorization': `Bearer ${s.access_token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: !!session,
  });

  if (!mounted || isSessionPending || isLoading) {
    return <div className="p-20 text-center">Loading your orders...</div>;
  }

  if (orders?.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="bg-gray-100 p-8 rounded-full w-fit mx-auto">
          <ShoppingBag size={60} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">No orders yet</h2>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          You haven't placed any orders yet. Start shopping to see your orders here!
        </p>
        <Link href="/shop">
          <Button size="lg" className="rounded-full px-12 h-14 font-bold mt-4">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'Processing':
        return <Package size={16} className="text-blue-500" />;
      case 'Shipped':
        return <Truck size={16} className="text-purple-500" />;
      case 'Delivered':
        return <CheckCircle2 size={16} className="text-green-500" />;
      default:
        return <Package size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="space-y-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">MY ORDERS</h1>
          <p className="text-gray-500">Track and manage your past and current orders.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {orders?.map((order: any) => (
            <div
              key={order.id}
              className="bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                {/* Order Meta */}
                <div className="md:w-64 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Order ID
                    </p>
                    <p className="font-bold text-lg">#DS-{order.id.toString().padStart(6, '0')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Date Placed
                    </p>
                    <OrderDate date={order.created_at} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Total Amount
                    </p>
                    <p className="font-extrabold text-xl">
                      ₦{Number(order.total).toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Badge
                      className={`px-4 py-1.5 rounded-full border flex items-center gap-2 w-fit ${getStatusColor(order.order_status)}`}
                    >
                      {getStatusIcon(order.order_status)}
                      {order.order_status}
                    </Badge>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="flex-1 space-y-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Items Ordered
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {order.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border"
                      >
                        <div className="w-12 h-16 bg-white border rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.image} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-tight">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-1 uppercase">
                            Size: {item.size} | Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="rounded-xl font-bold h-11 px-6">
                      View Order Details
                    </Button>
                    {order.payment_status === 'pending' && (
                      <Button className="rounded-xl font-bold h-11 px-6">Complete Payment</Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

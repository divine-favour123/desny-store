'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-10">
      <div className="flex flex-col items-center space-y-6">
        <div className="bg-green-50 p-6 rounded-full text-green-500 animate-bounce">
          <CheckCircle2 size={80} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          🎉 Order Placed Successfully!
        </h1>
        <p className="text-gray-500 text-lg max-w-md">
          Thank you for shopping with Desny Store. Your order has been received and is being
          processed.
        </p>
      </div>

      <div className="bg-white border rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-500 font-medium">Order ID</span>
          <span className="font-bold">#DS-{orderId?.padStart(6, '0')}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-500 font-medium">Estimated Delivery</span>
          <span className="font-bold">2–5 Business Days</span>
        </div>
        <div className="flex items-center justify-center space-x-8 pt-4">
          <div className="flex flex-col items-center gap-2">
            <Package size={24} className="text-gray-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Processing
            </span>
          </div>
          <div className="h-[2px] w-12 bg-gray-100" />
          <div className="flex flex-col items-center gap-2">
            <Truck size={24} className="text-gray-100" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-100">
              Shipping
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
        <Link href="/my-orders">
          <Button variant="outline" size="lg" className="h-14 px-8 rounded-full font-bold border-2">
            View My Orders
          </Button>
        </Link>
        <Link href="/shop">
          <Button size="lg" className="h-14 px-8 rounded-full font-bold">
            Continue Shopping <ArrowRight size={18} className="ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}

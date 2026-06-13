'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowLeft, Truck } from 'lucide-react';
import { useCart } from '@/components/cart-context';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const DELIVERY_FEES: Record<string, number> = {
  'Benin City': 1000,
  Lagos: 2500,
  Abuja: 3000,
  'Port Harcourt': 2500,
  Warri: 1500,
  Ibadan: 2500,
  Enugu: 2000,
  Owerri: 2000,
  Kano: 3500,
  'Other States': 3500,
};

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Benin City');

  const deliveryFee = DELIVERY_FEES[deliveryLocation] || 0;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="bg-gray-100 p-8 rounded-full w-fit mx-auto">
          <Truck size={60} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">Your cart is empty</h2>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Let's find some amazing styles for
          you!
        </p>
        <Link href="/shop">
          <Button size="lg" className="rounded-full px-12 h-14 font-bold mt-4">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-extrabold tracking-tight">SHOPPING BAG</h1>
          <Link href="/shop" className="text-sm font-bold flex items-center hover:underline">
            <ArrowLeft size={16} className="mr-2" /> Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex gap-6 p-6 bg-white border rounded-3xl group transition-all hover:shadow-md"
              >
                <Link
                  href={`/product/${item.id}`}
                  className="flex-shrink-0 w-24 h-32 md:w-32 md:h-40 rounded-2xl overflow-hidden bg-gray-100 border"
                >
                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                </Link>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-wider">
                        Size: {item.size}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center space-x-3 p-1 bg-gray-50 rounded-xl border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </Button>
                      <span className="w-6 text-center font-bold">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                    <p className="font-extrabold text-lg">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-3xl p-8 sticky top-24 space-y-8 shadow-sm">
              <h2 className="text-2xl font-bold">Order Summary</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-500">
                    Delivery Location
                  </label>
                  <Select value={deliveryLocation} onValueChange={setDeliveryLocation}>
                    <SelectTrigger className="h-12 rounded-xl border-gray-200">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(DELIVERY_FEES).map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-400 italic">
                    Estimated delivery: 2–5 business days
                  </p>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-black">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-black">₦{deliveryFee.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold pt-2">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Link href={`/checkout?location=${encodeURIComponent(deliveryLocation)}`}>
                <Button className="w-full h-16 rounded-2xl font-extrabold text-lg shadow-lg shadow-black/10 mt-4">
                  Proceed to Checkout
                </Button>
              </Link>

              <div className="flex items-center justify-center space-x-4 pt-4 grayscale opacity-50">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                  className="h-4"
                  alt="Visa"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                  className="h-6"
                  alt="Mastercard"
                />
                <img
                  src="https://paystack.com/assets/img/paystack-logo.png"
                  className="h-4"
                  alt="Paystack"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

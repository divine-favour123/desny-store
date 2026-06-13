'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/components/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

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

function loadPaystack(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).PaystackPop) { resolve(); return; }
    const existing = document.getElementById('paystack-inline');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.id = 'paystack-inline';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack'));
    document.head.appendChild(script);
  });
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, subtotal, clearCart } = useCart();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartChecked, setCartChecked] = useState(false);
  const redirectedRef = useRef(false);
  const prefilledRef = useRef(false);

  const initialLocation = searchParams.get('location') || 'Benin City';
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    cityState: initialLocation,
    landmark: '',
  });

  // FIX 1: Depend only on session user ID (primitive), not the whole session object
  // This stops the infinite re-render loop
  const sessionUserId = session?.user?.id;
  const sessionUserName = session?.user?.name;
  const sessionUserEmail = session?.user?.email;

  useEffect(() => {
    if (isSessionPending) return;
    if (!session) {
      if (!redirectedRef.current) {
        redirectedRef.current = true;
        toast.error('Please sign in to checkout');
        router.push(`/account/signin?callbackUrl=${encodeURIComponent('/checkout')}`);
      }
      return;
    }
    // Only prefill once using a ref guard
    if (!prefilledRef.current && sessionUserId) {
      prefilledRef.current = true;
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || sessionUserName || '',
        email: prev.email || sessionUserEmail || '',
      }));
    }
  }, [isSessionPending, sessionUserId]); // Only primitive dependency - no infinite loop

  useEffect(() => { setCartChecked(true); }, []);

  useEffect(() => {
    if (cartChecked && cart.length === 0 && !redirectedRef.current) {
      redirectedRef.current = true;
      router.push('/cart');
    }
  }, [cartChecked, cart.length, router]);

  const deliveryFee = DELIVERY_FEES[formData.cityState] ?? DELIVERY_FEES['Other States'];
  const total = subtotal + deliveryFee;

  // FIX 2: NOT async — Paystack v1 rejects async functions as invalid callbacks
  // Capture all values in a snapshot BEFORE calling PaystackPop.setup
  const handlePaystackPayment = () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
    if (!paystackKey) {
      toast.error('Paystack key missing — check your .env.local file');
      return;
    }

    setIsProcessing(true);

    // Snapshot everything NOW — the callback closure will use these stable values
    const snap = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      cityState: formData.cityState,
      landmark: formData.landmark,
      cart: cart.map((i) => ({ ...i })),
      subtotal,
      deliveryFee,
      total,
    };

    loadPaystack()
      .then(function () {
        const handler = (window as any).PaystackPop.setup({
          key: paystackKey,
          email: snap.email,
          amount: Math.round(snap.total * 100),
          currency: 'NGN',
          ref: 'DSN-' + Date.now() + '-' + Math.floor(Math.random() * 9999),

          // ✅ MUST be a plain function — NOT async
          // Paystack internally does typeof callback === 'function' AND checks it's
          // not a Promise-returning (async) function. async fails that check.
          callback: function (response: { reference: string }) {
            fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                full_name: snap.fullName,
                phone: snap.phone,
                email: snap.email,
                address: snap.address,
                city_state: snap.cityState,
                landmark: snap.landmark,
                items: snap.cart,
                subtotal: snap.subtotal,
                delivery_fee: snap.deliveryFee,
                total: snap.total,
                delivery_location: snap.cityState,
                paystack_reference: response.reference,
              }),
            })
              .then(function (res) { return res.json(); })
              .then(function (data) {
                if (data.id) {
                  clearCart();
                  router.push('/confirmation?id=' + data.id);
                } else {
                  toast.error('Payment received but order failed to save. Ref: ' + response.reference);
                  setIsProcessing(false);
                }
              })
              .catch(function () {
                toast.error('Order save failed. Contact support with ref: ' + response.reference);
                setIsProcessing(false);
              });
          },

          onClose: function () {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          },
        });

        handler.openIframe();
      })
      .catch(function () {
        toast.error('Could not load Paystack. Check your internet connection.');
        setIsProcessing(false);
      });
  };

  if (isSessionPending || !cartChecked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || cart.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Delivery Form */}
        <div className="space-y-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Delivery Details</h1>
            <p className="text-gray-500 text-sm">Fill in your delivery information accurately.</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-bold uppercase tracking-wider text-xs">Full Name</Label>
                <Input id="fullName" className="h-12 rounded-xl border-gray-200"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-bold uppercase tracking-wider text-xs">Phone Number</Label>
                <Input id="phone" placeholder="08012345678" className="h-12 rounded-xl border-gray-200"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold uppercase tracking-wider text-xs">Email Address</Label>
              <Input id="email" type="email" className="h-12 rounded-xl border-gray-200"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="font-bold uppercase tracking-wider text-xs">Delivery Address</Label>
              <Textarea id="address" placeholder="No. 12, Example Street, Near Landmark"
                className="min-h-[100px] rounded-xl border-gray-200"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cityState" className="font-bold uppercase tracking-wider text-xs">City / State</Label>
                <select id="cityState"
                  className="w-full h-12 px-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  value={formData.cityState}
                  onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}>
                  {Object.keys(DELIVERY_FEES).map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="landmark" className="font-bold uppercase tracking-wider text-xs">Landmark (Optional)</Label>
                <Input id="landmark" placeholder="e.g. Opposite Big Church" className="h-12 rounded-xl border-gray-200"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 border rounded-3xl p-8 lg:p-10 space-y-8 h-fit lg:sticky lg:top-24">
          <h2 className="text-xl font-extrabold tracking-tight">Order Summary</h2>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-16 h-20 bg-white border rounded-xl overflow-hidden flex-shrink-0">
                    {item.image && <img src={item.image} className="w-full h-full object-cover" alt={item.name} />}
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase">Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-bold text-sm whitespace-nowrap">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Subtotal</span>
              <span className="font-bold text-black">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Delivery — {formData.cityState}</span>
              <span className="font-bold text-black">₦{deliveryFee.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-extrabold pt-1">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
          </div>

          <Button
            onClick={handlePaystackPayment}
            disabled={isProcessing}
            className="w-full h-14 rounded-2xl font-extrabold text-base bg-black text-white hover:bg-gray-900"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : `Pay ₦${total.toLocaleString()} with Paystack`}
          </Button>

          <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
            🔒 Secured by Paystack
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

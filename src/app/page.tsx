'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/product-card';

export default function HomePage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const res = await fetch('/api/products?limit=8');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  return (
    <div className="flex flex-col">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-40"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Badge */}
        <div className="absolute top-6 right-6 z-10">
          <span className="border border-white/20 text-white text-[10px] px-3 py-1.5 rounded-full backdrop-blur-sm bg-white/5 tracking-widest uppercase font-bold">
            New Collection 2026
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-6 md:px-16 pb-16 md:pb-24">
          <p className="text-gray-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Desny Store — Premium Fashion
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter mb-6">
            WEAR YOUR<br />
            <span className="text-white/60">CONFIDENCE.</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-md mb-8 leading-relaxed">
            Bold designs. Authentic quality. Delivered across Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/shop">
              <Button className="h-12 px-8 rounded-full font-bold text-sm bg-white text-black hover:bg-gray-100 border-0">
                Shop Now
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="h-12 px-8 rounded-full font-bold text-sm border-white/30 text-white bg-transparent hover:bg-white/10">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="bg-black border-y border-white/10 py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-8 px-4">
              <span className="text-[10px] font-black text-white/70 tracking-[0.2em] uppercase">Free Delivery Above ₦30,000</span>
              <span className="text-white/30 font-black">✦</span>
              <span className="text-[10px] font-black text-white/70 tracking-[0.2em] uppercase">New Arrivals Weekly</span>
              <span className="text-white/30 font-black">✦</span>
              <span className="text-[10px] font-black text-white/70 tracking-[0.2em] uppercase">Authentic Quality</span>
              <span className="text-white/30 font-black">✦</span>
              <span className="text-[10px] font-black text-white/70 tracking-[0.2em] uppercase">Pay With Paystack</span>
              <span className="text-white/30 font-black">✦</span>
            </div>
          ))}
        </div>
        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: fit-content;
            animation: marquee 30s linear infinite;
          }
        `}</style>
      </div>

      {/* ── NEW ARRIVALS ── */}
      <section className="py-16 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gray-400 text-xs font-bold tracking-[0.3em] uppercase mb-1">Just Dropped</p>
              <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">New Arrivals</h2>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-1 text-sm font-bold text-black hover:text-gray-500 transition-colors group">
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl" />
                  <div className="h-3 w-3/4 bg-gray-100 animate-pulse rounded" />
                  <div className="h-3 w-1/3 bg-gray-100 animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : products?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.images?.[0] || ''}
                  sizes={product.sizes || []}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-3xl">
              <p className="text-4xl mb-3">👗</p>
              <p className="font-bold text-gray-800">Products coming soon</p>
              <p className="text-gray-400 text-sm mt-1">The admin is adding new pieces</p>
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <Link href="/shop">
              <Button variant="outline" className="rounded-full px-12 h-12 font-bold border-2 border-black text-black hover:bg-black hover:text-white transition-all">
                View Full Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-16 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <p className="text-gray-400 text-xs font-bold tracking-[0.3em] uppercase mb-2">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">The Desny Difference</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <ShieldCheck size={22} />, title: 'Authentic Quality', desc: 'Every item carefully selected for quality and style.' },
              { icon: <Truck size={22} />, title: 'Nationwide Delivery', desc: 'We deliver to all 36 states across Nigeria.' },
              { icon: <Lock size={22} />, title: 'Secure Payments', desc: 'Pay safely with Paystack — card, transfer, or USSD.' },
              { icon: <RotateCcw size={22} />, title: 'Easy Returns', desc: 'Not satisfied? Contact us within 7 days.' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-start gap-4 p-6 bg-white rounded-2xl border">
                <div className="p-3 bg-black text-white rounded-xl">{item.icon}</div>
                <div>
                  <h3 className="font-extrabold text-black mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-black py-20 px-6 text-center">
        <div className="max-w-xl mx-auto space-y-5">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Ready to Express Yourself?
          </h2>
          <p className="text-gray-400">Browse our full collection and find pieces that tell your story.</p>
          <Link href="/shop">
            <Button className="rounded-full px-10 h-12 font-bold text-sm bg-white text-black hover:bg-gray-100 border-0 mt-2">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}

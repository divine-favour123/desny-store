'use client';

import { ShieldCheck, Truck, RotateCcw, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-black text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            We Are Desny Store — Fashion That Speaks For You
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Making quality fashion accessible to every Nigerian.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Desny Store was born from a simple belief: everyone deserves to look good without
              spending a fortune. We are a Nigerian fashion brand dedicated to bringing you stylish,
              high-quality clothing for every occasion — from casual everyday wear to sharp native
              and corporate outfits.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Based in Nigeria and delivering nationwide, we are passionate about fashion, quality,
              and customer satisfaction. We carefully source every fabric and curate every design to
              ensure you get nothing but the best.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed text-lg italic">
              "To make quality fashion accessible to every Nigerian — delivered fast, priced right,
              and always on trend."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden shadow-xl translate-y-8">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-[3/4] bg-gray-200 rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-24 border-y">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 underline decoration-4 decoration-black underline-offset-8">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              {
                title: 'Quality',
                icon: ShieldCheck,
                text: 'We never compromise on the quality of our fabrics and finished items.',
              },
              {
                title: 'Authenticity',
                icon: Heart,
                text: 'Original designs and authentic materials sourced with integrity.',
              },
              {
                title: 'Speed',
                icon: Truck,
                text: 'We value your time. Our delivery network is optimized for nationwide speed.',
              },
              {
                title: 'Customer First',
                icon: RotateCcw,
                text: 'Your satisfaction is our priority. We are here to serve you every step of the way.',
              },
            ].map((v) => (
              <div key={v.title} className="text-center space-y-4">
                <div className="p-4 bg-white shadow-sm rounded-2xl w-fit mx-auto">
                  <v.icon size={32} />
                </div>
                <h3 className="text-xl font-bold">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

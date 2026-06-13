'use client';

import { use, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/cart-context';
import { toast } from 'sonner';
import Link from 'next/link';
import ProductCard from '@/components/product-card';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      return res.json();
    },
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', id],
    queryFn: async () => {
      const res = await fetch('/api/products?limit=4');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: !!product,
  });

  useEffect(() => {
    if (product?.sizes?.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-100 animate-pulse rounded-3xl" />
        <div className="space-y-6">
          <div className="h-10 w-3/4 bg-gray-100 animate-pulse rounded" />
          <div className="h-6 w-1/4 bg-gray-100 animate-pulse rounded" />
          <div className="h-32 w-full bg-gray-100 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!product) return <div className="py-20 text-center">Product not found</div>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
      });
    }
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] relative overflow-hidden rounded-3xl bg-gray-100 border">
            <img
              src={product.images[activeImage]}
              className="h-full w-full object-cover object-center"
              alt={product.name}
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`flex-shrink-0 w-24 h-24 rounded-xl border-2 transition-all overflow-hidden ${
                  activeImage === idx ? 'border-black' : 'border-transparent'
                }`}
              >
                <img src={img} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="space-y-4 pb-8 border-b">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-extrabold tracking-tight">{product.name}</h1>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 size={20} />
              </Button>
            </div>
            <p className="text-3xl font-bold">₦{Number(product.price).toLocaleString()}</p>
            <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
          </div>

          <div className="py-8 space-y-6">
            {/* Sizes */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold uppercase tracking-wider text-sm">Select Size</h3>
                <button className="text-sm font-medium underline text-gray-500">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-14 w-14 rounded-xl border-2 font-bold text-sm transition-all ${
                      selectedSize === size
                        ? 'bg-black text-white border-black shadow-lg scale-105'
                        : 'bg-white text-gray-500 border-gray-100 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-4">
              <h3 className="font-bold uppercase tracking-wider text-sm">Quantity</h3>
              <div className="flex items-center space-x-4 w-fit p-1 bg-gray-50 rounded-2xl border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus size={18} />
                </Button>
                <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus size={18} />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 h-16 rounded-2xl font-extrabold text-lg gap-2"
              >
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                size="lg"
                variant="outline"
                className="flex-1 h-16 rounded-2xl font-extrabold text-lg border-2 hover:bg-black hover:text-white"
              >
                Buy Now
              </Button>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-gray-400" />
              <span className="text-sm font-medium">Fast Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-gray-400" />
              <span className="text-sm font-medium">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw size={20} className="text-gray-400" />
              <span className="text-sm font-medium">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-24">
          <h2 className="text-3xl font-bold mb-12">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts
              .filter((p: any) => p.id !== product.id)
              .slice(0, 4)
              .map((p: any) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  image={p.images[0]}
                  sizes={p.sizes}
                />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/cart-context';
import { toast } from 'sonner';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  sizes: string[];
}

export default function ProductCard({ id, name, price, image, sizes }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, price, image, size: sizes[0] || 'Free Size' });
    toast.success(`${name} added to cart!`);
  };

  return (
    <div className="group relative bg-white border rounded-xl overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/product/${id}`}>
        <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
          <button
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-black line-clamp-1">
            {name}
          </h3>

          <div className="flex flex-wrap gap-1 mt-1">
            {sizes.slice(0, 3).map((size) => (
              <Badge
                key={size}
                variant="secondary"
                className="text-[10px] px-1.5 py-0 min-w-[20px] justify-center"
              >
                {size}
              </Badge>
            ))}
            {sizes.length > 3 && (
              <span className="text-[10px] text-gray-400">+{sizes.length - 3}</span>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-base font-bold text-black">
              ₦{Number(price).toLocaleString()}
            </span>
            <Button
              size="sm"
              variant="default"
              className="h-8 w-8 p-0 rounded-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}

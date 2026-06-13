'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/product-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'];

export default function ShopPage() {
  const [search, setSearch] = useState('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sort, setSort] = useState('newest');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', search, selectedSize, sort],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedSize) params.append('size', selectedSize);
      if (sort) params.append('sort', sort);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">SHOP WITH US</h1>
          <p className="text-gray-500">Explore our latest collection of premium quality fashion.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border shadow-sm sticky top-20 z-30">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search products..."
              className="pl-10 h-11 bg-gray-50 border-none rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full lg:w-[180px] h-11 bg-gray-50 border-none rounded-xl">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price Low-High</SelectItem>
                <SelectItem value="price-high">Price High-Low</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="h-11 rounded-xl flex items-center lg:hidden flex-1"
            >
              <SlidersHorizontal size={18} className="mr-2" /> Filters
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 space-y-8 flex-shrink-0">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Filter by Size</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSize(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    !selectedSize
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                  }`}
                >
                  All
                </button>
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-[4/5] bg-gray-100 animate-pulse rounded-xl" />
                    <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
                    <div className="h-4 w-1/4 bg-gray-100 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : products?.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="bg-gray-100 p-6 rounded-full w-fit mx-auto">
                  <Search size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch('');
                    setSelectedSize(null);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.images?.[0] || 'https://via.placeholder.com/400x500'}
                    sizes={product.sizes || []}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

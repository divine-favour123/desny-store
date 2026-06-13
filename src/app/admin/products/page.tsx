'use client';
import { AdminGuard } from '@/components/admin-guard';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Plus, Pencil, Trash2, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import useUpload from '@/utils/useUpload';
import { adminFetch } from '@/lib/admin-fetch';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'];

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [upload, { loading: isUploading }] = useUpload();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sizes: [] as string[],
    images: [] as string[],
    in_stock: true,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await adminFetch('/api/admin/products');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const productMutation = useMutation({
    mutationFn: async (data: any) => {
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await adminFetch('/api/admin/products', {
        method,
        body: JSON.stringify(editingProduct ? { ...data, id: editingProduct.id } : data),
      });
      if (!res.ok) throw new Error('Operation failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsModalOpen(false);
      resetForm();
      toast.success(editingProduct ? 'Product updated' : 'Product created');
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await adminFetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      sizes: [],
      images: [],
      in_stock: true,
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      sizes: product.sizes || [],
      images: product.images || [],
      in_stock: product.in_stock,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const result = await upload({ file: files[i] });
      if ('url' in result) {
        setFormData((prev) => ({ ...prev, images: [...prev.images, result.url] }));
      }
    }
  };

  const removeImage = (url: string) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((img) => img !== url) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    productMutation.mutate(formData);
  };

  return (
    <div className="p-8 space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Products</h1>
          <p className="text-gray-500 mt-1">Manage your store's inventory and details.</p>
        </div>
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2 h-11 px-6 shadow-lg shadow-black/5">
              <Plus size={18} /> Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-widest text-[10px]">
                    Product Name
                  </Label>
                  <Input
                    required
                    className="h-12 rounded-xl"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-widest text-[10px]">
                    Price (₦)
                  </Label>
                  <Input
                    type="number"
                    required
                    className="h-12 rounded-xl"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold uppercase tracking-widest text-[10px]">
                  Description
                </Label>
                <Textarea
                  className="min-h-[100px] rounded-xl"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <Label className="font-bold uppercase tracking-widest text-[10px]">
                  Sizes Available
                </Label>
                <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-xl border border-dashed">
                  {SIZES.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={formData.sizes.includes(size)}
                        onCheckedChange={(checked) => {
                          if (checked)
                            setFormData({ ...formData, sizes: [...formData.sizes, size] });
                          else
                            setFormData({
                              ...formData,
                              sizes: formData.sizes.filter((s) => s !== size),
                            });
                        }}
                      />
                      <Label htmlFor={`size-${size}`} className="text-sm font-medium">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="font-bold uppercase tracking-widest text-[10px]">
                  Product Images
                </Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {formData.images.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square group rounded-xl overflow-hidden border bg-gray-50"
                    >
                      <img src={url} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    {isUploading ? (
                      <Loader2 className="animate-spin text-gray-400" />
                    ) : (
                      <ImageIcon className="text-gray-400" />
                    )}
                    <span className="text-[10px] font-bold mt-2 text-gray-400 uppercase tracking-widest">
                      Upload
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="in_stock"
                  checked={formData.in_stock}
                  onCheckedChange={(checked) => setFormData({ ...formData, in_stock: !!checked })}
                />
                <Label htmlFor="in_stock" className="font-bold">
                  Product is In Stock
                </Label>
              </div>

              <DialogFooter className="pt-6">
                <Button
                  type="submit"
                  disabled={productMutation.isPending || isUploading}
                  className="w-full h-14 rounded-2xl font-extrabold text-lg"
                >
                  {productMutation.isPending
                    ? 'Saving...'
                    : editingProduct
                      ? 'Update Product'
                      : 'Create Product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-20 font-bold text-xs uppercase tracking-widest">
                Image
              </TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">Name</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">Price</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">Sizes</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">Status</TableHead>
              <TableHead className="text-right font-bold text-xs uppercase tracking-widest">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="w-12 h-12 bg-gray-100 animate-pulse rounded-lg" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-16 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-16 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                    <TableCell />
                  </TableRow>
                ))
              : products?.map((product: any) => (
                  <TableRow key={product.id} className="group">
                    <TableCell>
                      <img
                        src={product.images?.[0]}
                        className="w-12 h-12 object-cover rounded-lg border bg-gray-50"
                      />
                    </TableCell>
                    <TableCell className="font-bold">{product.name}</TableCell>
                    <TableCell className="font-medium text-gray-500">
                      ₦{Number(product.price).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes?.map((s: string) => (
                          <Badge key={s} variant="secondary" className="text-[10px] px-1 py-0">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          product.in_stock
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }
                      >
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this product?')) {
                              deleteMutation.mutate(product.id);
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

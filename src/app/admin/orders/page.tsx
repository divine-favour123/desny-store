'use client';

import { adminFetch } from '@/lib/admin-fetch';
import { AdminGuard } from '@/components/admin-guard';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingBag, Eye, Phone, MapPin, Calendar, CreditCard, ChevronDown } from 'lucide-react';
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

function FormattedDate({ date }: { date: string }) {
  const [formatted, setFormatted] = useState('');
  useEffect(() => {
    if (date) setFormatted(format(new Date(date), 'MMM dd, yyyy'));
  }, [date]);
  return <>{formatted}</>;
}

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders', selectedStatus],
    queryFn: async () => {
      const res = await adminFetch(`/api/admin/orders?status=${selectedStatus}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await adminFetch('/api/admin/orders', {
        method: 'PATCH',
        body: JSON.stringify({ id, order_status: status }),
      });
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
    },
  });

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
    <div className="p-8 space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Orders</h1>
          <p className="text-gray-500 mt-1">Manage customer orders and delivery tracking.</p>
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px] h-11 rounded-xl bg-white border-gray-200">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Orders</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold text-xs uppercase tracking-widest">
                Order ID
              </TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">
                Customer
              </TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">Date</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">Total</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">Payment</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">Status</TableHead>
              <TableHead className="text-right font-bold text-xs uppercase tracking-widest">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="h-4 w-20 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-16 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-16 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-16 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                    <TableCell />
                  </TableRow>
                ))
              : orders?.map((order: any) => (
                  <TableRow key={order.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-bold">
                      #DS-{order.id.toString().padStart(6, '0')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{order.full_name}</span>
                        <span className="text-xs text-gray-400">{order.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {mounted ? <FormattedDate date={order.created_at} /> : '...'}
                    </TableCell>
                    <TableCell className="font-bold">
                      ₦{Number(order.total).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={order.payment_status === 'paid' ? 'default' : 'secondary'}
                        className="rounded-full text-[10px] uppercase font-bold px-2 py-0"
                      >
                        {order.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={order.order_status}
                        onValueChange={(status) => statusMutation.mutate({ id: order.id, status })}
                      >
                        <SelectTrigger
                          className={`h-8 rounded-full text-xs font-bold px-3 border-none shadow-none ${getStatusColor(order.order_status)}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-3xl overflow-y-auto max-h-[90vh]">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                              Order Details{' '}
                              <Badge className={getStatusColor(order.order_status)}>
                                {order.order_status}
                              </Badge>
                            </DialogTitle>
                          </DialogHeader>

                          <div className="space-y-8 py-6">
                            {/* Summary Header */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-2xl border">
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                  <Calendar size={10} /> Date
                                </p>
                                <p className="text-sm font-bold">
                                  {mounted ? <FormattedDate date={order.created_at} /> : '...'}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                  <CreditCard size={10} /> Payment
                                </p>
                                <p className="text-sm font-bold uppercase">
                                  {order.payment_status}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  Reference
                                </p>
                                <p className="text-[10px] font-medium break-all">
                                  {order.paystack_reference || 'N/A'}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  Items
                                </p>
                                <p className="text-sm font-bold">
                                  {Array.isArray(order.items) ? order.items.length : JSON.parse(order.items).length} Product(s)
                                </p>
                              </div>
                            </div>

                            {/* Customer Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                                  Customer Info
                                </h3>
                                <div className="space-y-3">
                                  <p className="font-bold flex items-center gap-2 text-lg">
                                    {order.full_name}
                                  </p>
                                  <p className="text-gray-500 flex items-center gap-2">
                                    <Phone size={14} /> {order.phone}
                                  </p>
                                  <p className="text-gray-500 flex items-center gap-2">
                                    <ShoppingBag size={14} /> {order.email}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                                  Delivery Address
                                </h3>
                                <div className="space-y-2">
                                  <p className="text-gray-700 font-medium flex items-start gap-2">
                                    <MapPin size={16} className="mt-1 flex-shrink-0" />
                                    {order.address}, {order.city_state}
                                  </p>
                                  {order.landmark && (
                                    <p className="text-xs text-gray-500 italic ml-6">
                                      Landmark: {order.landmark}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <Separator />

                            {/* Items */}
                            <div className="space-y-4">
                              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                                Ordered Items
                              </h3>
                              <div className="space-y-3">
                                {Array.isArray(order.items) ? order.items.map : JSON.parse(order.items).map((item: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center bg-white p-3 border rounded-xl"
                                  >
                                    <div className="flex gap-4 items-center">
                                      <div className="w-12 h-16 bg-gray-50 rounded-lg overflow-hidden border">
                                        <img
                                          src={item.image}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div>
                                        <p className="font-bold text-sm">{item.name}</p>
                                        <p className="text-xs text-gray-500 uppercase">
                                          Size: {item.size} | Qty: {item.quantity}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="font-bold">
                                      ₦{(item.price * item.quantity).toLocaleString()}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-gray-50 p-6 rounded-2xl border space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-bold">
                                  ₦{Number(order.subtotal).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Delivery Fee</span>
                                <span className="font-bold">
                                  ₦{Number(order.delivery_fee).toLocaleString()}
                                </span>
                              </div>
                              <Separator className="bg-gray-200" />
                              <div className="flex justify-between text-xl font-extrabold pt-2">
                                <span>Total</span>
                                <span>₦{Number(order.total).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

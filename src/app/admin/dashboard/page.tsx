'use client';

import { adminFetch } from '@/lib/admin-fetch';

import { AdminGuard } from '@/components/admin-guard';
import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingBag, TrendingUp, ArrowUpRight, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useState, useEffect } from 'react';

function DashboardContent() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await adminFetch('/api/admin/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-6 md:p-8 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products">
            <Button className="rounded-xl gap-2 h-11 px-6">
              <Plus size={18} /> Add Product
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="outline" className="rounded-xl h-11 px-6">View Orders</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: stats?.total_products ?? 0, icon: <Package size={20} />, color: 'text-blue-600' },
          { label: 'Total Orders', value: stats?.total_orders ?? 0, icon: <ShoppingBag size={20} />, color: 'text-green-600' },
          { label: 'Pending Orders', value: stats?.pending_orders ?? 0, icon: <Clock size={20} />, color: 'text-yellow-600' },
          { label: 'Total Revenue', value: `₦${(stats?.total_revenue ?? 0).toLocaleString()}`, icon: <TrendingUp size={20} />, color: 'text-purple-600' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className={`mb-3 ${stat.color}`}>{stat.icon}</div>
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              View All <ArrowUpRight size={14} />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats?.recent_orders?.length > 0 ? stats.recent_orders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}…</TableCell>
                  <TableCell className="font-medium">{order.full_name}</TableCell>
                  <TableCell>
                    {Array.isArray(order.items) ? order.items.length : (typeof order.items === 'string' ? JSON.parse(order.items).length : 0)} item(s)
                  </TableCell>
                  <TableCell className="font-bold">₦{Number(order.total).toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 text-xs">
                    {mounted ? new Date(order.created_at).toLocaleDateString() : '...'}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">No orders yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}

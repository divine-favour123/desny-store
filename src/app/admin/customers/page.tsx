'use client';

import { adminFetch } from '@/lib/admin-fetch';
import { AdminGuard } from '@/components/admin-guard';

import { useQuery } from '@tanstack/react-query';
import { Users, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

function FormattedDate({ date }: { date: string }) {
  const [formatted, setFormatted] = useState('');
  useEffect(() => {
    if (date) setFormatted(format(new Date(date), 'MMM dd, yyyy'));
  }, [date]);
  return <>{formatted}</>;
}

export default function AdminCustomersPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const res = await adminFetch('/api/admin/customers');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  return (
    <div className="p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Customers</h1>
        <p className="text-gray-500 mt-1">View and manage your registered customers.</p>
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold text-xs uppercase tracking-widest">Name</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">Email</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">Phone</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">
                Joined Date
              </TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest">
                Total Orders
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-40 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-12 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))
              : customers?.map((customer: any, idx: number) => (
                  <TableRow key={idx} className="hover:bg-gray-50/50">
                    <TableCell className="font-bold">{customer.full_name}</TableCell>
                    <TableCell className="text-gray-500 font-medium">
                      <div className="flex items-center gap-2 italic">
                        <Mail size={14} /> {customer.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Phone size={14} /> {customer.phone || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {mounted ? <FormattedDate date={customer.created_at} /> : '...'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-bold">
                        <ShoppingBag size={14} className="text-gray-400" />
                        {customer.total_orders}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            {customers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-gray-400">
                  <Users size={40} className="mx-auto mb-4 opacity-20" />
                  No customers found yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

'use client';

import { adminFetch } from '@/lib/admin-fetch';
import { AdminGuard } from '@/components/admin-guard';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Mail, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';

function FormattedDate({ date }: { date: string }) {
  const [formatted, setFormatted] = useState('');
  useEffect(() => {
    if (date) setFormatted(format(new Date(date), 'MMM dd, yyyy HH:mm'));
  }, [date]);
  return <>{formatted}</>;
}

export default function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const res = await adminFetch('/api/admin/messages');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const readMutation = useMutation({
    mutationFn: async ({ id, is_read }: { id: number; is_read: boolean }) => {
      const res = await adminFetch('/api/admin/messages', {
        method: 'PATCH',
        body: JSON.stringify({ id, is_read }),
      });
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    },
  });

  return (
    <div className="p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Messages</h1>
        <p className="text-gray-500 mt-1">Customer inquiries and feedback from the contact form.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading
          ? [1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-3xl" />
            ))
          : messages?.map((msg: any) => (
              <div
                key={msg.id}
                className={`bg-white border rounded-3xl p-8 shadow-sm transition-all hover:shadow-md ${!msg.is_read ? 'border-l-4 border-l-black' : ''}`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      {!msg.is_read ? (
                        <Circle className="fill-black text-black" size={8} />
                      ) : (
                        <CheckCircle2 className="text-green-500" size={16} />
                      )}
                      <h3 className="font-extrabold text-xl">{msg.subject}</h3>
                    </div>

                    <p className="text-gray-600 leading-relaxed italic">"{msg.message}"</p>

                    <div className="flex flex-wrap gap-6 pt-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <Mail size={14} /> {msg.name} ({msg.email})
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <Calendar size={14} />{' '}
                        {mounted ? <FormattedDate date={msg.created_at} /> : '...'}
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-3 justify-end">
                    <Button
                      variant={msg.is_read ? 'outline' : 'default'}
                      className="rounded-xl h-11 px-6 font-bold"
                      onClick={() => readMutation.mutate({ id: msg.id, is_read: !msg.is_read })}
                    >
                      {msg.is_read ? 'Mark as Unread' : 'Mark as Read'}
                    </Button>
                    <Button variant="ghost" className="text-red-500 font-bold h-11 px-6">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        {messages?.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="bg-gray-100 p-8 rounded-full w-fit mx-auto">
              <MessageSquare size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold">No messages yet</h3>
            <p className="text-gray-500">Inquiries from the contact form will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

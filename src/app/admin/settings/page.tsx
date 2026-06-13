'use client';

import { adminFetch } from '@/lib/admin-fetch';
import { AdminGuard } from '@/components/admin-guard';

import { useState } from 'react';
import { Settings, Shield, Store, Mail, Phone, MapPin, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: 'Desny Store',
    email: 'support@desnystore.com',
    phone: '+234 800 000 0000',
    address: 'No. 5, Fashion Avenue, Ring Road, Benin City, Edo State, Nigeria',
  });

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };

  return (
    <div className="p-8 space-y-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-1">
          Configure your store information and admin preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Store Info */}
        <div className="bg-white border rounded-3xl p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Store className="text-black" size={24} />
            <h2 className="text-xl font-bold">Store Information</h2>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-bold uppercase tracking-widest text-[10px]">Store Name</Label>
              <Input
                className="h-12 rounded-xl"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold uppercase tracking-widest text-[10px]">
                Contact Email
              </Label>
              <Input
                className="h-12 rounded-xl"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold uppercase tracking-widest text-[10px]">
                Contact Phone
              </Label>
              <Input
                className="h-12 rounded-xl"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold uppercase tracking-widest text-[10px]">
                Store Address
              </Label>
              <Input
                className="h-12 rounded-xl"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white border rounded-3xl p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Shield className="text-black" size={24} />
            <h2 className="text-xl font-bold">Admin Security</h2>
          </div>
          <Separator />
          <div className="space-y-4">
            <p className="text-sm text-gray-500 italic">
              To change your admin password, please use the account security settings.
            </p>
            <Button variant="outline" className="rounded-xl font-bold">
              Manage Admin Password
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="h-14 px-10 rounded-2xl font-extrabold text-lg gap-2 shadow-xl shadow-black/10"
          >
            {isLoading ? 'Saving...' : 'Save Settings'} <Save size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}

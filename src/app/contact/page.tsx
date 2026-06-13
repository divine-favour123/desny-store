'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Message sent! We'll get back to you soon.");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Info */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight">Get In Touch With Us</h1>
            <p className="text-xl text-gray-500 max-w-md">
              Have a question or complaint? We'd love to hear from you. We typically respond within 24 hours.
            </p>
          </div>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Call Us</h3>
                <p className="text-gray-500">+234 800 000 0000</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Email Us</h3>
                <p className="text-gray-500">support@desnystore.com</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Our Location</h3>
                <p className="text-gray-500">No. 5, Fashion Avenue, Ring Road, Benin City, Edo State, Nigeria</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Business Hours</h3>
                <p className="text-gray-500">Mon–Sat, 8:00 AM – 7:00 PM</p>
              </div>
            </div>
          </div>
          <div className="pt-8 flex gap-6">
            <a href="#" className="h-14 w-14 rounded-2xl bg-black text-white flex items-center justify-center hover:scale-110 transition-transform">
              <InstagramIcon />
            </a>
            <a href="#" className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition-transform">
              <FacebookIcon />
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
          <h2 className="text-3xl font-bold">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-bold uppercase tracking-widest text-xs">Full Name</Label>
              <Input id="name" required className="h-14 rounded-2xl border-gray-100 bg-gray-50/50" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold uppercase tracking-widest text-xs">Email Address</Label>
              <Input id="email" type="email" required className="h-14 rounded-2xl border-gray-100 bg-gray-50/50" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject" className="font-bold uppercase tracking-widest text-xs">Subject</Label>
              <Input id="subject" required className="h-14 rounded-2xl border-gray-100 bg-gray-50/50" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="font-bold uppercase tracking-widest text-xs">Your Message</Label>
              <Textarea id="message" required className="min-h-[150px] rounded-2xl border-gray-100 bg-gray-50/50" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full h-16 rounded-2xl font-extrabold text-lg gap-3">
              {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={20} />
            </Button>
          </form>
        </div>
      </div>

      {/* Map */}
      <section className="mt-24 rounded-3xl overflow-hidden h-[450px] border relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126938.82582846872!2d5.539343868615454!3d6.350819129596328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1040d367469796d3%3A0xf6398904323c914e!2sBenin%20City!5e0!3m2!1sen!2sng!4v1717758000000!5m2!1sen!2sng"
          width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute bottom-8 left-8 bg-white p-6 rounded-2xl shadow-xl border md:max-w-sm">
          <p className="font-bold text-lg mb-2">Our Store Location</p>
          <p className="text-gray-500 text-sm">We are located in the heart of Benin City. Visit us for an in-person experience!</p>
        </div>
      </section>
    </div>
  );
}

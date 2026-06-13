'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-gray-50 border-t py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand & Tagline */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">DESNYHUB</h2>
          <p className="text-gray-500 text-sm italic">"Wear Your Confidence."</p>
          <div className="flex space-x-4 pt-4">
            <a href="#" className="text-gray-400 hover:text-black transition-colors">
              <InstagramIcon />
            </a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors">
              <FacebookIcon />
            </a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors">
              <XIcon />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-black">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-black">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-black">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-black">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/my-orders" className="hover:text-black">
                My Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Contact Info</h3>
          <ul className="space-y-4 text-sm text-gray-500">
            <li className="flex items-start">
              <MapPin size={18} className="mr-2 flex-shrink-0" />
              <span>No. 5, DESNY ROAD, Ring Road, Benin City, Edo State, Nigeria</span>
            </li>
            <li className="flex items-center">
              <Phone size={18} className="mr-2 flex-shrink-0" />
              <span>+234 800 000 0000</span>
            </li>
            <li className="flex items-center">
              <Mail size={18} className="mr-2 flex-shrink-0" />
              <span>support@desnystore.com</span>
            </li>
          </ul>
        </div>

        {/* Support Hours */}
        <div>
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Support Hours</h3>
          <p className="text-sm text-gray-500">Mon–Sat: 8:00 AM – 7:00 PM</p>
          <p className="text-sm text-gray-500 mt-2 italic">We respond within 24 hours.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t text-center text-gray-400 text-xs">
        <p>© 2025 Desny Store. All Rights Reserved. | Powered by Paystack</p>
        <p className="mt-2">Built with passion in Nigeria 🇳🇬</p>
      </div>
    </footer>
  );
}

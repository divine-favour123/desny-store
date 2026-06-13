import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './global.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Desny Store | Premium Fashion',
  description: 'Wear Your Confidence. Shop the best premium fashion in Nigeria.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

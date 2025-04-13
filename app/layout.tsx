import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import NProgressWrapper from '@/app/components/NProgressWrapper';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AppScuola - Studia Smarter, Non Harder',
  description: 'La rivoluzionaria PWA per studenti con funzionalità avanzate di apprendimento',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AppScuola',
  },
};

export const viewport = {
  themeColor: '#6c3eb7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          <NProgressWrapper>
            {children}
          </NProgressWrapper>
        </Providers>
      </body>
    </html>
  );
} 
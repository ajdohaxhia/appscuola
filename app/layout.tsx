import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import NProgressWrapper from '@/app/components/NProgressWrapper';
import type { Metadata } from 'next';
import ServiceWorkerRegistration from './components/ServiceWorkerRegistration';
import ViewportHandler from './components/ViewportHandler';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AppScuola',
  description: 'La tua app per la scuola',
  manifest: '/manifest.json',
  themeColor: '#ffffff',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AppScuola',
  },
  formatDetection: {
    telephone: false,
  },
  applicationName: 'AppScuola',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="AppScuola" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AppScuola" />
        <meta name="description" content="L'app PWA definitiva per studenti: organizzati e studia in modo innovativo con appunti, mappe mentali, flashcards, calendario e assistente AI." />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} app-container`}>
        <div className="main-content">
          <Providers>
            <NProgressWrapper>
              {children}
            </NProgressWrapper>
          </Providers>
        </div>
        <ServiceWorkerRegistration />
        <ViewportHandler />
      </body>
    </html>
  );
} 
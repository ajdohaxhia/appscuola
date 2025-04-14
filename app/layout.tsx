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
  themeColor: '#4F46E5',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
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
        <meta name="application-name" content="AppScuola" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AppScuola" />
        <meta name="description" content="L'app PWA definitiva per studenti: organizzati e studia in modo innovativo con appunti, mappe mentali, flashcards, calendario e assistente AI." />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#3b82f6" />
        
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                      console.log('ServiceWorker registration successful');
                    })
                    .catch(err => {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                });
              }
            `,
          }}
        />
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
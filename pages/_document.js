import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="application-name" content="AppScuola" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AppScuola" />
        <meta name="description" content="L'app PWA definitiva per studenti dell'istituto tecnico" />
        <meta name="theme-color" content="#005fa3" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 
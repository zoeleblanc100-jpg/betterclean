import React from "react"
import type { Metadata } from 'next'
import { Poppins, Playfair_Display } from 'next/font/google'
import Providers from "@/components/providers"

import './globals.css'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans'
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif'
})

export const metadata: Metadata = {
  title: {
    default: 'Purrball - Jouets Premium pour Chats | Accessoires Chat Canada',
    template: '%s | Purrball',
  },
  description: 'Boutique en ligne de jouets pour chat, fontaines a eau et accessoires premium. Livraison gratuite au Canada. Jouets interactifs, fournitures chat, produits naturels. Satisfaction garantie.',
  keywords: [
    'jouets pour chat', 'jouets chat interactifs', 'accessoires chat', 'fontaine eau chat',
    'jouets stimulants chat', 'balle jouet chat', 'produits chat Canada', 'fournitures chat',
    'jouets pour chat interieur', 'jouets pour chaton', 'produits naturels pour chat',
    'boutique chat en ligne Quebec', 'livraison gratuite chat Canada', 'jouets chat Canada',
    'cat toys', 'interactive cat toys', 'cat accessories', 'cat water fountain',
    'premium cat toys Canada', 'cat supplies online', 'best cat toys',
  ],
  authors: [{ name: 'Purrball' }],
  creator: 'Purrball',
  publisher: 'Purrball',
  metadataBase: new URL('https://purrball.ca'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    alternateLocale: 'en_CA',
    url: 'https://purrball.ca',
    siteName: 'Purrball',
    title: 'Purrball - Jouets Premium pour Chats | Livraison Gratuite Canada',
    description: 'Decouvrez notre collection de jouets premium et accessoires pour chats. Fontaines a eau, jouets interactifs, produits naturels. Livraison gratuite au Canada.',
    images: [
      {
        url: 'https://res.cloudinary.com/dhhdhilja/image/upload/v1770517604/purrball/Section2_-_Featured_Cat_Toy.jpg.webp',
        width: 1200,
        height: 630,
        alt: 'Purrball - Jouets Premium pour Chats',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Purrball - Jouets Premium pour Chats',
    description: 'Jouets interactifs, fontaines a eau et accessoires premium pour chats. Livraison gratuite au Canada.',
    images: ['https://res.cloudinary.com/dhhdhilja/image/upload/v1770517604/purrball/Section2_-_Featured_Cat_Toy.jpg.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  verification: {},
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preload" as="image" href="/Section7-3_Interactive_Modes.gif" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* TikTok Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)};
                ttq.load('D66J9U3C77U9CBKPQFLG');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
        {/* Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1215963014054108'); 
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" 
            src="https://www.facebook.com/tr?id=1215963014054108&ev=PageView&noscript=1"/>
        </noscript>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2J8V2Z8EN8"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2J8V2Z8EN8');
            `,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${playfair.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        {/* Anti-DevTools / Anti-inspect protection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                // Disable right-click context menu
                document.addEventListener('contextmenu', function(e){ e.preventDefault(); });

                // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
                document.addEventListener('keydown', function(e){
                  if(e.key === 'F12') { e.preventDefault(); return false; }
                  if(e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) { e.preventDefault(); return false; }
                  if(e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) { e.preventDefault(); return false; }
                  if(e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) { e.preventDefault(); return false; }
                  if(e.ctrlKey && (e.key === 'U' || e.key === 'u')) { e.preventDefault(); return false; }
                  if(e.ctrlKey && (e.key === 'S' || e.key === 's')) { e.preventDefault(); return false; }
                  if(e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i')) { e.preventDefault(); return false; }
                  if(e.metaKey && e.altKey && (e.key === 'J' || e.key === 'j')) { e.preventDefault(); return false; }
                  if(e.metaKey && e.altKey && (e.key === 'C' || e.key === 'c')) { e.preventDefault(); return false; }
                  if(e.metaKey && (e.key === 'U' || e.key === 'u')) { e.preventDefault(); return false; }
                });

                // Disable drag
                document.addEventListener('dragstart', function(e){ e.preventDefault(); });

                // Disable text selection on the whole page (optional, can be removed)
                document.addEventListener('selectstart', function(e){
                  if(e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;
                  e.preventDefault();
                });

                // Detect DevTools open via debugger timing
                (function detect(){
                  var t = performance.now();
                  debugger;
                  if(performance.now() - t > 100){
                    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><h1>Access Denied</h1></div>';
                  }
                  setTimeout(detect, 1000);
                })();
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}

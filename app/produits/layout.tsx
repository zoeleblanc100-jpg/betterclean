import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BetterClean Pro Electric Scrubber | Buy Power Scrubber Online',
  description: 'Buy BetterClean Pro electric scrubber online. 300 RPM power scrubber for bathroom, tiles, grout. Waterproof, rechargeable, 90min battery. Free shipping Canada.',
  keywords: [
    'electric scrubber', 'power scrubber', 'buy scrubber online', 'BetterClean Pro',
    'bathroom scrubber', 'tile scrubber', 'grout cleaner', 'shower scrubber',
    'electric cleaning brush', 'spin scrubber', 'rechargeable scrubber',
    'waterproof scrubber', 'scrubber Canada', 'cleaning tools online',
  ],
  alternates: {
    canonical: '/produits',
  },
  openGraph: {
    title: 'BetterClean Pro Electric Scrubber | Power Cleaning Tool',
    description: 'Professional electric scrubber for deep cleaning. 300 RPM motor, waterproof, rechargeable. Free shipping Canada.',
    url: 'https://bettercleans.ca/produits',
  },
}

export default function ProduitsLayout({ children }: { children: React.ReactNode }) {
  return children
}

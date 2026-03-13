import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accessories | BetterClean Scrubber Heads & Parts',
  description: 'BetterClean electric scrubber accessories: replacement brush heads, extension handles, charging cables. Keep your power scrubber performing at its best. Free shipping Canada.',
  keywords: [
    'BetterClean accessories', 'scrubber brush heads', 'replacement brush heads',
    'electric scrubber parts', 'scrubber extension handle', 'charging cable scrubber',
    'power scrubber accessories', 'cleaning tool parts Canada',
  ],
  alternates: {
    canonical: '/fournitures',
  },
  openGraph: {
    title: 'Accessories | BetterClean - Scrubber Heads & Parts',
    description: 'Replacement brush heads and accessories for your electric scrubber. Keep your power scrubber performing at its best.',
    url: 'https://bettercleans.ca/fournitures',
  },
}

export default function FournituresLayout({ children }: { children: React.ReactNode }) {
  return children
}

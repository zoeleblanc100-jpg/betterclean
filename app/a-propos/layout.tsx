import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | BetterClean - Canadian Cleaning Innovation',
  description: 'Discover BetterClean, Canadian innovator in electric cleaning tools. Our mission: make deep cleaning effortless with professional-grade power scrubbers. Designed in Canada.',
  keywords: [
    'about BetterClean', 'electric scrubber Canada', 'cleaning tools Canadian company',
    'power scrubber brand', 'BetterClean story', 'cleaning innovation Canada',
  ],
  alternates: {
    canonical: '/a-propos',
  },
  openGraph: {
    title: 'About BetterClean | Canadian Cleaning Innovation',
    description: 'Our mission: make deep cleaning effortless with professional-grade electric scrubbers designed in Canada.',
    url: 'https://bettercleans.ca/a-propos',
  },
}

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Guide | How to Use BetterClean Electric Scrubber',
  description: 'Complete guide to using your BetterClean electric scrubber. Tips for bathroom, tiles, grout cleaning. Battery care, maintenance, best practices for deep cleaning.',
  keywords: [
    'how to use electric scrubber', 'BetterClean guide', 'scrubber maintenance tips',
    'bathroom cleaning guide', 'tile cleaning tips', 'grout cleaning guide',
    'electric scrubber best practices', 'cleaning tool care', 'scrubber battery care',
  ],
  alternates: {
    canonical: '/guide',
  },
  openGraph: {
    title: 'User Guide | BetterClean - Tips & Best Practices',
    description: 'Everything you need to know to get the most out of your electric scrubber. Usage tips, maintenance, cleaning guides.',
    url: 'https://bettercleans.ca/guide',
  },
}

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | BetterClean Electric Scrubber Questions',
  description: 'Answers to all your questions about BetterClean electric scrubber. Shipping, returns, warranty, orders. How to use, battery life, waterproof rating.',
  keywords: [
    'BetterClean FAQ', 'electric scrubber questions', 'scrubber help Canada',
    'shipping returns warranty', 'how to use scrubber', 'battery life FAQ',
  ],
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'FAQ | BetterClean - Frequently Asked Questions',
    description: 'Find answers to all your questions about our products, shipping and returns.',
    url: 'https://bettercleans.ca/faq',
  },
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children
}

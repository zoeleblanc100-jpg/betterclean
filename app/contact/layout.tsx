import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | BetterClean Customer Support',
  description: 'Contact BetterClean support for questions about our electric scrubber, orders, shipping or returns. Fast and friendly customer service. Free shipping Canada.',
  keywords: [
    'contact BetterClean', 'customer support', 'electric scrubber help',
    'order questions', 'shipping support', 'returns help Canada',
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | BetterClean - Customer Support',
    description: 'Contact our team for any questions. Fast and friendly customer service.',
    url: 'https://bettercleans.ca/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}

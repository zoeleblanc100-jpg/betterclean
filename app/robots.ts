import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout', '/order-success', '/order-failed', '/order-tracking', '/cart', '/suivi'],
      },
    ],
    sitemap: 'https://bettercleans.ca/sitemap.xml',
  }
}

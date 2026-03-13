"use client"

import Link from "next/link"
import { MapPin, Truck, Shield, Clock } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export default function Footer() {
  const { t, locale } = useI18n()
  const isFr = locale === 'fr'
  
  const guarantees = [
    { icon: MapPin, text: isFr ? "Fabriqué pour le Canada" : "Made for Canada" },
    { icon: Truck, text: isFr ? "Livraison Gratuite" : "Free Shipping" },
    { icon: Shield, text: isFr ? "Garantie 30 Jours" : "30-Day Guarantee" },
    { icon: Clock, text: isFr ? "Livraison Rapide" : "Fast Delivery" },
  ]

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Guarantees Bar */}
      <div className="py-4 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {guarantees.map((item) => (
            <div key={item.text} className="flex items-center justify-center gap-2 text-gray-600">
              <item.icon className="w-4 h-4 text-[#5a9ea8]" />
              <span className="text-xs font-medium font-[var(--font-dm-sans)]">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Footer */}
      <div className="border-t border-gray-100 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm">
              <span className="font-bold text-[#1a1a1a] font-[var(--font-dm-sans)]">BetterClean</span>
              <Link href="/contact" className="text-gray-600 hover:text-[#5a9ea8] transition-colors font-[var(--font-dm-sans)]">
                {isFr ? 'Contact' : 'Contact'}
              </Link>
              <Link href="/order-tracking" className="text-gray-600 hover:text-[#5a9ea8] transition-colors font-[var(--font-dm-sans)]">
                {isFr ? 'Suivre Commande' : 'Track Order'}
              </Link>
              <Link href="/returns" className="text-gray-600 hover:text-[#5a9ea8] transition-colors font-[var(--font-dm-sans)]">
                {isFr ? 'Retours' : 'Returns'}
              </Link>
            </div>
            
            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/0169695890db3db16bfe.svg" alt="Visa" className="h-5 w-8 opacity-70" />
              <img src="https://secure.payment-ca.com/assets/img/mastercard.svg" alt="Mastercard" className="h-5 w-8 opacity-70" />
              <img src="https://secure.payment-ca.com/assets/img/amex.svg" alt="Amex" className="h-5 w-8 opacity-70" />
              <img src="https://secure.payment-ca.com/assets/img/discover.svg" alt="Discover" className="h-5 w-8 opacity-70" />
            </div>
          </div>
          
          <div className="text-center mt-3">
            <p className="text-sm text-gray-600 font-[var(--font-dm-sans)]">
              2024 BetterClean. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

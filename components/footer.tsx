"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Truck, Shield, Clock } from "lucide-react"

export default function Footer() {
  const guarantees = [
    { icon: MapPin, text: "Made for Canada" },
    { icon: Truck, text: "Free Shipping" },
    { icon: Shield, text: "30-Day Guarantee" },
    { icon: Clock, text: "Fast Delivery" },
  ]

  const paymentMethods = [
    { name: "Visa", src: "https://cdn.shopify.com/shopifycloud/checkout-web/assets/0169695890db3db16bfe.svg" },
    { name: "Mastercard", src: "https://secure.payment-ca.com/assets/img/mastercard.svg" },
    { name: "American Express", src: "https://secure.payment-ca.com/assets/img/amex.svg" },
    { name: "Discover", src: "https://secure.payment-ca.com/assets/img/discover.svg" },
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
              <span className="font-bold text-[#1a1a1a] font-[var(--font-dm-sans)]">QuickClean</span>
              <Link href="/contact" className="text-gray-600 hover:text-[#5a9ea8] transition-colors font-[var(--font-dm-sans)]">
                Contact
              </Link>
              <Link href="/order-tracking" className="text-gray-600 hover:text-[#5a9ea8] transition-colors font-[var(--font-dm-sans)]">
                Track Order
              </Link>
              <Link href="/returns" className="text-gray-600 hover:text-[#5a9ea8] transition-colors font-[var(--font-dm-sans)]">
                Returns
              </Link>
            </div>
            
            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              {paymentMethods.map((method) => (
                <div key={method.name} className="relative w-8 h-5 opacity-60 hover:opacity-100 transition-opacity">
                  <Image
                    src={method.src}
                    alt={method.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500 font-[var(--font-dm-sans)]">
              © 2026 QuickClean. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

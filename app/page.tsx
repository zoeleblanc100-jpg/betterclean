"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Zap, Battery, Droplets } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-[#1a1a1a] font-[var(--font-dm-sans)]">
            Spend Less. Clean More
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-600 font-[var(--font-dm-sans)]">
            A powerful electric scrubber that removes grime fast, without the effort.
          </p>
          <Link href="/produits/quickclean-pro-1">
            <Button 
              size="lg" 
              className="bg-[#5a9ea8] hover:bg-[#4a8a94] text-white px-8 py-4 text-lg font-semibold rounded-full"
            >
              Get Yours Now 👉
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Section 1 - Image Left, Text Right */}
      <section className="px-4 py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden w-4/5 sm:w-3/5 md:w-3/5 mx-auto">
              <Image 
                src="/SHOP.webp" 
                alt="QuickClean Electric Scrubber"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold italic mb-6 text-[#1a1a1a] font-[var(--font-playfair-display)]">
                Effortless Deep Cleaning
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-[var(--font-dm-sans)]">
                Built to handle the mess for you. Deep cleaning has never been this easy. The powerful motor does all the hard work while you guide it effortlessly.
              </p>
              <Link href="/produits/quickclean-pro-1">
                <Button 
                  size="lg" 
                  className="bg-[#5a9ea8] hover:bg-[#4a8a94] text-white px-8 py-4 text-lg font-semibold rounded-full"
                >
                  Get Yours Now 👉
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2 - Text Left, Image Right */}
      <section className="px-4 py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold italic mb-6 text-[#1a1a1a] font-[var(--font-playfair-display)]">
                Let It Do The Work
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-[var(--font-dm-sans)]">
                The QuickClean Pro is engineered to be tough on the grime. Easy on you. No more scrubbing until your arms ache - just guide and let the power do the rest.
              </p>
              <Link href="/produits/quickclean-pro-1">
                <Button 
                  size="lg" 
                  className="bg-[#5a9ea8] hover:bg-[#4a8a94] text-white px-8 py-4 text-lg font-semibold rounded-full"
                >
                  Get Yours Now 👉
                </Button>
              </Link>
            </div>
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden w-4/5 sm:w-3/5 md:w-3/5 mx-auto">
              <Image 
                src="/SHOP1.webp" 
                alt="QuickClean in Action"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[#1a1a1a] font-[var(--font-dm-sans)]">
            Why Choose QuickClean?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5a9ea8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1a1a1a] font-[var(--font-dm-sans)]">
                Powerful Motor
              </h3>
              <p className="text-gray-600 font-[var(--font-dm-sans)]">
                High-speed rotating action removes stubborn grime with minimal effort from you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5a9ea8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Battery className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1a1a1a] font-[var(--font-dm-sans)]">
                Long Battery Life
              </h3>
              <p className="text-gray-600 font-[var(--font-dm-sans)]">
                Up to 2 hours of continuous cleaning power on a single charge.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5a9ea8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1a1a1a] font-[var(--font-dm-sans)]">
                Waterproof Design
              </h3>
              <p className="text-gray-600 font-[var(--font-dm-sans)]">
                IPX7 rated for safe use in wet environments like bathrooms and kitchens.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

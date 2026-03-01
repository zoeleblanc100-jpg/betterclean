"use client"

import { Menu, Search, User, ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import CartDropdown from "./cart-dropdown"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { itemCount } = useCart()

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/produits/quickclean-pro-1" },
    { label: "Contact", href: "/contact" },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#d6ecf0] text-[#1a1a1a] text-center py-2 px-4 text-sm font-medium">
        🇨🇦 Canada Free Shipping On All Orders! - 30-Day Money Back Guarantee
      </div>
      
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left - Search Icon */}
            <div className="flex items-center">
              <button className="w-10 h-10 text-gray-600 hover:text-gray-900 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Center - Logo and Nav */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="font-bold text-2xl text-[#1a1a1a] font-[var(--font-dm-sans)]">
                QuickClean
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                {menuItems.map((item) => (
                  <Link 
                    key={item.label}
                    href={item.href} 
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors font-[var(--font-dm-sans)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right - Account and Cart */}
            <div className="flex items-center space-x-2">
              <Link href="/order-tracking" className="w-10 h-10 text-gray-600 hover:text-gray-900 flex items-center justify-center">
                <User className="w-5 h-5" />
              </Link>
              
              <CartDropdown />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 md:hidden text-gray-600 flex items-center justify-center"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-3 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-[var(--font-dm-sans)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

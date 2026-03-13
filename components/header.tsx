"use client"

import { Menu, Search, User, ShoppingCart, X, Home, ShoppingBag, HelpCircle, FileText, Phone } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import CartDropdown from "./cart-dropdown"
import { useI18n } from "@/lib/i18n-context"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { itemCount } = useCart()
  const { locale } = useI18n()
  const isFr = locale === 'fr'

  const menuItems = [
    { label: isFr ? "Accueil" : "Home", href: "/", icon: Home },
    { label: isFr ? "Boutique" : "Shop", href: "/produits/betterclean-pro-1", icon: ShoppingBag },
    { label: isFr ? "Contact" : "Contact", href: "/contact", icon: Phone },
    { label: isFr ? "FAQ" : "FAQ", href: "/faq", icon: HelpCircle },
  ]

  const policyItems = [
    { label: isFr ? "Politique de remboursement" : "Refund Policy", href: "/politique-remboursement", icon: FileText },
    { label: isFr ? "Conditions d'utilisation" : "Terms of Use", href: "/conditions-utilisation", icon: FileText },
    { label: isFr ? "Confidentialité" : "Privacy Policy", href: "/politique-confidentialite", icon: FileText },
  ]

  useEffect(() => {
    setMounted(true)
    // Prevent body scroll when menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const closeMenu = () => setMobileMenuOpen(false)

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

            {/* Center - Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)]">
                BetterClean
              </Link>
            </div>

            {/* Right - Account and Cart */}
            <div className="flex items-center space-x-2">
              <Link href="/order-tracking" className="w-10 h-10 text-gray-600 hover:text-gray-900 flex items-center justify-center">
                <User className="w-5 h-5" />
              </Link>
              
              <CartDropdown />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 md:hidden text-gray-600 flex items-center justify-center"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation - Below Logo */}
        <div className="hidden md:flex justify-center border-t border-gray-100 py-3">
          <div className="flex items-center space-x-8">
            {menuItems.slice(0, 3).map((item) => (
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
      </nav>

      {/* Mobile Menu Drawer - Shopify Style */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-[100] md:hidden animate-fadeIn"
            onClick={closeMenu}
          />
          
          {/* Drawer */}
          <div className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-[101] md:hidden shadow-2xl animate-slideInRight">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="font-semibold text-[#1a1a1a] font-[var(--font-dm-sans)]">
                {isFr ? "Menu" : "Menu"}
              </span>
              <button 
                onClick={closeMenu}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="overflow-y-auto h-[calc(100vh-70px)]">
              {/* Main Navigation */}
              <div className="p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-3 font-medium">
                  {isFr ? "Navigation" : "Navigation"}
                </p>
                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 py-3 px-3 text-gray-700 hover:text-[#5a9ea8] hover:bg-gray-50 rounded-lg transition-all font-[var(--font-dm-sans)]"
                        onClick={closeMenu}
                      >
                        <Icon className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 mx-4" />

              {/* Policy Links */}
              <div className="p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-3 font-medium">
                  {isFr ? "Informations" : "Information"}
                </p>
                <div className="space-y-1">
                  {policyItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 py-3 px-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all text-sm font-[var(--font-dm-sans)]"
                        onClick={closeMenu}
                      >
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-4 mt-auto">
                <div className="bg-[#d6ecf0] rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-2">{isFr ? "Besoin d'aide ?" : "Need help?"}</p>
                  <a 
                    href="mailto:support@betterclean.com" 
                    className="text-sm font-medium text-[#5a9ea8] hover:underline"
                  >
                    support@betterclean.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            .animate-fadeIn {
              animation: fadeIn 0.2s ease-out;
            }
            .animate-slideInRight {
              animation: slideInRight 0.3s ease-out;
            }
          `}</style>
        </>
      )}
    </>
  )
}

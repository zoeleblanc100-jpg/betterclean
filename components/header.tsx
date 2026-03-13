"use client"

import { Menu, Search, User, ShoppingCart, X, Home, ShoppingBag, HelpCircle, FileText, Phone, Globe } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import CartDropdown from "./cart-dropdown"
import { useI18n } from "@/lib/i18n-context"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { itemCount } = useCart()
  const { locale, setLocale } = useI18n()
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

  const toggleLanguage = () => {
    setLocale(isFr ? 'en' : 'fr')
  }

  if (!mounted) return null

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#d6ecf0] text-[#1a1a1a] text-center py-2 px-4 text-sm font-medium">
        {isFr ? "Livraison gratuite au Canada - Garantie 30 jours" : "🇨🇦 Canada Free Shipping - 30-Day Guarantee"}
      </div>
      
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left - Search Icon */}
            <div className="flex items-center gap-1">
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

            {/* Right - Account, Cart, and Language Toggle */}
            <div className="flex items-center space-x-1">
              {/* Language Toggle - More Visible */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                title={isFr ? "Switch to English" : "Passer en Français"}
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {isFr ? "FR" : "EN"}
                </span>
              </button>

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
            {menuItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors font-[var(--font-dm-sans)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={closeMenu}
          />
          
          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-[280px] bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <span className="font-bold text-lg">{isFr ? "Menu" : "Menu"}</span>
              <button 
                onClick={closeMenu}
                className="w-10 h-10 flex items-center justify-center text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4">
              {/* Main Menu Items */}
              <div className="space-y-2 mb-6">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
              
              {/* Policy Items */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">
                  {isFr ? "Informations" : "Information"}
                </p>
                <div className="space-y-2">
                  {policyItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Language Toggle in Mobile Menu */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <button
                  onClick={() => {
                    toggleLanguage()
                    closeMenu()
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full"
                >
                  <Globe className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    {isFr ? "Switch to English" : "Passer en Français"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

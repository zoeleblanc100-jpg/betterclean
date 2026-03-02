"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { ShoppingCart, X, Plus, Minus, Truck } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import Link from "next/link"

export default function CartDropdown() {
  const { items, removeItem, updateQuantity, total, itemCount, setCartOpen, isCartOpen } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setCartOpen(!isCartOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#5a9ea8] text-white text-xs rounded-full flex items-center justify-center font-medium">
            {itemCount}
          </span>
        )}
      </button>

      {/* Shopify-style Cart Sidebar */}
      {isCartOpen && createPortal(
        <>
          {/* Animation styles */}
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .cart-sidebar {
              animation: slideInRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            .cart-backdrop {
              animation: fadeIn 0.3s ease-out;
            }
          `}</style>

          {/* Backdrop */}
          <div 
            className="cart-backdrop fixed inset-0 bg-black/50 z-[9998]"
            onClick={() => setCartOpen(false)}
          />
          
          {/* Cart Sidebar */}
          <div className="cart-sidebar fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[9999] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-[#1a1a1a] font-[var(--font-dm-sans)]">
                Shopping Cart ({itemCount})
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="p-6 bg-[#d6ecf0] border-b border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-[#5a9ea8]" />
                <span className="text-sm font-medium text-[#1a1a1a] font-[var(--font-dm-sans)]">
                  {itemCount >= 2 ? "🎉 Free shipping unlocked!" : "Free shipping with 2+ items"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#5a9ea8] h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((itemCount / 2) * 100, 100)}%` }}
                />
              </div>
              {itemCount < 2 && (
                <p className="text-xs text-gray-600 mt-2 font-[var(--font-dm-sans)]">
                  Add {2 - itemCount} more item{2 - itemCount > 1 ? 's' : ''} for free shipping
                </p>
              )}
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2 font-[var(--font-dm-sans)]">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6 font-[var(--font-dm-sans)]">
                  Add some products to get started
                </p>
                <Link href="/produits/betterclean-pro-1">
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="bg-[#5a9ea8] hover:bg-[#4a8a94] text-white px-8 py-3 rounded-full font-medium transition-colors font-[var(--font-dm-sans)]"
                  >
                    Shop Now
                  </button>
                </Link>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || "/product1.webp"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[#1a1a1a] text-sm mb-1 font-[var(--font-dm-sans)]">
                            {item.name}
                          </h4>
                          {item.variant && (
                            <p className={`text-xs mb-2 font-[var(--font-dm-sans)] ${item.variant === 'FREE GIFT' ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                              {item.variant}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            {item.price === 0 ? (
                              <span className="text-xs text-green-600 font-medium font-[var(--font-dm-sans)]">x {item.quantity}</span>
                            ) : (
                              <div className="flex items-center border border-gray-200 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-sm font-medium font-[var(--font-dm-sans)]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              {item.price === 0 ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400 line-through font-[var(--font-dm-sans)]">{formatPrice(item.originalPrice)}</span>
                                  <span className="font-semibold text-green-600 font-[var(--font-dm-sans)]">FREE</span>
                                </div>
                              ) : (
                                <>
                                  <span className="font-semibold text-[#1a1a1a] font-[var(--font-dm-sans)]">
                                    {formatPrice(item.price * item.quantity)}
                                  </span>
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-[#1a1a1a] font-[var(--font-dm-sans)]">
                      Total
                    </span>
                    <span className="text-xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)]">
                      {formatPrice(total)}
                    </span>
                  </div>
                  
                  <Link href="/checkout" className="block mb-3">
                    <button
                      onClick={() => setCartOpen(false)}
                      className="w-full bg-[#5a9ea8] hover:bg-[#4a8a94] text-white py-4 rounded-full font-semibold text-lg transition-colors font-[var(--font-dm-sans)]"
                    >
                      Checkout
                    </button>
                  </Link>
                  
                  <Link href="/cart" className="block">
                    <button
                      onClick={() => setCartOpen(false)}
                      className="w-full text-gray-600 hover:text-[#5a9ea8] py-2 font-medium transition-colors text-sm underline font-[var(--font-dm-sans)]"
                    >
                      View Cart
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </>,
        document.body
      )}
    </>
  )
}

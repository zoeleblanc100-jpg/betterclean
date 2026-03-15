"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ttqTrack } from "@/lib/tiktok"
import { fbqTrack } from "@/lib/meta"

interface CartItem {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  quantity: number
  variant?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  discount: number
  total: number
  shipping: number
  itemCount: number
  paidItemCount: number
  freeShippingProgress: number
  freeShippingThreshold: number
  openCart: () => void
  setCartOpen: (open: boolean) => void
  isCartOpen: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const FREE_SHIPPING_ITEM_THRESHOLD = 2 // 2 articles pour livraison gratuite

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isClient, setIsClient] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
    try {
      const savedCart = localStorage.getItem("bettercleans-cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart)
        }
      } else {
        // Auto-add free brush accessory on first visit
        const freeBrush: CartItem = {
          id: 'brush-accessory-free',
          name: 'Extra Brush Head Set',
          price: 0,
          originalPrice: 10.00,
          image: '/product1.webp',
          quantity: 1,
          variant: 'FREE GIFT'
        }
        setItems([freeBrush])

        // Show welcome popup
        setTimeout(() => {
          const popup = document.createElement('div')
          popup.id = 'welcome-popup'
          popup.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 99999 !important;
            background: #5a9ea8 !important;
            color: white !important;
            padding: 12px 20px !important;
            border-radius: 25px !important;
            font-family: system-ui, -apple-system, sans-serif !important;
            font-size: 14px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          `
          popup.innerHTML = `
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px; font-size: 18px;">&#127873;</span>
              <span>Free brush set added to your cart!</span>
            </div>
          `
          document.body.appendChild(popup)
          setTimeout(() => {
            if (popup && popup.parentNode) {
              popup.remove()
            }
          }, 3000)
        }, 1500)
      }
    } catch {
      localStorage.removeItem("bettercleans-cart")
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("bettercleans-cart", JSON.stringify(items))
      } catch {
        // Silent fail
      }
    }
  }, [items, isClient])

  const addItem = (product: Omit<CartItem, "quantity">) => {
    // ✅ SAUVEGARDE DANS LES STATS (éviter doublons même IP)
    const existingCarts = JSON.parse(localStorage.getItem('bc_carts') || '[]');
    const now = Date.now();
    
    // Vérifier si cette IP a déjà ajouté ce produit aujourd'hui
    const today = new Date().toDateString();
    const alreadyAdded = existingCarts.some((cart: any) => 
      cart.product === product.name && 
      cart.ip === 'local' && 
      new Date(cart.ts).toDateString() === today
    );
    
    if (!alreadyAdded) {
      existingCarts.push({ ts: now, product: product.name, ip: 'local' });
      localStorage.setItem('bc_carts', JSON.stringify(existingCarts));
      
      var cartData = {
        ts: now, 
        product: product.name, 
        ip: 'local'
      };
      
      // 🔄 Stocker sur Vercel au lieu de Telegram
      fetch('/api/store-stats', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'cart',
          data: cartData,
          password: 'yofam0'
        })
      }).catch(function(error) {
        console.log('Failed to store cart stats:', error);
        // Fallback: try Telegram if Vercel fails
        fetch("https://api.telegram.org/bot8535669526:AAHjGvoXJv5HwdDDr6jl8eTFeWa4DyTe4lg/sendMessage", {
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            chat_id: "-5217100062", 
            text: "🛒 Panier\nProduit: " + product.name + "\nIP: local", 
            parse_mode: "Markdown" 
          })
        }).catch(function() {
          // Silent fail
        });
      });
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      let newItems;
      if (existingItem) {
        newItems = prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...prevItems, { ...product, quantity: 1 }]
      }
      
      // Auto-add free brush gift if not already in cart
      const hasFreeGift = newItems.some(item => item.id === 'brush-accessory-free')
      if (!hasFreeGift) {
        newItems = [...newItems, {
          id: 'brush-accessory-free',
          name: 'Extra Brush Head Set',
          price: 0,
          originalPrice: 10.00,
          image: '/product1.webp',
          quantity: 1,
          variant: 'FREE GIFT'
        }]
      }
      
      return newItems
    })
    
    // Auto-open cart when item is added
    setIsCartOpen(true)

    // TikTok AddToCart event (client + server)
    const eventId = `atc_${product.id}_${Date.now()}`
    ttqTrack('AddToCart', {
      content_id: product.id,
      content_type: 'product',
      content_name: product.name,
      value: Number(product.price) || 0,
      currency: 'CAD',
    })
    fetch('/api/tiktok-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'AddToCart',
        event_id: eventId,
        properties: {
          content_id: product.id,
          content_type: 'product',
          content_name: product.name,
          value: Number(product.price) || 0,
          currency: 'CAD',
        },
      }),
    }).catch(() => {})

    // Meta Pixel AddToCart event
    fbqTrack('AddToCart', {
      content_ids: [product.id],
      content_type: 'product',
      content_name: product.name,
      value: Number(product.price) || 0,
      currency: 'CAD',
    })
  }

  const openCart = () => setIsCartOpen(true)
  const setCartOpen = (open: boolean) => setIsCartOpen(open)

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("bettercleans-cart")
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = 0
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const paidItems = items.filter(item => item.price > 0).reduce((sum, item) => sum + item.quantity, 0)
  const shipping = totalItems === 0 ? 0 : (totalItems >= FREE_SHIPPING_ITEM_THRESHOLD ? 0 : 5.99)
  const total = subtotal - discount
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const freeShippingProgress = Math.min((totalItems / FREE_SHIPPING_ITEM_THRESHOLD) * 100, 100)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        total,
        shipping,
        itemCount,
        paidItemCount: paidItems,
        freeShippingProgress,
        freeShippingThreshold: FREE_SHIPPING_ITEM_THRESHOLD,
        openCart,
        setCartOpen,
        isCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}

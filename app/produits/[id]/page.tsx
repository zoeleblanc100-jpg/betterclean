"use client"

import { useState, use, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Star, Truck, Leaf, Shield, Clock, Minus, Plus } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getProductById, getRelatedProducts } from "@/lib/products"
import { notFound } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import ProductReviews from "@/components/product-reviews"
import { useLocalizedProduct } from "@/lib/use-localized-product"
import { useI18n } from "@/lib/i18n-context"
import { ttqTrack } from "@/lib/tiktok"
import { fbqTrack } from "@/lib/meta"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const rawProduct = getProductById(id)
  const relatedProducts = getRelatedProducts(id)
  const { addItem } = useCart()
  const { localize, isEn } = useLocalizedProduct()
  const { formatPrice } = useI18n()
  const product = rawProduct ? localize(rawProduct) : null
  
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedPackage, setSelectedPackage] = useState(0)
  const [selectedImage, setSelectedImage] = useState(0)
  const [openSection, setOpenSection] = useState<string | null>("details")
  const [userProvince, setUserProvince] = useState("Quebec")

  // Detect visitor province via IP geolocation
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.region) setUserProvince(data.region)
      })
      .catch(() => {})
  }, [])

  // TikTok ViewContent event + Telegram notification
  useEffect(() => {
    if (!product) return
    const eventId = `vc_${id}_${Date.now()}`
    // Client-side pixel
    // TikTok ViewContent event
    ttqTrack('ViewContent', {
      content_id: product.id,
      content_type: 'product',
      content_name: product.name,
      content_category: product.category,
      value: Number(product.packages[0].pricePerUnit) || 0,
      currency: 'CAD',
    })
    // TikTok server-side event
    fetch('/api/tiktok-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'ViewContent',
        event_id: eventId,
        properties: {
          content_id: product.id,
          content_type: 'product',
          content_name: product.name,
          content_category: product.category,
          value: Number(product.packages[0].pricePerUnit) || 0,
          currency: 'CAD',
        },
      }),
    }).catch(() => {})

    // Meta Pixel ViewContent event
    fbqTrack('ViewContent', {
      content_ids: [product.id],
      content_type: 'product',
      content_name: product.name,
      content_category: product.category,
      value: Number(product.packages[0].pricePerUnit) || 0,
      currency: 'CAD',
    })

    // Telegram notification for page visit (only for Wicked Ball M3)
    if (product.id === 'wicked-ball-m3') {
      fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'page_visit',
          productName: product.name,
          productId: product.id,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          ip: 'Client IP', // Will be detected server-side
        }),
      }).catch(() => {})
    }
  }, [id, product])

  // Countdown timer - client-side only to avoid hydration mismatch
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 56, seconds: 23 })
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  useEffect(() => {
    if (!isClient) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) { seconds = 59; minutes-- }
        if (minutes < 0) { minutes = 59; hours-- }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59 }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isClient])

  if (!product) {
    notFound()
  }

  const currentPrice = product.packages[selectedPackage].pricePerUnit
  const totalPrice = currentPrice * product.packages[selectedPackage].quantity

  const handleAddToCart = () => {
    console.log('🛒 handleAddToCart called for product:', product.id)
    alert('🛒 handleAddToCart called for product: ' + product.id)
    alert('🔍 Product object:', JSON.stringify({id: product.id, name: product.name}))
    
    for (let i = 0; i < product.packages[selectedPackage].quantity; i++) {
      addItem({
        id: `${product.id}-${product.colors[selectedColor].name}`,
        name: `${product.name} (${product.colors[selectedColor].name})`,
        price: currentPrice,
        originalPrice: product.originalPrice,
        image: product.colors[selectedColor].image,
        variant: `#PAWPAW -${Math.round((1 - currentPrice / product.originalPrice) * 100)}% appliqué`,
      })
    }

    // Telegram notification for cart addition (only for Wicked Ball M3)
    if (product.id === 'wicked-ball-m3') {
      console.log('📱 Sending Telegram notification for cart addition...')
      alert('📱 Sending Telegram notification for cart addition...')
      fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'add_to_cart',
          productName: `${product.name} (${product.colors[selectedColor].name})`,
          productId: product.id,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      }).then(response => {
        console.log('✅ Telegram cart notification response:', response.status)
        alert('✅ Telegram response: ' + response.status)
        return response.json()
      }).then(data => {
        console.log('📊 Telegram response data:', data)
        alert('📊 Response data: ' + JSON.stringify(data))
      }).catch(error => {
        console.error('❌ Telegram cart notification failed:', error)
        alert('❌ Error: ' + error.message)
      })
    } else {
      console.log('⚠️ Product is not wicked-ball-m3, no notification sent. Current product:', product.id)
      alert('⚠️ Product is not wicked-ball-m3: ' + product.id)
    }
  }

  const handleColorChange = (index: number) => {
    setSelectedColor(index)
    setSelectedImage(0)
  }

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  // Get current display image
  const displayImage = selectedImage < product.images.length 
    ? product.images[selectedImage] 
    : product.colors[selectedColor].image

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-neutral-900 transition-colors">Homepage</Link>
          <span>/</span>
          <Link href="/produits" className="hover:text-neutral-900 transition-colors">Cat</Link>
          <span>/</span>
          <span className="text-neutral-900">{product.name}</span>
        </nav>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          
          {/* LEFT: Image Gallery - Cheerble style */}
          <div className="flex flex-col-reverse lg:flex-row gap-3">
            {/* Thumbnails - vertical on desktop, horizontal on mobile */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] pb-2 lg:pb-0 lg:pr-1">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-14 h-14 lg:w-16 lg:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-neutral-900' : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <Image src={img} alt={`Vue ${index + 1}`} fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 aspect-square max-h-[600px] bg-white rounded-xl overflow-hidden">
              {!product.inStock && (
                <span className="absolute top-4 left-4 z-10 bg-neutral-900 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {isEn ? 'SOLD OUT' : 'ÉPUISÉ'}
                </span>
              )}
              <Image
                src={displayImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-4"
                priority
              />
            </div>
          </div>

          {/* RIGHT: Product Info - Cheerble style */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* Category badge + Stars */}
            <div className="flex items-center justify-between mb-4">
              <span className="border border-neutral-200 text-neutral-500 text-[11px] font-medium px-3 py-1 rounded uppercase tracking-wider">CAT</span>
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-neutral-900 fill-neutral-900' : 'text-neutral-200'}`} />
                  ))}
                </div>
                <span className="text-xs text-neutral-400">{product.rating}({product.reviewCount})</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight mb-3">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-neutral-500 text-sm leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-bold text-red-600">{formatPrice(currentPrice)}</span>
              <span className="text-base text-neutral-300 line-through">{formatPrice(product.originalPrice)}</span>
              <span className="bg-red-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded uppercase">
                Save {Math.round((1 - currentPrice / product.originalPrice) * 100)}%
              </span>
            </div>

            {/* #PAWPAW discount badge */}
            <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-green-700 text-xs font-medium">{isEn ? 'Discount' : 'Rabais'} <span className="font-bold">#PAWPAW</span> -{Math.round((1 - currentPrice / product.originalPrice) * 100)}% {isEn ? 'applied automatically' : 'appliqué automatiquement'}</span>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-100 mb-6" />

            {/* Color / Standard Selector */}
            <div className="mb-6">
              <p className="text-sm text-neutral-900 mb-3">
                {product.category === 'Fournitures' ? 'Standard:' : 'Color:'}{' '}
                <span className="font-medium">{product.colors[selectedColor].name}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.category === 'Fournitures' ? (
                  product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorChange(index)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                        selectedColor === index
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                      }`}
                    >
                      {color.name}
                    </button>
                  ))
                ) : (
                  product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorChange(index)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === index ? 'border-neutral-900 scale-110' : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))
                )}
              </div>
              <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                {isEn
                  ? `Only ${product.colors[selectedColor].stockCount} left in stock`
                  : `Seulement ${product.colors[selectedColor].stockCount} en stock`}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-100 mb-6" />

            {/* Quantity + Add to Cart - Cheerble style */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-neutral-200 rounded-lg">
                <button
                  onClick={() => setSelectedPackage(Math.max(0, selectedPackage - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-neutral-50 transition-colors text-neutral-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 h-12 flex items-center justify-center text-sm font-medium border-x border-neutral-200">
                  {product.packages[selectedPackage].quantity}
                </span>
                <button
                  onClick={() => setSelectedPackage(Math.min(product.packages.length - 1, selectedPackage + 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-neutral-50 transition-colors text-neutral-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-brand hover:bg-brand-dark text-white h-12 rounded-lg font-medium text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEn ? 'ADD TO CART' : 'AJOUTER AU PANIER'}
              </button>
            </div>

            {/* Delivery Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Truck className="w-4 h-4 text-neutral-400" />
                <span>{isEn ? 'Deliver to' : 'Livrer à'} <span className="font-medium text-neutral-900 underline">{userProvince}, Canada</span></span>
              </div>
              <p className="text-sm text-neutral-900 font-medium">
                {isEn ? 'Ordered before 11:00 pm' : 'Commandé avant 23h'}
              </p>
              <p className="text-sm text-neutral-500">
                {isEn ? 'Estimated delivery:' : 'Livraison estimée:'} <span className="font-medium text-neutral-900">{isEn ? '2-3 business days' : '2-3 jours ouvrables'}</span>
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-100 mb-6" />

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2.5 text-xs text-neutral-500">
                <Truck className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span>{isEn ? 'Free shipping' : 'Livraison gratuite'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-500">
                <Shield className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span>{isEn ? '2-month warranty' : 'Garantie 2 mois'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-500">
                <Leaf className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span>{isEn ? 'Eco-friendly' : 'Éco-responsable'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-500">
                <Clock className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span>{isEn ? 'Ships in 24h' : 'Expédition 24h'}</span>
              </div>
            </div>

            {/* Accordion Sections */}
            <div className="border-t border-neutral-100">
              <div className="border-b border-neutral-100">
                <button onClick={() => toggleSection("details")} className="w-full flex items-center justify-between py-4 text-left hover:opacity-70 transition-opacity">
                  <span className="text-xs font-medium text-neutral-900 uppercase tracking-wider">{isEn ? 'Product Details' : 'Détails du produit'}</span>
                  {openSection === "details" ? <Minus className="w-4 h-4 text-neutral-400" /> : <Plus className="w-4 h-4 text-neutral-400" />}
                </button>
                {openSection === "details" && (
                  <div className="pb-6">
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-neutral-500 text-sm">
                          <span className="text-neutral-300 mt-0.5">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="border-b border-neutral-100">
                <button onClick={() => toggleSection("materials")} className="w-full flex items-center justify-between py-4 text-left hover:opacity-70 transition-opacity">
                  <span className="text-xs font-medium text-neutral-900 uppercase tracking-wider">{isEn ? 'Materials & Care' : 'Matériaux & Entretien'}</span>
                  {openSection === "materials" ? <Minus className="w-4 h-4 text-neutral-400" /> : <Plus className="w-4 h-4 text-neutral-400" />}
                </button>
                {openSection === "materials" && (
                  <div className="pb-6"><p className="text-neutral-500 text-sm leading-relaxed">{product.materials}</p></div>
                )}
              </div>
              <div className="border-b border-neutral-100">
                <button onClick={() => toggleSection("shipping")} className="w-full flex items-center justify-between py-4 text-left hover:opacity-70 transition-opacity">
                  <span className="text-xs font-medium text-neutral-900 uppercase tracking-wider">{isEn ? 'Shipping & Returns' : 'Livraison & Retours'}</span>
                  {openSection === "shipping" ? <Minus className="w-4 h-4 text-neutral-400" /> : <Plus className="w-4 h-4 text-neutral-400" />}
                </button>
                {openSection === "shipping" && (
                  <div className="pb-6">
                    <p className="text-neutral-500 text-sm leading-relaxed">{product.shipping}</p>
                    <p className="text-neutral-500 text-sm leading-relaxed mt-4">{isEn ? 'Returns accepted within 30 days. Item must be in original packaging.' : 'Retours acceptés dans les 30 jours. L\'article doit être dans son emballage d\'origine.'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Gallery Images */}
        <div className="mt-16 space-y-5">
          <h3 className="text-xl font-semibold text-neutral-900">{isEn ? 'Unleash the Fun' : 'Libérez le plaisir'}</h3>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-2xl">{product.longDescription}</p>
          <div className="space-y-4">
            {product.images.slice(1).map((img, index) => (
              <div key={index} className="relative w-full rounded-2xl overflow-hidden">
                <Image src={img} alt={`Détail ${index + 1}`} width={1200} height={800} sizes="100vw" className="w-full h-auto bg-neutral-50" />
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews */}
        <ProductReviews />
      </main>

      {/* Sticky Bottom Bar (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-100 p-3 flex items-center gap-3 lg:hidden z-50">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative w-9 h-9 bg-neutral-50 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={product.colors[selectedColor].image} alt={product.name} fill sizes="48px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-neutral-900 font-medium text-xs truncate">{product.name}</p>
            <p className="text-red-600 font-semibold text-xs">{formatPrice(totalPrice)}</p>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="bg-brand hover:bg-brand-dark text-white py-2.5 px-5 rounded-lg font-medium text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 transition-all"
        >
          {isEn ? 'ADD TO CART' : 'AJOUTER AU PANIER'}
        </button>
      </div>

      <div className="h-20 lg:hidden" />

      <Footer />
    </div>
  )
}

"use client"

import { useState, use, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Check, ChevronDown, ChevronUp, Shield, Truck, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { ttqTrack } from "@/lib/tiktok"
import { fbqTrack } from "@/lib/meta"
import { useI18n } from "@/lib/i18n-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ReviewsSection from "@/components/reviews-section"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const { addItem, setCartOpen } = useCart()
  const { t, formatPrice, locale } = useI18n()
  const isFr = locale === 'fr'
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedBundle, setSelectedBundle] = useState("buy1")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  
  // Touch gesture handling for mobile swipe
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  
  const minSwipeDistance = 50
  
  // Province detection for localized delivery messages
  const [userProvince, setUserProvince] = useState<string | null>(null)
  
  // Detect user's province (simplified for demo - in production, use geolocation API)
  useEffect(() => {
    // For demo purposes, randomly assign provinces - replace with actual geolocation
    const provinces = ['Quebec', 'Ontario', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland', 'PEI', 'Northwest Territories', 'Yukon', 'Nunavut']
    const randomProvince = provinces[Math.floor(Math.random() * provinces.length)]
    setUserProvince(randomProvince)
  }, [])
  
  // Get localized delivery message based on province
  const getDeliveryMessage = () => {
    if (!userProvince) return null
    
    const deliveryTimes = {
      'Quebec': {
        fr: 'Livraison demain au Québec si commande avant 21h',
        en: 'Delivery tomorrow to Quebec if ordered before 9PM',
        condition: { fr: '*Valable pour les commandes avant 21h au Québec uniquement.', en: '*Valid for orders before 9PM in Quebec only.' }
      },
      'Ontario': {
        fr: 'Livraison demain en Ontario si commande avant 21h',
        en: 'Delivery tomorrow to Ontario if ordered before 9PM',
        condition: { fr: '*Valable pour les commandes avant 21h en Ontario uniquement.', en: '*Valid for orders before 9PM in Ontario only.' }
      },
      'British Columbia': {
        fr: 'Livraison demain en Colombie-Britannique si commande avant 21h',
        en: 'Delivery tomorrow to British Columbia if ordered before 9PM',
        condition: { fr: '*Valable pour les commandes avant 21h en Colombie-Britannique uniquement.', en: '*Valid for orders before 9PM in British Columbia only.' }
      },
      'Alberta': {
        fr: 'Livraison demain en Alberta si commande avant 21h',
        en: 'Delivery tomorrow to Alberta if ordered before 9PM',
        condition: { fr: '*Valable pour les commandes avant 21h en Alberta uniquement.', en: '*Valid for orders before 9PM in Alberta only.' }
      },
      'Manitoba': {
        fr: 'Livraison demain au Manitoba si commande avant 21h',
        en: 'Delivery tomorrow to Manitoba if ordered before 9PM',
        condition: { fr: '*Valable pour les commandes avant 21h au Manitoba uniquement.', en: '*Valid for orders before 9PM in Manitoba only.' }
      },
      'Saskatchewan': {
        fr: 'Livraison demain en Saskatchewan si commande avant 21h',
        en: 'Delivery tomorrow to Saskatchewan if ordered before 9PM',
        condition: { fr: '*Valable pour les commandes avant 21h en Saskatchewan uniquement.', en: '*Valid for orders before 9PM in Saskatchewan only.' }
      },
      'Nova Scotia': {
        fr: 'Livraison demain en Nouvelle-Écosse si commande avant 21h',
        en: 'Delivery tomorrow to Nova Scotia if ordered before 9PM',
        condition: { fr: '*Valable pour les commandes avant 21h en Nouvelle-Écosse uniquement.', en: '*Valid for orders before 9PM in Nova Scotia only.' }
      },
      'New Brunswick': {
        fr: 'Livraison demain au Nouveau-Brunswick si commande avant 21h',
        en: 'Delivery tomorrow to New Brunswick if ordered before 9PM',
        condition: { fr: '*Valable pour les commandes avant 21h au Nouveau-Brunswick uniquement.', en: '*Valid for orders before 9PM in New Brunswick only.' }
      },
      'Newfoundland': {
        fr: 'Livraison demain à Terre-Neuve si commande avant 21h',
        en: 'Delivery tomorrow to Newfoundland if ordered before 9PM',
        condition: { fr: '*Valable pour les commandes avant 21h à Terre-Neuve uniquement.', en: '*Valid for orders before 9PM in Newfoundland only.' }
      },
      'PEI': {
        fr: 'Livraison demain à l\'Île-du-Prince-Édouard si commande avant 21h',
        en: 'Delivery tomorrow to PEI if ordered before 9PM',
        condition: { fr: '*Valable pour les commandes avant 21h à l\'Île-du-Prince-Édouard uniquement.', en: '*Valid for orders before 9PM in PEI only.' }
      },
      'Northwest Territories': {
        fr: 'Livraison demain aux Territoires du Nord-Ouest si commande avant 21h',
        en: 'Delivery tomorrow to Northwest Territories if ordered before 9PM',
        condition: { fr: '*Valable pour les commandes avant 21h aux Territoires du Nord-Ouest uniquement.', en: '*Valid for orders before 9PM in Northwest Territories only.' }
      },
      'Yukon': {
        fr: 'Livraison demain au Yukon si commande avant 21h',
        en: 'Delivery tomorrow to Yukon if ordered before 9PM',
        condition: { fr: '*Valable pour les commandes avant 21h au Yukon uniquement.', en: '*Valid for orders before 9PM in Yukon only.' }
      },
      'Nunavut': {
        fr: 'Livraison demain au Nunavut si commande avant 21h',
        en: 'Delivery tomorrow to Nunavut if ordered before 9PM',
        condition: { fr: '*Valable pour les commandes avant 21h au Nunavut uniquement.', en: '*Valid for orders before 9PM in Nunavut only.' }
      }
    }
    
    return deliveryTimes[userProvince as keyof typeof deliveryTimes] || deliveryTimes['Quebec']
  }
  
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = 0
    touchStartX.current = e.targetTouches[0].clientX
  }
  
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }
  
  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe && selectedImageIndex < productImages.length - 1) {
      setSelectedImageIndex(prev => prev + 1)
    }
    if (isRightSwipe && selectedImageIndex > 0) {
      setSelectedImageIndex(prev => prev - 1)
    }
  }

  const productImages = [
    "/product5.webp",
    "/product2.webp", 
    "/product3.webp",
    "/product4.webp",
    "/product1.webp"
  ]

  const product = {
    id: "betterclean-pro-1",
    name: isFr ? "Brosse Électrique BetterClean" : "BetterClean Electric Scrubber",
    rating: 4.2,
    totalReviews: 247,
    price: 23.97,
    originalPrice: 56.99,
    description: isFr 
      ? "Réduisez votre temps de nettoyage de moitié tout en obtenant de meilleurs résultats - la brosse électrique BetterClean offre une puissance professionnelle qui fait disparaître les taches tenaces avec un effort minimal."
      : "Cut your cleaning time in half while getting better results - BetterClean Electric Scrubber delivers professional-grade power that makes stubborn stains disappear with zero elbow grease.",
    features: isFr ? [
      "Un outil, possibilités infinies",
      "Conçu pour durer",
      "Résultats dignes d'une photo",
      "Moteur puissant",
      "Longue autonomie de batterie",
      "Conception étanche"
    ] : [
      "One Tool, Endless Possibilities",
      "Built to Last",
      "Photo Worthy Results",
      "Powerful Motor",
      "Long Battery Life",
      "Waterproof Design"
    ]
  }

  const bundles = [
    {
      id: "buy1",
      name: isFr ? "Acheter 1" : "Buy 1",
      price: 23.97,
      originalPrice: 56.99,
      savings: 30.02,
      description: isFr ? "Une brosse électrique BetterClean" : "Single BetterClean Electric Scrubber"
    },
    {
      id: "buy2",
      name: isFr ? "Acheter 2 & Économiser" : "Buy 2 & Save",
      price: 44.99,
      originalPrice: 53.98,
      savings: 69.01,
      description: isFr ? "Deux brosses électriques BetterClean" : "Two BetterClean Electric Scrubbers",
      popular: true
    },
    {
      id: "buy3",
      name: isFr ? "Acheter 3 & Économiser" : "Buy 3 & Save",
      price: 64.99,
      originalPrice: 80.97,
      savings: 105.98,
      description: isFr ? "Trois brosses électriques BetterClean" : "Three BetterClean Electric Scrubbers"
    }
  ]

  const faqs = isFr ? [
    {
      q: "Sur quelles surfaces puis-je utiliser le BetterClean Pro ?",
      a: "Cette brosse est sécuritaire à utiliser sur la plupart des surfaces domestiques courantes, y compris les carreaux, les joints, les éviers, les baignoires, les douches, les cuisinières et la vaisselle. Avec les différentes brosses incluses, vous pouvez passer entre un nettoyage doux et un frottement plus intense selon la surface."
    },
    {
      q: "Est-elle assez puissante pour éliminer la saleté tenace et les taches ?",
      a: "Oui. Le moteur rotatif à grande vitesse est conçu pour éliminer le crasse accumulée, le savon, la graisse et les taches avec un effort minimal. Vous n'avez pas besoin d'appuyer fort, laissez simplement le BetterClean Pro faire le travail pour vous."
    },
    {
      q: "Combien de temps dure la batterie avec une charge complète ?",
      a: "La durée de vie de la batterie peut varier selon le réglage de vitesse et la surface nettoyée, mais elle est conçue pour un usage pratique quotidien jusqu'à 2 heures."
    },
    {
      q: "La brosse est-elle étanche et sécuritaire à utiliser autour de l'eau ?",
      a: "Oui, le BetterClean Pro est conçu pour gérer les environnements humides comme les salles de bain et les cuisines, avec une classification IPX7. Il est sécuritaire à utiliser avec de l'eau et des solutions de nettoyage, ce qui le rend idéal pour les éviers, les douches et la vaisselle."
    },
    {
      q: "Est-ce qu'elle vient avec des têtes de brosse de rechange ?",
      a: "Oui. La brosse est livrée avec plusieurs têtes interchangeables, vous permettant de nettoyer différentes zones plus efficacement. Les têtes de rechange peuvent également être changées facilement au besoin, vous permettant de continuer à utiliser le même appareil à long terme."
    },
  ] : [
    {
      q: "What surfaces can I use the BetterClean Pro on?",
      a: "This scrubber is safe to use on most common household surfaces including tiles, grout, sinks, bathtubs, showers, stovetops and dishes. With the different brush heads included, you can switch between gentle cleaning and tougher scrubbing depending on the surface.",
    },
    {
      q: "Is it powerful enough to remove tough dirt and stains?",
      a: "Yes. The high-speed rotating motor is designed to remove built-up grime, soap scum, grease and stains with minimal effort. You don't need to press hard, just let the BetterClean Pro do the work for you.",
    },
    {
      q: "How long does the battery last on a full charge?",
      a: "Battery life may vary depending on the speed setting and surface being cleaned, but it's designed for practical, everyday use to last up to 2 hours.",
    },
    {
      q: "Is the scrubber waterproof and safe to use around water?",
      a: "Yes, the BetterClean Pro is built to handle wet environments like bathrooms and kitchens, boasting an IPX7 rating. It's safe to use with water and cleaning solutions, making it ideal for sinks, showers, and dishes.",
    },
    {
      q: "Does it come with replacement brush heads?",
      a: "Yes. The scrubber comes with multiple interchangeable brush heads, allowing you to clean different areas more effectively. Replacement heads can also be swapped easily when needed, so you can keep using the same device long-term.",
    },
  ]

  const selectedBundleData = bundles.find(b => b.id === selectedBundle) || bundles[1]

  // TikTok ViewContent event + Telegram notification
  useEffect(() => {
    const eventId = `vc_${id}_${Date.now()}`
    // TikTok ViewContent event
    ttqTrack('ViewContent', {
      content_id: product.id,
      content_type: 'product',
      content_name: product.name,
      content_category: 'cleaning',
      value: Number(selectedBundleData.price) || 0,
      currency: 'CAD',
    })
    
    // Meta Pixel ViewContent event
    fbqTrack('ViewContent', {
      content_ids: [product.id],
      content_type: 'product',
      content_name: product.name,
      content_category: 'cleaning',
      value: Number(selectedBundleData.price) || 0,
      currency: 'CAD',
    })

    // Telegram notification for page visit
    if (product.id === 'betterclean-pro-1') {
      fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'page_visit',
          productName: product.name,
          productId: product.id,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          ip: 'Client IP',
        }),
      }).catch(() => {})
    }
  }, [id, product, selectedBundleData])

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedBundle}`,
      name: `${product.name} - ${selectedBundleData.name}`,
      price: selectedBundleData.price,
      originalPrice: selectedBundleData.originalPrice,
      image: productImages[0],
      variant: selectedBundleData.name,
    })
    console.log("Product added to cart!")

    // Cart opens automatically via addItem in cart context

    // Telegram notification for cart addition
    if (product.id === 'betterclean-pro-1') {
      fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'add_to_cart',
          productName: `${product.name} - ${selectedBundleData.name}`,
          productId: product.id,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {})
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Product Header */}
      <section className="px-4 py-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Product Image Gallery - Improved swipeable gallery */}
            <div className="relative">
              {/* Main Image with Swipe Support */}
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
                <div 
                  className="flex h-full transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${selectedImageIndex * 100}%)` }}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  {productImages.map((image, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0 relative">
                      <Image 
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        className="object-contain"
                        priority={index === 0}
                        quality={100}
                        unoptimized
                        sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 40vw"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Navigation Arrows */}
                <button 
                  onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : productImages.length - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-800" />
                </button>
                <button 
                  onClick={() => setSelectedImageIndex(prev => prev < productImages.length - 1 ? prev + 1 : 0)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                >
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full z-10">
                  {selectedImageIndex + 1} / {productImages.length}
                </div>
              </div>
              
              {/* Thumbnail Images - Horizontal scroll below main image */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-[#5a9ea8] ring-2 ring-[#5a9ea8]/20' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image 
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      quality={100}
                      unoptimized
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white">
              <h1 className="text-3xl font-semibold mb-2 text-black">
                BetterClean Electric Scrubber
              </h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-black text-black" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.totalReviews})
                </span>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice} CAD
                  </span>
                  <span className="text-2xl font-semibold text-black">
                    ${product.price} CAD
                  </span>
                  <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                    Sale
                  </span>
                </div>
              </div>

              {/* Bundle Selection */}
              <div className="mb-6">
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="text-base font-medium text-black mb-2">
                    Buy More, Save More
                  </h3>
                  <p className="text-sm text-gray-600">
                    Time-limited offer!
                  </p>
                </div>
                <div className="space-y-2">
                  {bundles.map((bundle) => (
                    <div
                      key={bundle.id}
                      onClick={() => setSelectedBundle(bundle.id)}
                      className={`relative p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedBundle === bundle.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {bundle.popular && (
                        <div className="absolute -top-2 right-3">
                          <span className="bg-black text-white text-xs font-medium px-2 py-0.5 rounded">
                            Most Popular
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedBundle === bundle.id ? 'border-black bg-black' : 'border-gray-400'
                          }`}>
                            {selectedBundle === bundle.id && (
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-black text-sm">
                              {bundle.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              Regular price
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-semibold text-black">
                            ${bundle.price}
                          </div>
                          <div className="text-xs text-gray-500 line-through">
                            ${bundle.originalPrice}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="mb-6">
                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium rounded-lg transition-colors"
                >
                  {isFr ? 'Ajouter au panier' : 'Add to cart'}
                </Button>
              </div>


              {/* Features List */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-[#1a1a1a] font-[var(--font-dm-sans)]">
                  {isFr ? 'Caractéristiques Clés' : 'Key Features'}
                </h3>
                <div className="space-y-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#5a9ea8] flex-shrink-0" />
                      <span className="text-gray-700 font-[var(--font-dm-sans)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Description */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a1a1a] font-[var(--font-dm-sans)]">
            {isFr ? 'Description du Produit' : 'Product Description'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed font-[var(--font-dm-sans)]">
            {product.description}
          </p>
        </div>
      </section>

      {/* Smart Delivery Promise */}
      {userProvince && getDeliveryMessage() && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-12">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-2">
              <Truck className="w-8 h-8 text-green-600" />
              <h3 className="text-lg font-bold text-green-800">
                {isFr ? getDeliveryMessage()?.fr : getDeliveryMessage()?.en}
              </h3>
            </div>
            <p className="text-green-700 text-sm font-[var(--font-dm-sans)]">
              {isFr ? getDeliveryMessage()?.condition.fr : getDeliveryMessage()?.condition.en}
            </p>
          </div>
        </div>
      )}

      {/* Trust & Confidence Section */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a1a] font-[var(--font-dm-sans)]">
              {isFr ? 'Pourquoi Choisir BetterClean ?' : 'Why Choose BetterClean?'}
            </h2>
            <p className="text-lg text-gray-600 font-[var(--font-dm-sans)]">
              {isFr ? 'Rejoignez des milliers de clients satisfaits qui ont transformé leur routine de nettoyage' : 'Join thousands of satisfied customers who\'ve transformed their cleaning routine'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Trust Elements */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5a9ea8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1a1a1a] font-[var(--font-dm-sans)]">
                {isFr ? 'Garantie 30 jours' : '30-Day Guarantee'}
              </h3>
              <p className="text-gray-600 font-[var(--font-dm-sans)]">
                {isFr ? 'Pas satisfait ? Remboursez sous 30 jours.' : 'Not satisfied? Return it within 30 days for a full refund.'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#5a9ea8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1a1a1a] font-[var(--font-dm-sans)]">
                {isFr ? 'Livraison Gratuite Partout au Canada' : 'Free Shipping Across Canada'}
              </h3>
              <p className="text-gray-600 font-[var(--font-dm-sans)]">
                {isFr ? 'Livraison rapide et sécurisée directement à votre porte. Suivez votre commande à chaque étape.' : 'Fast and secure delivery to your door. Track your order every step of the way.'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#5a9ea8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1a1a1a] font-[var(--font-dm-sans)]">
                {isFr ? 'Résultats Prouvés' : 'Proven Results'}
              </h3>
              <p className="text-gray-600 font-[var(--font-dm-sans)]">
                {isFr ? 'Plus de 1000 clients ont réduit leur temps de nettoyage de moitié avec BetterClean.' : 'Over 10,000+ customers have cut their cleaning time in half with BetterClean.'}
              </p>
            </div>
          </div>

          {/* Customer Testimonials */}
          <div className="bg-white rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-[#1a1a1a] font-[var(--font-dm-sans)]">
              {isFr ? 'Ce que disent nos clients' : 'What Our Customers Say'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 font-[var(--font-dm-sans)] italic">
                  "This scrubber is amazing! It cleaned my bathroom tiles like new in minutes. Worth every penny."
                </p>
                <div className="font-semibold text-[#1a1a1a] font-[var(--font-dm-sans)]">Sarah M.</div>
                <div className="text-sm text-gray-500 font-[var(--font-dm-sans)]">Verified Buyer</div>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 font-[var(--font-dm-sans)] italic">
                  "I was skeptical at first, but this really does cut cleaning time in half. My kitchen has never been cleaner!"
                </p>
                <div className="font-semibold text-[#1a1a1a] font-[var(--font-dm-sans)]">Mike R.</div>
                <div className="text-sm text-gray-500 font-[var(--font-dm-sans)]">Verified Buyer</div>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 font-[var(--font-dm-sans)] italic">
                  "Best cleaning tool I've ever bought. The different brush heads work perfectly for every surface."
                </p>
                <div className="font-semibold text-[#1a1a1a] font-[var(--font-dm-sans)]">Lisa K.</div>
                <div className="text-sm text-gray-500 font-[var(--font-dm-sans)]">Verified Buyer</div>
              </div>
            </div>
          </div>

          {/* Product Guarantees */}
          <div className="bg-gradient-to-r from-[#5a9ea8] to-[#4a8a94] rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4 font-[var(--font-dm-sans)]">
              {isFr ? 'Votre Achat est Protégé' : 'Your Purchase is Protected'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3">
                <Check className="w-6 h-6 flex-shrink-0" />
                <span className="font-[var(--font-dm-sans)]">{isFr ? 'Garantie Remboursement 30 jours' : '30-Day Money Back Guarantee'}</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Check className="w-6 h-6 flex-shrink-0" />
                <span className="font-[var(--font-dm-sans)]">{isFr ? 'Garantie Produit 1 An' : '1-Year Product Warranty'}</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Check className="w-6 h-6 flex-shrink-0" />
                <span className="font-[var(--font-dm-sans)]">{isFr ? 'Paiement Sécurisé' : 'Secure Payment Processing'}</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Check className="w-6 h-6 flex-shrink-0" />
                <span className="font-[var(--font-dm-sans)]">{isFr ? 'Support client 24/7' : '24/7 Customer Support'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a1a] font-[var(--font-dm-sans)]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-[#1a1a1a] pr-4 font-[var(--font-dm-sans)]">
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-gray-700 leading-relaxed font-[var(--font-dm-sans)]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Need More Brush Section */}
      <section id="brush-section" className="px-4 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a1a] font-[var(--font-dm-sans)]">
              Need More Brush?
            </h2>
            <p className="text-lg text-gray-600 font-[var(--font-dm-sans)]">
              Keep your BetterClean performing at its best with replacement brush heads
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {/* 5 Brush Heads Product */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="aspect-square bg-gray-100 rounded-xl mb-6 overflow-hidden max-w-xs mx-auto">
                <Image 
                  src="/product1.webp" 
                  alt="5 Replacement Brush Heads"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#1a1a1a] font-[var(--font-dm-sans)]">
                5 Replacement Brush Heads
              </h3>
              <p className="text-gray-600 mb-6 font-[var(--font-dm-sans)]">
                Complete set of 5 professional brush heads for different surfaces. Keep your BetterClean scrubber working like new.
              </p>
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-3xl font-bold text-[#5a9ea8] font-[var(--font-dm-sans)]">$10.00</span>
                <span className="text-lg text-gray-500 line-through font-[var(--font-dm-sans)]">$24.99</span>
                <span className="bg-[#5a9ea8] text-white text-sm font-semibold px-3 py-1 rounded-full">
                  60% OFF
                </span>
              </div>
              <button 
                onClick={() => {
                  addItem({
                    id: 'replacement-brush-heads-5',
                    name: '5 Replacement Brush Heads',
                    price: 10.00,
                    originalPrice: 24.99,
                    image: '/product1.webp',
                    variant: 'Replacement Set'
                  })
                }}
                className="w-full bg-[#5a9ea8] hover:bg-[#4a8a94] text-white py-4 rounded-full font-bold text-lg transition-colors font-[var(--font-dm-sans)] mb-4"
              >
                {isFr ? 'Ajouter au Panier - 10,00 $' : 'Add to Cart - $10.00'}
              </button>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-[#5a9ea8]" />
                  <span className="font-[var(--font-dm-sans)]">{isFr ? 'Compatible avec tous les modèles BetterClean' : 'Compatible with all BetterClean models'}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-[#5a9ea8]" />
                  <span className="font-[var(--font-dm-sans)]">{isFr ? 'Facile à installer et remplacer' : 'Easy to install and replace'}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-[#5a9ea8]" />
                  <span className="font-[var(--font-dm-sans)]">{isFr ? 'Qualité professionnelle durable' : 'Long-lasting professional quality'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Reviews Section */}
      <ReviewsSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}

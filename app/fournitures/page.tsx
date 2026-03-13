"use client"

import { useRef, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Droplets, Zap, Shield, Volume2, Play } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { products } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { useI18n } from "@/lib/i18n-context"
import { useLocalizedProduct } from "@/lib/use-localized-product"

export default function FournituresPage() {
  const { addItem } = useCart()
  const { t, formatPrice } = useI18n()
  const { localize } = useLocalizedProduct()
  const fountain = localize(products.find(p => p.id === "purr-fountain-f1")!)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayVideo = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      video.play()
      setIsPlaying(true)
    }
  }, [isPlaying])

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (video && video.currentTime >= 93) {
      video.pause()
      video.currentTime = 0
      setIsPlaying(false)
    }
  }, [])

  const handleAddToCart = () => {
    addItem({
      id: fountain.id,
      name: fountain.name,
      price: fountain.price,
      originalPrice: fountain.originalPrice,
      image: fountain.image,
      variant: `#PAWPAW -${Math.round((1 - fountain.price / fountain.originalPrice) * 100)}% appliqué`,
    })
  }

  const highlights = [
    { icon: Droplets, title: t.fournituresPage.pumpless, desc: t.fournituresPage.pumplessDesc },
    { icon: Zap, title: t.fournituresPage.smartSensor, desc: t.fournituresPage.smartSensorDesc },
    { icon: Shield, title: t.fournituresPage.safe, desc: t.fournituresPage.safeDesc },
    { icon: Volume2, title: t.fournituresPage.quiet, desc: t.fournituresPage.quietDesc },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Banner */}
      <section className="relative h-[200px] md:h-[320px] overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dhhdhilja/image/upload/v1770517763/purrball/petfount.webp"
          alt="Accessoires BetterClean"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent" />
        <div className="absolute bottom-8 left-6 md:left-12 z-10">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">{t.fournituresPage.collection}</p>
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            {t.fournituresPage.title}
          </h1>
          <p className="text-neutral-600 text-sm md:text-base mt-2 max-w-md">
            {t.fournituresPage.subtitle}
          </p>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-block bg-brand/10 text-brand text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
              {t.fournituresPage.new}
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-3">
              BetterClean System F1
            </h2>
            <p className="text-neutral-500 text-sm md:text-base max-w-xl mx-auto">
              {t.fournituresPage.productSubtitle}
            </p>
          </div>

          {/* Product Hero - Big image + Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center mb-16">
            {/* Left: Main Product Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-neutral-100">
              <Image
                src={fountain.image}
                alt={fountain.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6"
                loading="lazy"
              />
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                -{Math.round((1 - fountain.price / fountain.originalPrice) * 100)}%
              </span>
            </div>

            {/* Right: Product Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="border border-neutral-200 text-neutral-500 text-[11px] font-medium px-3 py-1 rounded-full uppercase tracking-wide">{t.fournituresPage.title}</span>
                <span className="bg-red-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                  {t.fournituresPage.save} {Math.round((1 - fountain.price / fountain.originalPrice) * 100)}%
                </span>
              </div>

              <h3 className="text-3xl font-bold text-neutral-900 tracking-tight mb-3">{fountain.name}</h3>

              <div className="flex items-center gap-1.5 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(fountain.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200'}`} />
                  ))}
                </div>
                <span className="text-xs text-neutral-400 ml-1">{fountain.rating} ({fountain.reviewCount} {t.fournituresPage.reviews})</span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl font-bold text-red-600">{formatPrice(fountain.price)}</span>
                <span className="text-lg text-neutral-300 line-through">{formatPrice(fountain.originalPrice)}</span>
              </div>

              {/* #PAWPAW discount badge */}
              <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="text-green-700 text-xs font-medium">{t.fournituresPage.discount} <span className="font-bold">#PAWPAW</span> -{Math.round((1 - fountain.price / fountain.originalPrice) * 100)}% {t.fournituresPage.discountApplied}</span>
              </div>

              <p className="text-xs text-orange-600 flex items-center gap-1 mb-4">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                {t.fournituresPage.title === 'Fournitures' ? `Seulement ${fountain.stockCount} en stock` : `Only ${fountain.stockCount} left in stock`}
              </p>

              <p className="text-neutral-600 text-sm leading-relaxed mb-6">{fountain.description}</p>

              <ul className="text-neutral-600 text-sm space-y-2 mb-8">
                {fountain.features.slice(0, 5).map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-brand rounded-full mt-1.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-brand hover:bg-brand-dark text-white py-3.5 rounded-full font-medium text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {t.fournituresPage.addToCart}
                </button>
                <Link
                  href={`/produits/${fountain.id}`}
                  className="flex-1 border border-brand text-brand hover:bg-brand hover:text-white py-3.5 rounded-full font-medium text-sm uppercase tracking-wider transition-all text-center"
                >
                  {t.fournituresPage.viewDetails}
                </Link>
              </div>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {highlights.map((h, i) => (
              <div key={i} className="bg-neutral-50 rounded-2xl p-5 text-center">
                <h.icon className="w-7 h-7 text-brand mx-auto mb-3" />
                <h4 className="font-semibold text-neutral-900 text-sm mb-1">{h.title}</h4>
                <p className="text-neutral-500 text-xs">{h.desc}</p>
              </div>
            ))}
          </div>


          {/* CTA Section */}
          <div className="bg-neutral-900 rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {t.fournituresPage.ctaTitle}
            </h3>
            <p className="text-neutral-400 text-sm md:text-base mb-6 max-w-lg mx-auto">
              {t.fournituresPage.ctaSubtitle}
            </p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-3xl font-bold text-white">CA${fountain.price.toFixed(2)}</span>
              <span className="text-lg text-neutral-500 line-through">CA${fountain.originalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-brand hover:bg-brand-dark text-white px-10 py-4 rounded-full font-medium text-sm uppercase tracking-wider transition-all inline-flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {t.fournituresPage.addToCart} — CA${fountain.price.toFixed(2)}
            </button>
          </div>
        </div>
      </section>

      {/* Product Video */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight mb-6 text-center">
            {t.fournituresPage.videoTitle}
          </h3>
          <div
            className="relative rounded-2xl overflow-hidden bg-neutral-900 cursor-pointer group"
            onClick={handlePlayVideo}
          >
            <video
              ref={videoRef}
              src="/pet_video.mp4#t=1"
              className="w-full aspect-video object-cover"
              playsInline
              preload="none"
              onTimeUpdate={handleTimeUpdate}
            />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="https://res.cloudinary.com/dhhdhilja/image/upload/v1770517681/purrball/pet_fountain_elfin_e1_plus_video_post_image_1.jpg.webp"
                  alt="Purr Fountain F1 Video"
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="relative w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-neutral-900 ml-1" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Knowledge Slide */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden">
          <Image
            src="https://res.cloudinary.com/dhhdhilja/image/upload/v1770517666/purrball/knowleage_slide2_pc.jpg.webp"
            alt="Purr Fountain F1 - Guide"
            width={1200}
            height={600}
            sizes="(max-width: 1024px) 100vw, 896px"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      </section>

      {/* Cross-sell: Toys */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="https://res.cloudinary.com/dhhdhilja/image/upload/v1770517604/purrball/Section2_-_Featured_Cat_Toy.jpg.webp"
                alt={t.fournituresPage.title === 'Fournitures' ? 'Jouets pour chats' : 'Cat toys'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <span className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                {t.fournituresPage.title === 'Fournitures' ? 'Jouets' : 'Toys'}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight mb-4">
                {t.fournituresPage.title === 'Fournitures' ? 'Stimulez l\'Instinct de Jeu de Votre Chat' : 'Stimulate Your Cat\'s Play Instinct'}
              </h2>
              <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                {t.fournituresPage.title === 'Fournitures'
                  ? "Un chat hydraté est un chat en bonne santé, mais un chat actif l'est encore plus ! Nos jouets interactifs intelligents stimulent les instincts naturels de chasse de votre félin, favorisent l'exercice quotidien et renforcent votre lien."
                  : "A hydrated cat is a healthy cat, but an active cat is even healthier! Our smart interactive toys stimulate your cat's natural hunting instincts, promote daily exercise and strengthen your bond."}
              </p>
              <ul className="space-y-2 mb-6">
                {(t.fournituresPage.title === 'Fournitures'
                  ? ['Balle auto-roulante intelligente', 'Stimulation mentale et physique', 'Rechargeable par USB', 'Économisez jusqu\'à 58%']
                  : ['Smart auto-rolling ball', 'Mental and physical stimulation', 'USB rechargeable', 'Save up to 58%']
                ).map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-neutral-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-medium px-6 py-3 rounded-full text-sm transition-all"
              >
                {t.fournituresPage.title === 'Fournitures' ? 'Voir Nos Jouets' : 'See Our Toys'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-sell: Cat Care Guide */}
      <section className="py-16 px-4 bg-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/10 text-white/80 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            {t.fournituresPage.title === 'Fournitures' ? 'Guide Santé' : 'Health Guide'}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
            {t.fournituresPage.title === 'Fournitures' ? 'Tout Savoir sur la Santé de Votre Chat' : 'Everything About Your Cat\'s Health'}
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed mb-8 max-w-2xl mx-auto">
            {t.fournituresPage.title === 'Fournitures'
              ? "L'hydratation n'est qu'un aspect de la santé de votre chat. Découvrez notre guide complet avec les meilleures pratiques pour l'alimentation, l'exercice, les soins et les signes à surveiller."
              : "Hydration is just one aspect of your cat's health. Discover our complete guide with best practices for nutrition, exercise, care and warning signs to watch for."}
          </p>
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 bg-white text-neutral-900 font-medium px-6 py-3 rounded-full text-sm hover:bg-neutral-100 transition-all"
          >
            {t.fournituresPage.title === 'Fournitures' ? 'Lire le Guide Santé Chat' : 'Read the Cat Health Guide'}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BenefitsSection from "@/components/benefits-section"
import { products } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { useI18n } from "@/lib/i18n-context"
import { useLocalizedProduct } from "@/lib/use-localized-product"

export default function ProductsPage() {
  const { addItem } = useCart()
  const { t, formatPrice } = useI18n()
  const { localize } = useLocalizedProduct()
  const product = localize(products[0])

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Banner */}
      <section className="relative h-[140px] md:h-[200px] overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dhhdhilja/image/upload/v1770517587/purrball/CollectionPage-cat-banner.jpg.webp"
          alt={t.productsPage.heroBannerAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 to-transparent" />
        <div className="absolute bottom-6 left-6 md:left-12 z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            {t.productsPage.title}
          </h1>
        </div>
      </section>

      {/* Trending This Month */}
      <section className="py-10 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-6 md:mb-14">
            {t.productsPage.trending}
          </h2>

          {/* Mobile: Photo first, then simple info below like Cheerble */}
          <div className="md:hidden">
            {/* Big lifestyle photo */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
              <Image
                src="https://res.cloudinary.com/dhhdhilja/image/upload/v1770517604/purrball/Section2_-_Featured_Cat_Toy.jpg.webp"
                alt={t.productsPage.featuredProductAlt}
                fill
                sizes="100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>

            {/* Simple product info below */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="border border-neutral-200 text-neutral-500 text-[10px] font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wide">{t.productsPage.cat}</span>
                <span className="bg-red-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">{t.productsPage.save} {Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
              </div>

              <h3 className="text-lg font-bold text-neutral-900 tracking-tight">{product.name}</h3>

              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-neutral-900">{formatPrice(product.price)}</span>
                <span className="text-sm text-neutral-300 line-through">{formatPrice(product.originalPrice)}</span>
                <div className="flex items-center gap-1 ml-auto">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-neutral-400">{product.rating}({product.reviewCount})</span>
                </div>
              </div>

              <p className="text-xs text-orange-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                {t.productsPage.stockText.replace('{count}', product.stockCount.toString())}
              </p>

              <p className="text-neutral-500 text-xs leading-relaxed">{product.description}</p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-brand hover:bg-brand-dark text-white py-3 rounded-full font-medium text-xs uppercase tracking-wider transition-all"
                >
                  {t.productsPage.addToCart}
                </button>
                <Link
                  href={`/produits/${product.id}`}
                  className="flex-1 border border-brand text-brand py-3 rounded-full font-medium text-xs uppercase tracking-wider transition-all text-center"
                >
                  {t.productsPage.viewDetails}
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop: Side by side layout */}
          <div className="hidden md:grid grid-cols-2 gap-12 items-start">
            {/* Left: Product Info */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="border border-neutral-200 text-neutral-500 text-[11px] font-medium px-3 py-1 rounded-full uppercase tracking-wide">{t.productsPage.cat}</span>
                <span className="bg-red-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">{t.productsPage.save} {Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
              </div>

              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-3xl font-bold text-neutral-900 tracking-tight leading-tight">{product.name}</h3>
                <div className="flex items-center gap-1 flex-shrink-0 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-400 ml-1">{product.rating}({product.reviewCount})</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl font-bold text-neutral-900">{formatPrice(product.price)}</span>
                <span className="text-base text-neutral-300 line-through">{formatPrice(product.originalPrice)}</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                {product.colors.map((color, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full border-2 ${i === 0 ? 'border-neutral-900' : 'border-neutral-200'}`} style={{ backgroundColor: color.value }} title={color.name} />
                ))}
              </div>
              <p className="text-xs text-orange-600 flex items-center gap-1 mb-6">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                {t.productsPage.stockText.replace('{count}', product.stockCount.toString())}
              </p>

              <div className="border-t border-neutral-100 mb-6" />

              <p className="text-neutral-600 text-sm leading-relaxed mb-4">{product.description}</p>

              <ul className="text-neutral-600 text-sm space-y-1.5 mb-8">
                {product.features.map((feature, i) => (
                  <li key={i}>• {feature}</li>
                ))}
              </ul>

              <div className="flex items-center gap-3">
                <button onClick={handleAddToCart} className="bg-brand hover:bg-brand-dark text-white px-8 py-3.5 rounded-full font-medium text-sm uppercase tracking-wider transition-all">{t.productsPage.addToCart}</button>
                <Link href={`/produits/${product.id}`} className="border border-brand text-brand hover:bg-brand hover:text-white px-8 py-3.5 rounded-full font-medium text-sm uppercase tracking-wider transition-all">{t.productsPage.learnMore}</Link>
              </div>
            </div>

            {/* Right: Lifestyle photo */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://res.cloudinary.com/dhhdhilja/image/upload/v1770517604/purrball/Section2_-_Featured_Cat_Toy.jpg.webp"
                alt={t.productsPage.featuredProductAlt}
                fill
                sizes="50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-16 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight mb-10">
            {t.productsPage.allProducts}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {products.filter(p => p.category !== 'Fournitures').slice(1).map((rawP) => {
              const p = localize(rawP)
              return (
              <Link key={p.id} href={`/produits/${p.id}`} className="group block">
                <div className="relative aspect-square bg-white rounded-2xl overflow-hidden mb-4 border border-neutral-100">
                  <span className="absolute top-3 right-3 z-10 bg-red-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                  </span>
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="px-1">
                  <h3 className="font-semibold text-neutral-900 text-sm mb-1">{p.name}</h3>
                  <p className="text-neutral-400 text-xs mb-2">{p.description.slice(0, 60)}...</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base font-bold text-red-600">{formatPrice(p.price)}</span>
                    <span className="text-sm text-neutral-300 line-through">{formatPrice(p.originalPrice)}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      addItem({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        originalPrice: p.originalPrice,
                        image: p.image,
                      })
                    }}
                    className="w-full bg-brand hover:bg-brand-dark text-white px-4 py-2.5 rounded-full font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {t.productsPage.addToCart}
                  </button>
                </div>
              </Link>
            )})}
          </div>
        </div>
      </section>

      {/* Product Video - lazy load with click to play */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden bg-neutral-900">
          <video
            src="https://res.cloudinary.com/dhhdhilja/video/upload/v1770517640/purrball/e7c69d7aa78343edb5974d2576e163fb.HD-1080p-7.2Mbps-46122013.mp4#t=4"
            poster="https://res.cloudinary.com/dhhdhilja/video/upload/so_4,w_800,f_jpg/v1770517640/purrball/e7c69d7aa78343edb5974d2576e163fb.HD-1080p-7.2Mbps-46122013.jpg"
            className="w-full aspect-video object-cover"
            muted
            loop
            playsInline
            preload="none"
            controls
          />
        </div>
      </section>

      {/* Cross-sell: Water Fountain */}
      <section className="py-16 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-neutral-100">
              <Image
                src="https://res.cloudinary.com/dhhdhilja/image/upload/v1770517651/purrball/e__pumpless_design.webp"
                alt={t.productsPage.fountainAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                {t.header.fournitures}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight mb-4">
                {t.productsPage.fountainTitle}
              </h2>
              <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                {t.productsPage.fountainDesc}
              </p>
              <ul className="space-y-2 mb-6">
                {t.productsPage.fountainFeatures.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-neutral-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/fournitures"
                className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-medium px-6 py-3 rounded-full text-sm transition-all"
              >
                {t.productsPage.discoverFountain}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BenefitsSection />
      <Footer />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n-context"

interface Review {
  id: number
  name: string
  rating: number
  date: string
  title: string
  content: string
  photo: string
  verified: boolean
  location: string
}

export default function ReviewsSection() {
  const { t, locale } = useI18n()
  const isFr = locale === 'fr'
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [displayCount, setDisplayCount] = useState(6)
  const [activeFilter, setActiveFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/reviews.json")
      .then((res) => res.json())
      .then((data) => {
        setReviews(data)
        setFilteredReviews(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error loading reviews:", err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let filtered = reviews
    if (activeFilter === "5star") {
      filtered = reviews.filter((r) => r.rating === 5)
    } else if (activeFilter === "verified") {
      filtered = reviews.filter((r) => r.verified)
    } else if (activeFilter === "recent") {
      filtered = [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
    setFilteredReviews(filtered)
    setDisplayCount(6)
  }, [activeFilter, reviews])

  const loadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 6, filteredReviews.length))
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0"

  if (loading) {
    return (
      <section className="px-4 py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">Loading reviews...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="reviews-section" className="px-4 py-16 md:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#1a1a1a] font-[var(--font-dm-sans)]">
            {isFr ? 'Apprécié par des milliers' : 'Loved by Thousands'}
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto font-[var(--font-dm-sans)]">
            {isFr ? 'Rejoignez plus de 100 000 clients satisfaits qui ont transformé leur routine de nettoyage' : 'Join 100,000+ happy customers who transformed their cleaning routine'}
          </p>
          
          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(Number(averageRating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-[#1a1a1a]">{averageRating}</span>
            </div>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">{reviews.length}+ verified reviews</span>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: "all", label: "All Reviews" },
              { id: "5star", label: "5 Stars" },
              { id: "verified", label: "Verified Buyers" },
              { id: "recent", label: "Most Recent" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter.id
                    ? "bg-[#5a9ea8] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredReviews.slice(0, displayCount).map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              {/* Review Photo */}
              <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={`/images/reviews/${review.photo}`}
                  alt={`Review by ${review.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg mb-2 text-[#1a1a1a] font-[var(--font-dm-sans)]">
                {review.title}
              </h3>

              {/* Content */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-4 font-[var(--font-dm-sans)]">
                {review.content}
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="font-semibold text-sm text-[#1a1a1a]">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.location}</p>
                </div>
                {review.verified && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Check className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {displayCount < filteredReviews.length && (
          <div className="text-center">
            <Button
              onClick={loadMore}
              variant="outline"
              className="px-8 py-3 rounded-full border-[#5a9ea8] text-[#5a9ea8] hover:bg-[#5a9ea8] hover:text-white transition-all"
            >
              {isFr ? 'Voir plus' : 'See more'}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

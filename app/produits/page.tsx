"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProductsPage() {
  const router = useRouter()
  
  // Immediate redirect on mount
  useEffect(() => {
    router.replace("/produits/betterclean-pro-1")
  }, [router])

  // Return null or loading state while redirecting
  return null
}

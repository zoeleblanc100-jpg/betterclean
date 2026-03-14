export interface ProductColor {
  name: string
  value: string
  image: string
  stockCount: number
}

export interface ProductPackage {
  quantity: number
  label: string
  pricePerUnit: number
  badge?: string
}

export interface Product {
  id: string
  name: string
  description: string
  descriptionEn: string
  longDescription: string
  longDescriptionEn: string
  price: number
  originalPrice: number
  image: string
  images: string[]
  colors: ProductColor[]
  packages: ProductPackage[]
  category: string
  inStock: boolean
  stockCount: number
  features: string[]
  featuresEn: string[]
  materials: string
  materialsEn: string
  shipping: string
  shippingEn: string
  reviewCount: number
  rating: number
}

export const products: Product[] = [
  {
    id: "betterclean-pro-1",
    name: "Brosse Électrique BetterClean",
    description: "La brosse électrique révolutionnaire qui nettoie en profondeur sans effort.",
    descriptionEn: "The revolutionary electric scrubber brush that deep cleans without effort.",
    longDescription: "BetterClean Pro est la solution de nettoyage ultime pour votre maison. Avec 300 RPM de puissance, 90 minutes d'autonomie et une étanchéité IPX7, elle élimine la saleté tenace partout. Parfaite pour salle de bain, cuisine, carrelage et plus.",
    longDescriptionEn: "BetterClean Pro is the ultimate cleaning solution for your home. With 300 RPM power, 90 minutes battery life and IPX7 waterproof rating, it eliminates tough dirt everywhere. Perfect for bathroom, kitchen, tiles and more.",
    price: 23.97,
    originalPrice: 56.99,
    image: "/product5.webp",
    images: [
      "/product5.webp",
      "/product2.webp", 
      "/product3.webp",
      "/product4.webp",
      "/product1.webp"
    ],
    colors: [
      { name: "Blanc", value: "#ffffff", image: "/product5.webp", stockCount: 50 },
      { name: "Gris", value: "#808080", image: "/product2.webp", stockCount: 30 }
    ],
    packages: [
      { quantity: 1, label: "1x", pricePerUnit: 23.97, badge: "Aujourd'hui seulement - 58%" },
      { quantity: 2, label: "2x", pricePerUnit: 22.49 },
      { quantity: 3, label: "3x", pricePerUnit: 21.66, badge: "Meilleur Deal" }
    ],
    category: "Nettoyage Électrique",
    inStock: true,
    stockCount: 80,
    features: [
      "300 RPM de puissance de nettoyage",
      "90 minutes d'autonomie par charge",
      "Étanchéité IPX7 - utilisez sous l'eau",
      "Tête interchangeable pour différentes surfaces",
      "Rechargeable par USB-C",
      "Légère et ergonomique"
    ],
    featuresEn: [
      "300 RPM cleaning power",
      "90 minutes battery life per charge",
      "IPX7 waterproof rating - use underwater",
      "Interchangeable head for different surfaces",
      "USB-C rechargeable",
      "Lightweight and ergonomic"
    ],
    materials: "Plastique ABS de haute qualité, silicone alimentaire, batterie lithium-ion. Sans BPA.",
    materialsEn: "High-quality ABS plastic, food-grade silicone, lithium-ion battery. BPA-free.",
    shipping: "Expédition en 24h. Livraison garantie avec Canada Post. Livraison gratuite pour les commandes de 2+ unités.",
    shippingEn: "Ships within 24h. Guaranteed delivery with Canada Post. Free shipping on orders of 2+ units.",
    reviewCount: 247,
    rating: 4.2
  }
]

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getRelatedProducts(currentId: string, limit = 4): Product[] {
  return products.filter(p => p.id !== currentId).slice(0, limit)
}

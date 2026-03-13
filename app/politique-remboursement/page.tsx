"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Footer from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"

export default function PolitiqueRemboursementPage() {
  const { locale } = useI18n()
  const isFr = locale === 'fr'

  const sections = isFr ? [
    { title: "1. Notre engagement", content: "Chez BetterClean, votre satisfaction est notre priorité. Nous offrons une politique de remboursement généreuse de 30 jours pour vous assurer une expérience d'achat sans souci." },
    { title: "2. Période de remboursement", content: "Vous avez 30 jours pour demander un remboursement à compter de la date de réception. Remboursement complet, aucune question posée. Frais de retour gratuits pour les défauts de fabrication." },
    { title: "3. Conditions de remboursement", content: "Éligibles : produits non utilisés ou légèrement utilisés, accessoires dans leur emballage, produits défectueux, erreurs de commande. Non éligibles : produits personnalisés, articles fortement endommagés, retours après 30 jours, articles en promotion finale." },
    { title: "4. Comment demander un remboursement", content: "Étape 1 : Contactez-nous à support@bettercleans.ca avec votre numéro de commande, raison du retour et photos si défectueux. Étape 2 : Retournez le produit avec l'étiquette prépayée. Étape 3 : Remboursement traité sous 3-5 jours ouvrables." },
    { title: "5. Types de remboursement", content: "Remboursement complet : produit défectueux, erreur de notre part, retour dans les 7 premiers jours (inclut frais de livraison). Remboursement partiel : retour après 7 jours, produit utilisé, emballage manquant." },
    { title: "6. Frais de retour", content: "Gratuits : produits défectueux, erreur de commande, retours dans les 7 premiers jours. À votre charge ($4.99 CAD) : changement d'avis après 7 jours, commande du mauvais produit." },
    { title: "7. Échanges", content: "Échanges acceptés dans les mêmes conditions. Contactez-nous, retournez le produit, nous expédierons le nouveau dès réception. Différence de prix applicable si nécessaire." },
    { title: "8. Garantie qualité", content: "Garantie 2 mois contre les défauts de fabrication. Remplacement gratuit, réparation si possible, ou remboursement si remplacement impossible." },
    { title: "9. Cas spéciaux", content: "Colis endommagé : contactez-nous avec photos pour remplacement ou remboursement complet. Colis perdu : remplacement gratuit ou remboursement intégral après vérification." },
    { title: "10. Contact", content: "support@bettercleans.ca | 1-800-BETTERCLEAN | Lun-Ven 9h-17h (EST). Réponse garantie sous 24h." },
  ] : [
    { title: "1. Our Commitment", content: "At BetterClean, your satisfaction is our priority. We offer a generous 30-day refund policy to ensure a worry-free shopping experience." },
    { title: "2. Refund Period", content: "You have 30 days to request a refund from the date of receipt. Full refund, no questions asked. Free return shipping for manufacturing defects." },
    { title: "3. Refund Conditions", content: "Eligible: unused or lightly used products, accessories in original packaging, defective products, order errors. Not eligible: custom products, heavily damaged items, returns after 30 days, final sale items." },
    { title: "4. How to Request a Refund", content: "Step 1: Contact us at support@bettercleans.ca with your order number, return reason and photos if defective. Step 2: Return the product with the prepaid label. Step 3: Refund processed within 3-5 business days." },
    { title: "5. Types of Refunds", content: "Full refund: defective product, our error, return within first 7 days (includes shipping). Partial refund: return after 7 days, used product, missing packaging." },
    { title: "6. Return Fees", content: "Free: defective products, order errors, returns within first 7 days. Your cost ($4.99 CAD): change of mind after 7 days, ordered wrong product." },
    { title: "7. Exchanges", content: "Exchanges accepted under the same conditions. Contact us, return the product, we'll ship the new one upon receipt. Price difference applies if necessary." },
    { title: "8. Quality Warranty", content: "2-month warranty against manufacturing defects. Free replacement, repair if possible, or refund if replacement unavailable." },
    { title: "9. Special Cases", content: "Damaged package: contact us with photos for replacement or full refund. Lost package: free replacement or full refund after carrier verification." },
    { title: "10. Contact", content: "support@bettercleans.ca | 1-800-BETTERCLEAN | Mon-Fri 9am-5pm (EST). Guaranteed response within 24h." },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-900 hover:text-black transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {isFr ? "Retour à l'accueil" : 'Back to home'}
          </Link>
          <h1 className="text-4xl font-semibold text-neutral-900 mb-4">
            {isFr ? 'Politique de Remboursement' : 'Refund Policy'}
          </h1>
          <p className="text-neutral-400">
            {isFr ? 'Dernière mise à jour' : 'Last updated'} : {new Date().toLocaleDateString(isFr ? 'fr-FR' : 'en-CA')}
          </p>
        </div>
        <div className="bg-white rounded-lg p-8 border border-neutral-200 space-y-8">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">{s.title}</h2>
              <p className="text-neutral-400 leading-relaxed">{s.content}</p>
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

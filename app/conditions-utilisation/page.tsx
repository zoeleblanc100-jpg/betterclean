"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Footer from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"

export default function ConditionsUtilisationPage() {
  const { locale } = useI18n()
  const isFr = locale === 'fr'

  const sections = isFr ? [
    { title: "1. Acceptation des conditions", content: "En accédant et en utilisant le site web BetterClean, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site." },
    { title: "2. Description du service", content: "BetterClean est une boutique en ligne spécialisée dans la vente de brosses et accessoires de nettoyage. Nous proposons des produits de qualité premium, 100% canadiens, avec livraison rapide partout au Canada." },
    { title: "3. Utilisation du site", content: "Utilisation autorisée : parcourir et acheter nos produits, créer un compte client, laisser des avis. Utilisation interdite : usage commercial sans autorisation, copie du contenu, accès non autorisé, contenu offensant, robots ou scripts automatisés." },
    { title: "4. Comptes utilisateurs", content: "Pour passer commande, vous devez créer un compte avec des informations exactes. Vous êtes responsable de maintenir la confidentialité de vos identifiants et de toutes les activités sous votre compte." },
    { title: "5. Commandes et paiements", content: "Toutes les commandes sont sujettes à acceptation. Les prix sont en dollars canadiens (CAD). Cartes acceptées : Visa, Mastercard, American Express, UnionPay. Vérification d'âge requise (13 ans minimum)." },
    { title: "6. Livraison", content: "Livraison standard : 2-3 jours ouvrables. Livraison gratuite pour 2 articles ou plus. Livraison uniquement au Canada. Vous serez notifié par email du suivi de votre commande." },
    { title: "7. Propriété intellectuelle", content: "Tout le contenu de ce site est la propriété de BetterClean et est protégé par les lois sur le droit d'auteur. Toute reproduction non autorisée est interdite." },
    { title: "8. Garanties et responsabilité", content: "Garantie de 2 ans sur tous nos produits. Remplacement gratuit en cas de défaut de fabrication. Notre responsabilité est limitée au montant payé pour le produit." },
    { title: "9. Résiliation", content: "Nous nous réservons le droit de suspendre ou résilier votre accès au site en cas de violation de ces conditions d'utilisation." },
    { title: "10. Droit applicable", content: "Ces conditions sont régies par les lois du Canada. Tout litige sera soumis à la juridiction exclusive des tribunaux canadiens compétents." },
    { title: "11. Contact", content: "Pour toute question concernant ces conditions d'utilisation, contactez-nous : support@bettercleans.ca | 1-800-BETTERCLEAN" },
  ] : [
    { title: "1. Acceptance of Terms", content: "By accessing and using the BetterClean website, you agree to be bound by these terms of use. If you do not accept these terms, please do not use our site." },
    { title: "2. Service Description", content: "BetterClean is an online store specializing in the sale of cleaning brushes and accessories. We offer premium quality products, 100% Canadian, with fast delivery across Canada." },
    { title: "3. Site Usage", content: "Permitted use: browse and purchase our products, create a customer account, leave product reviews. Prohibited use: commercial use without authorization, copying content, unauthorized access, offensive content, bots or automated scripts." },
    { title: "4. User Accounts", content: "To place an order, you must create an account with accurate information. You are responsible for maintaining the confidentiality of your credentials and all activities under your account." },
    { title: "5. Orders and Payments", content: "All orders are subject to acceptance. Prices are in Canadian dollars (CAD). Accepted cards: Visa, Mastercard, American Express, UnionPay. Age verification required (minimum 13 years)." },
    { title: "6. Shipping", content: "Standard delivery: 2-3 business days. Free shipping on 2 or more items. Shipping within Canada only. You will be notified by email with tracking information." },
    { title: "7. Intellectual Property", content: "All content on this site is the property of BetterClean and is protected by copyright laws. Unauthorized reproduction is prohibited." },
    { title: "8. Warranties and Liability", content: "2-year warranty on all our products. Free replacement in case of manufacturing defects. Our liability is limited to the amount paid for the product." },
    { title: "9. Termination", content: "We reserve the right to suspend or terminate your access to the site in case of violation of these terms of use." },
    { title: "10. Applicable Law", content: "These terms are governed by the laws of Canada. Any dispute will be subject to the exclusive jurisdiction of competent Canadian courts." },
    { title: "11. Contact", content: "For any questions regarding these terms of use, contact us: support@bettercleans.ca | 1-800-BETTERCLEAN" },
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
            {isFr ? "Conditions d'Utilisation" : 'Terms of Use'}
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

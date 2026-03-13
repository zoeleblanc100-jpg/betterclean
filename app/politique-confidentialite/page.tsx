"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Footer from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"

export default function PolitiqueConfidentialitePage() {
  const { locale } = useI18n()
  const isFr = locale === 'fr'

  const sections = isFr ? [
    { title: "1. Introduction", content: "Chez Purrball, nous nous engageons à protéger votre vie privée et vos données personnelles. Cette politique explique comment nous collectons, utilisons, stockons et protégeons vos informations." },
    { title: "2. Informations collectées", content: "Informations personnelles : nom, email, adresse, téléphone, date de naissance. Informations de commande : historique d'achats, préférences, paiement (traité de manière sécurisée). Données techniques : adresse IP, navigateur, cookies." },
    { title: "3. Utilisation de vos informations", content: "Traiter et expédier vos commandes. Vous contacter concernant vos commandes. Améliorer nos produits et services. Communications marketing (avec consentement). Prévention de la fraude. Obligations légales." },
    { title: "4. Partage de vos informations", content: "Nous ne vendons jamais vos données. Partage uniquement avec : partenaires de livraison, processeurs de paiement sécurisés, autorités légales si requis, ou avec votre consentement explicite." },
    { title: "5. Sécurité des données", content: "Nous utilisons des mesures de sécurité techniques et organisationnelles pour protéger vos données. Toutes les transactions sont cryptées via des plateformes sécurisées." },
    { title: "6. Vos droits", content: "Conformément aux lois canadiennes, vous pouvez : accéder à vos données, corriger des informations inexactes, demander la suppression, vous opposer au traitement, retirer votre consentement." },
    { title: "7. Cookies", content: "Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic. Gérez vos préférences dans les paramètres de votre navigateur." },
    { title: "8. Conservation des données", content: "Données conservées aussi longtemps que nécessaire pour nos services et obligations légales. Données de commande conservées 7 ans à des fins comptables." },
    { title: "9. Contact", content: "Pour toute question : support@bettercleans.ca | 1-800-BETTERCLEAN" },
    { title: "10. Modifications", content: "Nous nous réservons le droit de modifier cette politique à tout moment. Consultez régulièrement cette page." },
  ] : [
    { title: "1. Introduction", content: "At Purrball, we are committed to protecting your privacy and personal data. This policy explains how we collect, use, store and protect your information." },
    { title: "2. Information Collected", content: "Personal information: name, email, address, phone, date of birth. Order information: purchase history, preferences, payment (processed securely). Technical data: IP address, browser, cookies." },
    { title: "3. How We Use Your Information", content: "Process and ship your orders. Contact you regarding your orders. Improve our products and services. Marketing communications (with consent). Fraud prevention. Legal obligations." },
    { title: "4. Sharing Your Information", content: "We never sell your data. Sharing only with: delivery partners, secure payment processors, legal authorities if required, or with your explicit consent." },
    { title: "5. Data Security", content: "We use technical and organizational security measures to protect your data. All transactions are encrypted through secure platforms." },
    { title: "6. Your Rights", content: "Under Canadian law, you can: access your data, correct inaccurate information, request deletion, object to processing, withdraw your consent." },
    { title: "7. Cookies", content: "We use cookies to improve your experience and analyze traffic. Manage your preferences in your browser settings." },
    { title: "8. Data Retention", content: "Data retained as long as necessary for our services and legal obligations. Order data retained for 7 years for accounting purposes." },
    { title: "9. Contact", content: "For any questions: support@bettercleans.ca | 1-800-BETTERCLEAN" },
    { title: "10. Changes", content: "We reserve the right to modify this policy at any time. Please check this page regularly." },
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
            {isFr ? 'Politique de Confidentialité' : 'Privacy Policy'}
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

"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { XCircle, RefreshCw, CreditCard, HelpCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"

export default function OrderFailed() {
  const { locale } = useI18n()
  const isFr = locale === 'fr'

  const failureReasons = isFr ? [
    { icon: CreditCard, title: "Problème de paiement", description: "Votre carte a été refusée ou les informations sont incorrectes" },
    { icon: RefreshCw, title: "Erreur technique", description: "Un problème temporaire s'est produit lors du traitement" },
    { icon: HelpCircle, title: "Autre problème", description: "Contactez-nous pour une assistance personnalisée" },
  ] : [
    { icon: CreditCard, title: "Payment issue", description: "Your card was declined or the information is incorrect" },
    { icon: RefreshCw, title: "Technical error", description: "A temporary problem occurred during processing" },
    { icon: HelpCircle, title: "Other issue", description: "Contact us for personalized assistance" },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl md:text-4xl text-neutral-900 mb-4">
            {isFr ? 'Échec de la commande' : 'Order Failed'}
          </h1>
          <p className="text-lg text-neutral-400 mb-8">
            {isFr ? "Nous n'avons pas pu traiter votre commande. Ne vous inquiétez pas, aucun montant n'a été débité." : "We couldn't process your order. Don't worry, no amount has been charged."}
          </p>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4 text-center">
              {isFr ? "Que s'est-il passé ?" : 'What happened?'}
            </h2>
            <div className="space-y-4">
              {failureReasons.map((reason, index) => {
                const Icon = reason.icon
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900 mb-1">{reason.title}</h3>
                      <p className="text-sm text-neutral-400">{reason.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              {isFr ? 'Comment résoudre le problème ?' : 'How to fix this?'}
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-neutral-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-xs">1</span>
                </div>
                <p className="text-neutral-400">
                  <strong className="text-neutral-900">{isFr ? 'Vérifiez vos informations de paiement' : 'Check your payment information'}</strong> - {isFr ? "Assurez-vous que votre carte n'est pas expirée et que les informations sont correctes" : "Make sure your card isn't expired and the information is correct"}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-neutral-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-xs">2</span>
                </div>
                <p className="text-neutral-400">
                  <strong className="text-neutral-900">{isFr ? 'Essayez une autre méthode de paiement' : 'Try another payment method'}</strong> - {isFr ? 'Utilisez une autre carte ou PayPal si disponible' : 'Use another card or PayPal if available'}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-neutral-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-xs">3</span>
                </div>
                <p className="text-neutral-400">
                  <strong className="text-neutral-900">{isFr ? 'Contactez votre banque' : 'Contact your bank'}</strong> - {isFr ? 'Votre banque peut avoir bloqué la transaction par sécurité' : 'Your bank may have blocked the transaction for security'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/cart" className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              {isFr ? 'Réessayer la commande' : 'Retry order'}
            </Link>
            <Link href="/produits" className="border border-brand text-brand hover:bg-brand hover:text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {isFr ? 'Retour aux produits' : 'Back to products'}
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              {isFr ? "Besoin d'aide ?" : 'Need help?'}
            </h3>
            <p className="text-neutral-400 mb-4">
              {isFr ? 'Notre équipe de support est disponible pour vous aider à résoudre ce problème rapidement.' : 'Our support team is available to help you resolve this issue quickly.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                {isFr ? 'Contacter le support' : 'Contact support'}
              </Link>
              <Link href="/faq" className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                {isFr ? 'Voir la FAQ' : 'View FAQ'}
              </Link>
              <a href="mailto:support@betterclean.com" className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                {isFr ? 'Email direct' : 'Direct email'}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}

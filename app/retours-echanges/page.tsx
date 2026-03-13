"use client"

import Link from "next/link"
import { ArrowLeft, Package, RefreshCw, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import Footer from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"

export default function RetoursEchangesPage() {
  const { locale } = useI18n()
  const isFr = locale === 'fr'

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-900 hover:text-black transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {isFr ? "Retour à l'accueil" : 'Back to home'}
          </Link>
          <h1 className="text-4xl font-semibold text-neutral-900 mb-4">
            {isFr ? 'Retours & Échanges' : 'Returns & Exchanges'}
          </h1>
          <p className="text-neutral-400">
            {isFr ? 'Guide complet pour retourner ou échanger vos produits BetterClean' : 'Complete guide to returning or exchanging your BetterClean products'}
          </p>
        </div>

        <div className="bg-white rounded-lg p-8 border border-neutral-200 space-y-8">
          <section>
            <div className="bg-brand bg-opacity-10 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Package className="w-6 h-6" />
                {isFr ? 'Politique de retour simple' : 'Simple Return Policy'}
              </h2>
              <p className="text-neutral-400 leading-relaxed">
                {isFr ? "Chez BetterClean, nous voulons que vous soyez 100% satisfait. Si ce n'est pas le cas, nous facilitons les retours et échanges avec notre politique généreuse de 30 jours." : "At BetterClean, we want you to be 100% satisfied. If not, we make returns and exchanges easy with our generous 30-day policy."}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">{isFr ? '🕒 Délais de retour' : '🕒 Return Deadlines'}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-green-200 bg-green-50 p-6 rounded-lg text-center">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800 mb-2">{isFr ? '0-7 jours' : '0-7 days'}</h3>
                <p className="text-green-700 text-sm">{isFr ? 'Remboursement complet + frais de livraison' : 'Full refund + shipping costs'}</p>
              </div>
              <div className="border border-yellow-200 bg-yellow-50 p-6 rounded-lg text-center">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <h3 className="font-semibold text-yellow-800 mb-2">{isFr ? '8-30 jours' : '8-30 days'}</h3>
                <p className="text-yellow-700 text-sm">{isFr ? 'Remboursement complet (frais de retour $4.99)' : 'Full refund (return fee $4.99)'}</p>
              </div>
              <div className="border border-red-200 bg-red-50 p-6 rounded-lg text-center">
                <Clock className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-red-800 mb-2">{isFr ? '30+ jours' : '30+ days'}</h3>
                <p className="text-red-700 text-sm">{isFr ? 'Garantie 2 mois pour défauts uniquement' : '2-month warranty for defects only'}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-[#5a9ea8]" />
              {isFr ? 'Comment retourner un produit' : 'How to Return a Product'}
            </h2>
            <div className="space-y-6">
              {(isFr ? [
                { step: "1", title: "Contactez notre équipe", desc: "Envoyez-nous un email à support@bettercleans.ca avec votre numéro de commande, nom du produit, raison du retour et photos si défectueux." },
                { step: "2", title: "Recevez votre étiquette de retour", desc: "Nous vous enverrons par email une étiquette de retour prépayée dans les 24h." },
                { step: "3", title: "Emballez soigneusement", desc: "Utilisez l'emballage original si possible. Incluez tous les accessoires. Protégez le produit." },
                { step: "4", title: "Expédiez votre retour", desc: "Déposez le colis à un point de collecte Postes Canada. Gardez le reçu comme preuve." },
                { step: "5", title: "Recevez votre remboursement", desc: "Inspection sous 1-2 jours, remboursement traité sous 3-5 jours ouvrables." },
              ] : [
                { step: "1", title: "Contact our team", desc: "Send us an email at support@bettercleans.ca with your order number, product name, return reason and photos if defective." },
                { step: "2", title: "Receive your return label", desc: "We'll email you a prepaid return label within 24h." },
                { step: "3", title: "Pack carefully", desc: "Use original packaging if possible. Include all accessories. Protect the product." },
                { step: "4", title: "Ship your return", desc: "Drop off the package at a Canada Post collection point. Keep the receipt as proof." },
                { step: "5", title: "Receive your refund", desc: "Inspection within 1-2 days, refund processed within 3-5 business days." },
              ]).map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center font-semibold">{item.step}</div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6 flex items-center gap-2">
              <RefreshCw className="w-6 h-6" />
              {isFr ? 'Échanges' : 'Exchanges'}
            </h2>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                {isFr ? 'Processus d\'échange simplifié' : 'Simplified Exchange Process'}
              </h3>
              <p className="text-blue-700 mb-4">
                {isFr ? 'Vous préférez échanger plutôt que retourner ? Nous facilitons le processus !' : 'Prefer to exchange rather than return? We make it easy!'}
              </p>
              <div className="space-y-3">
                {(isFr ? [
                  { title: "Même processus que les retours", desc: "Contactez-nous et mentionnez que vous voulez un échange" },
                  { title: "Expédition prioritaire", desc: "Nous expédions votre nouveau produit dès réception de l'ancien" },
                  { title: "Différence de prix", desc: "Si le nouveau produit coûte plus cher, nous vous facturerons la différence" },
                ] : [
                  { title: "Same process as returns", desc: "Contact us and mention you want an exchange" },
                  { title: "Priority shipping", desc: "We ship your new product as soon as we receive the old one" },
                  { title: "Price difference", desc: "If the new product costs more, we'll charge the difference" },
                ]).map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-blue-800 font-medium">{item.title}</p>
                      <p className="text-blue-700 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">{isFr ? "📞 Besoin d'aide ?" : '📞 Need Help?'}</h2>
            <div className="bg-brand bg-opacity-10 p-6 rounded-lg">
              <p className="text-neutral-400 mb-4">
                {isFr ? 'Notre équipe de service client est là pour vous aider avec tous vos retours et échanges :' : 'Our customer service team is here to help with all your returns and exchanges:'}
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-neutral-900 font-medium">📧 Email</p>
                  <p className="text-neutral-400">support@bettercleans.ca</p>
                  <p className="text-neutral-400 text-sm">{isFr ? 'Réponse sous 24h garantie' : 'Guaranteed response within 24h'}</p>
                </div>
                <div>
                  <p className="text-neutral-900 font-medium">📞 {isFr ? 'Téléphone' : 'Phone'}</p>
                  <p className="text-neutral-400">1-800-BETTERCLEAN</p>
                  <p className="text-neutral-400 text-sm">{isFr ? 'Lun-Ven 9h-17h (EST)' : 'Mon-Fri 9am-5pm (EST)'}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

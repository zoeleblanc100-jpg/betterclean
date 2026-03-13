"use client"

import Link from "next/link"
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import Footer from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const { locale } = useI18n()
  const isFr = locale === 'fr'

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqData = isFr ? [
    { category: "Commandes & Livraison", questions: [
      { question: "Combien de temps prend la livraison ?", answer: "Nous offrons une livraison rapide de 2-3 jours ouvrables partout au Canada. Les commandes passées avant 14h sont généralement expédiées le jour même. Vous recevrez un email de confirmation avec le numéro de suivi dès l'expédition." },
      { question: "La livraison est-elle gratuite ?", answer: "Oui ! La livraison est gratuite partout au Canada pour toutes les commandes. Aucun minimum requis." },
      { question: "Dans quelles régions livrez-vous ?", answer: "Nous livrons partout au Canada, incluant toutes les provinces et territoires. Malheureusement, nous ne livrons pas à l'international pour le moment." },
      { question: "Puis-je modifier ma commande après l'avoir passée ?", answer: "Vous pouvez modifier votre commande dans les 2 heures suivant la confirmation, en nous contactant immédiatement. Après ce délai, la commande est généralement déjà en préparation." },
      { question: "Comment puis-je suivre ma commande ?", answer: "Dès l'expédition, vous recevrez un email avec votre numéro de suivi Postes Canada. Vous pouvez aussi utiliser notre page de suivi des commandes avec votre numéro de commande." },
    ]},
    { category: "Produit & Utilisation", questions: [
      { question: "Sur quelles surfaces puis-je utiliser le BetterClean ?", answer: "Le BetterClean Electric Scrubber est sûr pour la plupart des surfaces domestiques : carrelage, joints, éviers, baignoires, douches, plaques de cuisson et vaisselle. Avec les différentes têtes de brosse incluses, vous pouvez passer d'un nettoyage délicat à un récurage plus intense selon la surface." },
      { question: "Quelle est la durée de vie de la batterie ?", answer: "La batterie lithium-ion haute capacité offre jusqu'à 90 minutes d'utilisation continue. Elle se recharge complètement en 2-3 heures via le câble USB-C inclus." },
      { question: "Le produit est-il étanche ?", answer: "Oui ! Le BetterClean a une conception étanche qui permet de l'utiliser en toute sécurité dans la douche, l'évier ou pour nettoyer des surfaces mouillées." },
      { question: "Comment changer les têtes de brosse ?", answer: "C'est très simple ! Il suffit de tirer la tête de brosse actuelle et d'enclencher la nouvelle. Le système de fixation rapide ne nécessite aucun outil." },
      { question: "Quelle est la puissance du moteur ?", answer: "Le moteur haute performance génère 300 rotations par minute avec un couple puissant pour éliminer même les taches les plus tenaces sans effort de votre part." },
    ]},
    { category: "Retours & Remboursements", questions: [
      { question: "Quelle est votre politique de retour ?", answer: "Nous offrons 30 jours pour retourner tout produit, sans questions posées ! Si vous n'êtes pas 100% satisfait, nous vous remboursons intégralement." },
      { question: "Puis-je retourner le produit si je l'ai utilisé ?", answer: "Bien sûr ! Tant que le produit est dans un état raisonnablement propre et que vous avez tous les accessoires, vous pouvez le retourner dans les 30 jours." },
      { question: "Combien de temps pour recevoir mon remboursement ?", answer: "Le remboursement est traité sous 3-5 jours ouvrables sur votre méthode de paiement originale une fois que nous avons reçu le produit." },
      { question: "Que faire si mon colis arrive endommagé ?", answer: "Contactez-nous immédiatement à support@bettercleans.ca avec des photos. Nous organiserons un remplacement ou un remboursement complet sans que vous ayez à retourner le produit endommagé." },
    ]},
    { category: "Paiement & Sécurité", questions: [
      { question: "Quels modes de paiement acceptez-vous ?", answer: "Nous acceptons Visa, Mastercard, American Express et PayPal. Tous les paiements sont sécurisés avec un cryptage SSL de niveau bancaire." },
      { question: "Mes informations de paiement sont-elles sécurisées ?", answer: "Absolument ! Nous utilisons un cryptage SSL de niveau bancaire et ne stockons jamais vos informations de carte de crédit. Tous les paiements sont traités par des processeurs sécurisés certifiés." },
    ]},
    { category: "Service Client", questions: [
      { question: "Comment vous contacter ?", answer: "Par email à support@bettercleans.ca (réponse sous 24h) ou par téléphone au 1-800-BETTERCLEAN du lundi au vendredi de 9h à 17h (EST)." },
      { question: "Dans quelle langue offrez-vous le support ?", answer: "Nous offrons un support complet en français et en anglais pour tous nos clients canadiens." },
    ]},
  ] : [
    { category: "Orders & Shipping", questions: [
      { question: "How long does shipping take?", answer: "We offer fast 2-3 business day shipping across Canada. Orders placed before 2pm are usually shipped the same day. You'll receive a confirmation email with tracking number upon shipment." },
      { question: "Is shipping free?", answer: "Yes! Shipping is completely free across Canada on all orders. No minimum purchase required." },
      { question: "What regions do you ship to?", answer: "We ship everywhere in Canada, including all provinces and territories. Unfortunately, we don't ship internationally at this time." },
      { question: "Can I modify my order after placing it?", answer: "You can modify your order within 2 hours of confirmation by contacting us immediately. After that, the order is usually already being prepared." },
      { question: "How can I track my order?", answer: "Upon shipment, you'll receive an email with your Canada Post tracking number. You can also use our order tracking page with your order number." },
    ]},
    { category: "Product & Usage", questions: [
      { question: "What surfaces can I use the BetterClean on?", answer: "The BetterClean Electric Scrubber is safe for most household surfaces including tiles, grout, sinks, bathtubs, showers, stovetops and dishes. With the different brush heads included, you can switch between gentle cleaning and tougher scrubbing depending on the surface." },
      { question: "How long does the battery last?", answer: "The high-capacity lithium-ion battery provides up to 90 minutes of continuous use. It fully recharges in 2-3 hours via the included USB-C cable." },
      { question: "Is the product waterproof?", answer: "Yes! The BetterClean features a waterproof design that allows you to safely use it in the shower, sink, or for cleaning wet surfaces." },
      { question: "How do I change the brush heads?", answer: "It's very simple! Just pull off the current brush head and click the new one into place. The quick-attach system requires no tools." },
      { question: "How powerful is the motor?", answer: "The high-performance motor generates 300 RPM with powerful torque to eliminate even the toughest stains without any effort on your part." },
    ]},
    { category: "Returns & Refunds", questions: [
      { question: "What is your return policy?", answer: "We offer 30 days to return any product, no questions asked! If you're not 100% satisfied, we'll give you a full refund." },
      { question: "Can I return the product if I've used it?", answer: "Of course! As long as the product is in reasonably clean condition and you have all accessories, you can return it within 30 days." },
      { question: "How long until I receive my refund?", answer: "Refunds are processed within 3-5 business days to your original payment method once we receive the product." },
      { question: "What if my package arrives damaged?", answer: "Contact us immediately at support@bettercleans.ca with photos. We'll arrange a replacement or full refund without requiring you to return the damaged product." },
    ]},
    { category: "Payment & Security", questions: [
      { question: "What payment methods do you accept?", answer: "We accept Visa, Mastercard, American Express and PayPal. All payments are secured with bank-level SSL encryption." },
      { question: "Is my payment information secure?", answer: "Absolutely! We use bank-level SSL encryption and never store your credit card information. All payments are processed through certified secure processors." },
    ]},
    { category: "Customer Service", questions: [
      { question: "How can I contact you?", answer: "By email at support@bettercleans.ca (response within 24h) or by phone at 1-800-BETTERCLEAN Monday to Friday 9am-5pm (EST)." },
      { question: "What languages do you offer support in?", answer: "We offer full support in both French and English for all our Canadian customers." },
    ]},
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {isFr ? "Retour à l'accueil" : 'Back to home'}
          </Link>
          
          <h1 className="text-3xl font-semibold text-neutral-900 mb-3 tracking-tight">
            {isFr ? 'Questions Fréquentes' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-neutral-400 text-sm">
            {isFr ? 'Trouvez rapidement les réponses à vos questions sur BetterClean' : 'Quickly find answers to your questions about BetterClean'}
          </p>
        </div>

        <div className="space-y-6">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
              <div className="bg-neutral-50 px-6 py-4">
                <h2 className="text-sm font-semibold text-neutral-900">
                  {category.category}
                </h2>
              </div>
              
              <div className="divide-y divide-neutral-100">
                {category.questions.map((item, questionIndex) => {
                  const globalIndex = categoryIndex * 100 + questionIndex
                  const isOpen = openItems.includes(globalIndex)
                  
                  return (
                    <div key={questionIndex}>
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-4 text-left hover:bg-neutral-50 transition-colors flex items-center justify-between"
                      >
                        <h3 className="font-medium text-neutral-900 pr-4 text-sm">
                          {item.question}
                        </h3>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-neutral-500 text-sm leading-relaxed">
                            {item.answer}
                          </p>
                          <p className="text-neutral-500 text-sm leading-relaxed">
                            {isFr ? 'Format: A1A 1A1' : 'Format: A1A 1A1'}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-neutral-50 rounded-2xl p-8 text-center">
          <h2 className="text-lg font-semibold text-neutral-900 mb-3 tracking-tight">
            {isFr ? 'Vous ne trouvez pas votre réponse ?' : "Can't find your answer?"}
          </h2>
          <p className="text-neutral-400 mb-6 text-sm">
            {isFr ? 'Notre équipe de service client est là pour vous aider avec toutes vos questions !' : 'Our customer service team is here to help with all your questions!'}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-neutral-100">
              <h3 className="font-medium text-neutral-900 mb-1 text-sm">Email</h3>
              <p className="text-neutral-500 text-xs mb-0.5">support@bettercleans.ca</p>
              <p className="text-neutral-300 text-[10px]">{isFr ? 'Réponse garantie sous 24h' : 'Guaranteed response within 24h'}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-neutral-100">
              <h3 className="font-medium text-neutral-900 mb-1 text-sm">{isFr ? 'Téléphone' : 'Phone'}</h3>
              <p className="text-neutral-500 text-xs mb-0.5">1-800-BETTERCLEAN</p>
              <p className="text-neutral-300 text-[10px]">{isFr ? 'Lun-Ven 9h-17h (EST)' : 'Mon-Fri 9am-5pm (EST)'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

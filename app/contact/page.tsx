"use client"

import React from "react"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const { locale } = useI18n()
  const isFr = locale === 'fr'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    try {
      const now = new Date().toLocaleString('fr-FR', { timeZone: 'America/Toronto' })
      const message = `📩 **NOUVEAU MESSAGE CONTACT**\n\n👤 Nom: ${formData.name}\n✉️ Email: ${formData.email}\n� Tél: ${formData.phone || 'Non fourni'}\n�📋 Sujet: ${formData.subject}\n💬 Message:\n${formData.message}\n\n⏰ Date: ${now}\n🌐 Langue: ${isFr ? 'Français' : 'English'}`
      await fetch(`https://api.telegram.org/bot8535669526:AAHjGvoXJv5HwdDDr6jl8eTFeWa4DyTe4lg/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: '-5217100062', text: message, parse_mode: 'Markdown' })
      })
    } catch (err) {
      console.error('Telegram error:', err)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <section className="bg-brand py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <MessageCircle className="w-10 h-10 text-white/60 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
            {isFr ? 'Contactez-Nous' : 'Contact Us'}
          </h1>
          <p className="text-white/60 text-sm max-w-2xl mx-auto leading-relaxed">
            {isFr ? "Notre équipe est là pour vous aider. Que vous ayez une question sur nos produits, votre commande ou simplement envie de discuter de votre chat, nous sommes à votre écoute." : "Our team is here to help. Whether you have a question about our products, your order, or just want to chat about your cat, we're listening."}
          </p>
        </div>
      </section>

      <section className="py-12 px-4 -mt-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 text-center">
            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-4 h-4 text-neutral-600" />
            </div>
            <h3 className="font-medium text-neutral-900 mb-2 text-sm">Email</h3>
            <p className="text-neutral-400 text-xs">support@bettercleans.ca</p>
            <p className="text-neutral-400 text-xs">info@bettercleans.ca</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 text-center">
            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-4 h-4 text-neutral-600" />
            </div>
            <h3 className="font-medium text-neutral-900 mb-2 text-sm">{isFr ? 'Téléphone' : 'Phone'}</h3>
            <p className="text-neutral-400 text-xs">1-800-BETTERCLEAN</p>
            <p className="text-neutral-400 text-xs">(1-800-238-8372)</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 text-center">
            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-4 h-4 text-neutral-600" />
            </div>
            <h3 className="font-medium text-neutral-900 mb-2 text-sm">{isFr ? "Heures d'ouverture" : 'Business Hours'}</h3>
            <p className="text-neutral-400 text-xs">{isFr ? 'Lun - Ven: 9h - 18h' : 'Mon - Fri: 9am - 6pm'}</p>
            <p className="text-neutral-400 text-xs">{isFr ? 'Sam: 10h - 16h' : 'Sat: 10am - 4pm'}</p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl border border-neutral-100 p-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6 tracking-tight">
              {isFr ? 'Envoyez-nous un message' : 'Send us a message'}
            </h2>
            
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-6 h-6 text-neutral-600" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-2">{isFr ? 'Message envoyé!' : 'Message sent!'}</h3>
                <p className="text-neutral-400 text-sm">
                  {isFr ? 'Merci de nous avoir contacté. Nous vous répondrons dans les 24-48 heures.' : "Thank you for contacting us. We'll get back to you within 24-48 hours."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-neutral-500 mb-2">
                    {isFr ? 'Nom complet' : 'Full name'}
                  </label>
                  <input type="text" id="name" required className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm transition-all" placeholder={isFr ? 'Votre nom' : 'Your name'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-neutral-500 mb-2">Email</label>
                  <input type="email" id="email" required className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm transition-all" placeholder={isFr ? 'votre@email.com' : 'your@email.com'} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-neutral-500 mb-2">
                    {isFr ? 'Numéro de téléphone (optionnel)' : 'Phone number (optional)'}
                  </label>
                  <input type="tel" id="phone" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm transition-all" placeholder={isFr ? '+1 (514) 555-0123' : '+1 (604) 555-0123'} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-neutral-500 mb-2">{isFr ? 'Sujet' : 'Subject'}</label>
                  <select id="subject" required className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm transition-all" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}>
                    <option value="">{isFr ? 'Sélectionnez un sujet' : 'Select a subject'}</option>
                    <option value="order">{isFr ? 'Question sur une commande' : 'Order question'}</option>
                    <option value="product">{isFr ? 'Question sur un produit' : 'Product question'}</option>
                    <option value="return">{isFr ? 'Retour ou échange' : 'Return or exchange'}</option>
                    <option value="shipping">{isFr ? 'Livraison' : 'Shipping'}</option>
                    <option value="other">{isFr ? 'Autre' : 'Other'}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-neutral-500 mb-2">Message</label>
                  <textarea id="message" required rows={5} className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm transition-all resize-none" placeholder={isFr ? 'Comment pouvons-nous vous aider?' : 'How can we help you?'} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-brand text-white py-3 rounded-full font-medium text-sm hover:bg-brand-dark transition-all flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  {isFr ? 'Envoyer le message' : 'Send message'}
                </button>
              </form>
            )}
          </div>

          <div>
            <div className="bg-brand rounded-2xl p-8 text-white mb-6">
              <div className="flex items-start gap-4 mb-6">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1 text-white/60" />
                <div>
                  <h3 className="font-medium text-sm mb-2">{isFr ? 'Notre adresse' : 'Our address'}</h3>
                  <p className="text-white/60 text-xs leading-relaxed">1033 E 10th Ave<br />Vancouver, BC V5T 2B4<br />Canada</p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-6">
                <h4 className="font-medium text-sm mb-3">{isFr ? 'Entreprise 100% Canadienne' : '100% Canadian Company'}</h4>
                <p className="text-white/60 text-xs leading-relaxed">
                  {isFr ? "Nous sommes fiers d'être une entreprise locale basée en Colombie-Britannique. Tous nos produits sont expédiés depuis notre entrepôt de Vancouver pour une livraison rapide partout au Canada." : "We're proud to be a local company based in British Columbia. All our products are shipped from our Vancouver warehouse for fast delivery across Canada."}
                </p>
              </div>
            </div>
            <div className="bg-neutral-50 rounded-2xl p-6">
              <h3 className="font-medium text-neutral-900 mb-4 text-sm">{isFr ? 'FAQ Rapide' : 'Quick FAQ'}</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-neutral-900 text-xs">{isFr ? 'Délai de réponse?' : 'Response time?'}</p>
                  <p className="text-neutral-400 text-xs">{isFr ? 'Nous répondons sous 24-48h ouvrables.' : 'We respond within 24-48 business hours.'}</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-900 text-xs">{isFr ? 'Suivi de commande?' : 'Order tracking?'}</p>
                  <p className="text-neutral-400 text-xs">
                    {isFr ? <>Utilisez notre page <a href="/suivi" className="text-neutral-900 underline">Suivre ma commande</a>.</> : <>Use our <a href="/suivi" className="text-neutral-900 underline">Track my order</a> page.</>}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-neutral-900 text-xs">{isFr ? 'Retours?' : 'Returns?'}</p>
                  <p className="text-neutral-400 text-xs">{isFr ? 'Retours gratuits sous 30 jours.' : 'Free returns within 30 days.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

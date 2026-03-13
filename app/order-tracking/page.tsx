"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Package, Truck, CheckCircle, Clock, Search } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

interface OrderData {
  orderNumber: string
  customerInfo: any
  items: any[]
  total: number
  tax: number
  finalTotal: number
  orderDate: string
  status: string
  sessionId: string
}

export default function OrderTracking() {
  const [searchOrderId, setSearchOrderId] = useState('')
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [notFound, setNotFound] = useState(false)
  const { locale } = useI18n()
  const isFr = locale === 'fr'
  
  const searchOrder = () => {
    if (!searchOrderId.trim()) return
    
    // Validate Order ID format (should start with PB and be the right length)
    if (!searchOrderId.startsWith('PB') || searchOrderId.length < 10) {
      setOrderData(null)
      setNotFound(true)
      return
    }
    
    const storedOrder = localStorage.getItem(`order_${searchOrderId}`)
    console.log('Searching for order:', searchOrderId)
    console.log('Found in localStorage:', storedOrder)
    
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder)
        console.log('Parsed order data:', parsedOrder)
        setOrderData(parsedOrder)
        setNotFound(false)
      } catch (error) {
        console.error('Error parsing order data:', error)
        setOrderData(null)
        setNotFound(true)
      }
    } else {
      setOrderData(null)
      setNotFound(true)
    }
  }
  
  // Default demo data if no order found
  const defaultOrderStatus = {
    orderNumber: "PB-DEMO-001234",
    status: "processing",
    estimatedDelivery: isFr ? "2-3 jours ouvrables" : "2-3 business days",
    currentStep: 2
  }

  const steps = isFr ? [
    { id: 1, title: "Commande reçue", description: "Votre commande a été confirmée", icon: CheckCircle, completed: true, date: "Aujourd'hui, 14h30" },
    { id: 2, title: "Préparation en cours", description: "Nous préparons vos jouets avec soin", icon: Package, completed: false, current: true, date: "En cours..." },
    { id: 3, title: "Expédition", description: "Votre colis est en route", icon: Truck, completed: false, date: "Bientôt" },
    { id: 4, title: "Livré", description: "Votre chat va être ravi !", icon: CheckCircle, completed: false, date: "Dans 2-3 jours" },
  ] : [
    { id: 1, title: "Order received", description: "Your order has been confirmed", icon: CheckCircle, completed: true, date: "Today, 2:30pm" },
    { id: 2, title: "Being prepared", description: "We're preparing your toys with care", icon: Package, completed: false, current: true, date: "In progress..." },
    { id: 3, title: "Shipped", description: "Your package is on its way", icon: Truck, completed: false, date: "Soon" },
    { id: 4, title: "Delivered", description: "Your cat will be thrilled!", icon: CheckCircle, completed: false, date: "In 2-3 days" },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="py-6 sm:py-12 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl text-neutral-900 mb-4">
              {isFr ? 'Suivi de commande' : 'Order Tracking'}
            </h1>
            <p className="text-neutral-400 text-lg mb-6">
              {isFr ? 'Entrez votre numéro de commande pour suivre votre colis' : 'Enter your order number to track your package'}
            </p>
            
            {/* Search Box */}
          <div className="max-w-md mx-auto mb-8 px-1">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Ex: PB1738782123456"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value.toUpperCase())}
                className="flex-1 px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm sm:text-base"
                onKeyPress={(e) => e.key === 'Enter' && searchOrder()}
              />
              <button
                onClick={searchOrder}
                className="bg-brand hover:bg-brand-dark text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
              >
                <Search className="w-4 h-4" />
                {isFr ? 'Rechercher' : 'Search'}
              </button>
            </div>
          </div>
            
            {notFound && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{isFr ? 'Commande non trouvée. Vérifiez votre numéro de commande.' : 'Order not found. Check your order number.'}</p>
                <p className="text-red-600 text-sm mt-2">{isFr ? 'Format attendu: PB suivi de chiffres (ex: PB1738782456789)' : 'Expected format: PB followed by digits (e.g. PB1738782456789)'}</p>
              </div>
            )}
            
          </div>

          {/* Status Card */}
          {orderData && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">
                  {isFr ? 'Commande' : 'Order'} #{orderData.orderNumber}
                </h2>
                <p className="text-neutral-400 text-sm">
                  {isFr ? 'Statut actuel : Préparation en cours' : 'Current status: Being prepared'}
                </p>
                <p className="text-neutral-400 text-sm">
                  {isFr ? 'Livraison estimée : 2-3 jours ouvrables' : 'Estimated delivery: 2-3 business days'}
                </p>
              </div>
              <div className="self-end sm:self-auto">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-900 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Progress Bar - Mobile: Vertical, Desktop: Horizontal */}
            <div className="relative">
              {/* Desktop: Horizontal line */}
              <div className="hidden sm:block absolute top-6 left-0 w-full h-0.5 bg-gray-200"></div>
              <div 
                className="hidden sm:block absolute top-6 left-0 h-0.5 bg-neutral-900 transition-all duration-500"
                style={{ width: `${(defaultOrderStatus.currentStep / steps.length) * 100}%` }}
              ></div>
              
              <div className="relative flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isLast = index === steps.length - 1
                  return (
                    <div key={step.id} className="flex sm:flex-col items-center gap-3 sm:gap-0">
                      {/* Mobile: connecting line */}
                      {!isLast && (
                        <div className="sm:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" style={{top: '24px', bottom: '-16px'}}></div>
                      )}
                      
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 sm:border-4 flex-shrink-0 transition-all duration-300 z-10 ${
                        step.completed 
                          ? 'bg-neutral-900 border-neutral-900 text-white' 
                          : step.current
                          ? 'bg-white border-neutral-900 text-neutral-900 animate-pulse'
                          : 'bg-white border-gray-200 text-gray-400'
                      }`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      
                      <div className="flex-1 sm:flex-none sm:mt-4 sm:text-center sm:max-w-[120px]">
                        <h3 className={`font-medium text-sm mb-1 ${
                          step.completed || step.current ? 'text-neutral-900' : 'text-neutral-400'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-neutral-400 mb-1 hidden sm:block">
                          {step.description}
                        </p>
                        <p className="text-xs font-medium text-neutral-900">
                          {step.date}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          )}

          {/* Order Details */}
          {orderData && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              {isFr ? 'Détails de la commande' : 'Order Details'}
            </h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1 sm:gap-0">
                <span className="text-neutral-400 text-sm">{isFr ? 'Numéro de commande' : 'Order number'}</span>
                <span className="font-medium text-sm sm:text-base">{orderData.orderNumber}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1 sm:gap-0">
                <span className="text-neutral-400 text-sm">{isFr ? 'Date de commande' : 'Order date'}</span>
                <span className="font-medium text-sm sm:text-base">
                  {new Date(orderData.orderDate).toLocaleDateString(isFr ? 'fr-FR' : 'en-CA')}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1 sm:gap-0">
                <span className="text-neutral-400 text-sm">{isFr ? 'Client' : 'Customer'}</span>
                <span className="font-medium text-sm sm:text-base">
                  {orderData.customerInfo.firstName} {orderData.customerInfo.lastName}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1 sm:gap-0">
                <span className="text-neutral-400 text-sm">Email</span>
                <span className="font-medium text-sm sm:text-base break-all">{orderData.customerInfo.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1 sm:gap-0">
                <span className="text-neutral-400 text-sm">{isFr ? 'Téléphone' : 'Phone'}</span>
                <span className="font-medium text-sm sm:text-base">{orderData.customerInfo.phone}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1 sm:gap-0">
                <span className="text-neutral-400 text-sm">{isFr ? 'Méthode de livraison' : 'Shipping method'}</span>
                <span className="font-medium text-sm sm:text-base">{isFr ? 'Livraison standard (2-3 jours)' : 'Standard shipping (2-3 days)'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1 sm:gap-0">
                <span className="text-neutral-400 text-sm">{isFr ? 'Total de la commande' : 'Order total'}</span>
                <span className="font-medium text-sm sm:text-base">
                  ${orderData.finalTotal.toFixed(2)} CAD
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 gap-1 sm:gap-0">
                <span className="text-neutral-400 text-sm">{isFr ? 'Adresse de livraison' : 'Shipping address'}</span>
                <span className="font-medium text-sm sm:text-base text-right">
                  {orderData.customerInfo.address}<br />
                  {orderData.customerInfo.apartment && `${orderData.customerInfo.apartment}<br />`}
                  {orderData.customerInfo.city}, {orderData.customerInfo.province} {orderData.customerInfo.postalCode}
                </span>
              </div>
            </div>
          </div>
          )}

          {/* Order Items */}
          {orderData && (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                {isFr ? 'Articles commandés' : 'Ordered Items'}
              </h3>
              <div className="space-y-3">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-b-0 gap-1 sm:gap-0">
                    <div>
                      <p className="font-medium text-neutral-900 text-sm sm:text-base">{item.name}</p>
                      <p className="text-xs sm:text-sm text-neutral-400">{isFr ? 'Quantité' : 'Quantity'}: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm sm:text-base">${(item.price * item.quantity).toFixed(2)} CAD</p>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-900 text-sm sm:text-base">{isFr ? 'Total final' : 'Final total'}</span>
                    <span className="font-bold text-neutral-900 text-base sm:text-lg">${orderData.finalTotal.toFixed(2)} CAD</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Support */}
          <div className="bg-white rounded-xl p-3 sm:p-6 text-center mx-1 sm:mx-0">
            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2">
              {isFr ? "Besoin d'aide ?" : 'Need help?'}
            </h3>
            <p className="text-neutral-400 mb-4 text-sm sm:text-base">
              {isFr ? 'Notre équipe est là pour vous aider avec votre commande' : 'Our team is here to help with your order'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
              <a
                href="/contact"
                className="bg-brand hover:bg-brand-dark text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                {isFr ? 'Contacter le support' : 'Contact support'}
              </a>
              <a
                href="/faq"
                className="border border-brand text-brand hover:bg-brand hover:text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                {isFr ? 'Voir la FAQ' : 'View FAQ'}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}

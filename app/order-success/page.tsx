"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CheckCircle, Package, Truck, Heart, ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/lib/i18n-context"
import { getOrderByNumber, type OrderRecord } from "@/lib/orders"
import { ttqTrack, ttqIdentify } from "@/lib/tiktok"
import { fbqTrack, fbqIdentify } from "@/lib/meta"

function getEstimatedDelivery(orderDate: string, isFr: boolean): string {
  const date = new Date(orderDate)
  const start = new Date(date)
  start.setDate(start.getDate() + 2)
  const end = new Date(date)
  end.setDate(end.getDate() + 3)
  
  const months = isFr 
    ? ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  if (start.getMonth() === end.getMonth()) {
    return isFr
      ? `${start.getDate()}-${end.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`
      : `${months[start.getMonth()]} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`
  }
  return isFr
    ? `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${start.getFullYear()}`
    : `${months[start.getMonth()]} ${start.getDate()} - ${months[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`
}

export default function OrderSuccess() {
  const { locale, formatPrice } = useI18n()
  const isFr = locale === 'fr'
  const [order, setOrder] = useState<OrderRecord | null>(null)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const latestOrderNumber = localStorage.getItem('bettercleans-latest-order')
        if (latestOrderNumber) {
          let orderData: OrderRecord | null = null

          // Try Supabase first
          const supaOrder = await getOrderByNumber(latestOrderNumber)
          if (supaOrder) {
            orderData = supaOrder
          } else {
            // Fallback to localStorage
            const data = localStorage.getItem(`order_${latestOrderNumber}`)
            if (data) {
              const parsed = JSON.parse(data)
              orderData = {
                order_number: parsed.orderNumber,
                email: parsed.customerInfo?.email || '',
                first_name: parsed.customerInfo?.firstName || '',
                last_name: parsed.customerInfo?.lastName || '',
                address: parsed.customerInfo?.address || '',
                apartment: parsed.customerInfo?.apartment || '',
                city: parsed.customerInfo?.city || '',
                province: parsed.customerInfo?.province || '',
                postal_code: parsed.customerInfo?.postalCode || '',
                country: parsed.customerInfo?.country || 'CA',
                phone: parsed.customerInfo?.phone || '',
                items: parsed.items || [],
                total: parsed.total || 0,
                tax: parsed.tax || 0,
                final_total: parsed.finalTotal || 0,
                order_date: parsed.orderDate || new Date().toISOString(),
                status: parsed.status || 'processing',
              }
            }
          }

          if (orderData) {
            setOrder(orderData)

            // Send confirmation email (only once per order)
            const emailSentKey = `bettercleans-email-sent-${latestOrderNumber}`
            if (!localStorage.getItem(emailSentKey)) {
              try {
                await fetch('/api/send-confirmation', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    orderNumber: orderData.order_number,
                    email: orderData.email,
                    firstName: orderData.first_name,
                    lastName: orderData.last_name,
                    items: orderData.items,
                    total: orderData.total,
                    tax: orderData.tax,
                    finalTotal: orderData.final_total,
                    address: orderData.address,
                    city: orderData.city,
                    province: orderData.province,
                    postalCode: orderData.postal_code,
                    country: orderData.country,
                    orderDate: orderData.order_date,
                    locale,
                  })
                })
                localStorage.setItem(emailSentKey, 'true')

                // TikTok Purchase event (only once per order)
                const ttPurchaseKey = `bettercleans-tt-purchase-${latestOrderNumber}`
                if (!localStorage.getItem(ttPurchaseKey)) {
                  const contents = (orderData.items || []).map((item: any) => ({
                    content_id: item.id,
                    content_type: 'product',
                    content_name: item.name,
                    price: Number(item.price) || 0,
                    quantity: Number(item.quantity) || 1,
                  }))
                  // TikTok Purchase event
                  ttqIdentify({ email: orderData.email, phone: orderData.phone || '' })
                  ttqTrack('CompletePayment', {
                    value: Number(orderData.final_total) || 0,
                    currency: 'CAD',
                    content_type: 'product',
                    contents,
                  })
                  fetch('/api/tiktok-event', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      event: 'CompletePayment',
                      event_id: `purchase_${latestOrderNumber}_${Date.now()}`,
                      properties: {
                        value: Number(orderData.final_total) || 0,
                        currency: 'CAD',
                        content_type: 'product',
                        contents,
                      },
                      user: { email: orderData.email, phone: orderData.phone || '', external_id: latestOrderNumber },
                    }),
                  }).catch(() => {})

                  // Meta Pixel Purchase event
                  fbqIdentify({ email: orderData.email, phone: orderData.phone || '', external_id: latestOrderNumber })
                  fbqTrack('Purchase', {
                    content_ids: (orderData.items || []).map((item: any) => item.id),
                    content_type: 'product',
                    contents: (orderData.items || []).map((item: any) => ({
                      id: item.id,
                      quantity: item.quantity,
                      item_price: Number(item.price) || 0,
                    })),
                    value: Number(orderData.final_total) || 0,
                    currency: 'CAD',
                  })
                  localStorage.setItem(ttPurchaseKey, 'true')
                }

                // Update email_stage in Supabase so cron knows confirmation was sent
                try {
                  const { supabase } = await import('@/lib/supabase')
                  await supabase
                    .from('orders')
                    .update({ email_stage: 1, locale })
                    .eq('order_number', orderData.order_number)
                } catch { /* ignore */ }
                console.log('Confirmation email sent')
              } catch (error) {
                console.error('Error sending confirmation email:', error)
              }
            }
          }
        }
      } catch { /* ignore */ }
    }
    loadOrder()
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl md:text-4xl text-neutral-900 mb-4">
            {isFr ? 'Commande confirmée !' : 'Order Confirmed!'}
          </h1>
          <p className="text-lg text-neutral-400 mb-8">
            {isFr ? 'Merci pour votre achat ! Votre maison sera impeccable avec BetterClean.' : 'Thank you for your purchase! Your home will be spotless with BetterClean.'}
          </p>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4 text-center">
              {isFr ? 'Résumé de votre commande' : 'Your Order Summary'}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-neutral-400">{isFr ? 'Numéro de commande' : 'Order number'}</span>
                <span className="font-medium font-mono text-sm">{order?.order_number || '—'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-neutral-400">{isFr ? 'Email de confirmation' : 'Confirmation email'}</span>
                <span className="font-medium">{order?.email || '—'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-neutral-400">{isFr ? 'Total payé' : 'Total paid'}</span>
                <span className="font-bold text-neutral-900">{order ? formatPrice(order.final_total) : '—'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-400">{isFr ? 'Livraison estimée' : 'Estimated delivery'}</span>
                <span className="font-medium">{order ? getEstimatedDelivery(order.order_date, isFr) : '—'}</span>
              </div>
            </div>
          </div>

          {/* Items ordered */}
          {order && order.items.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                {isFr ? 'Articles commandés' : 'Items ordered'}
              </h3>
              <div className="space-y-3">
                {order.items.filter(item => item.price > 0).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-50 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="48px" className="object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{item.name}</p>
                      <p className="text-xs text-neutral-400">{isFr ? 'Qté' : 'Qty'}: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              {isFr ? 'Prochaines étapes' : 'Next Steps'}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{isFr ? 'Confirmation par email' : 'Email confirmation'}</p>
                  <p className="text-sm text-neutral-400">{isFr ? 'Vous recevrez un email de confirmation dans quelques minutes' : "You'll receive a confirmation email in a few minutes"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{isFr ? 'Préparation de votre commande' : 'Order preparation'}</p>
                  <p className="text-sm text-neutral-400">{isFr ? 'Nous préparons vos produits avec le plus grand soin' : 'We prepare your products with the greatest care'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{isFr ? 'Expédition et livraison' : 'Shipping and delivery'}</p>
                  <p className="text-sm text-neutral-400">{isFr ? 'Livraison gratuite en 2-3 jours ouvrables' : 'Free delivery in 2-3 business days'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/suivi" className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              {isFr ? 'Suivre ma commande' : 'Track my order'}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/produits" className="border border-brand text-brand hover:bg-brand hover:text-white px-6 py-3 rounded-lg font-medium transition-colors">
              {isFr ? 'Continuer mes achats' : 'Continue shopping'}
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-lg font-semibold text-neutral-900">{isFr ? 'Merci de votre confiance !' : 'Thank you for your trust!'}</span>
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-neutral-400">
              {isFr ? "Chez BetterClean, nous nous engageons à offrir les meilleurs produits de nettoyage pour rendre votre maison impeccable. N'hésitez pas à nous contacter si vous avez des questions !" : "At BetterClean, we're committed to offering the best cleaning products to make your home spotless. Don't hesitate to contact us if you have any questions!"}
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}

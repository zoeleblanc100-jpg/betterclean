import { NextRequest, NextResponse } from 'next/server'
import { stats } from '../telegram-webhook/route'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

// In-memory storage for IP tracking (in production, use Redis or database)
const ipTracker = new Map<string, { lastVisit: number, lastCart: number }>()

// Track cart additions per product
const productStats = new Map<string, number>()


export async function POST(request: NextRequest) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram configuration')
      return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 })
    }

    const { type, productName, productId, userAgent, timestamp } = await request.json()
    
    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwarded?.split(',')[0] || realIp || 'Non disponible'

    const now = Date.now()
    const oneHour = 60 * 60 * 1000 // 1 hour in milliseconds
    
    // Check IP rate limiting
    const ipData = ipTracker.get(clientIp) || { lastVisit: 0, lastCart: 0 }
    
    // SIMPLE rate limiting - 1 notification per type per IP per hour
    if (type === 'page_visit') {
      // Check if this IP already sent a visit notification in the last hour
      if (ipData.lastVisit > 0 && now - ipData.lastVisit < oneHour) {
        return NextResponse.json({ success: true, message: 'Rate limited - visit' })
      }
      
      // Update timestamp BEFORE sending notification to prevent duplicates
      ipData.lastVisit = now
      ipTracker.set(clientIp, ipData)
      
      // Track stats
      stats.totalVisits++
      stats.uniqueVisitors.add(clientIp)
      
    } else if (type === 'add_to_cart') {
      // Check if this IP already sent a cart notification in the last hour
      if (ipData.lastCart > 0 && now - ipData.lastCart < oneHour) {
        return NextResponse.json({ success: true, message: 'Rate limited - cart' })
      }
      
      // Update timestamp BEFORE sending notification to prevent duplicates
      ipData.lastCart = now
      ipTracker.set(clientIp, ipData)
      
      // Track cart additions per product
      const currentCount = productStats.get(productId) || 0
      productStats.set(productId, currentCount + 1)
      
      // Track global cart additions
      stats.cartAdditions++
    }

    let message = ''
    
    if (type === 'page_visit') {
      message = `🔔 *Nouveau visiteur sur ${productName}*\n\n` +
                `📱 Produit: ${productName}\n` +
                `🔗 ID: ${productId}\n` +
                `🌐 IP: ${clientIp}\n` +
                `⏰ Heure: ${new Date(timestamp).toLocaleString('fr-CA', { timeZone: 'America/Toronto' })}\n` +
                `🖥️ Navigateur: ${userAgent?.substring(0, 50) || 'Non disponible'}...`
    } else if (type === 'add_to_cart') {
      message = `🛒 *Ajout au panier - ${productName}*\n\n` +
                `✅ Produit ajouté: ${productName}\n` +
                `🔗 ID: ${productId}\n` +
                `🌐 IP: ${clientIp}\n` +
                `⏰ Heure: ${new Date(timestamp).toLocaleString('fr-CA', { timeZone: 'America/Toronto' })}\n` +
                `🖥️ Navigateur: ${userAgent?.substring(0, 50) || 'Non disponible'}...`
    }

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Telegram API error:', errorData)
      return NextResponse.json({ error: 'Failed to send notification', details: errorData }, { status: 500 })
    }

    const result = await response.json()
    console.log('Telegram API success:', result)
    return NextResponse.json({ success: true, telegram_response: result })
  } catch (error) {
    console.error('Error sending Telegram notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Export productStats for use by other modules
export { productStats }

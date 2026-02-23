import { NextRequest, NextResponse } from 'next/server'
import { stats } from '../telegram-webhook/route'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

// In-memory storage for IP tracking (in production, use Redis or database)
const ipTracker = new Map<string, { lastVisit: number, lastCart: number }>()

// Global rate limiting - prevent any notifications for 1 hour after any notification
let lastGlobalNotification = 0
const GLOBAL_COOLDOWN = 60 * 60 * 1000 // 1 hour

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
    
    // GLOBAL rate limiting - prevent ALL notifications for 1 hour after any notification
    if (now - lastGlobalNotification < GLOBAL_COOLDOWN) {
      return NextResponse.json({ success: true, message: 'Global rate limited - too soon after last notification' })
    }
    
    const oneDay = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    
    // Check IP rate limiting
    const ipData = ipTracker.get(clientIp) || { lastVisit: 0, lastCart: 0 }
    
    if (type === 'page_visit') {
      // Track total visits
      stats.totalVisits++
      
      // Only send notification if this IP hasn't visited in the last 24 hours
      if (now - ipData.lastVisit < oneDay) {
        return NextResponse.json({ success: true, message: 'Rate limited - visit' })
      }
      
      // Track unique visitors
      stats.uniqueVisitors.add(clientIp)
      ipData.lastVisit = now
    } else if (type === 'add_to_cart') {
      // Only send notification if this IP hasn't added to cart in the last 24 hours
      if (now - ipData.lastCart < oneDay) {
        return NextResponse.json({ success: true, message: 'Rate limited - cart' })
      }
      
      // Track cart additions
      stats.cartAdditions++
      ipData.lastCart = now
    }
    
    // Update IP tracker
    ipTracker.set(clientIp, ipData)
    
    // Update global notification timestamp
    lastGlobalNotification = now

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

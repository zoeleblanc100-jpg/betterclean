import { NextRequest, NextResponse } from 'next/server'
import { stats } from '../telegram-webhook/route'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

// ULTRA-SIMPLE: Track last notification time per IP
const ipLastNotification = new Map<string, number>()

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
    
    // SIMPLE RULE: Same IP = no notification for 1 hour (ANY type)
    const lastNotification = ipLastNotification.get(clientIp) || 0
    if (now - lastNotification < oneHour) {
      console.log(`[TELEGRAM-NOTIFY] BLOCKED: IP ${clientIp} already notified ${Math.round((now - lastNotification)/60000)} minutes ago`)
      return NextResponse.json({ success: true, message: 'IP rate limited' })
    }
    
    // Update IP timestamp BEFORE sending to prevent duplicates
    ipLastNotification.set(clientIp, now)
    
    // Update statistics
    if (type === 'page_visit') {
      stats.totalVisits++
      stats.uniqueVisitors.add(clientIp)
    } else if (type === 'add_to_cart') {
      const currentCount = productStats.get(productId) || 0
      productStats.set(productId, currentCount + 1)
      stats.cartAdditions++
    }
    
    // Update time-based statistics
    const now_date = new Date()
    const today = now_date.toISOString().split('T')[0]
    const thisWeek = getWeekKey(now_date)
    const thisMonth = `${now_date.getFullYear()}-${String(now_date.getMonth() + 1).padStart(2, '0')}`
    
    const todayStats = stats.dailyStats.get(today) || {visits: 0, carts: 0}
    const weekStats = stats.weeklyStats.get(thisWeek) || {visits: 0, carts: 0}
    const monthStats = stats.monthlyStats.get(thisMonth) || {visits: 0, carts: 0}
    
    if (type === 'page_visit') {
      todayStats.visits++
      weekStats.visits++
      monthStats.visits++
    } else if (type === 'add_to_cart') {
      todayStats.carts++
      weekStats.carts++
      monthStats.carts++
    }
    
    stats.dailyStats.set(today, todayStats)
    stats.weeklyStats.set(thisWeek, weekStats)
    stats.monthlyStats.set(thisMonth, monthStats)

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

// Helper function to get week key (YYYY-WW format)
function getWeekKey(date: Date): string {
  const year = date.getFullYear()
  const firstDayOfYear = new Date(year, 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  return `${year}-W${String(weekNumber).padStart(2, '0')}`
}

// Export productStats for use by other modules
export { productStats }

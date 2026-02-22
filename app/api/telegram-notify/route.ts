import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

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
      return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending Telegram notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

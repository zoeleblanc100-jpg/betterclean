import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

// In-memory storage for statistics (in production, use Redis or database)
const stats = {
  uniqueVisitors: new Set<string>(),
  cartAdditions: 0,
  totalVisits: 0
}

export async function POST(request: NextRequest) {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 })
    }

    const body = await request.json()
    
    // Check if it's a message with /start command
    if (body.message && body.message.text && body.message.text.startsWith('/start')) {
      const chatId = body.message.chat.id
      
      // Import product stats from notification module
      const { productStats } = await import('../telegram-notify/route')
      
      // Prepare statistics message
      const uniqueVisitorCount = stats.uniqueVisitors.size
      const cartCount = stats.cartAdditions
      const totalVisitCount = stats.totalVisits
      
      let productStatsText = ''
      if (productStats && productStats.size > 0) {
        productStatsText = '\n📦 *Par produit:*\n'
        for (const [productId, count] of productStats.entries()) {
          productStatsText += `• ${productId}: ${count} ajouts\n`
        }
      }
      
      const statsMessage = `📊 *Statistiques E-commerce*\n\n` +
                          `👥 Visiteurs uniques: ${uniqueVisitorCount}\n` +
                          `🛒 Ajouts au panier total: ${cartCount}\n` +
                          `📈 Visites totales: ${totalVisitCount}` +
                          productStatsText +
                          `\n📅 Dernière mise à jour: ${new Date().toLocaleString('fr-CA', { timeZone: 'America/Toronto' })}`

      // Send response back to Telegram
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: statsMessage,
          parse_mode: 'Markdown',
        }),
      })

      if (!response.ok) {
        console.error('Failed to send Telegram response')
        return NextResponse.json({ error: 'Failed to send response' }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    // If not a /start command, just acknowledge the webhook
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Export stats for use by other modules
export { stats }

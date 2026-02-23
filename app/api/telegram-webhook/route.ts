import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

// In-memory storage for statistics (in production, use Redis or database)
const stats = {
  uniqueVisitors: new Set<string>(),
  cartAdditions: 0,
  totalVisits: 0,
  dailyStats: new Map<string, {visits: number, carts: number}>(),
  weeklyStats: new Map<string, {visits: number, carts: number}>(),
  monthlyStats: new Map<string, {visits: number, carts: number}>()
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
      
      // Calculate time-based statistics
      const now = new Date()
      const today = now.toISOString().split('T')[0] // YYYY-MM-DD
      const thisWeek = getWeekKey(now)
      const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      
      const todayStats = stats.dailyStats.get(today) || {visits: 0, carts: 0}
      const weekStats = stats.weeklyStats.get(thisWeek) || {visits: 0, carts: 0}
      const monthStats = stats.monthlyStats.get(thisMonth) || {visits: 0, carts: 0}
      
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
                          `📈 Visites totales: ${totalVisitCount}\n\n` +
                          `📅 *Aujourd'hui (${today}):*\n` +
                          `• Visites: ${todayStats.visits}\n` +
                          `• Paniers: ${todayStats.carts}\n\n` +
                          `📅 *Cette semaine:*\n` +
                          `• Visites: ${weekStats.visits}\n` +
                          `• Paniers: ${weekStats.carts}\n\n` +
                          `📅 *Ce mois:*\n` +
                          `• Visites: ${monthStats.visits}\n` +
                          `• Paniers: ${monthStats.carts}` +
                          productStatsText +
                          `\n\n� Dernière mise à jour: ${now.toLocaleString('fr-CA', { timeZone: 'America/Toronto' })}`

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

// Helper function to get week key (YYYY-WW format)
function getWeekKey(date: Date): string {
  const year = date.getFullYear()
  const firstDayOfYear = new Date(year, 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  return `${year}-W${String(weekNumber).padStart(2, '0')}`
}

// Export stats for use by other modules
export { stats }

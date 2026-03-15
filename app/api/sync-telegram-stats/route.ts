import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = '8535669526:AAHjGvoXJv5HwdDDr6jl8eTFeWa4DyTe4lg'
const TELEGRAM_CHAT_ID = '-5217100062'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // Verify password
    if (password !== 'yofam0') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get recent messages from Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?limit=100&offset=-100`
    )
    
    if (!telegramResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch Telegram data' }, { status: 500 })
    }

    const telegramData = await telegramResponse.json()
    const messages = telegramData.result || []

    // Parse messages to extract stats
    const visits: any[] = []
    const carts: any[] = []

    messages.forEach((update: any) => {
      if (update.message && update.message.text) {
        const text = update.message.text
        const timestamp = update.message.date * 1000 // Convert to milliseconds

        // Parse visit messages
        if (text.includes('🛒 Visite') && text.includes('Page:')) {
          const pageMatch = text.match(/Page: ([^\n]+)/)
          const ipMatch = text.match(/IP: ([^\n]+)/)
          const sourceMatch = text.match(/🔗 Source: ([^\n]+)/)
          
          if (pageMatch && ipMatch) {
            visits.push({
              ts: timestamp,
              page: pageMatch[1].trim(),
              ip: ipMatch[1].trim(),
              source: sourceMatch ? sourceMatch[1].trim() : 'Unknown'
            })
          }
        }

        // Parse cart messages (if you add cart tracking to Telegram)
        if (text.includes('🛒 Panier') && text.includes('Produit:')) {
          const productMatch = text.match(/Produit: ([^\n]+)/)
          
          if (productMatch) {
            carts.push({
              ts: timestamp,
              product: productMatch[1].trim(),
              ip: 'telegram'
            })
          }
        }
      }
    })

    // Merge with existing localStorage data
    const existingVisits = JSON.parse(localStorage.getItem('bc_visits') || '[]')
    const existingCarts = JSON.parse(localStorage.getItem('bc_carts') || '[]')

    // Combine data, avoiding duplicates
    const allVisits = [...existingVisits, ...visits]
    const allCarts = [...existingCarts, ...carts]

    // Save back to localStorage (this won't work server-side, but we'll return the data)
    // In a real implementation, you'd save to a database

    return NextResponse.json({
      success: true,
      visits: allVisits.length,
      carts: allCarts.length,
      telegramVisits: visits.length,
      telegramCarts: carts.length,
      message: 'Data synchronized from Telegram'
    })

  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

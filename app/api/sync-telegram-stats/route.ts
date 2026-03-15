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
      console.error('Telegram API error:', telegramResponse.statusText)
      return NextResponse.json({ 
        error: 'Failed to fetch Telegram data',
        details: telegramResponse.statusText 
      }, { status: 500 })
    }

    const telegramData = await telegramResponse.json()
    
    if (!telegramData.ok) {
      console.error('Telegram API not ok:', telegramData)
      return NextResponse.json({ 
        error: 'Telegram API error',
        details: telegramData.description 
      }, { status: 500 })
    }

    const messages = telegramData.result || []
    console.log('Found messages:', messages.length)

    // Parse messages to extract stats
    const visits: any[] = []
    const carts: any[] = []

    messages.forEach((update: any) => {
      try {
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

          // Parse cart messages
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
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    })

    console.log('Parsed visits:', visits.length, 'carts:', carts.length)

    return NextResponse.json({
      success: true,
      visits: visits.length,
      carts: carts.length,
      telegramVisits: visits,
      telegramCarts: carts,
      message: 'Data synchronized from Telegram'
    })

  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { type, data, password } = await request.json()
    
    // Verify password
    if (password !== 'yofam0') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Store stats data (in a real app, you'd use a database like Vercel KV)
    // For now, we'll store it in memory and return success
    // This is a simplified version that just acknowledges the data
    
    console.log('Stats received:', { type, data })
    
    // In production, you would:
    // 1. Store in Vercel KV/Redis
    // 2. Store in database (Supabase, PlanetScale, etc.)
    // 3. Store in file system (not recommended for Vercel)
    
    return NextResponse.json({
      success: true,
      message: 'Stats stored successfully',
      type,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Store stats error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const password = searchParams.get('password')
    
    // Verify password
    if (password !== 'yofam0') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return stored stats (in a real app, fetch from database)
    // For now, return empty arrays since we're not persisting
    return NextResponse.json({
      success: true,
      visits: [],
      carts: [],
      message: 'No stored stats (demo mode)'
    })

  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

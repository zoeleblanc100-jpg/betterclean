import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = "https://ic8ty5pE7fgVwD74QIzZkA_QDqNPbU9.supabase.co"
const SUPABASE_KEY = "sb_publishable_ic8ty5pE7fgVwD74QIzZkA_QDqNPbU9"

export async function POST(request: NextRequest) {
  try {
    console.log('Supabase API called')
    
    const { password } = await request.json()
    
    // Verify password
    if (password !== 'yofam0') {
      console.log('Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Fetching from Supabase:', SUPABASE_URL)

    // Fetch visits from Supabase
    const visitsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/visits?select=*&order=ts.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    )

    console.log('Visits response status:', visitsResponse.status)

    // Fetch carts from Supabase
    const cartsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/carts?select=*&order=ts.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    )

    console.log('Carts response status:', cartsResponse.status)

    if (!visitsResponse.ok || !cartsResponse.ok) {
      console.error('Supabase API errors:', {
        visits: visitsResponse.status,
        visitsText: await visitsResponse.text(),
        carts: cartsResponse.status,
        cartsText: await cartsResponse.text()
      })
      
      return NextResponse.json({ 
        error: 'Failed to fetch Supabase data',
        details: {
          visitsStatus: visitsResponse.status,
          cartsStatus: cartsResponse.status
        }
      }, { status: 500 })
    }

    const visits = await visitsResponse.json()
    const carts = await cartsResponse.json()

    console.log('Supabase data loaded:', { visits: visits.length, carts: carts.length })

    return NextResponse.json({
      success: true,
      visits: visits.length,
      carts: carts.length,
      supabaseVisits: visits,
      supabaseCarts: carts,
      message: 'Data loaded from Supabase'
    })

  } catch (error) {
    console.error('Supabase sync error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = "https://ic8ty5pE7fgVwD74QIzZkA_QDqNPbU9.supabase.co"
// La clé doit être complète et commencer par eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljOHR5NXBFN2ZnVnc3c0OVFJe1prYV9RcU5QYlU5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NjI4NzEsImV4cCI6MjA1NzIwNDg3MX0.VOTRE_CLÉ_ICI"

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
    console.log('Using key:', SUPABASE_KEY.substring(0, 20) + '...')

    // Test basic connection first
    try {
      const testResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      })
      
      console.log('Test connection status:', testResponse.status)
      
      if (!testResponse.ok) {
        const errorText = await testResponse.text()
        console.error('Test connection failed:', errorText)
        return NextResponse.json({ 
          error: 'Supabase connection failed',
          details: `Status: ${testResponse.status}, Error: ${errorText}`
        }, { status: 500 })
      }
    } catch (connectionError) {
      console.error('Connection error:', connectionError)
      return NextResponse.json({ 
        error: 'Cannot connect to Supabase',
        details: connectionError instanceof Error ? connectionError.message : 'Unknown connection error'
      }, { status: 500 })
    }

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
          cartsStatus: cartsResponse.status,
          visitsError: visitsResponse.ok ? null : await visitsResponse.text(),
          cartsError: cartsResponse.ok ? null : await cartsResponse.text()
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

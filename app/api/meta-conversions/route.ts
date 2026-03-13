import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get environment variables from Vercel
    const token = process.env.META_CONVERSIONS_API_TOKEN
    const pixelId = process.env.META_PIXEL_ID
    const apiVersion = process.env.META_API_VERSION || 'v19.0'
    
    if (!token || !pixelId) {
      console.error('Missing Meta Conversions API credentials')
      return NextResponse.json(
        { error: 'Missing credentials' },
        { status: 500 }
      )
    }
    
    // Prepare the payload for Meta Conversions API
    const payload = {
      data: body.events || [body],
      access_token: token
    }
    
    // Send to Meta Conversions API
    const response = await fetch(
      `https://graph.facebook.com/${apiVersion}/${pixelId}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    )
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('Meta Conversions API Error:', errorData)
      return NextResponse.json(
        { error: 'Failed to send event to Meta', details: errorData },
        { status: 400 }
      )
    }
    
    const result = await response.json()
    console.log('Meta Conversions API Success:', result)
    
    return NextResponse.json({ 
      success: true, 
      result 
    })
    
  } catch (error) {
    console.error('Meta Conversions API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

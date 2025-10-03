import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// URL cơ sở của API bên ngoài
const HOUJIN_API_BASE_URL = 'https://api.houjin-bangou.nta.go.jp/4/name'

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json()

    const apiKey = 'Kd4y5Y2BQgn52'

    if (!apiKey) {
      console.error('HOUJIN_API_KEY is not defined in environment variables.')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      )
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Parameter "name" is required' },
        { status: 400 },
      )
    }

    const params = new URLSearchParams({
      id: apiKey,
      name: name,
      type: '02',
      history: '0',
    })

    const fullUrl = `${HOUJIN_API_BASE_URL}?${params.toString()}`

    console.log(fullUrl, 'fullUrl')

    const apiResponse = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!apiResponse.ok) {
      throw new Error(`External API failed with status: ${apiResponse.status}`)
    }

    const data = await apiResponse.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in search-houjin API route:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

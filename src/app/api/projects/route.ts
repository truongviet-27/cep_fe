import { NextResponse } from 'next/server'

export async function GET() {
  const externalApiUrl = 'https://api.mockapi.com/api/projects'
  const apiKey = '19cc7eb2bebf4562b3bf7e2d81e7cbb7'

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
  }

  try {
    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: headers,
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          error: 'Failed to fetch data from external API',
          details: errorData,
        },
        { status: response.status },
      )
    }

    const data = await response.json()

    console.log(data, 'data')
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    // Xử lý các lỗi mạng hoặc lỗi không mong muốn khác
    console.error('Error fetching from external API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

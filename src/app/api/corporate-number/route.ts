import { parseHoujinCsv } from '@utility/csv-parsing-function'
import moji from 'moji'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const HOUJIN_API_BASE_URL = 'https://api.houjin-bangou.nta.go.jp/4/name'

export async function POST(req: NextRequest) {
  try {
    const { name, address } = await req.json()

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

    if (/[ ]/.test(name)) {
      return NextResponse.json(
        { error: '検索文字列に半角スペースを含めることはできません。' },
        { status: 400 },
      )
    }

    const fullWidthName = moji(name).convert('HE', 'ZE').toString()

    const params = new URLSearchParams({
      id: apiKey,
      name: fullWidthName,
      mode: '2',
      type: '02',
      history: '0',
    })

    if (address && address !== '') {
      params.append('address', String(address))
    }

    const fullUrl = `${HOUJIN_API_BASE_URL}?${params.toString()}`

    const apiResponse = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!apiResponse.ok) {
      throw new Error(`External API failed with status: ${apiResponse.status}`)
    }

    const csvData = await apiResponse.text()

    const jsonData = parseHoujinCsv(csvData)

    return NextResponse.json(jsonData)
  } catch (error) {
    console.error('Error in search-houjin API route:', error)
    return NextResponse.json(
      { error: '検索結果件数が多いため結果をお返しできません。' },
      { status: 500 },
    )
  }
}

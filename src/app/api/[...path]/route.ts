import { type NextRequest, NextResponse } from 'next/server'
import { FINMIND_API_HOST, FINMIND_USER_ID, FINMIND_USER_PASSWORD } from '@/const'

export async function GET(req: NextRequest) {
  const apiPath = req.nextUrl.pathname
  const queryObject = Object.fromEntries(req.nextUrl.searchParams.entries())
  const queryObjectToUse = {
    ...queryObject,
    user_id: FINMIND_USER_ID,
    password: FINMIND_USER_PASSWORD,
  }
  const queryToUse = new URLSearchParams(queryObjectToUse).toString()
  const url = new URL(`${FINMIND_API_HOST}${apiPath}?${queryToUse}`)
  console.log('~~~~~~~~~~~~~fetching url:', url.toString(), FINMIND_USER_ID, FINMIND_USER_PASSWORD)
  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      return NextResponse.json(
        (await response.json()) ?? {
          error: `Failed to fetch data from target URL: ${response.statusText}`,
        },
        { status: response.status }
      )
    }
    const data = await response.json()
    return NextResponse.json(data, {
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      {
        status: 500,
      }
    )
  }
}

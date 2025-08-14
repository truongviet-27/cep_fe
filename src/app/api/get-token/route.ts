import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('next-auth.session-token')?.value || ''
  return Response.json({ token })
}

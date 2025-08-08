import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import React from 'react'

import authOptions from '@/app/api/auth/[...nextauth]/options'

export default async function LoginLayout({
  children,
}: React.PropsWithChildren) {
  const session = await getServerSession(authOptions)

  if (session?.user) {
    return redirect('/projects')
  }

  return <>{children}</>
}

// eslint-disable-next-line simple-import-sort/imports
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import type React from 'react'

import authOptions from '@/app/api/auth/[...nextauth]/options'

export default async function Layout({ children }: React.PropsWithChildren) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return redirect('/login')
  }

  return children
}

'use client'
// eslint-disable-next-line simple-import-sort/imports
import type React from 'react'

import { useGo } from '@refinedev/core'
import { useUserStore } from '@stores/useUserStore'

export default function Layout({ children }: React.PropsWithChildren) {
  const go = useGo()
  const isLoggedIn = useUserStore((state) => state.isLoggedIn)

  if (!isLoggedIn) {
    go({ to: '/login' })
  }

  return children
}

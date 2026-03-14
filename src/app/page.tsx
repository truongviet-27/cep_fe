'use client'

import { Authenticated, useGo } from '@refinedev/core'
import { NavigateToResource } from '@refinedev/nextjs-router'
import { useUserStore } from '@stores/useUserStore'
import { Suspense, useEffect } from 'react'

function HomeRedirect() {
  const go = useGo()
  const permission = useUserStore((s) => s.permission)

  useEffect(() => {
    if (permission?.is_first_login) {
      go({ to: '/initial-setup-guide' })
    }
  }, [go, permission?.is_first_login])

  if (permission?.is_first_login) {
    return null
  }
  return <NavigateToResource />
}

export default function Page() {
  return (
    <Suspense>
      <Authenticated key="home-page">
        <HomeRedirect />
      </Authenticated>
    </Suspense>
  )
}

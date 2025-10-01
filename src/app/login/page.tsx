'use client'

import LoadingPage from '@components/common/loading-page'
import { useGo, useLogin } from '@refinedev/core'
import { useUserStore } from '@stores/useUserStore'
import { useLayoutEffect } from 'react'

export default function LoginPage() {
  const { mutate: login } = useLogin()
  const go = useGo()
  const isLoggedIn = useUserStore((state) => state.isLoggedIn)

  useLayoutEffect(() => {
    if (isLoggedIn) {
      go({ to: '/quotas' })
    } else {
      login({})
    }
  }, [login])

  return <LoadingPage />
}

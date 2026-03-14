'use client'

import LoadingPage from '@components/common/loading-page'
import { useGo, useLogin } from '@refinedev/core'
import { useUserStore } from '@stores/useUserStore'
import { useLayoutEffect } from 'react'

export default function LoginPage() {
  const { mutate: login } = useLogin()
  const go = useGo()
  const isLoggedIn = useUserStore((state) => state.isLoggedIn)
  const permission = useUserStore((state) => state.permission)

  useLayoutEffect(() => {
    if (isLoggedIn) {
      go({
        to: permission?.is_first_login ? '/initial-setup-guide' : '/quotas',
      })
    } else {
      login({})
    }
  }, [login, permission?.is_first_login])

  return <LoadingPage />
}

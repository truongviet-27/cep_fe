'use client'

import LoadingPage from '@components/common/loading-page'
import { useLogin } from '@refinedev/core'
import { useLayoutEffect } from 'react'

export default function LoginPage() {
  const { mutate: login } = useLogin()

  useLayoutEffect(() => {
    login({})
  }, [login])

  return <LoadingPage />
}

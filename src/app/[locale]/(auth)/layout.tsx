import './auth.css'

import AuthContainer from '@components/layout/container'
import AuthHeader from '@components/layout/header'
import { Layout } from 'antd'
import React from 'react'

export default async function AuthLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <Layout className="min-h-screen">
      <AuthHeader selectedMenuKey="system" currentUser="伊藤太郎" />
      <AuthContainer>{children}</AuthContainer>
    </Layout>
  )
}

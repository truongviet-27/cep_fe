import React from 'react'
import { Layout } from 'antd'
import AuthHeader from '@components/layouts/auth-layout/header'
import AuthContainer from '@components/layouts/auth-layout/container'
import './auth.css'

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

import './style.css'

import AuthContainer from '@components/layout/container'
import AuthHeader from '@components/layout/header'
import Menu from '@components/layout/menu'
import { Layout } from 'antd'
import React from 'react'

export default function AuthLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <Layout className="min-h-screen space-y-4">
      <AuthHeader>
        <Menu />
      </AuthHeader>
      <AuthContainer>{children}</AuthContainer>
    </Layout>
  )
}

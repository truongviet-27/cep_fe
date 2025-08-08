import './style.css'

import { Layout } from 'antd'
import React from 'react'

import AuthContainer from '@/components/layout/container'
import AuthHeader from '@/components/layout/header'
import Menu from '@/components/layout/menu'

export default function AuthLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <Layout className={`h-full min-h-screen space-y-4`}>
      <AuthHeader>
        <Menu />
      </AuthHeader>
      <AuthContainer>{children}</AuthContainer>
    </Layout>
  )
}

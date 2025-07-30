import './auth.css'

import AuthContainer from '@components/layout/container'
import { Navbar } from '@components/layout/navbar'
import { Layout } from 'antd'

export default function AuthLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <Layout className="min-h-screen">
      <Navbar />
      <AuthContainer>{children}</AuthContainer>
    </Layout>
  )
}

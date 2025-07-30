import '../auth.css'

import { AppIcon } from '@components/common/app-icon'
import AuthContainer from '@components/layout/container'
import AuthHeader from '@components/layout/header'
import { Layout, Menu } from 'antd'
import React from 'react'

export default async function AuthLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  const currentUser = '伊藤太郎',
    selectedMenuKey = 'system',
    menuItems = [
      { key: 'estimates', label: '見積書' },
      { key: 'orders', label: '注文書' },
      { key: 'delivery', label: '納品書' },
      { key: 'invoices', label: '請求書' },
      { key: 'system', label: 'システム設定' },
    ]

  return (
    <Layout className="min-h-screen">
      <AuthHeader>
        <div className="flex items-center space-x-8">
          <AppIcon level={4} />
          <Menu
            mode="horizontal"
            className="flex-1 border-none bg-transparent"
            items={menuItems}
            selectedKeys={[selectedMenuKey]}
          />
        </div>
        <div className="text-gray-700">{currentUser}</div>
      </AuthHeader>
      <AuthContainer>{children}</AuthContainer>
    </Layout>
  )
}

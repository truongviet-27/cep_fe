import './style.css'

import { AppIcon } from '@components/common/app-icon'
import AuthContainer from '@components/layout/container'
import AuthHeader from '@components/layout/header'
import { Layout, Menu } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function AuthLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  const t = useTranslations('breadcrumb')

  const currentUser = '伊藤太郎',
    selectedMenuKey = 'system',
    menuItems = [
      { key: 'estimates', label: t('estimates') },
      { key: 'orders', label: t('orders') },
      { key: 'delivery', label: t('delivery') },
      { key: 'invoices', label: t('invoices') },
      { key: 'system', label: t('system') },
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
          <div className="text-gray-700">{currentUser}</div>
        </div>
      </AuthHeader>
      <AuthContainer>{children}</AuthContainer>
    </Layout>
  )
}

import './style.css'

import { DownOutlined } from '@ant-design/icons'
import { AppIcon } from '@components/common/app-icon'
import Breadcrumb from '@components/layout/breadcrumbs'
import AuthContainer from '@components/layout/container'
import AuthHeader from '@components/layout/header'
import { Layout, Menu, Space } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function AuthLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  const t = useTranslations('breadcrumb')
  const t_system = useTranslations('systemConfig')

  const currentUser = '伊藤太郎',
    selectedMenuKey = 'system',
    menuItems = [
      { key: 'estimates', label: t('estimates') },
      { key: 'orders', label: t('orders') },
      { key: 'delivery', label: t('delivery') },
      { key: 'invoices', label: t('invoices') },
      {
        key: 'system',
        label: (
          <Space size="small">
            {t('system')}
            <DownOutlined style={{ fontSize: '10px' }} />
          </Space>
        ),
        children: [
          {
            key: 'permission-settings',
            label: t_system('permissionSettings'),
          },
          {
            key: 'permission-settings',
            label: t_system('numberingAssignmentSettings'),
            href: '/numbering-assignment-settings',
          },
        ],
      },
    ]

  return (
    <Layout className="min-h-screen">
      <AuthHeader>
        <div className="flex items-center justify-start space-x-8">
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
      <Breadcrumb />
      <AuthContainer>{children}</AuthContainer>
    </Layout>
  )
}

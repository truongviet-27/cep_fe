'use client'

import type { HeaderProps } from '@type/config'
import { Layout, Menu } from 'antd'

const { Header } = Layout

export default function AuthHeader({
  currentUser = '伊藤太郎',
  selectedMenuKey = 'system',
}: Readonly<HeaderProps>) {
  const menuItems = [
    { key: 'estimates', label: '見積書' },
    { key: 'orders', label: '注文書' },
    { key: 'delivery', label: '納品書' },
    { key: 'invoices', label: '請求書' },
    { key: 'system', label: 'システム設定' },
  ]

  return (
    <Header
      className="flex items-center justify-between border-b px-6"
      style={{ background: '#fff', borderColor: '#e5e7eb' }}
    >
      <div className="flex items-center space-x-8">
        <div className="text-xl font-semibold text-blue-500">eeERP</div>
        <Menu
          mode="horizontal"
          className="flex-1 border-none bg-transparent"
          items={menuItems}
          selectedKeys={[selectedMenuKey]}
        />
      </div>
      <div className="text-gray-700">{currentUser}</div>
    </Header>
  )
}

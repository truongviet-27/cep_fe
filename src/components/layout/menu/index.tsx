'use client'

import { DownOutlined } from '@ant-design/icons'
import { AppIcon } from '@components/common/app-icon'
import { Menu as MenuAntd, Space } from 'antd'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import React from 'react'

function Menu() {
  const t = useTranslations('breadcrumb')
  const t_system = useTranslations('systemConfig')

  const selectedMenuKey = usePathname().split('/')?.[1]

  const currentUser = '伊藤太郎',
    menuItems = [
      { key: 'estimates', label: t('estimates') },
      { key: 'customers', label: t('customers') },
      {
        key: 'projects',
        label: <Link href={'/projects'}>{t('projects')}</Link>,
      },
      { key: 'products', label: t('products') },
      {
        key: 'departments',
        label: <Link href={'/departments'}>{t('departments')}</Link>,
      },
      { key: 'employees', label: t('employees') },
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
            label: (
              <Link href={'/permission-settings'}>
                {t_system('permissionSettings')}
              </Link>
            ),
          },
          {
            key: 'numbering-assignment-settings',
            label: (
              <Link href={'/'}>{t_system('numberingAssignmentSettings')}</Link>
            ),
            href: '/numbering-assignment-settings',
          },
        ],
      },
    ]

  return (
    <>
      <div className="flex items-center justify-start space-x-8">
        <AppIcon level={4} />
        <MenuAntd
          mode="horizontal"
          className="flex-1 border-none bg-transparent"
          items={menuItems}
          selectedKeys={[selectedMenuKey]}
        />
      </div>
      <div className="text-gray-700">{currentUser}</div>
    </>
  )
}

export default Menu

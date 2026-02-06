'use client'

import { DownOutlined } from '@ant-design/icons'
import { AppIcon } from '@components/icons/app-icon'
import { recursiveNestedMenu } from '@components/layout/menu/utils/recursive-nested-menu'
import { useGo, useMenu } from '@refinedev/core'
import type { TreeMenuItem } from '@refinedev/core/dist/hooks/menu/useMenu'
import type { MenuProps } from 'antd'
import { Menu as MenuAntd } from 'antd'
import { last } from 'lodash'
import { useTranslations } from 'next-intl'
import React from 'react'

function Menu() {
  const { menuItems, selectedKey } = useMenu()
  const t = useTranslations('common')

  const go = useGo()

  // Xử lý sự kiện click cho toàn bộ Menu
  const handleMenuClick: MenuProps['onClick'] = (info) => {
    const to = info.key
    // Chỉ điều hướng khi `key` (route) tồn tại
    if (to) {
      go({
        type: 'replace',
        to,
      })
    }
  }

  const selectedKeys = [`/${last(selectedKey.split('/'))}`]

  const items = recursiveNestedMenu(
    (menuItems as (TreeMenuItem & { isNotMenu: boolean })[]).filter(
      (menuItem) => !menuItem.isNotMenu,
    ),
    [],
    t,
  )

  return (
    <div className="flex w-2/3 items-center justify-start space-x-8">
      <AppIcon level={2} />
      <MenuAntd
        mode="horizontal"
        className="flex-1 border-none bg-transparent"
        items={items}
        selectedKeys={selectedKeys}
        expandIcon={<DownOutlined style={{ fontSize: '10px' }} />}
        style={{ width: 'max-content' }}
        onClick={handleMenuClick}
      />
    </div>
  )
}

export default Menu

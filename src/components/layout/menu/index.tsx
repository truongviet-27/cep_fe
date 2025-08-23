'use client'

import { DownOutlined } from '@ant-design/icons'
import { AppIcon } from '@components/icons/app-icon'
import { recursiveNestedMenu } from '@components/layout/menu/utils/recursive-nested-menu'
import { useGo, useMenu } from '@refinedev/core'
import { Menu as MenuAntd } from 'antd'
import { last } from 'lodash'
import React from 'react'

function Menu() {
  const { menuItems, selectedKey } = useMenu()
  const go = useGo()

  const handleNavigation = (to: string) => {
    go({
      type: 'replace',
      to,
    })
  }

  const selectedKeys = [last(selectedKey.split('/')) ?? '/']

  const items = recursiveNestedMenu(menuItems, handleNavigation)

  return (
    <div className="flex w-2/3 items-center justify-start space-x-8">
      <AppIcon level={4} />
      <MenuAntd
        mode="horizontal"
        className="flex-1 border-none bg-transparent"
        items={items}
        selectedKeys={selectedKeys}
        expandIcon={<DownOutlined style={{ fontSize: '10px' }} />}
        style={{ width: 'max-content' }}
      />
    </div>
  )
}

export default Menu

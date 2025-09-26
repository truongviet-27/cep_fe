import { DownOutlined } from '@ant-design/icons'
import { hasDisableMenu } from '@utility/permission'
import React from 'react'

type Tree = {
  route?: string
  icon?: React.ReactNode
  label?: string
  children: Tree[] | null
  name: string
  expandIcon?: React.ReactNode
}

type ConvertTree = {
  key: string
  label: React.ReactNode
  children?: ConvertTree[] | null
  icon?: React.ReactNode
  disabled?: boolean
}

const recursiveNestedMenu = (menuItems: Tree[], items: ConvertTree[] = []) => {
  menuItems.forEach(({ route, label, children, name }, index) => {
    items.push({
      key: route || name,
      label: (
        <span>
          {label}
          &nbsp;
          {children && children.length > 0 && (
            <DownOutlined style={{ fontSize: '10px' }} />
          )}
        </span>
      ),
      children: [],
      disabled: hasDisableMenu(route),
    })

    if (children && items[index]?.children && children.length > 0) {
      recursiveNestedMenu(children, items[index].children)
    }
    if (items[index].children && items[index].children.length === 0) {
      items[index].children = null
    }
  })

  return items
}

export { recursiveNestedMenu }

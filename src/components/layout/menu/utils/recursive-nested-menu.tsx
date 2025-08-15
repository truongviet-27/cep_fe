import { DownOutlined } from '@ant-design/icons'
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
}

const recursiveNestedMenu = (
  menuItems: Tree[],
  handleNavigation: (route: string) => void,
  items: ConvertTree[] = [],
) => {
  menuItems.forEach(({ route, label, children, name }, index) => {
    items.push({
      key: name,
      label: (
        <span onClick={() => route && handleNavigation(route)}>
          {label}
          &nbsp;
          {children && children.length > 0 && (
            <DownOutlined style={{ fontSize: '10px' }} />
          )}
        </span>
      ),
      children: [],
    })

    if (children && items[index]?.children && children.length > 0) {
      recursiveNestedMenu(children, handleNavigation, items[index].children)
    }
    if (items[index].children && items[index].children.length === 0) {
      items[index].children = null
    }
  })

  return items
}

export { recursiveNestedMenu }

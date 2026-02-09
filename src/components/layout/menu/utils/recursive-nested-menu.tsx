import { DownOutlined, QuestionOutlined } from '@ant-design/icons'
import { hasDisableMenu, hasDisableMenuByParameter } from '@utility/permission'
import { Tooltip } from 'antd'
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

const recursiveNestedMenu = (
  menuItems: Tree[],
  items: ConvertTree[] = [],
  t?: (key: string) => string,
) => {
  menuItems.forEach(({ route, label, children, name }, index) => {
    const isAgreedPrices = name === 'agreed-prices'

    items.push({
      key: route || name,
      label: (
        <span>
          {label}
          {isAgreedPrices && (
            <Tooltip
              title={
                <span style={{ color: '#000' }}>
                  {t
                    ? t('agreed_prices.tooltip')
                    : '基本契約に基づく継続契約の見積一覧です。'}
                </span>
              }
              placement="right"
              overlayInnerStyle={{
                backgroundColor: '#e6f7ff',
              }}
              color="#e6f7ff"
            >
              <QuestionOutlined
                style={{
                  color: '#fff',
                  backgroundColor: '#1890ff',
                  borderRadius: '50%',
                  fontSize: '12px',
                  marginLeft: '10px',
                  padding: '2px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #1890ff',
                }}
              />
            </Tooltip>
          )}
          &nbsp;
          {children && children.length > 0 && (
            <DownOutlined style={{ fontSize: '10px' }} />
          )}
        </span>
      ),
      children: [],
      disabled: hasDisableMenu(route) || hasDisableMenuByParameter(route),
    })

    if (children && items[index]?.children && children.length > 0) {
      recursiveNestedMenu(children, items[index].children, t)
    }
    if (items[index].children && items[index].children.length === 0) {
      items[index].children = null
    }
  })

  return items
}

export { recursiveNestedMenu }

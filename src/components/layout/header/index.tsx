'use client'

import { BellOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { cn } from '@utility/cn'
import { GRAY, WHITE } from '@utility/color'
import { Avatar, Badge, Input, Layout, Space } from 'antd'
import { useKBar } from 'kbar'
import React from 'react'

const { Header } = Layout

export default function AuthHeader({
  children,
}: Readonly<React.PropsWithChildren>) {
  const { query } = useKBar()

  return (
    <div className={'flex justify-center'}>
      <Header
        className={cn(
          'flex w-full items-center border-b px-6 pb-6',
          'rounded-lg',
          'border',
          'shadow-sm',
          'px-6 py-4',
          children ? 'justify-center' : 'justify-end',
        )}
        style={{
          background: WHITE,
          borderColor: GRAY,
          width: `calc(100% - 3rem)`,
        }}
      >
        {children}

        {!children && (
          <div className={'ml-6 flex w-full items-center space-x-3'}>
            <Input
              prefix={<SearchOutlined />}
              onClick={() => query.toggle()}
              placeholder="Type to search"
              style={{
                maxWidth: '40rem',
                minWidth: '80%',
                borderRadius: '6px',
                marginRight: '1rem',
              }}
            />
            <Space size="middle">
              <Badge dot>
                <BellOutlined style={{ fontSize: '18px' }} />
              </Badge>
              <Space>
                <Avatar
                  src={'https://via.placeholder.com/48'}
                  icon={<UserOutlined />}
                />
              </Space>
            </Space>
          </div>
        )}
      </Header>
    </div>
  )
}

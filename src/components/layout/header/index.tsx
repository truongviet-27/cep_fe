'use client'

import { BellOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Input, Layout, Space } from 'antd'
import { useKBar } from 'kbar'
import React from 'react'

const { Header } = Layout

export default function AuthHeader({
  children,
}: Readonly<React.PropsWithChildren>) {
  const { query } = useKBar()

  return (
    <Header
      className="flex w-full items-center justify-end border-b px-6"
      style={{ background: '#fff', borderColor: '#e5e7eb' }}
    >
      {children}

      {!children && (
        <div className={'flex w-full items-center space-x-3'}>
          <Input
            prefix={<SearchOutlined />}
            onClick={() => query.toggle()}
            placeholder="Type to search"
            style={{ maxWidth: '600px', minWidth: '80%', borderRadius: '6px' }}
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
  )
}

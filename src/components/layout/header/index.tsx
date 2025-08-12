'use client'

import { BellOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Input, Layout, Space } from 'antd'
import { useKBar } from 'kbar'
import { useSession } from 'next-auth/react'
import React from 'react'

import { cn } from '@/utility/cn'
import { GRAY, WHITE } from '@/utility/color'

const { Header } = Layout

export default function AuthHeader({
  children,
}: Readonly<React.PropsWithChildren>) {
  const { query } = useKBar()
  const session = useSession()

  return (
    <div className={cn(children && 'flex justify-center')}>
      <Header
        className={cn(
          'flex w-full items-center border-b',
          'rounded-lg',
          'border',
          'shadow-sm',
          'px-6 py-4 pb-6',
          children ? 'justify-between' : 'justify-end',
        )}
        style={{
          background: WHITE,
          borderColor: GRAY,
          width: children ? `calc(100% - 3rem)` : '100%',
        }}
      >
        {children}

        {children ? (
          <div className="flex items-center gap-2">
            <div className="text-right leading-tight">
              <div className="text-[12px] font-semibold text-[#74232A]">
                株式会社ピオネロ
              </div>

              <div className="flex items-center justify-end gap-1">
                <span className="max-w-[180px] truncate text-[14px] font-medium text-gray-900">
                  {session?.data?.user?.name}
                </span>
                <UserOutlined className="text-[16px] text-[#1677ff]" />
              </div>

              <div className="text-[11px] text-gray-400">テナント管理者</div>
            </div>
          </div>
        ) : (
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

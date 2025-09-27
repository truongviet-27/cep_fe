'use client'

import {
  BellOutlined,
  DownOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import TenantSwitchingModal from '@components/layout/header/tenant-switching-modal'
import { useModal } from '@refinedev/core'
import { getOrgFromToken, isSupperAdmin } from '@utility/decode-token'
import { Avatar, Badge, Input, Layout, Modal, Space } from 'antd'
import { useKBar } from 'kbar'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React from 'react'

import { cn } from '@/utility/cn'
import { GRAY, WHITE } from '@/utility/color'

const { Header } = Layout

export default function AuthHeader({
  children,
}: Readonly<React.PropsWithChildren>) {
  const t_btn = useTranslations('buttons')
  const { query } = useKBar()
  const session = useSession()
  const modalProps = useModal()

  const isAdmin = isSupperAdmin(session.data?.accessToken)
  const tenantName = getOrgFromToken(session.data?.accessToken)?.name

  return (
    <div
      className={cn(
        children &&
          'sticky top-0 z-50 mb-0 flex justify-center border-b-[1px] border-solid border-[#E0E0E0]',
      )}
    >
      <Header
        className={cn(
          'flex w-full items-center',
          'px-6 py-4 pb-6',

          children ? 'justify-between' : 'justify-end',
        )}
        style={{
          background: WHITE,
          borderColor: GRAY,
          width: '100%',
          padding: 32,
        }}
      >
        {children}

        {children ? (
          <div className="flex items-center gap-2">
            <div className="text-right leading-tight">
              <Space
                size={4}
                className={cn(isAdmin && 'cursor-pointer')}
                onClick={isAdmin ? () => modalProps.show() : undefined}
              >
                <div className="text-[12px] font-semibold text-[#74232A]">
                  {tenantName ?? '株式会社ピオネロ'}
                </div>
                {isAdmin && <DownOutlined style={{ fontSize: '10px' }} />}
              </Space>

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

        <Modal
          {...modalProps}
          onCancel={modalProps.close}
          cancelButtonProps={{ style: { display: 'none' } }}
          okText={t_btn('cancel')}
          width={'50vw'}
        >
          <TenantSwitchingModal modalProps={modalProps} />
        </Modal>
      </Header>
    </div>
  )
}

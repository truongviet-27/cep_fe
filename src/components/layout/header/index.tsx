'use client'

import {
  BellOutlined,
  DownOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import TenantSwitchingModal from '@components/layout/header/tenant-switching-modal'
import { useGo, useLogout, useModal } from '@refinedev/core'
import useTenantStore from '@stores/useTenantStore'
import { useUserStore } from '@stores/useUserStore'
import { isSupperAdmin } from '@utility/decode-token'
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Input,
  Layout,
  Modal,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import { useKBar } from 'kbar'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React from 'react'

import { cn } from '@/utility/cn'
import { GRAY, WHITE } from '@/utility/color'

const { Text } = Typography

const { Header } = Layout

export default function AuthHeader({
  children,
}: Readonly<React.PropsWithChildren>) {
  const t_btn = useTranslations('buttons')
  const t_menu = useTranslations('menu')
  const { query } = useKBar()
  const session = useSession()
  const go = useGo()
  const modalProps = useModal()
  const { mutate: logout } = useLogout()
  const { permission } = useUserStore()
  const helpUrl =
    'https://app.eebot.jp/fastdesk/d5bac3ba-6c59-499c-be14-4847905ac901'

  const isAdmin = isSupperAdmin(session.data?.accessToken)
  const { organizationName } = useUserStore()
  const storeTenantName = useTenantStore((s) => s.tenantName)
  const tenantName = isAdmin ? storeTenantName : organizationName
  const menuItems = [{ key: 'logout', label: t_menu('logout') }]
  const onMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout()
    }
  }

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
          padding: 18,
        }}
      >
        {children}

        {children ? (
          <div className="flex items-end gap-2">
            <Button
              type="default"
              style={{
                color: 'rgb(39, 132, 255)',
                borderColor: 'rgb(39, 132, 255)',
                backgroundColor: WHITE,
              }}
              onClick={() => go({ to: '/initial-setup-guide' })}
            >
              初期設定ガイド
            </Button>
            <a
              href={helpUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-flex' }}
            >
              <Button
                type="default"
                style={{
                  color: '#B2AC00',
                  borderColor: '#B2AC00',
                  backgroundColor: WHITE,
                }}
              >
                ヘルプ
              </Button>
            </a>
            <div className="text-right leading-tight">
              <Space
                size={4}
                className={cn(isAdmin && 'cursor-pointer')}
                onClick={isAdmin ? () => modalProps.show() : undefined}
              >
                <Tooltip title={tenantName ?? ''}>
                  <Text
                    className="text-[22px] font-semibold !text-[#74232A]"
                    style={{
                      width: '260px',
                      fontSize: '22px',
                      color: '#74232A',
                      margin: 0,
                      display: 'inline-block',
                      verticalAlign: 'middle',
                    }}
                    ellipsis={true}
                  >
                    {tenantName ?? ''}
                  </Text>
                </Tooltip>
                {isAdmin && <DownOutlined style={{ fontSize: '10px' }} />}
              </Space>

              <Dropdown
                trigger={['click']}
                menu={{ items: menuItems, onClick: onMenuClick }}
              >
                <div className="flex cursor-pointer items-start justify-end gap-1">
                  <div className="flex flex-col gap-[2px]">
                    <span className="max-w-[180px] truncate text-[12px] font-medium text-gray-900">
                      {permission?.user?.name ??
                        session?.data?.user?.name ??
                        ''}
                    </span>
                    <span className="text-[12px] text-gray-400">
                      {permission?.role?.display_name ?? ''}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <UserOutlined className="text-[16px] text-[#1677ff]" />
                    <DownOutlined style={{ fontSize: '10px' }} />
                  </div>
                </div>
              </Dropdown>
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
              <Dropdown
                trigger={['click']}
                menu={{ items: menuItems, onClick: onMenuClick }}
              >
                <Space className="cursor-pointer">
                  <Avatar
                    src={'https://via.placeholder.com/48'}
                    icon={<UserOutlined />}
                  />
                  <DownOutlined style={{ fontSize: '10px' }} />
                </Space>
              </Dropdown>
            </Space>
          </div>
        )}

        <Modal
          {...modalProps}
          onCancel={modalProps.close}
          onOk={modalProps.close}
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

'use client'

import { Layout } from 'antd'
import React from 'react'

import Breadcrumb from '../breadcrumbs'

const { Content } = Layout

export default function AuthContainer({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const breadcrumbItems = [{ title: 'システム設定' }]

  return (
    <Content>
      <Breadcrumb items={breadcrumbItems} />
      <div className="px-6 pb-6">{children}</div>
    </Content>
  )
}

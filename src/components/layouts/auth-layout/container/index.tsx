'use client'

import { Layout } from 'antd'
import Breadcrumb from '../breadcrumbs'
import React from 'react'

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

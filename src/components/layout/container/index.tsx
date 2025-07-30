'use client'

import { Layout } from 'antd'
import React from 'react'

const { Content } = Layout

export default function AuthContainer({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Content>
      <div className="px-6 pb-6">{children}</div>
    </Content>
  )
}

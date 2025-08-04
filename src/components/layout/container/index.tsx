'use client'

import useModalStore from '@stores/useModalStore'
import { Layout } from 'antd'
import React from 'react'

const { Content } = Layout

export default function AuthContainer({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { modal } = useModalStore()

  return (
    <Content>
      <div className="px-6 pb-6">
        {modal}
        {children}
      </div>
    </Content>
  )
}

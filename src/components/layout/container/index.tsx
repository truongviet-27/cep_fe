'use client'

import { LAYOUT_BG } from '@utility/color'
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
      <div style={{ backgroundColor: LAYOUT_BG }}>{children}</div>
      <div className={'flex justify-end space-x-3 py-6 pr-[18px]'}>
        Copyright©Commerce Robotics Inc.All rights reserved.
      </div>
    </Content>
  )
}

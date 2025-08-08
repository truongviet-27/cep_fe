import { Layout } from 'antd'
import React from 'react'

import { LAYOUT_BG } from '@/utility/color'

function Background({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: LAYOUT_BG,
      }}
    >
      {children}
    </Layout>
  )
}

export default Background

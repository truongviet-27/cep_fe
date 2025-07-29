import { Layout } from 'antd'
import React from 'react'

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
        background: '#f0f2f5',
      }}
    >
      {children}
    </Layout>
  )
}

export default Background

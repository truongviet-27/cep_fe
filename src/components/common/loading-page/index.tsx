import { Layout, Spin } from 'antd'
import React from 'react'

function LoadingPage() {
  return (
    <Layout
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin size="middle" />
    </Layout>
  )
}

export default LoadingPage

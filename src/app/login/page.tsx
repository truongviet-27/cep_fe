'use client'

import { ThemedTitleV2 } from '@refinedev/antd'
import { Button, Typography, Layout, Space } from 'antd'
import { useLogin } from '@refinedev/core'

export default function Login() {
  const { mutate: login } = useLogin()

  return (
    <Layout
      style={{
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Space direction="vertical" align="center">
        <ThemedTitleV2
          collapsed={false}
          wrapperStyles={{
            fontSize: '22px',
            marginBottom: '36px',
          }}
        />
        <Button
          style={{ width: '240px' }}
          type="primary"
          size="middle"
          onClick={() => login({})}
        >
          Sign in
        </Button>
        <Typography.Text type="secondary">
          Powered by
          <img
            style={{ padding: '0 5px' }}
            alt="Keycloak"
            src="https://refine.ams3.cdn.digitaloceanspaces.com/superplate-auth-icons%2Fkeycloak.svg"
          />
          Keycloak
        </Typography.Text>
      </Space>
    </Layout>
  )
}

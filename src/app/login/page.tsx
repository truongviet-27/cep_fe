'use client'

import { GoogleOutlined, WindowsOutlined } from '@ant-design/icons'
import { AppIcon } from '@components/common/app-icon'
import Background from '@components/layout/background'
import { useSetLocale, useTranslate, useTranslation } from '@refinedev/core'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from 'antd'
import React from 'react'

const { Title, Text, Link } = Typography

function Page() {
  const t = useTranslate()
  const changeLocale = useSetLocale()
  const { getLocale } = useTranslation()
  const currentLocale = getLocale()

  return (
    <Background>
      <Card
        style={{
          width: '100%',
          maxWidth: 500,
          padding: '16px',
        }}
        variant="borderless"
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <AppIcon />
        </div>

        <Title level={4}>{t('login.title', 'Lets get you started')}</Title>
        <Text type="secondary">
          {t('login.noAccount', 'Dont have an account?')}{' '}
          <Link href={`/register`}>{t('login.signUp', 'sign up')}</Link>
        </Text>

        <Form
          layout="vertical"
          requiredMark={false}
          // onFinish={(values) => login(values)}
          style={{ marginTop: '24px' }}
        >
          <Form.Item
            name="email"
            label={t('login.form.email', 'Username/Email Address')}
            rules={[
              {
                required: true,
                message: t(
                  'login.errors.emailRequired',
                  'Please enter your email!',
                ),
              },
            ]}
          >
            <Input
              placeholder={t(
                'login.form.emailPlaceholder',
                'Enter your email address',
              )}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={t('login.form.password', 'Password')}
            rules={[
              {
                required: true,
                message: t(
                  'login.errors.passwordRequired',
                  'Please enter your password!',
                ),
              },
            ]}
          >
            <Input.Password
              placeholder={t(
                'login.form.passwordPlaceholder',
                'Enter your password',
              )}
            />
          </Form.Item>
          <Row justify="space-between" align="middle">
            <Col>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>{t('login.form.rememberMe', 'Remember me')}</Checkbox>
              </Form.Item>
            </Col>
            <Col>
              <Link href="/">
                {t('login.form.forgotPassword', 'Forgot Password?')}
              </Link>
            </Col>
          </Row>
          <Form.Item style={{ marginTop: '24px' }}>
            <Button type="primary" htmlType="submit" block loading={false}>
              {t('login.signin', 'Sign in')}
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">{t('login.divider', 'Or sign in with')}</Text>
        </Divider>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            block
            icon={<GoogleOutlined />}
            // onClick={() => login({ provider: 'google' })}
          >
            {t('login.google', 'Sign in with Google')}
          </Button>
          <Button
            block
            icon={<WindowsOutlined />}
            // onClick={() => login({ provider: 'microsoft' })}
          >
            {t('login.microsoft', 'Sign in with Microsoft')}
          </Button>
        </Space>
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Text>{t('login.language', 'Language')}: </Text>
          <Select
            value={currentLocale}
            onChange={(value) => changeLocale(value)}
            options={[
              { value: 'en', label: 'English' },
              { value: 'ja', label: '日本語' },
            ]}
          />
        </div>
      </Card>
    </Background>
  )
}

export default Page

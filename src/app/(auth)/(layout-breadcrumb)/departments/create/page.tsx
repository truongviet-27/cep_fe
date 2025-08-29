'use client'

import { RightOutlined } from '@ant-design/icons'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useCreate, useGo, useResource, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, message, Row, Space, Typography } from 'antd'
import type { Rule } from 'antd/es/form'
import Link from 'next/link'
import { useMemo } from 'react'

const { Title, Text } = Typography

interface DepartmentPayload {
  code: string
  name: string
}

export default function Page() {
  const [form] = Form.useForm<DepartmentPayload>()
  const t = useTranslate()
  const { resource } = useResource()
  const go = useGo()
  const { mutate: create, isLoading } = useCreate()

  const codeRules: Rule[] = useMemo(
    () => [
      { required: true, message: '部門コードは必須です。' },
      { pattern: /^[A-Z0-9-]+$/, message: 'A-Z, 0-9, - のみ使用できます。' },
      { max: 32, message: '最大32文字までです。' },
    ],
    [],
  )

  const nameRules: Rule[] = useMemo(
    () => [
      { required: true, message: '部門名は必須です。' },
      { max: 120, message: '最大120文字までです。' },
    ],
    [],
  )

  const handleAutoNumber = () => {
    // TODO: call your real API for next code (e.g. /code-issue/next?target=department)
    const num = Math.floor(Math.random() * 900) + 100 // 100-999
    const next = `DEP${num}`
    form.setFieldsValue({ code: next })
  }

  const onSubmit = (values: DepartmentPayload) => {
    create(
      { resource: resource?.name ?? 'departments', values },
      {
        onSuccess: () => {
          message.success('登録しました。')
          go({
            to: { resource: resource?.name ?? 'departments', action: 'list' },
          })
        },
      },
    )
  }

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('system_config.system_config')}
        </Title>
      ),
    },
    { title: <Title level={5}>部門登録</Title> },
  ]

  return (
    <Create
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      footerButtons={
        <Col>
          <Button
            size="middle"
            type="primary"
            htmlType="submit"
            loading={isLoading}
            onClick={() => onSubmit(form.getFieldsValue())}
          >
            登録
          </Button>
        </Col>
      }
    >
      <Form<DepartmentPayload>
        form={form}
        layout="vertical"
        colon={false}
        onFinish={onSubmit}
        autoComplete="off"
      >
        {/* 部門コード */}
        <Form.Item
          label={
            <span>
              部門コード <Text type="danger">*</Text>
            </span>
          }
          required
        >
          <Row align="middle" gutter={12} wrap={false}>
            <Col flex="360px">
              <Form.Item
                name="code"
                rules={codeRules}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="DEP001" size="middle" />
              </Form.Item>
            </Col>
            <Col>
              <Text type="secondary">(A-Z, 0-9, -)</Text>
            </Col>
            <Col>
              <Space direction="vertical" size={2}>
                <Button size="middle" type="default" onClick={handleAutoNumber}>
                  自動採番
                </Button>
                <Link
                  href="/system-config/code-issue-settings"
                  className="text-blue-500"
                >
                  コード採番設定はこちら
                </Link>
              </Space>
            </Col>
          </Row>
        </Form.Item>

        {/* 部門名（支社/部/課） */}
        <Form.Item
          label={
            <span>
              部門名（支社/部/課） <Text type="danger">*</Text>
            </span>
          }
          name="name"
          rules={nameRules}
        >
          <Input placeholder="例）営業本部 / 営業部 / 第一課" size="middle" />
        </Form.Item>
      </Form>
    </Create>
  )
}

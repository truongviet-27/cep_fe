'use client'

import { RightOutlined } from '@ant-design/icons'
import { useForm } from '@refinedev/antd'
import { useGo } from '@refinedev/core'
import { Button, Form, Input, message, Select, Space, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'

import { CommonCreate } from '@/components/common/create'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import type { IProject } from '@/interfaces/products'
import { PRIMARY } from '@/utility/color'

const { Title } = Typography
const { TextArea } = Input

type IProjectCreate = Omit<IProject, 'id' | 'key' | 'author' | 'updatedDate'>

export default function Page() {
  const t = useTranslations('projects.create')
  const t_buttons = useTranslations('buttons')
  const t_breadcrumb = useTranslations('breadcrumb')
  const go = useGo()

  const { formProps, saveButtonProps, formLoading } = useForm<IProjectCreate>({
    createMutationOptions: {
      onSuccess: () => {
        message.success(t('notifications.createSuccess'))
        go({ to: '/projects', type: 'push' })
      },
    },
  })

  const breadcrumbItems = [
    {
      title: (
        <a onClick={() => go({ to: '/projects', type: 'push' })}>
          <Title level={5} style={{ color: PRIMARY }}>
            {t_breadcrumb('projects')}
          </Title>
        </a>
      ),
    },
    {
      title: <Title level={5}>{t('title')}</Title>,
    },
  ]

  return (
    <CommonCreate
      isLoading={formLoading}
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      footerButtons={
        <Form.Item style={{ textAlign: 'end' }}>
          <Space>
            <Button
              onClick={() =>
                go({
                  to: '/projects',
                  type: 'push',
                })
              }
            >
              {t_buttons('back')}
            </Button>
            <Button {...saveButtonProps} type="primary">
              {t_buttons('create')}
            </Button>
          </Space>
        </Form.Item>
      }
    >
      <h1 className="mb-6 text-xl font-medium">{t('title')}</h1>

      <Form {...formProps} layout="vertical">
        <Form.Item
          label={t('fields.projectCode.label')}
          name="projectCode"
          rules={[
            {
              required: true,
              message: t('fields.projectCode.required'),
            },
          ]}
          extra={t('fields.projectCode.extra')}
        >
          <Input placeholder="PROJ001" />
        </Form.Item>

        <Form.Item
          label={t('fields.projectName.label')}
          name="projectName"
          rules={[
            {
              required: true,
              message: t('fields.projectName.required'),
            },
          ]}
        >
          <Input placeholder={t('fields.projectName.placeholder')} />
        </Form.Item>

        <Form.Item
          label={t('fields.customer.label')}
          name="customer"
          rules={[
            {
              required: true,
              message: t('fields.customer.required'),
            },
          ]}
        >
          <Select placeholder={t('fields.customer.placeholder')}>
            <Select.Option value="株式会社サンプル商事">
              株式会社サンプル商事
            </Select.Option>
            <Select.Option value="テスト株式会社">テスト株式会社</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label={t('fields.remarks.label')} name="remarks">
          <TextArea rows={4} placeholder={t('fields.remarks.placeholder')} />
        </Form.Item>
      </Form>
    </CommonCreate>
  )
}

'use client'

import { RightOutlined } from '@ant-design/icons'
import { DateField, TextField, useForm } from '@refinedev/antd'
import { useGo, useModal } from '@refinedev/core'
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useTranslations } from 'next-intl'
import React from 'react'

import { CommonEdit } from '@/components/common/edit'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { PRIMARY } from '@/utility/color'

const { Title } = Typography

export default function Page() {
  const t = useTranslations('projects.create')
  const t_prj = useTranslations('projects')
  const t_buttons = useTranslations('buttons')
  const go = useGo()
  const { formProps, saveButtonProps, formLoading } = useForm()
  // const { mutate } = useDelete()

  const { show, visible, close } = useModal()

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t_prj('projects')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('title')}</Title>,
    },
  ]

  return (
    <CommonEdit
      isLoading={formLoading}
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      footerButtons={
        <Col span={24}>
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
                {t_buttons('edit')}
              </Button>
              <Button
                onClick={show}
                style={{ background: 'red', color: 'white' }}
              >
                {t_buttons('delete')}
              </Button>
            </Space>
          </Form.Item>
        </Col>
      }
    >
      <h1 className="mb-6 text-xl font-medium">{t('title')}</h1>
      <Form {...formProps} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
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
          </Col>
          <Col span={24}>
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
          </Col>

          <Col span={24}>
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
                <Select.Option value="テスト株式会社">
                  テスト株式会社
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={t('fields.remarks.label')} name="remarks">
              <TextArea
                rows={4}
                placeholder={t('fields.remarks.placeholder')}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={t('fields.updatedDate')} name={['updatedDate']}>
              <DateField
                value={formProps.form?.getFieldValue('updatedDate')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={t('fields.createdAt')} name={['createdAt']}>
              <DateField
                value={formProps.form?.getFieldValue('createdAt')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={t('fields.status')} name={['status']}>
              <TextField
                value={formProps.form?.getFieldValue('status')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Modal open={visible} onCancel={close} cancelText={'aa'} okText={'aaa'}>
          aaaa
        </Modal>
      </Form>
    </CommonEdit>
  )
}

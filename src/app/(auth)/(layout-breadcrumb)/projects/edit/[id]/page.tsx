'use client'

import { RightOutlined } from '@ant-design/icons'
import CommonCard from '@components/common/common-card'
import Breadcrumbs from '@components/layout/breadcrumbs'
import useModal from '@hooks/useModal'
import { useForm } from '@refinedev/antd'
import { useGo } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'
import React from 'react'

const { Title } = Typography

export default function Page() {
  const t = useTranslations('projects.edit')
  const t_breadcrumb = useTranslations('breadcrumb')
  const t_buttons = useTranslations('buttons')
  const go = useGo()
  const { formProps, saveButtonProps } = useForm()
  // const { mutate } = useDelete()

  const { showDialog } = useModal()

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t_breadcrumb('projects')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('title')}</Title>,
    },
  ]

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      <CommonCard>
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

            <Col span={12}>
              <Form.Item
                label={t('projects.fields.updatedDate')}
                name={['updatedDate']}
                rules={[
                  {
                    required: true,
                  },
                ]}
                getValueProps={(value) => ({
                  value: value ? dayjs(value) : undefined,
                })}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('projects.fields.createdAt')}
                name={['createdAt']}
                rules={[
                  {
                    required: true,
                  },
                ]}
                getValueProps={(value) => ({
                  value: value ? dayjs(value) : undefined,
                })}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={t('projects.fields.status')}
                name={['status']}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

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
                    onClick={() => {
                      console.log('he1')
                      showDialog(<div>aaaaa</div>)
                    }}
                    style={{ background: 'red', color: 'white' }}
                  >
                    {t_buttons('delete')}
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </CommonCard>
    </>
  )
}

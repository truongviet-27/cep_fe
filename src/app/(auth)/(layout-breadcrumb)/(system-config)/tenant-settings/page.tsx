/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { RightOutlined } from '@ant-design/icons'
import Left from '@components/cep/system-config/tenant-setting/components/Left'
import Right from '@components/cep/system-config/tenant-setting/components/Right'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useForm } from '@refinedev/antd'
import { useApiUrl, useCustom, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Button, Form, Row, Space, Typography } from 'antd'

const { Title } = Typography

function Page() {
  const t = useTranslate()
  const { formProps, saveButtonProps } = useForm()
  const apiUrl = useApiUrl()

  const { data } = useCustom({
    method: 'get',
    url: `${apiUrl}/api/v1/quota-form-settings`,
  })

  const handleFinish = (values: any) => {
    const customValues = {
      ...values,
      updatedAt: new Date().toISOString(),
    }
    formProps.onFinish?.(customValues)
  }

  return (
    <Create
      isLoading={false}
      title={
        <Breadcrumbs
          items={[
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('system_config.system_config')}
                </Title>
              ),
            },
            {
              title: (
                <Title level={5}>{t('tenant_settings.tenant_settings')}</Title>
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      hiddenButtonBack={true}
      rightFooterButtons={
        <Space>
          <Button type="default" size="large">
            {'キャンセル'}
          </Button>
          <Button type="default" size="large">
            {'プレビュー'}
          </Button>
          <Button type="primary" size="large" {...saveButtonProps}>
            {t('buttons.save')}
          </Button>
        </Space>
      }
    >
      <Form
        initialValues={data?.data}
        {...formProps}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Row gutter={[16, 16]}>
          {/* Left Column */}
          <Left />
          {/* Right Column */}
          <Right />
        </Row>
      </Form>
    </Create>
  )
}

export default Page

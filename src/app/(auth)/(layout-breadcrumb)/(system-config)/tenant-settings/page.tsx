/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { RightOutlined } from '@ant-design/icons'
import Left from '@components/cep/system-config/tenant-setting/components/Left'
import Right from '@components/cep/system-config/tenant-setting/components/Right'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useForm } from '@refinedev/antd'
import {
  useApiUrl,
  useCustom,
  useCustomMutation,
  useTranslate,
} from '@refinedev/core'
import type { QuotaFormSettingResponse } from '@sdk/hey-api'
import { PRIMARY } from '@utility/color'
import { Button, Form, Row, Space, Typography } from 'antd'
import { useEffect } from 'react'

const { Title } = Typography

type FormType = QuotaFormSettingResponse & {
  company_logo_image_file_key: string | null
  company_seal_image_file_key: string | null
}

function Page() {
  const t = useTranslate()
  const { formProps, saveButtonProps, form } = useForm<FormType>()
  const apiUrl = useApiUrl()

  const { mutate, isPending } = useCustomMutation()

  const { data, isFetching } = useCustom<QuotaFormSettingResponse>({
    method: 'get',
    url: `${apiUrl}/quota-form-settings`,
  })

  const handleFinish = (values: any) => {
    const customValues: QuotaFormSettingResponse = {
      ...values,
      id: form.getFieldValue('id'),
      company_logo_image: form.getFieldValue('company_logo_image_file_key'),
      company_seal_image: form.getFieldValue('company_seal_image_file_key'),
    }
    mutate({
      method: 'put',
      url: `${apiUrl}/quota-form-settings/${form.getFieldValue('id')}`,
      values: customValues,
    })
  }

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue(data.data)
    }
  }, [data])

  return (
    <Create
      isLoading={isFetching}
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
          <Button
            type="primary"
            size="large"
            {...saveButtonProps}
            loading={isPending}
          >
            {t('buttons.save')}
          </Button>
        </Space>
      }
    >
      <Form {...formProps} layout="vertical" onFinish={handleFinish}>
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

/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { RightOutlined } from '@ant-design/icons'
import Left from '@components/cep/system-config/tenant-setting/components/Left'
import Right from '@components/cep/system-config/tenant-setting/components/Right'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { useForm } from '@refinedev/antd'
import { useApiUrl, useCustom, useTranslate, useUpdate } from '@refinedev/core'
import {
  ParameterResourceEnum,
  type QuotaFormSettingResponse,
} from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { PRIMARY } from '@utility/color'
import { Button, Form, Modal, Row, Space, Typography } from 'antd'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'

const { Title } = Typography

type FormType = QuotaFormSettingResponse & {
  company_logo_image_file_key: string | null
  company_seal_image_file_key: string | null
}

function TenantSetting() {
  const t = useTranslate()
  const parameterSettings = useUserStore((state) => state.parameterSettings)

  if (!parameterSettings.get(ParameterResourceEnum.QUOTATION_FORMS)) {
    redirect('/403')
  }

  const { formProps, saveButtonProps, form } = useForm<FormType>()

  const [isPdf, setIsPdf] = useState(false)
  const apiUrl = useApiUrl()

  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const { mutate, isPending } = useUpdate({
    resource: `quota-form-settings`,
    id: form.getFieldValue('id'),
  })

  const { data, isFetching } = useCustom<QuotaFormSettingResponse>({
    method: 'get',
    url: `${apiUrl}/quota-form-settings`,
  })

  const handleFinish = (values: any) => {
    const customValues: QuotaFormSettingResponse = {
      ...values,
      id: form.getFieldValue('id'),
      company_logo_image:
        form.getFieldValue('company_logo_image_file_key') ??
        form
          .getFieldValue('company_logo_image')
          .match(/imports.*?\.(jpg|jpeg|png)/i)[0],
      company_seal_image:
        form.getFieldValue('company_seal_image_file_key') ??
        form
          .getFieldValue('company_seal_image')
          .match(/imports.*?\.(jpg|jpeg|png)/i)[0],
    }
    mutate({
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
          <Button
            type="default"
            size="large"
            onClick={() => {
              form.setFieldsValue(data?.data as QuotaFormSettingResponse)
            }}
          >
            {'キャンセル'}
          </Button>
          <Button
            type="default"
            size="large"
            onClick={() => {
              setIsPdf(!isPdf)
            }}
          >
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

      {
        <Modal
          title="PDF Default"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isPdf}
          onCancel={() => {
            setIsPdf(false)
          }}
          footer={null}
          style={{ top: 20 }}
          width={{
            xs: '90%',
            sm: '80%',
            md: '70%',
            lg: '60%',
          }}
        >
          <div
            style={{ height: '800px', border: '1px solid rgba(0, 0, 0, 0.3)' }}
          >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer
                fileUrl="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
        </Modal>
      }
    </Create>
  )
}

export default TenantSetting

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { RightOutlined } from '@ant-design/icons'
import Left from '@components/cep/system-config/tenant-setting/components/Left'
import PreviewPdf from '@components/cep/system-config/tenant-setting/components/preview'
import Right from '@components/cep/system-config/tenant-setting/components/Right'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { useForm } from '@refinedev/antd'
import {
  useApiUrl,
  useCustom,
  useCustomMutation,
  useTranslate,
  useUpdate,
} from '@refinedev/core'
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

  const [previewPdf, setPreviewPdf] = useState('')

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

  const { data, isFetching, refetch } = useCustom<QuotaFormSettingResponse>({
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
      is_enable_delivery: !values.is_enable_delivery,
      is_enable_delivery_method: !values.is_enable_delivery_method,
      is_enable_payment_due_date: !values.is_enable_payment_due_date,
      is_enable_expiration_date: !values.is_enable_expiration_date,
      is_display_company_logo_image: !values.is_display_company_logo_image,
      is_display_company_seal_image: !values.is_display_company_seal_image,
      company_seal_image:
        form.getFieldValue('company_seal_image_file_key') ??
        form
          .getFieldValue('company_seal_image')
          .match(/imports.*?\.(jpg|jpeg|png)/i)[0],
    }
    mutate(
      {
        values: customValues,
      },
      {
        onSuccess: () => {
          refetch()
        },
      },
    )
  }

  const { mutate: mutatePreviewPdf } = useCustomMutation()

  const handlePreviewPdf = () => {
    const customValues: QuotaFormSettingResponse = {
      ...form.getFieldsValue(),
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
      is_enable_delivery: !form.getFieldValue('is_enable_delivery'),
      is_enable_delivery_method: !form.getFieldValue(
        'is_enable_delivery_method',
      ),
      is_enable_payment_due_date: !form.getFieldValue(
        'is_enable_payment_due_date',
      ),
      is_enable_expiration_date: !form.getFieldValue(
        'is_enable_expiration_date',
      ),
      is_display_company_logo_image: !form.getFieldValue(
        'is_display_company_logo_image',
      ),
      is_display_company_seal_image: !form.getFieldValue(
        'is_display_company_seal_image',
      ),
    }

    mutatePreviewPdf(
      {
        values: customValues,
        url: `${apiUrl}/quota-form-settings`,
        method: 'post',
      },
      {
        onSuccess(data) {
          setPreviewPdf(data.data?.pdf ?? '')
        },
      },
    )
  }

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue({
        ...data.data,
        is_enable_delivery: !data.data.is_enable_delivery,
        is_enable_delivery_method: !data.data.is_enable_delivery_method,
        is_enable_payment_due_date: !data.data.is_enable_payment_due_date,
        is_enable_expiration_date: !data.data.is_enable_expiration_date,
        is_display_company_logo_image: !data.data.is_display_company_logo_image,
        is_display_company_seal_image: !data.data.is_display_company_seal_image,
      })
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
              handlePreviewPdf()
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
          title="Preview PDF"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isPdf}
          onCancel={() => {
            setIsPdf(false)
          }}
          footer={null}
          style={{ top: 20, bottom: 20 }}
          width={{
            xs: '90%',
            sm: '80%',
            md: '70%',
            lg: '50%',
          }}
        >
          <div
            style={{
              border: '1px solid rgba(0, 0, 0, 0.3)',
              borderRadius: 8,
            }}
          >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer
                fileUrl={previewPdf}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>

            {/* <PreviewPdf previewPdf={previewPdf} /> */}
          </div>
        </Modal>
      }
    </Create>
  )
}

export default TenantSetting

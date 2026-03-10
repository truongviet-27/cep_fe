/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { RightOutlined } from '@ant-design/icons'
import Left from '@components/cep/system-config/tenant-setting/components/Left'
import Right from '@components/cep/system-config/tenant-setting/components/Right'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { usePdfViewerLayoutPlugin } from '@hooks/usePdfViewerLayout'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { useForm } from '@refinedev/antd'
import {
  useApiUrl,
  useCustom,
  useCustomMutation,
  useGo,
  useTranslate,
  useUpdate,
} from '@refinedev/core'
import {
  ParameterResourceEnum,
  type QuotaFormSettingResponse,
} from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Button, Form, Modal, Row, Space, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'

const { Title } = Typography

type FormType = QuotaFormSettingResponse & {
  company_logo_image_file_key: string | null
  company_seal_image_file_key: string | null
  company_logo_image_name: string | null
  company_seal_image_name: string | null
}

function TenantSetting() {
  const t = useTranslate()
  const go = useGo()
  const parameterSettings = useUserStore((state) => state.parameterSettings)
  const { formProps, saveButtonProps, form } = useForm<FormType>()

  const [previewPdf, setPreviewPdf] = useState('')

  const logo_image = Form.useWatch('company_logo_image_file_key', form)
  const seal_image = Form.useWatch('company_seal_image_file_key', form)

  const [isPdf, setIsPdf] = useState(false)
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)
  const [pendingFormValues, setPendingFormValues] = useState<any>(null)
  const apiUrl = useApiUrl()
  const pdfViewerLayoutPlugin = usePdfViewerLayoutPlugin()

  const { mutate, isPending } = useUpdate({
    resource: `quota-form-settings`,
    id: form.getFieldValue('id'),
  })

  const { data, isFetching, refetch } = useCustom<QuotaFormSettingResponse>({
    method: 'get',
    url: `${apiUrl}/quota-form-settings`,
  })

  const handleFinish = (values: any) => {
    // Store form values and show warning modal
    setPendingFormValues(values)
    setIsWarningModalOpen(true)
  }

  const handleConfirmSave = () => {
    const logoImageMatch = logo_image?.match(/imports.*?\.(jpg|jpeg|png)/i)
    const sealImageMatch = seal_image?.match(/imports.*?\.(jpg|jpeg|png)/i)

    const customValues: QuotaFormSettingResponse = {
      ...pendingFormValues,
      id: form.getFieldValue('id'),
      company_logo_image:
        form.getFieldValue('company_logo_image_file_key') ??
        (logoImageMatch ? logoImageMatch[0] : null),
      is_enable_delivery: !pendingFormValues.is_enable_delivery,
      is_enable_delivery_method: !pendingFormValues.is_enable_delivery_method,
      is_enable_payment_due_date: !pendingFormValues.is_enable_payment_due_date,
      is_enable_expiration_date: !pendingFormValues.is_enable_expiration_date,
      is_display_company_logo_image:
        !pendingFormValues.is_display_company_logo_image,
      is_display_company_seal_image:
        !pendingFormValues.is_display_company_seal_image,
      company_seal_image:
        form.getFieldValue('company_seal_image_file_key') ??
        (sealImageMatch ? sealImageMatch[0] : null),
    }
    mutate(
      {
        values: customValues,
      },
      {
        onSuccess: () => {
          refetch()
          setIsWarningModalOpen(false)
          setPendingFormValues(null)
        },
      },
    )
  }

  const handleCancelSave = () => {
    setIsWarningModalOpen(false)
    setPendingFormValues(null)
  }

  const { mutate: mutatePreviewPdf, isPending: isPendingPreviewPdf } =
    useCustomMutation()

  const handlePreviewPdf = async () => {
    await form.validateFields()

    const logoImageValue = form.getFieldValue('company_logo_image_file_key')
    const sealImageValue = form.getFieldValue('company_seal_image_file_key')
    const logoImageMatch = logoImageValue?.match(/imports.*?\.(jpg|jpeg|png)/i)
    const sealImageMatch = sealImageValue?.match(/imports.*?\.(jpg|jpeg|png)/i)

    const customValues = {
      ...form.getFieldsValue(),
      id: form.getFieldValue('id'),
      company_logo_image:
        form.getFieldValue('company_logo_image_file_key') ??
        (logoImageMatch ? logoImageMatch[0] : null),
      company_seal_image:
        form.getFieldValue('company_seal_image_file_key') ??
        (sealImageMatch ? sealImageMatch[0] : null),
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
    if (!parameterSettings?.get?.(ParameterResourceEnum.QUOTATION_FORMS)) {
      go({
        to: '/403',
      })
    }
  }, [parameterSettings, go])

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
              title: boldText(t('system_config.system_config')),
            },
            {
              title: boldText(t('tenant_settings.tenant_settings'), PRIMARY),
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
              form.setFieldsValue({
                ...data?.data,
                is_enable_delivery: !data?.data.is_enable_delivery,
                is_enable_delivery_method:
                  !data?.data.is_enable_delivery_method,
                is_enable_payment_due_date:
                  !data?.data.is_enable_payment_due_date,
                is_enable_expiration_date:
                  !data?.data.is_enable_expiration_date,
                is_display_company_logo_image:
                  !data?.data.is_display_company_logo_image,
                is_display_company_seal_image:
                  !data?.data.is_display_company_seal_image,
              } as QuotaFormSettingResponse)
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
            プレビュー
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

      {/* Warning Modal */}
      <Modal
        title={
          <div
            style={{ display: 'flex', alignItems: 'center', color: '#d46b08' }}
          >
            <span style={{ marginRight: '8px', fontSize: '18px' }}>⚠️</span>
            <span style={{ fontWeight: 'bold' }}>重要なお知らせ</span>
          </div>
        }
        open={isWarningModalOpen}
        onCancel={handleCancelSave}
        footer={[
          <Button key="cancel" size="large" onClick={handleCancelSave}>
            キャンセル
          </Button>,
          <Button
            key="confirm"
            type="primary"
            size="large"
            loading={isPending}
            onClick={handleConfirmSave}
          >
            保存する
          </Button>,
        ]}
        width={600}
        centered
      >
        <div
          style={{
            padding: '16px 0',
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#595959',
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            この設定は、今後作成される見積書に適用されます。
          </div>
          <div style={{ marginBottom: '16px' }}>
            既に作成済みの見積書には、従来の設定が適用されます。
          </div>
          <div>
            作成済みの見積書にも新しい設定を反映させたい場合は、「編集」をクリックして再度保存してください。
          </div>
        </div>
      </Modal>

      {/* Preview PDF Modal */}
      <Modal
        title="Preview PDF"
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
          xxl: '50%',
        }}
      >
        <div>
          <Spin spinning={isPendingPreviewPdf}>
            {!isPendingPreviewPdf && (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={`data:application/pdf;base64,${previewPdf}`}
                  plugins={[pdfViewerLayoutPlugin]}
                />
              </Worker>
            )}
          </Spin>

          {/* <PreviewPdf previewPdf={previewPdf} /> */}
        </div>
      </Modal>
    </Create>
  )
}

export default TenantSetting

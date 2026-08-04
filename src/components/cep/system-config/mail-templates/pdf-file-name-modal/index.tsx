import CommonTable from '@components/common/table'
import {
  useApiUrl,
  useCustom,
  useCustomMutation,
  useNotification,
  useTranslate,
} from '@refinedev/core'
import type { MailTemplateControllerGetPdfFileNameSettingsResponses } from '@sdk/hey-api'
import boldText from '@utility/bold-text'
import { Form, Input, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'

type PdfFileNameItem = NonNullable<
  MailTemplateControllerGetPdfFileNameSettingsResponses[200]['data']
>[number]

type FormValues = Record<string, string>

function PdfFileNameModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const t = useTranslate()
  const apiUrl = useApiUrl()
  const { open: openNotification } = useNotification()
  const [form] = Form.useForm<FormValues>()
  const [snapshot, setSnapshot] = useState<FormValues>({})

  const { data, isFetching, refetch } = useCustom<PdfFileNameItem[]>({
    url: `${apiUrl}/mail-templates/pdf-file-names`,
    method: 'get',
    queryOptions: { enabled: open },
  })

  const { mutate, isLoading: isSubmitting } = useCustomMutation()

  const items: PdfFileNameItem[] = data?.data ?? []

  useEffect(() => {
    if (!open) return
    const values: FormValues = {}
    items.forEach((item) => {
      if (item.code) {
        values[item.code] = item.pdf_file_name ?? ''
      }
    })
    form.setFieldsValue(values)
    setSnapshot(values)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, data])

  const currentValues = Form.useWatch([], form) ?? {}

  const isDirty = useMemo(() => {
    return Object.keys(snapshot).some(
      (code) => (currentValues?.[code] ?? '') !== snapshot[code],
    )
  }, [currentValues, snapshot])

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      mutate(
        {
          url: `${apiUrl}/mail-templates/pdf-file-names`,
          method: 'patch',
          values: {
            items: items.map((item) => ({
              code: item.code,
              pdf_file_name: values[item.code ?? ''],
            })),
          },
        },
        {
          onSuccess: () => {
            openNotification?.({
              type: 'success',
              message: t('mail_templates.popup.pdfFileName.successMessage'),
              description: t('mail_templates.popup.pdfFileName.successMessage'),
            })
            refetch()
            handleClose()
          },
          onError: () => {
            openNotification?.({
              type: 'error',
              message: t('mail_templates.popup.pdfFileName.errorMessage'),
              description: t('mail_templates.popup.pdfFileName.errorMessage'),
            })
          },
        },
      )
    } catch (errorInfo) {
      console.log('validate failed:', errorInfo)
    }
  }

  const columns: ColumnsType<PdfFileNameItem> = [
    {
      dataIndex: 'label',
      title: t('mail_templates.form.documentType'),
      width: '40%',
    },
    {
      dataIndex: 'pdf_file_name',
      title: t('mail_templates.form.pdfFileName'),
      render: (_, record) => (
        <Form.Item
          name={record.code}
          noStyle
          rules={[
            {
              required: true,
              message: t('mail_templates.validation.pdfFileName.required'),
            },
            {
              max: 255,
              message: t('mail_templates.validation.pdfFileName.max255'),
            },
            {
              pattern: /^(?!\s*$).+/,
              message: t('mail_templates.validation.pdfFileName.notBlank'),
            },
            {
              pattern: /\.pdf$/i,
              message: t(
                'mail_templates.validation.pdfFileName.invalidExtension',
              ),
            },
          ]}
        >
          <Input />
        </Form.Item>
      ),
    },
  ]

  return (
    <Modal
      title={boldText(t('mail_templates.popup.pdfFileName.title'))}
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText={t('mail_templates.buttons.change')}
      cancelText={t('mail_templates.buttons.close')}
      okButtonProps={{ disabled: !isDirty, loading: isSubmitting }}
      destroyOnHidden
      width={600}
    >
      <Form form={form} component={false}>
        <CommonTable<PdfFileNameItem>
          rowKey="code"
          dataSource={items}
          columns={columns}
          pagination={false}
          loading={isFetching}
          size="middle"
        />
      </Form>
    </Modal>
  )
}

export default PdfFileNameModal

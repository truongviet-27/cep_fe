/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { RightOutlined } from '@ant-design/icons'
import DetailInfo from '@components/cep/estimates/quotas/action/components/detail-info'
import History from '@components/cep/estimates/quotas/action/components/history'
import Note from '@components/cep/estimates/quotas/action/components/note'
import OptionalInfo from '@components/cep/estimates/quotas/action/components/optional-info'
import Tags from '@components/cep/estimates/quotas/action/components/tags'
import { QuotaStatus } from '@components/cep/estimates/quotas/enum'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import type { QuoteTemplateDetailType } from '@interfaces/quota-templates'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { DeleteButton, useForm } from '@refinedev/antd'
import {
  useApiUrl,
  useCustom,
  useCustomMutation,
  useGo,
  useParsed,
  useResource,
  useShow,
  useTranslate,
} from '@refinedev/core'
import { type QuotaFormSettingResponse } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Modal,
  Row,
  Space,
  Spin,
} from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useEffect, useState } from 'react'
import BasicInfo from './components/basic-info'

dayjs.extend(utc)
dayjs.extend(timezone)

function QuotaAction() {
  const t = useTranslate()
  const methods = useForm({
    queryOptions: {
      enabled: false,
    },
  })

  const { id, action, params } = useParsed()

  const { actionType } = params as any
  const isClone = action === 'clone'
  const isCloneVersion = actionType === 'VERSION'
  const isCloneNew = !isCloneVersion && isClone
  const isEdit = action === 'edit'

  const isUpdate = !!id

  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const go = useGo()
  const apiUrl = useApiUrl()

  const permission = useUserStore((state) => state.permission)

  const { query: quoteTemplateQuery } = useShow<QuoteTemplateDetailType>({
    resource: 'quota-templates',
    id: Number(params?.templateId),
    queryOptions: {
      enabled: !!params?.templateId,
    },
  })

  const { formProps, form, saveButtonProps, mutation } = methods

  const { form: formProps2 } = formProps

  const { resource } = useResource()

  const [isPdf, setIsPdf] = useState(false)
  const [previewPdf, setPreviewPdf] = useState('')

  const { data, isFetching } = useCustom<QuotaFormSettingResponse>({
    method: 'get',
    url: `${apiUrl}/quota-form-settings`,
    queryOptions: {
      enabled: !isUpdate && !params?.templateId,
    },
  })

  const { data: dataBasicInfo, isFetching: isFetchingBasicInfo } = useCustom({
    url: `${apiUrl}/quotas/${id}`,
    method: 'get',
    queryOptions: {
      enabled: isUpdate,
      select: (data) => {
        const detail = data.data as any

        if (
          !permission?.is_module_admin &&
          !detail.is_author &&
          !isCloneNew &&
          !isCloneVersion
        ) {
          go({
            to: '/403',
          })
        }

        return {
          ...data,
          data: {
            ...detail,
          },
        } as unknown as any
      },
    },
  })

  const { data: dataProducts, isFetching: isFetchingProduct } = useCustom({
    url: `${apiUrl}/quotas/${id}/products`,
    method: 'get',
    queryOptions: {
      enabled: isUpdate,
    },
  })

  const { data: dataHistory, isFetching: isFetchingHistory } = useCustom({
    url: `${apiUrl}/quotas/${id}/history`,
    method: 'get',
    queryOptions: {
      enabled: isUpdate && !isCloneNew,
    },
  })

  const { mutate: mutatePreviewPdf, isPending: isPendingPreviewPdf } =
    useCustomMutation()

  const handlePreviewPdf = () => {
    const customValues = {
      ...form.getFieldsValue(),
      tags: form.getFieldValue('tags').map((item: any) => ({
        id: item?.value,
        name: item?.label,
      })),
      customer_id: form.getFieldValue('customer')?.value,
      customer_name: form.getFieldValue('customer')?.label,
      status: QuotaStatus.Creating,
    }

    mutatePreviewPdf(
      {
        values: customValues,
        url: isEdit
          ? `${apiUrl}/quotas/preview-pdf/${id}`
          : `${apiUrl}/quotas/preview-pdf`,
        method: 'post',
      },
      {
        onSuccess(data) {
          setPreviewPdf(data.data?.pdf_base64 ?? '')
        },
      },
    )
  }

  useEffect(() => {
    if (isCloneVersion) {
      if (dataBasicInfo?.data && dataProducts?.data && dataHistory?.data) {
        form.setFieldsValue({
          ...dataBasicInfo.data,
          code: `${dataBasicInfo.data.code}-${(dataHistory.data?.clone_history?.length ?? 0) + 1}`,
          customer: {
            value: dataBasicInfo.data.customer_id,
            label: dataBasicInfo.data.customer_name,
          },
          delivery_date: dataBasicInfo.data.delivery_date
            ? dayjs(dataBasicInfo.data.delivery_date).tz('Asia/Tokyo')
            : null,
          created_at: dataBasicInfo.data.created_at
            ? dayjs(dataBasicInfo.data.created_at)
            : null,
          tags:
            dataBasicInfo.data.tags?.map((item: any) => ({
              value: item.id,
              label: item.name,
            })) || [],
          main_product: dataProducts.data.main_product.map((item: any) => ({
            ...item,
            products: item.products.map((item2: any) => ({
              ...item2,
              unit: item2.unit_name,
            })),
          })),
          optional_product: dataProducts.data.optional_product.map(
            (item: any) => ({
              ...item,
              products: item.products.map((item2: any) => ({
                ...item2,
                unit: item2.unit_name,
              })),
            }),
          ),
          ...dataHistory?.data?.data,
        })
      }
    } else {
      if (dataBasicInfo?.data && dataProducts?.data) {
        form.setFieldsValue({
          ...dataBasicInfo.data,
          code: isEdit ? dataBasicInfo.data.code : '',
          customer: {
            value: dataBasicInfo.data.customer_id,
            label: dataBasicInfo.data.customer_name,
          },
          delivery_date: dataBasicInfo.data.delivery_date
            ? dayjs(dataBasicInfo.data.delivery_date).tz('Asia/Tokyo')
            : null,
          created_at: dataBasicInfo.data.created_at
            ? dayjs(dataBasicInfo.data.created_at)
            : null,
          tags:
            dataBasicInfo.data.tags?.map((item: any) => ({
              value: item.id,
              label: item.name,
            })) || [],
          main_product: dataProducts.data.main_product.map((item: any) => ({
            ...item,
            products: item.products.map((item2: any) => ({
              ...item2,
              unit: item2.unit_name ?? '-',
            })),
          })),
          optional_product: dataProducts.data.optional_product.map(
            (item: any) => ({
              ...item,
              products: item.products.map((item2: any) => ({
                ...item2,
                unit: item2.unit_name ?? '-',
              })),
            }),
          ),
          ...dataHistory?.data?.data,
        })
      }
    }
  }, [dataProducts, dataHistory, dataBasicInfo])

  useEffect(() => {
    const quoteTemplate = quoteTemplateQuery?.data?.data
    if (quoteTemplate) {
      delete quoteTemplate.created_at
      delete quoteTemplate.updated_at
      delete quoteTemplate.author
      delete quoteTemplate.editor
      form.setFieldsValue({
        ...form.getFieldsValue(),
        type: quoteTemplate?.type,
        delivery_method: quoteTemplate?.delivery_method,
        payment_due_date: quoteTemplate?.payment_due_date,
        expiration_date: quoteTemplate?.expiration_date,
        consumption_tax: quoteTemplate?.consumption_tax,
        tax_rate: quoteTemplate?.tax_rate,
        note: quoteTemplate?.note,
        main_product: quoteTemplate?.main_product,
        optional_product: quoteTemplate?.optional_product,
        tags: (quoteTemplate?.tags ?? []).map(({ id }) => id),
      })
    } else if (!isUpdate && data?.data) {
      form.setFieldsValue({
        title: '',
        type: 'normal',
        category: 'merchandise',
        customer: null,
        status: 'creating',
        created_at: dayjs(),
        delivery_date: null,
        delivery_method: data?.data.default_delivery_method,
        payment_due_date: data?.data.default_payment_due_date,
        expiration_date: data?.data.default_expiration_date,
        consumption_tax: data?.data.consumption_tax,
        tax_rate: data?.data.tax_rate,
        note: null,
        tags: [],
        total_cost: 0,
        consumption_tax_amount: 0,
        total_profit_margin: 0,
        total_price_tax_included: 0,
        tax_rounding_method: data.data?.tax_rounding_method,
        main_product: [
          {
            group_name: '',
            products: [
              {
                product_id: null,
                package_id: null,
                name: '',
                code: '',
                package_name: '',
                cost_price: 0,
                quantity: 0,
                selling_price: 0,
                profit_margin: 0,
                is_add_total: true,
                unit: null,
              },
            ],
          },
        ],
        optional_product: [
          {
            group_name: '',
            products: [
              {
                product_id: null,
                package_id: null,
                name: '',
                code: '',
                package_name: '',
                cost_price: 0,
                selling_price: 0,
                quantity: 0,
                profit_margin: 0,
                is_add_total: false,
                unit: null,
              },
            ],
          },
        ],
      })
    }
  }, [data, quoteTemplateQuery?.data?.data])

  const onFinish = (values: any) => {
    if (isUpdate && isEdit) {
      mutation.mutate(
        {
          resource: resource?.name,
          values: {
            ...values,
            customer_id: values.customer.value,
            customer_name: values.customer.label,
            status: 'creating',
            delivery_date: values.delivery_date
              ? dayjs(values.delivery_date)
                  .utc(true)
                  .startOf('day')
                  .toISOString()
              : null,
            created_at: dayjs(values.created_at)
              .utc(true)
              .startOf('day')
              .toISOString(),
            tags: values?.tags.map((item: any) => ({
              id: item.value,
              name: item.label,
            })),
            tax_rate: values.tax_rate ?? 0,
          },
          id: params?.id,
        },
        {
          onSuccess(data) {
            go({
              to: `/quotas/show/${data.data.id}`,
            })
          },
        },
      )
    } else {
      mutation.mutate(
        {
          resource: resource?.name,
          values: {
            ...values,
            source_id: isCloneVersion ? Number(id) : null,
            customer_id: values.customer.value,
            customer_name: values.customer.label,
            delivery_date: values.delivery_date
              ? dayjs(values.delivery_date)
                  .utc(true)
                  .startOf('day')
                  .toISOString()
              : null,
            created_at: dayjs(values.created_at)
              .utc(true)
              .startOf('day')
              .toISOString(),
            status: 'creating',
            tags: values.tags.map((item: any) => ({
              id: item.value,
              name: item.label,
            })),
            tax_rate: values.tax_rate ?? 0,
          },
        },
        {
          onSuccess(data) {
            go({
              to: `/quotas/show/${data.data.id}`,
            })
          },
        },
      )
    }
  }

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: boldText(t('estimates.estimates')),
            },
            {
              title: boldText(
                isUpdate ? t('quotas.edit') : t('quotas.create'),
                PRIMARY,
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={
        <div className="flex justify-between">
          {isUpdate ? t('quotas.edit') : t('quotas.create')}
          <Button
            color="primary"
            variant="outlined"
            onClick={async () => {
              await form.validateFields()
              setIsPdf(!isPdf)
              handlePreviewPdf()
            }}
          >
            {t('quotas.action.preview')}
          </Button>
        </div>
      }
    >
      <Spin
        spinning={
          isFetching ||
          isFetchingBasicInfo ||
          isFetchingProduct ||
          isFetchingHistory ||
          quoteTemplateQuery.isFetching
        }
      >
        <Form
          form={formProps2}
          onFinish={onFinish}
          labelCol={{ xs: 24, sm: 8, md: 6, lg: 4, xl: 2 }}
          labelAlign="left"
          layout="horizontal"
          colon={false}
          initialValues={{
            delivery_date: dayjs(),
            created_at: dayjs(),
          }}
          scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
          autoComplete="off"
          name="basic"
        >
          <BasicInfo />
          <DetailInfo />
          <OptionalInfo />
          <Row>
            <Col xs={24}>
              <Note />
            </Col>
          </Row>
          <Tags />
          {isUpdate && !isCloneNew && <History data={dataHistory?.data} />}

          <Divider
            size="large"
            style={{
              background: '#d9d9d9',
            }}
          />
          {isUpdate && !isCloneNew && (
            <ShowMoreInfo
              descriptions={[
                {
                  title: t('approve_routes.show.creator'),
                  value:
                    (dataBasicInfo?.data.author?.name ?? '---') +
                    ' ' +
                    dayjs(dataBasicInfo?.data.created_at).format(
                      'YYYY/MM/DD HH:mm',
                    ),
                },
                {
                  title: t('approve_routes.show.updater'),
                  value:
                    (dataBasicInfo?.data.editor?.name ?? '---') +
                    ' ' +
                    dayjs(dataBasicInfo?.data?.updated_at).format(
                      'YYYY/MM/DD HH:mm',
                    ),
                },
              ]}
            />
          )}

          <Flex
            justify="space-between"
            style={{
              marginTop: 20,
            }}
          >
            <Space>
              {isEdit && (
                <DeleteButton
                  icon={null}
                  size={'small'}
                  onSuccess={() => {
                    go({
                      to: '/quotas',
                    })
                  }}
                />
              )}
            </Space>
            <Space className="items-end">
              <Button
                type="default"
                onClick={() => {
                  go({
                    to: '/quotas',
                  })
                }}
              >
                {t('buttons.back')}
              </Button>

              <Button {...saveButtonProps} type="primary">
                {action === 'edit' ? t('buttons.save') : t('buttons.create')}
              </Button>
            </Space>
          </Flex>
        </Form>
      </Spin>
      {
        <Modal
          title={t('quotas.action.preview_pdf')}
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
                    plugins={[defaultLayoutPluginInstance]}
                  />
                </Worker>
              )}
            </Spin>

            {/* <PreviewPdf previewPdf={previewPdf} /> */}
          </div>
        </Modal>
      }
    </PageContainer>
  )
}

export default QuotaAction

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
import type { CrudFilter } from '@refinedev/core'
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
import type {
  RoundingMethodEnumType,
  QuotaFormSettingResponse,
} from '@sdk/hey-api'
import { RoundingMethodEnumType as RoundingMethodEnum } from '@sdk/hey-api'
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
import { useCallback, useEffect, useState } from 'react'
import BasicInfo from './components/basic-info'
import Link from 'next/link'
import { DEPARTMENT_DEFAULT } from '@utility/constant'

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

  const [taxRoundingMethod, setTaxRoundingMethod] =
    useState<RoundingMethodEnumType>(RoundingMethodEnum.ROUND_UP)

  const { actionType } = params as any
  const isClone = action === 'clone'
  const isCloneVersion = actionType === 'VERSION'
  const isCloneNew = !isCloneVersion && isClone
  const isEdit = action === 'edit'

  const isUpdate = !!id

  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const go = useGo()
  const apiUrl = useApiUrl()

  const { permission, parameterSettings } = useUserStore.getState()

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
      enabled: !params?.templateId,
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

  let queryOptions: CrudFilter[] = []

  // if isupdate = true , get department of quota, if department is null => set default department , if department is not null => set department of user login
  if (isUpdate) {
    // if there is no department in permission and user is not admin, set default department filter
    if (!dataBasicInfo?.data.department) {
      queryOptions = [
        {
          field: 'name',
          operator: 'eq',
          value: DEPARTMENT_DEFAULT,
        },
      ]
    } else {
      queryOptions = [
        {
          field: 'id',
          operator: 'eq',
          value: dataBasicInfo?.data.department?.id,
        },
      ]
    }
  } else if (permission?.department) {
    queryOptions = [
      {
        field: 'id',
        operator: 'eq',
        value: permission.department.id,
      },
    ]
  } else {
    queryOptions = [
      {
        field: 'name',
        operator: 'eq',
        value: DEPARTMENT_DEFAULT,
      },
    ]
  }

  const { data: departmentData } = useCustom({
    method: 'get',
    url: `${apiUrl}/departments/find-first`,
    queryOptions: {
      enabled: true,
    },
    config: {
      filters: queryOptions,
    },
  })

  useEffect(() => {
    // neu edit => phai lay setting cua cua quota
    if (isEdit) {
      if (dataBasicInfo) {
        setTaxRoundingMethod(dataBasicInfo.data.tax_rounding_method)
      }
    } else if (isClone) {
      // neu clone => phai lay setting cua quota
      if (dataBasicInfo) {
        setTaxRoundingMethod(dataBasicInfo.data.tax_rounding_method)
      }
    } else {
      if (data?.data) {
        // neu create => lay setting cua tenant
        setTaxRoundingMethod(data.data.tax_rounding_method)
      }
    }
  }, [data?.data, isClone, isEdit, dataBasicInfo])
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
    const delivery_date = form.getFieldValue('delivery_date')
      ? form.getFieldValue('delivery_date').format('YYYY/MM/DD HH:mm')
      : null
    const customValues = {
      ...form.getFieldsValue(),
      delivery_date: delivery_date,
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

  const defaultOptionalProduct = [
    {
      group_name: '',
      products: [
        {
          product: null,
          product_id: null,
          package_id: null,
          name: '',
          code: '',
          package_name: '-',
          cost_price: 0,
          selling_price: 0,
          quantity: 0,
          profit_margin: 0,
          is_add_total: false,
          tax_rate: 0,
          unit: null,
          unit_name: '-',
        },
      ],
    },
  ]

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
          customer_contact_id: dataBasicInfo.data.customer_contact_id,
          delivery_date: dataBasicInfo.data.delivery_date
            ? dayjs(dataBasicInfo.data.delivery_date)
            : null,
          issue_date: dataBasicInfo.data.issue_date
            ? dayjs(dataBasicInfo.data.issue_date)
            : null,
          department_id: departmentData?.data.id,
          department_name: departmentData?.data.name,
          approve_routes: departmentData?.data.approve_routes || [],
          approve_route_id: dataBasicInfo.data.approve_route?.id,
          tags:
            dataBasicInfo.data.tags?.map((item: any) => ({
              value: item.id,
              label: item.name,
            })) || [],
          main_product: dataProducts.data.main_product.map((item: any) => ({
            ...item,
            products: item.products.map((item2: any) => ({
              ...item2,
              product: { value: item2.product_id, label: item2.name },
              package: { value: item2.package_id, label: item2.package_name },
              tax_rate: item2.tax_rate ?? 0,
              isSelfCreate: !item2.product_id,
              unit: item2.unit_name ?? '-',
              unit_name: item2.unit_name ?? '-',
            })),
          })),
          optional_product: dataProducts.data.optional_product?.length
            ? dataProducts.data.optional_product.map((item: any) => ({
                ...item,
                products: item.products.map((item2: any) => ({
                  ...item2,
                  product: { value: item2.product_id, label: item2.name },
                  package: {
                    value: item2.package_id,
                    label: item2.package_name,
                  },
                  tax_rate: item2.tax_rate ?? 0,
                  isSelfCreate: !item2.product_id,
                  unit: item2.unit_name ?? '-',
                  unit_name: item2.unit_name ?? '-',
                })),
              }))
            : defaultOptionalProduct,
          ...dataHistory?.data?.data,
        })
      }
    } else {
      // Edit case and Show case
      if (dataBasicInfo?.data && dataProducts?.data) {
        const basicData = { ...dataBasicInfo.data }
        // Remove customer_id and customer_name to avoid overwriting customer field
        delete basicData.customer_id
        delete basicData.customer_name

        const customerField = {
          value: dataBasicInfo.data.customer_id,
          label: dataBasicInfo.data.customer_name,
        }
        console.log('dataBasicInfo: ', dataBasicInfo)

        form.setFieldsValue({
          ...basicData,
          code: isEdit ? dataBasicInfo.data.code : '',
          customer: customerField,
          customer_contact_id: dataBasicInfo.data.customer_contact_id,
          tax_rounding_method: data?.data?.tax_rounding_method,
          department_id: departmentData?.data.id,
          department_name: departmentData?.data.name,
          approve_routes: departmentData?.data.approve_routes || [],
          approve_route_id: dataBasicInfo.data.approve_route?.id,
          customer_term: dataBasicInfo.data.customer_term,
          delivery_date: dataBasicInfo.data.delivery_date
            ? dayjs(dataBasicInfo.data.delivery_date)
            : null,
          issue_date: dataBasicInfo.data.issue_date
            ? dayjs(dataBasicInfo.data.issue_date)
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
              product: { value: item2.product_id, label: item2.name },
              package: { value: item2.package_id, label: item2.package_name },
              tax_rate: item2.tax_rate ?? 0,
              isSelfCreate: !item2.product_id,
              unit: item2.unit_name ?? '-',
              unit_name: item2.unit_name ?? '-',
            })),
          })),
          optional_product: dataProducts.data.optional_product?.length
            ? dataProducts.data.optional_product.map((item: any) => ({
                ...item,
                products: item.products.map((item2: any) => ({
                  ...item2,
                  product: { value: item2.product_id, label: item2.name },
                  package: {
                    value: item2.package_id,
                    label: item2.package_name,
                  },
                  isSelfCreate: !item2.product_id,
                  tax_rate: item2.tax_rate ?? 0,
                  unit: item2.unit_name ?? '-',
                  unit_name: item2.unit_name ?? '-',
                })),
              }))
            : defaultOptionalProduct,
          ...dataHistory?.data?.data,
        })
      }
    }
  }, [departmentData, dataProducts, dataHistory, dataBasicInfo])

  useEffect(() => {
    const quoteTemplate = quoteTemplateQuery?.data?.data
    if (quoteTemplate) {
      delete (quoteTemplate as any).issue_date
      delete quoteTemplate.updated_at
      delete quoteTemplate.author
      delete quoteTemplate.editor
      form.setFieldsValue({
        ...form.getFieldsValue(),
        category: quoteTemplate?.category,
        title: quoteTemplate?.name,
        type: quoteTemplate?.type,
        delivery_method: quoteTemplate?.delivery_method,
        payment_due_date: quoteTemplate?.payment_due_date,
        expiration_date: quoteTemplate?.expiration_date,
        consumption_tax: quoteTemplate?.consumption_tax,
        tax_rate: quoteTemplate?.tax_rate,
        note: quoteTemplate?.note,
        tax_rounding_method: data?.data?.tax_rounding_method,
        department_id: departmentData?.data.id,
        department_name: departmentData?.data.department_name,
        approve_routes: parameterSettings?.get('approve-routes')
          ? departmentData?.data.approve_routes || []
          : [],
        approve_route_id: departmentData?.data.approve_routes
          ? departmentData?.data.approve_routes[0]?.id
          : null,
        main_product: quoteTemplate?.main_product?.map((item: any) => ({
          ...item,
          products: item.products.map((item2: any) => ({
            ...item2,
            product: { value: item2.product_id, label: item2.name },
            package: { value: item2.package_id, label: item2.package_name },
            tax_rate: item2.tax_rate ?? 0,
            unit: item2.unit_name ?? '-',
            unit_name: item2.unit_name ?? '-',
          })),
        })),
        optional_product: quoteTemplate?.optional_product?.length
          ? quoteTemplate.optional_product.map((item: any) => ({
              ...item,
              products: item.products.map((item2: any) => ({
                ...item2,
                product: { value: item2.product_id, label: item2.name },
                package: { value: item2.package_id, label: item2.package_name },
                unit: item2.unit_name ?? '-',
                unit_name: item2.unit_name ?? '-',
              })),
            }))
          : defaultOptionalProduct,
        tags: (quoteTemplate?.tags ?? []).map(({ id, name }) => ({
          label: name,
          value: id,
          key: id,
        })),
      })
    } else if (!isUpdate && data?.data) {
      form.setFieldsValue({
        title: '',
        type: 'normal',
        category: 'merchandise',
        customer: null,
        customer_contact_id: null,
        status: 'creating',
        issue_date: dayjs(),
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
        customer_term: 'short_term',
        department_id: departmentData?.data.id,
        department_name: departmentData?.data.name,
        approve_routes: departmentData?.data.approve_routes || [],
        approve_route_id: departmentData?.data.approve_routes
          ? departmentData?.data.approve_routes[0]?.id
          : null,
        main_product: [
          {
            group_name: '',
            products: [
              {
                product: null,
                product_id: null,
                package: null,
                package_id: null,
                name: '',
                code: '',
                package_name: '-',
                cost_price: 0,
                quantity: 0,
                selling_price: 0,
                profit_margin: 0,
                is_add_total: true,
                unit: null,
                unit_name: '-',
                tax_rate: 0,
              },
            ],
          },
        ],
        optional_product: defaultOptionalProduct,
      })

      console.log('form value: ', form.getFieldsValue())
    }
  }, [departmentData, data, quoteTemplateQuery?.data?.data])

  const onFinish = (values: any) => {
    if (isUpdate && isEdit) {
      mutation.mutate(
        {
          resource: resource?.name,
          values: {
            ...values,
            type: values.type || 'normal',
            category: values.category || 'merchandise',
            customer_id: values.customer.value,
            customer_name: values.customer.label,
            customer_contact_id: values.customer_contact_id,
            consumption_tax: values.consumption_tax || 'exclusive',
            status: QuotaStatus.Creating,
            delivery_date: values.delivery_date
              ? dayjs(values.delivery_date)
                  .utc(true)
                  .startOf('day')
                  .toISOString()
              : null,
            issue_date: dayjs(values.issue_date)
              .utc(true)
              .startOf('day')
              .toISOString(),
            tags:
              values?.tags?.map((item: any) => ({
                id: item.value,
                name: item.label,
              })) || [],
            tax_rate: values.tax_rate ?? 0,
            tax_rate_group: values.tax_rate_group || [],
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
            type: values.type || 'normal',
            category: values.category || 'merchandise',
            source_id: isCloneVersion ? Number(id) : null,
            customer_id: values.customer.value,
            customer_name: values.customer.label,
            customer_contact_id: values.customer_contact_id,
            delivery_date: values.delivery_date
              ? dayjs(values.delivery_date)
                  .utc(true)
                  .startOf('day')
                  .toISOString()
              : null,
            issue_date: dayjs(values.issue_date)
              .utc(true)
              .startOf('day')
              .toISOString(),
            status: 'creating',
            tags:
              values?.tags?.map((item: any) => ({
                id: item.value,
                name: item.label,
              })) || [],
            tax_rate: values.tax_rate ?? 0,
            tax_rate_group: values.tax_rate_group || [],
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

  const [productPrincing, setProductPrincing] = useState<number[]>()
  const [productPrincingOptional, setProductPrincingptional] =
    useState<number[]>()

  const handleChangeProductPrincing = useCallback(
    (productIds: number[], productIdsOptional: number[]) => {
      setProductPrincing(() => [...productIds])
      setProductPrincingptional(() => [...productIdsOptional])
    },
    [],
  )

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/quotas">{boldText(t('estimates.estimates'))}</Link>
              ),
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
            disabled={
              isFetching ||
              isFetchingBasicInfo ||
              isFetchingProduct ||
              isFetchingHistory ||
              quoteTemplateQuery.isFetching
            }
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
          labelCol={{ span: '130px !important' }}
          wrapperCol={{ span: '120px !important' }}
          labelAlign="left"
          layout="horizontal"
          colon={false}
          initialValues={{
            type: 'normal',
            category: 'merchandise',
            consumption_tax: 'exclusive',
            delivery_date: dayjs(),
            issue_date: dayjs(),
          }}
          scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
          autoComplete="off"
          name="basic"
        >
          <BasicInfo
            parameterSettings={parameterSettings}
            handleChangeProductPrincing={handleChangeProductPrincing}
          />
          <DetailInfo
            taxRoundingMethod={taxRoundingMethod}
            productPrincing={productPrincing}
            mainProduct={dataProducts?.data.main_product}
          />
          <OptionalInfo
            productPrincing={productPrincingOptional}
            optionalProduct={dataProducts?.data.optional_product}
          />
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
              <> </>
            </Space>
            <Space className="items-end">
              <Button
                type="default"
                onClick={() => {
                  go({
                    to: '/quotas',
                  })
                }}
                autoInsertSpace={false}
              >
                {t('buttons.back')}
              </Button>
              <Button
                {...saveButtonProps}
                type="primary"
                autoInsertSpace={false}
              >
                {action === 'edit' ? t('buttons.save') : t('buttons.create')}
              </Button>
              {isEdit && (
                <DeleteButton
                  icon={null}
                  onSuccess={() => {
                    go({
                      to: '/quotas',
                    })
                  }}
                  autoInsertSpace={false}
                />
              )}
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

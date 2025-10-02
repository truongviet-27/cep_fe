/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import DetailInfo from '@components/cep/estimates/quotas/action/components/detail-info'
import History from '@components/cep/estimates/quotas/action/components/history'
import Note from '@components/cep/estimates/quotas/action/components/note'
import OptionalInfo from '@components/cep/estimates/quotas/action/components/optional-info'
import Tags from '@components/cep/estimates/quotas/action/components/tags'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { DeleteButton, useForm } from '@refinedev/antd'
import {
  useApiUrl,
  useCustom,
  useGo,
  useParsed,
  useResource,
  useTranslate,
} from '@refinedev/core'
import { type QuotaFormSettingResponse } from '@sdk/hey-api'
import { PRIMARY } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import BasicInfo from './components/basic-info'

const { Title } = Typography

function QuotaAction() {
  const t = useTranslate()
  const methods = useForm({
    queryOptions: {
      enabled: false,
    },
  })

  const { id, action, params } = useParsed()

  const { actionType } = params as any
  const isCloneVersion = actionType === 'VERSION'
  const isClone = action === 'clone'

  const isUpdate = !!id

  const go = useGo()
  const apiUrl = useApiUrl()

  const {
    formProps,
    form,
    saveButtonProps,
    mutation,
    query: queryBasic,
  } = methods

  const { form: formProps2 } = formProps

  const { resource } = useResource()

  const { data, isFetching } = useCustom<QuotaFormSettingResponse>({
    method: 'get',
    url: `${apiUrl}/quota-form-settings`,
    queryOptions: {
      enabled: !isUpdate,
    },
  })

  const { data: dataBasicInfo, isFetching: isFetchingBasicInfo } = useCustom({
    url: `${apiUrl}/quotas/${id}`,
    method: 'get',
    queryOptions: {
      enabled: isUpdate,
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
      enabled: isUpdate,
    },
  })

  useEffect(() => {
    if (isUpdate && isCloneVersion) {
      if (dataBasicInfo?.data && dataProducts?.data && dataHistory?.data) {
        form.setFieldsValue({
          ...dataBasicInfo.data,
          code: `${dataBasicInfo.data.code}-${dataHistory.data?.clone_history?.length ?? 0 + 1}`,
          customer: {
            value: dataBasicInfo.data.customer_id,
            label: dataBasicInfo.data.customer_name,
          },
          delivery_date: dataBasicInfo.data.delivery_date
            ? dayjs(dataBasicInfo.data.delivery_date)
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
          customer: {
            value: dataBasicInfo.data.customer_id,
            label: dataBasicInfo.data.customer_name,
          },
          delivery_date: dataBasicInfo.data.delivery_date
            ? dayjs(dataBasicInfo.data.delivery_date)
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
    }
  }, [dataProducts, dataHistory, dataBasicInfo])

  useEffect(() => {
    if (!isUpdate && data?.data) {
      form.setFieldsValue({
        title: '',
        type: 'normal',
        customer: null,
        status: 'creating',
        created_at: null,
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
        main_product: [
          {
            group_name: '',
            products: [
              {
                product_id: null,
                package_id: null,
                name: '',
                code: '',
                cost_price: 0,
                quantity: 0,
                selling_price: 0,
                profit_margin: 0,
                is_add_total: false,
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
                cost_price: 0,
                selling_price: 0,
                quantity: 0,
                profit_margin: 0,
                is_add_total: false,
              },
            ],
          },
        ],
      })
    }
  }, [data])

  const onFinish = (values: any) => {
    if (isUpdate && action === 'edit') {
      mutation.mutate(
        {
          resource: resource?.name,
          values: {
            ...values,
            customer_id: values.customer.value,
            customer_name: values.customer.label,
            status: 'creating',
            tags: values?.tags.map((item: any) => ({
              id: item.value,
              name: item.label,
            })),
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
            resource_id: isCloneVersion ? Number(id) : null,
            customer_id: values.customer.value,
            customer_name: values.customer.label,
            status: 'creating',
            tags: values.tags.map((item: any) => ({
              id: item.value,
              name: item.label,
            })),
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
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('quotas.quotas')}
                </Title>
              ),
            },
            {
              title: (
                <Title level={5}>
                  {isUpdate ? t('quotas.edit') : t('quotas.create')}
                </Title>
              ),
            },
          ]}
        />
      }
      title={
        <div className="flex justify-between">
          <span>{isUpdate ? t('quotas.edit') : t('quotas.create')}</span>
          <Button>プレビュー</Button>
        </div>
      }
    >
      <Spin
        spinning={
          isFetching ||
          isFetchingBasicInfo ||
          isFetchingProduct ||
          isFetchingHistory
        }
      >
        <Form
          form={formProps2}
          onFinish={onFinish}
          labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
          labelAlign="left"
          layout="horizontal"
          colon={false}
          initialValues={{
            delivery_date: dayjs(),
            created_at: dayjs(),
          }}
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
          {isUpdate && !isClone && <History />}

          <Divider />
          {isUpdate && !isClone && (
            <ShowMoreInfo
              descriptions={[
                {
                  title: t('approve_routes.show.creator'),
                  value:
                    (queryBasic?.data?.data.author?.name ?? '---') +
                    ' ' +
                    dayjs(queryBasic?.data?.data.created_at).format(
                      'YYYY/MM/DD HH:mm',
                    ),
                },
                {
                  title: t('approve_routes.show.updater'),
                  value:
                    (queryBasic?.data?.data.editor?.name ?? '---') +
                    ' ' +
                    dayjs(queryBasic?.data?.data.updated_at).format(
                      'YYYY/MM/DD HH:mm',
                    ),
                },
              ]}
            />
          )}

          <Flex
            justify="space-between"
            style={{
              marginTop: 40,
            }}
          >
            <Space>
              {isUpdate && !isClone && (
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
    </PageContainer>
  )
}

export default QuotaAction

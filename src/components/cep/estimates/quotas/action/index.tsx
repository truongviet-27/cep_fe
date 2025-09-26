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
  const methods = useForm()

  const { id } = useParsed()

  const isUpdate = !!id

  const go = useGo()
  const apiUrl = useApiUrl()

  const { formProps, saveButtonProps, form, mutation } = methods

  const { resource } = useResource()
  const { params } = useParsed()

  const { data, isFetching } = useCustom<QuotaFormSettingResponse>({
    method: 'get',
    url: `${apiUrl}/quotas-form-settings`,
    queryOptions: {
      enabled: !isUpdate,
    },
  })

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue({
        title: data?.data.greeting,
        type: 'normal',
        customer: null,
        status: 'waiting_approve',
        create_quota: null,
        delivery_date: null,
        delivery_method: data?.data.default_delivery_method,
        payment_due_date: data?.data.default_payment_due_date,
        expiration_date: data?.data.default_expiration_date,
        consumption_tax: data?.data.consumption_tax,
        tax_rate: data?.data.tax_rate,
        note: null,
        tags: [],
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
    if (isUpdate) {
      mutation.mutate(
        {
          resource: resource?.name,
          values: {
            ...values,
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
            source_id: null,
            code: 'QUOTA-2025-001',
            title: 'hung123',
            type: 'normal',
            status: 'waiting_approval',
            delivery_date: '2025-10-01T00:00:00Z',
            delivery_method: 'free text',
            payment_due_date: 'monthly_25',
            expiration_date: 'days_7',
            consumption_tax: 'exclusive',
            customer_id: 123,
            customer_name: 'Acme Corporation',
            tax_rate: 12,
            note: 'textarea',
            total_cost: 1220.5,
            consumption_tax_amount: 1220.5,
            total_profit_margin: 120.5,
            total_price_tax_included: 1423.6,
            tags: [
              {
                id: 1,
                name: 'name',
              },
            ],
            main_product: [
              {
                id: 123,
                group_name: 'group_name',
                display_order: 1,
                products: [
                  {
                    id: 1,
                    product_id: 1,
                    package_id: 1,
                    name: 'name',
                    code: 'code',
                    cost_price: 123123,
                    selling_price: 123123,
                    profit_margin: 12,
                    is_add_total: true,
                    display_order: 1,
                  },
                ],
              },
            ],
            optional_product: [
              {
                id: 123,
                group_name: 'group_name',
                display_order: 1,
                products: [
                  {
                    id: 1,
                    product_id: 1,
                    package_id: 1,
                    name: 'name',
                    code: 'code',
                    cost_price: 123123,
                    selling_price: 123123,
                    profit_margin: 12,
                    is_add_total: true,
                    display_order: 1,
                  },
                ],
              },
            ],
          },
          // {
          //   ...values,
          //   customer: {
          //     id: values.customer.value,
          //     name: values.customer.label,
          //   },
          //   status: 'waiting_approval',
          //   tags: values.tags.map((item: any) => ({
          //     id: item.value,
          //     name: item.label,
          //   })),
          // },
        },
        {
          onSuccess(data) {
            go({
              to: `/approve-routes/show/${data.data.id}`,
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
      <Spin spinning={isFetching}>
        <Form
          {...formProps}
          labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
          labelAlign="left"
          layout="horizontal"
          colon={false}
          onFinish={onFinish}
          // initialValues={
          //   isUpdate
          //     ? {
          //         title: 'hung123',
          //         type: 'normal',
          //         customer: {
          //           id: 10,
          //           name: '',
          //         },
          //         status: 'waiting_approve',
          //         create_quota: '',
          //         delivery_date: '2025-10-01T00:00:00Z',
          //         delivery_method: 'free text',
          //         payment_due_date: 'monthly_25',
          //         expiration_date: 'days_7',
          //         consumption_tax: 'exclusive',
          //         tax_rate: 12,
          //         note: 'textarea',
          //         tags: [
          //           {
          //             id: 1,
          //             name: 'A5',
          //           },
          //           {
          //             id: 2,
          //             name: 'A1',
          //           },
          //         ],
          //         original_product: [
          //           {
          //             id: 123,
          //             group_name: 'group_name',
          //             products: [
          //               {
          //                 id: 1,
          //                 product_id: 1,
          //                 package_id: 1,
          //                 name: 'name',
          //                 code: 'code',
          //                 cost_price: 123123,
          //                 selling_price: 123123,
          //                 profit_margin: 12,
          //                 is_add_total: true,
          //               },
          //               {
          //                 id: 2,
          //                 product_id: 1,
          //                 package_id: 2,
          //                 name: 'name',
          //                 code: 'code',
          //                 cost_price: 123123,
          //                 selling_price: 123123,
          //                 profit_margin: 12,
          //                 is_add_total: true,
          //               },
          //             ],
          //           },
          //         ],
          //         additional_product: [
          //           {
          //             id: 123,
          //             group_name: 'group_name',
          //             products: [
          //               {
          //                 id: 1,
          //                 product_id: 1,
          //                 package_id: 1,
          //                 name: 'name',
          //                 code: 'code',
          //                 cost_price: 123123,
          //                 selling_price: 123123,
          //                 profit_margin: 12,
          //                 is_add_total: true,
          //               },
          //               {
          //                 id: 2,
          //                 product_id: 1,
          //                 package_id: 2,
          //                 name: 'name',
          //                 code: 'code',
          //                 cost_price: 123123,
          //                 selling_price: 123123,
          //                 profit_margin: 12,
          //                 is_add_total: true,
          //               },
          //             ],
          //           },
          //         ],
          //       }
          //     : {
          //         title: '',
          //         type: '',
          //         customer: null,
          //         status: '',
          //         create_quota: '',
          //         delivery_date: '',
          //         delivery_method: '',
          //         payment_due_date: '',
          //         expiration_date: '',
          //         consumption_tax: '',
          //         tax_rate: null,
          //         note: '',
          //         tags: [],
          //         original_product: [
          //           {
          //             group_name: '',
          //             products: [{}],
          //           },
          //         ],
          //         additional_product: [
          //           {
          //             group_name: '',
          //             products: [{}],
          //           },
          //         ],
          //       }
          // }
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
          {isUpdate && <History />}

          <Divider />
          {isUpdate && (
            <ShowMoreInfo
              descriptions={[
                {
                  title: t('approve_routes.show.creator'),
                  value:
                    (data?.data?.author?.name ?? '---') +
                    ' ' +
                    dayjs(data?.data?.updated_at).format('YYYY/MM/DD HH:mm'),
                },
                {
                  title: t('approve_routes.show.updater'),
                  value:
                    (data?.data?.editor?.name ?? '---') +
                    ' ' +
                    dayjs(data?.data?.updated_at).format('YYYY/MM/DD HH:mm'),
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
              {isUpdate && (
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
                {isUpdate ? t('buttons.save') : t('buttons.create')}
              </Button>
            </Space>
          </Flex>
        </Form>
      </Spin>
    </PageContainer>
  )
}

export default QuotaAction

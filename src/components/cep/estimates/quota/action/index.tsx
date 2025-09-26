/* eslint-disable @typescript-eslint/no-explicit-any */
import DetailInfo from '@components/cep/estimates/quota/action/components/detail-info'
import History from '@components/cep/estimates/quota/action/components/history'
import Note from '@components/cep/estimates/quota/action/components/note'
import OptionalInfo from '@components/cep/estimates/quota/action/components/optional-info'
import Tags from '@components/cep/estimates/quota/action/components/tags'
import BasicInfo from '@components/cep/estimates/quota/show/components/basic-info'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { DeleteButton, useForm } from '@refinedev/antd'
import {
  useApiUrl,
  useCustom,
  useGo,
  useParsed,
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

const { Title } = Typography

function QuotaAction() {
  const t = useTranslate()
  const methods = useForm()

  const { id } = useParsed()

  const isUpdate = !!id

  const go = useGo()
  const apiUrl = useApiUrl()

  const { formProps, saveButtonProps, form } = methods

  const { data, isFetching } = useCustom<QuotaFormSettingResponse>({
    method: 'get',
    url: `${apiUrl}/quota-form-settings`,
    queryOptions: {
      enabled: !isUpdate,
    },
  })

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue({
        title: data?.data.greeting,
        type: 'normal',
        customer: {
          id: 1,
          name: '',
        },
        status: 'waiting_approve',
        create_quota: '',
        delivery_date: '2025-10-01T00:00:00Z',
        delivery_method: data?.data.default_delivery_method,
        payment_due_date: data?.data.default_payment_due_date,
        expiration_date: data?.data.default_expiration_date,
        consumption_tax: data?.data.consumption_tax,
        tax_rate: data?.data.tax_rate,
        note: 'textarea',
        tags: [],
        original_product: [
          {
            group_name: '',
            products: [
              {
                // product_id: 1,
                // package_id: 1,
                // name: 'name',
                // code: 'code',
                // cost_price: 123123,
                // selling_price: 123123,
                // profit_margin: 12,
                // is_add_total: true,
              },
            ],
          },
        ],
        additional_product: [
          {
            group_name: '',
            products: [{}],
          },
        ],
      })
    }
  }, [data])

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('quota.quota')}
                </Title>
              ),
            },
            {
              title: (
                <Title level={5}>
                  {isUpdate ? t('quota.edit') : t('quota.create')}
                </Title>
              ),
            },
          ]}
        />
      }
      title={
        <div className="flex justify-between">
          <span>{isUpdate ? t('quota.edit') : t('quota.create')}</span>
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
          initialValues={
            isUpdate
              ? {
                  title: 'hung123',
                  type: 'normal',
                  customer: {
                    id: 10,
                    name: '',
                  },
                  status: 'waiting_approve',
                  create_quota: '',
                  delivery_date: '2025-10-01T00:00:00Z',
                  delivery_method: 'free text',
                  payment_due_date: 'monthly_25',
                  expiration_date: 'days_7',
                  consumption_tax: 'exclusive',
                  tax_rate: 12,
                  note: 'textarea',
                  tags: [
                    {
                      id: 1,
                      name: 'A5',
                    },
                    {
                      id: 2,
                      name: 'A1',
                    },
                  ],
                  original_product: [
                    {
                      id: 123,
                      group_name: 'group_name',
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
                        },
                        {
                          id: 2,
                          product_id: 1,
                          package_id: 2,
                          name: 'name',
                          code: 'code',
                          cost_price: 123123,
                          selling_price: 123123,
                          profit_margin: 12,
                          is_add_total: true,
                        },
                      ],
                    },
                  ],
                  additional_product: [
                    {
                      id: 123,
                      group_name: 'group_name',
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
                        },
                        {
                          id: 2,
                          product_id: 1,
                          package_id: 2,
                          name: 'name',
                          code: 'code',
                          cost_price: 123123,
                          selling_price: 123123,
                          profit_margin: 12,
                          is_add_total: true,
                        },
                      ],
                    },
                  ],
                }
              : {
                  title: '',
                  type: '',
                  customer: null,
                  status: '',
                  create_quota: '',
                  delivery_date: '',
                  delivery_method: '',
                  payment_due_date: '',
                  expiration_date: '',
                  consumption_tax: '',
                  tax_rate: null,
                  note: '',
                  tags: [],
                  original_product: [
                    {
                      group_name: '',
                      products: [{}],
                    },
                  ],
                  additional_product: [
                    {
                      group_name: '',
                      products: [{}],
                    },
                  ],
                }
          }
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
                      to: '/quota',
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
                    to: '/quota',
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

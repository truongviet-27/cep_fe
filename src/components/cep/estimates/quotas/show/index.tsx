import BasicInfo from '@components/cep/estimates/quotas/show/components/basic-info'
import DetailInfo from '@components/cep/estimates/quotas/show/components/detail-info'
import History from '@components/cep/estimates/quotas/show/components/history'
import Conditions from '@components/cep/estimates/quotas/show/components/note'
import OptionalInfo from '@components/cep/estimates/quotas/show/components/optional-info'
import Reason from '@components/cep/estimates/quotas/show/components/reason'
import Tags from '@components/cep/estimates/quotas/show/components/tags'
import ShowMoreInfo from '@components/common/show-more-info'
import { Show } from '@components/crud/show'
import { DeleteButton } from '@refinedev/antd'
import { useGo, useParsed, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Divider,
  Flex,
  Form,
  Space,
  Typography,
} from 'antd'
import dayjs from 'dayjs'

const { Title } = Typography

function QuotaDetail() {
  const { id } = useParsed()
  // const { query } = useShow({
  //   id,
  // })

  const query = {
    data: {
      data: {
        id: 1,
        code: 'QUOTA-2025-001',
        title: 'hung123',
        type: 'normal',
        status: 'waiting_approval',
        delivery_date: '2025-10-01T00:00:00Z',
        delivery_method: 'free text',
        payment_due_date: 'monthly_25',
        expiration_date: 'days_7',
        consumption_tax: 'exclusive',
        tax_rate: 12,
        customer_id: 123,
        customer_name: 'Acme Corporation',
        note: 'textarea',
        total_cost: 1220.5,
        consumption_tax_amount: 1220.5,
        total_profit_margin: 120.5,
        total_price_tax_included: 1123.6,
        customer: {
          id: 1,
          name: 'Customer Name',
          customer_code: 'CUST001',
        },
        main_product_groups: [
          {
            id: 0,
            group_name: 'string',
            display_order: 0,
            products: [
              {
                id: 0,
                product_id: 0,
                package: {
                  id: 1,
                  name: 'package',
                },
                unit: 'Thung',
                name: 'string',
                code: 'string',
                cost_price: 100,
                selling_price: 200,
                profit_margin: 220,
                quantity: 2,
                is_add_total: true,
                display_order: 0,
              },
            ],
          },
        ],
        optional_product_groups: [
          {
            id: 0,
            group_name: 'string',
            display_order: 0,
            products: [
              {
                id: 0,
                product_id: 0,
                package: {
                  id: 1,
                  name: 'package',
                },
                unit: 'Thung',
                name: 'string',
                code: 'string',
                cost_price: 330,
                selling_price: 110,
                profit_margin: 550,
                quantity: 2,
                is_add_total: true,
                display_order: 0,
              },
            ],
          },
        ],
        tags: [
          {
            id: 0,
            name: 'string',
          },
        ],
        created_at: '2025-09-26T14:53:45.221Z',
        updated_at: '2025-09-26T14:53:45.221Z',
        created_by: {
          name: 'Viet Nguyen',
        },
        updated_by: {
          name: 'Viet Nguyen',
        },
      },
    },
  }

  const go = useGo()

  const t = useTranslate()
  return (
    <Show
      title={
        <Breadcrumb
          items={[
            {
              title: (
                <Title
                  level={5}
                  style={{
                    color: PRIMARY,
                  }}
                >
                  {t('quotas.quotas')}
                </Title>
              ),
            },
            {
              title: <Title level={5}>{t('quotas.detail')}</Title>,
            },
          ]}
        />
      }
      hiddenButtonBack
      i18nHeading={t('quotas.detail')}
    >
      <Form
        labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
        labelAlign="left"
        layout="horizontal"
        colon={false}
        autoComplete="off"
      >
        <BasicInfo data={query.data.data} />
        <DetailInfo
          tax_rate={query.data.data.tax_rate}
          data={query.data.data.main_product_groups}
        />
        <OptionalInfo data={query.data.data.optional_product_groups} />
        <Conditions note={query.data.data.note} />
        <Tags tags={query.data.data.tags} />
        <History />
        <Reason reason="差戻の理由を入力してください" />

        <Divider />
        <ShowMoreInfo
          descriptions={[
            {
              title: t('approve_routes.show.creator'),
              value:
                (query.data?.data?.created_by?.name ?? '---') +
                ' ' +
                dayjs(query.data?.data?.created_at).format('YYYY/MM/DD HH:mm'),
            },
            {
              title: t('approve_routes.show.updater'),
              value:
                (query.data?.data?.updated_by?.name ?? '---') +
                ' ' +
                dayjs(query.data?.data?.updated_at).format('YYYY/MM/DD HH:mm'),
            },
          ]}
        />
        <Flex
          justify="space-between"
          style={{
            marginTop: 40,
          }}
        >
          <Space>
            <DeleteButton
              icon={null}
              size={'small'}
              onSuccess={() => {
                go({
                  to: '/quotas',
                })
              }}
            />
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

            <Button
              type="primary"
              onClick={() => {
                go({
                  to: `/quotas/edit/${id}`,
                })
              }}
            >
              {t('buttons.edit')}
            </Button>
          </Space>
        </Flex>
      </Form>
    </Show>
  )
}

export default QuotaDetail

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable simple-import-sort/imports */
import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import CommonTable from '@components/common/table'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useApiUrl, useCustom, useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Button, Card } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const AgreedPriceCustomerDetail = () => {
  const t = useTranslate()
  const apiUrl = useApiUrl()
  const params = useParams()
  const customerId = params.id as string

  const { data: productsData, isLoading: productsLoading } = useCustom({
    url: `${apiUrl}/quota/agreed-prices/customers/${customerId}/products`,
    method: 'get',
  })

  const raw: any = productsData?.data
  const customer: any =
    raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : undefined

  const products: any[] = Array.isArray(raw?.products)
    ? raw.products
    : Array.isArray(raw?.items)
      ? raw.items
      : Array.isArray(raw)
        ? raw
        : []

  const breadcrumbItems = [
    {
      title: boldText(t('estimates.estimates')),
    },
    {
      title: boldText(t('agreed_prices.parent')),
    },
    {
      title: boldText(t('agreed_prices.customer_detail.title'), PRIMARY),
    },
  ]

  const productColumns: ColumnsType<any> = [
    {
      title: t('agreed_prices.customer_detail.table.product_code'),
      dataIndex: 'product_code',
      key: 'product_code',
      render: (_: any, record: any) =>
        record.product_code ?? record.product_id ?? '-',
    },
    {
      title: t('agreed_prices.customer_detail.table.product_name'),
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: t('agreed_prices.customer_detail.table.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
      render: (v: any) => (v ?? 0).toLocaleString(),
    },
    {
      title: t('agreed_prices.customer_detail.table.unit'),
      dataIndex: 'unit_name',
      key: 'unit_name',
      render: (_: any, record: any) => record.unit_name ?? record.unit ?? '-',
    },
    {
      title: t('agreed_prices.customer_detail.table.determined_unit_price'),
      dataIndex: 'selling_price',
      key: 'selling_price',
      align: 'right',
      render: (_: any, record: any) =>
        (
          record.determined_unit_price ??
          record.selling_price ??
          0
        ).toLocaleString(),
    },
    {
      title: t('agreed_prices.customer_detail.table.application_start'),
      dataIndex: 'start_date',
      key: 'start_date',
      render: (v: any) => (v ? dayjs(v).format('DD/MM/YYYY') : '-'),
    },
    {
      title: t('agreed_prices.customer_detail.table.application_end'),
      dataIndex: 'end_date',
      key: 'end_date',
      render: (v: any) => (
        <span style={{ color: '#FF6918', fontWeight: '500' }}>
          {v ? dayjs(v).format('DD/MM/YYYY') : '-'}
        </span>
      ),
    },
  ]

  const numberOfProducts = (() => {
    const fromCustomer =
      customer?.number_of_products ?? customer?.total_products

    if (typeof fromCustomer === 'number') return fromCustomer
    if (typeof fromCustomer === 'string') return Number(fromCustomer)

    return products.length
  })()
  console.log(products)

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      title={t('agreed_prices.customer_detail.title')}
    >
      <div className="space-y-6">
        <Card
          title={t('agreed_prices.customer_detail.basic_info')}
          headStyle={{
            color: PRIMARY,
          }}
        >
          <div className="mb-8 flex">
            <div className="w-1/8 text-sm font-semibold text-black/[0.88]">
              {t('agreed_prices.customer_detail.customer_code')}
            </div>
            <div className="w-1/8 font-normal text-black/[0.88]">
              {customer?.customer_code || '-'}
            </div>
          </div>
          <div className="mb-8 flex">
            <div className="w-1/8 text-sm font-semibold text-black/[0.88]">
              {t('agreed_prices.customer_detail.customer_name')}
            </div>
            <div className="w-1/8 font-normal text-black/[0.88]">
              {customer?.customer_name || '-'}
            </div>
          </div>
          <div className="mb-8 flex">
            <div className="w-1/8 text-sm font-semibold text-black/[0.88]">
              {t('agreed_prices.customer_detail.department_in_charge')}
            </div>
            <div className="w-1/8 font-normal text-black/[0.88]">
              {customer?.department_in_charge ??
                customer?.department_name ??
                '-'}
            </div>
          </div>
          <div className="mb-8 flex">
            <div className="w-1/8 text-sm font-semibold text-black/[0.88]">
              {t('agreed_prices.customer_detail.unit_price_rank_code')}
            </div>
            <div className="w-1/8 font-normal text-black/[0.88]">
              {customer?.unit_price_rank ?? customer?.rank_code ?? '-'}
            </div>
          </div>
          <div className="mb-8 flex">
            <div className="w-1/8 text-sm font-semibold text-black/[0.88]">
              {t('agreed_prices.customer_detail.number_of_products')}
            </div>
            <div className="w-1/8 font-normal text-black/[0.88]">
              {numberOfProducts.toLocaleString()}
            </div>
          </div>
        </Card>

        <Card
          title={t('agreed_prices.customer_detail.determined_unit_price_list')}
          headStyle={{
            color: PRIMARY,
          }}
        >
          <CommonTable
            columns={productColumns}
            dataSource={products}
            loading={productsLoading}
            rowKey={(r) =>
              String((r as any)?.product_id ?? (r as any)?.id ?? '')
            }
            pagination={false}
            size="small"
          />
        </Card>

        <div className="flex justify-end">
          <Link
            href={{
              pathname: '/agreed-prices',
              query: { tab: 'agreed_price_customer' },
            }}
          >
            <Button>{t('buttons.back')}</Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}

export default AgreedPriceCustomerDetail

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable simple-import-sort/imports */
import PageContainer from '@components/common/page-container'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useApiUrl, useCustom, useGo, useTranslate } from '@refinedev/core'
import { Button, Card, Col, Row, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { RightOutlined } from '@ant-design/icons'
import { useParams } from 'next/navigation'
import React from 'react'
import { PRIMARY } from '@utility/color'
import CommonTable from '@components/common/table'

const { Title } = Typography

const AgreedPriceCustomerDetail = () => {
  const t = useTranslate()
  const go = useGo()
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
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('estimates.estimates')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('agreed_prices.parent')}</Title>,
    },
    {
      title: (
        <Title level={5}>{t('agreed_prices.customer_detail.title')}</Title>
      ),
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
      dataIndex: 'application_start',
      key: 'application_start',
      render: (v: any) => v ?? '-',
    },
    {
      title: t('agreed_prices.customer_detail.table.application_end'),
      dataIndex: 'application_end',
      key: 'application_end',
      render: (v: any) => v ?? '-',
    },
  ]

  const numberOfProducts = (() => {
    const fromCustomer =
      customer?.number_of_products ?? customer?.total_products

    if (typeof fromCustomer === 'number') return fromCustomer
    if (typeof fromCustomer === 'string') return Number(fromCustomer)

    return products.length
  })()

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      title={t('agreed_prices.customer_detail.title')}
    >
      <div className="space-y-6">
        <Card title={t('agreed_prices.customer_detail.basic_info')}>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12} md={8}>
              <div>
                <div className="mb-1 text-sm text-gray-500">
                  {t('agreed_prices.customer_detail.customer_code')}
                </div>
                <div className="font-medium">
                  {customer?.customer_code || '-'}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <div className="mb-1 text-sm text-gray-500">
                  {t('agreed_prices.customer_detail.customer_name')}
                </div>
                <div className="font-medium">
                  {customer?.customer_name || '-'}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <div className="mb-1 text-sm text-gray-500">
                  {t('agreed_prices.customer_detail.department_in_charge')}
                </div>
                <div className="font-medium">
                  {customer?.department_in_charge ??
                    customer?.department_name ??
                    '-'}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <div className="mb-1 text-sm text-gray-500">
                  {t('agreed_prices.customer_detail.unit_price_rank')}
                </div>
                <div className="font-medium">
                  {customer?.unit_price_rank ?? customer?.rank_code ?? '-'}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <div className="mb-1 text-sm text-gray-500">
                  {t('agreed_prices.customer_detail.number_of_products')}
                </div>
                <div className="font-medium">
                  {numberOfProducts.toLocaleString()}
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        <Card
          title={t('agreed_prices.customer_detail.determined_unit_price_list')}
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
          <Button onClick={() => go({ to: '/agreed-prices' })}>
            {t('buttons.back')}
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}

export default AgreedPriceCustomerDetail

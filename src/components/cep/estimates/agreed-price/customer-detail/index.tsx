/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable simple-import-sort/imports */
import PageContainer from '@components/common/page-container'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useApiUrl, useCustom, useGo, useTranslate } from '@refinedev/core'
import { Button, Card, Col, Row, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { RightOutlined } from '@ant-design/icons'
import { useParams } from 'next/navigation'
import React from 'react'
import { PRIMARY } from '@utility/color'

const { Title } = Typography

const AgreedPriceCustomerDetail = () => {
  const t = useTranslate()
  const go = useGo()
  const apiUrl = useApiUrl()
  const params = useParams()
  const customerId = params.id as string

  const { data: customerData } = useCustom({
    url: `${apiUrl}/quota/agreed-prices/customers/${customerId}`,
    method: 'get',
  })

  const { data: productsData, isLoading: productsLoading } = useCustom({
    url: `${apiUrl}/quota/agreed-prices/customers/${customerId}/products`,
    method: 'get',
  })

  const customer = customerData?.data
  const products = productsData?.data?.items || []

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
    },
    {
      title: t('agreed_prices.customer_detail.table.unit'),
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: t('agreed_prices.customer_detail.table.determined_unit_price'),
      dataIndex: 'determined_unit_price',
      key: 'determined_unit_price',
      align: 'right',
      render: (price: number) => price?.toLocaleString() || '0',
    },
    {
      title: t('agreed_prices.customer_detail.table.application_start'),
      dataIndex: 'application_start',
      key: 'application_start',
    },
    {
      title: t('agreed_prices.customer_detail.table.application_end'),
      dataIndex: 'application_end',
      key: 'application_end',
    },
  ]

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
                  {customer?.department_in_charge || '-'}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <div className="mb-1 text-sm text-gray-500">
                  {t('agreed_prices.customer_detail.unit_price_rank')}
                </div>
                <div className="font-medium">
                  {customer?.unit_price_rank || '-'}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <div className="mb-1 text-sm text-gray-500">
                  {t('agreed_prices.customer_detail.number_of_products')}
                </div>
                <div className="font-medium">
                  {customer?.number_of_products || '0'}
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        <Card
          title={t('agreed_prices.customer_detail.determined_unit_price_list')}
        >
          <Table
            columns={productColumns}
            dataSource={products}
            loading={productsLoading}
            rowKey="id"
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

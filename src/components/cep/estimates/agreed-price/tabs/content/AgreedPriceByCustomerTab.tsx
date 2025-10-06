/* eslint-disable simple-import-sort/imports */
import React, { useMemo } from 'react'

import { Button, Col, Form, Input, Row, Select, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { List, ShowButton, useSelect, useTable } from '@refinedev/antd'
import { type HttpError, useGo, useTranslate } from '@refinedev/core'
import CommonTable from '@components/common/table'
import type { QuotaAgreedPriceCustomer } from '@sdk/hey-api/types.gen'

const AgreedPriceByCustomerTab = () => {
  const t = useTranslate()
  const go = useGo()
  const [form] = Form.useForm()

  const { selectProps: departmentSelectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: {
      mode: 'server',
      pageSize: 100,
    },
    onSearch(value) {
      return [
        {
          field: 'q',
          operator: 'eq',
          value,
        },
      ]
    },
  })

  const { selectProps: rankSelectProps } = useSelect({
    resource: 'ranks',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: {
      mode: 'server',
      pageSize: 100,
    },
    onSearch(value) {
      return [
        {
          field: 'q',
          operator: 'eq',
          value,
        },
      ]
    },
  })

  type CustomerRow = QuotaAgreedPriceCustomer

  const customerColumns: ColumnsType<CustomerRow> = useMemo(
    () => [
      {
        title: t('agreed_prices.customer_tab.table.business_partner_code'),
        dataIndex: 'customer_code',
        key: 'customer_code',
      },
      {
        title: t('agreed_prices.customer_tab.table.business_partner_name'),
        dataIndex: 'customer_name',
        key: 'customer_name',
      },
      {
        title: t('agreed_prices.customer_tab.table.responsible_department'),
        dataIndex: 'department_name',
        key: 'department_name',
      },
      {
        title: t('agreed_prices.customer_tab.table.unit_price_rank'),
        dataIndex: 'rank_code',
        key: 'rank_code',
      },
      {
        title: t('agreed_prices.customer_tab.table.product_count'),
        dataIndex: 'total_products',
        key: 'total_products',
        align: 'right',
        render: (value: number | string | undefined) =>
          Number(value ?? 0).toLocaleString(),
      },
      {
        title: t('agreed_prices.customer_tab.table.operation'),
        key: 'operation',
        render: (_, record) => (
          <Space>
            <ShowButton
              hideText
              size="small"
              recordItemId={record.customer_id as number}
              resource="agreed-prices/customer"
            />
          </Space>
        ),
      },
    ],
    [t, go],
  )

  const { tableProps, searchFormProps, setFilters } = useTable<
    CustomerRow,
    HttpError,
    Record<string, unknown>
  >({
    resource: 'quota/agreed-prices/customers',
    syncWithLocation: true,
    filters: {
      initial: [],
    },
    onSearch(values) {
      const v = values as Record<string, unknown>
      const depId = v.responsible_department as number | undefined
      const rankId = v.unit_price_rank_code as number | undefined
      return [
        {
          field: 'customer_name',
          operator: 'contains',
          value: v.business_partner_code_name,
        },
        {
          field: 'department_id_in[]',
          operator: 'in',
          value: depId ? [depId] : undefined,
        },
        {
          field: 'rank_id_in[]',
          operator: 'in',
          value: rankId ? [rankId] : undefined,
        },
      ]
    },
  })

  const handleCustomerClear = () => {
    form.resetFields()
    setFilters([], 'replace')
  }

  return (
    <List title="">
      <Form colon={false} form={form} layout="vertical" {...searchFormProps}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={4}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t(
                    'agreed_prices.customer_tab.search.business_partner_code_name',
                  )}
                </span>
              }
              name="business_partner_code_name"
            >
              <Input placeholder={t('agreed_prices.search.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t(
                    'agreed_prices.customer_tab.search.responsible_department',
                  )}
                </span>
              }
              name="responsible_department"
            >
              <Select
                {...departmentSelectProps}
                placeholder={t('agreed_prices.search.please_select')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t('agreed_prices.customer_tab.search.unit_price_rank_code')}
                </span>
              }
              name="unit_price_rank_code"
            >
              <Select
                {...rankSelectProps}
                placeholder={t('agreed_prices.search.please_select')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item label={<></>}>
              <Space>
                <Button type="primary" htmlType="submit">
                  {t('agreed_prices.action.search')}
                </Button>
                <Button onClick={handleCustomerClear}>
                  {t('agreed_prices.action.clear')}
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <CommonTable<CustomerRow>
        className={'mt-6'}
        rowKey={(record) => String(record.customer_id ?? '')}
        columns={customerColumns}
        {...tableProps}
      />
    </List>
  )
}

export default AgreedPriceByCustomerTab

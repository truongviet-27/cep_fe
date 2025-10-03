import CommonTable from '@components/common/table'
import { List, useSelect, useTable } from '@refinedev/antd'
import { useGo, useTranslate } from '@refinedev/core'
import { Button, Col, Form, Input, Row, Select, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useMemo } from 'react'

const AgreedPriceByCustomerTab = () => {
  const t = useTranslate()
  const go = useGo()

  const { selectProps: departmentSelectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
  })

  const { selectProps: rankSelectProps } = useSelect({
    resource: 'ranks',
    optionLabel: 'name',
    optionValue: 'id',
  })

  // Customer tab data and columns
  const customerMockData = [
    {
      id: '1',
      businessPartnerCode: 'CUST001',
      businessPartnerName: 'ABC Company Ltd',
      responsibleDepartment: 'Sales Department',
      unitPriceRank: 'Rank A',
      productCount: 15,
    },
    {
      id: '2',
      businessPartnerCode: 'CUST002',
      businessPartnerName: 'XYZ Corporation',
      responsibleDepartment: 'Marketing Department',
      unitPriceRank: 'Rank B',
      productCount: 8,
    },
    {
      id: '3',
      businessPartnerCode: 'CUST003',
      businessPartnerName: 'DEF Industries',
      responsibleDepartment: 'Sales Department',
      unitPriceRank: 'Rank A',
      productCount: 22,
    },
  ]

  const customerColumns: ColumnsType<Record<string, unknown>> = useMemo(
    () => [
      {
        title: t('agreed_price.customer_tab.table.business_partner_code'),
        dataIndex: 'businessPartnerCode',
        key: 'businessPartnerCode',
      },
      {
        title: t('agreed_price.customer_tab.table.business_partner_name'),
        dataIndex: 'businessPartnerName',
        key: 'businessPartnerName',
      },
      {
        title: t('agreed_price.customer_tab.table.responsible_department'),
        dataIndex: 'responsibleDepartment',
        key: 'responsibleDepartment',
      },
      {
        title: t('agreed_price.customer_tab.table.unit_price_rank'),
        dataIndex: 'unitPriceRank',
        key: 'unitPriceRank',
      },
      {
        title: t('agreed_price.customer_tab.table.product_count'),
        dataIndex: 'productCount',
        key: 'productCount',
        align: 'right',
      },
      {
        title: t('agreed_price.customer_tab.table.operation'),
        key: 'operation',
        render: (_, record) => (
          <Button
            type="link"
            onClick={() =>
              go({ to: `/agreed-prices/customer/${record.id}/edit` })
            }
          >
            {t('agreed_price.action.update')}
          </Button>
        ),
      },
    ],
    [t, go],
  )

  const { searchFormProps, setFilters } = useTable({
    syncWithLocation: true,
  })

  const handleCustomerSearch = (values: unknown) => {
    const formValues = values as Record<string, unknown>
    setFilters([
      {
        field: 'business_partner_code_name',
        operator: 'contains',
        value: formValues.business_partner_code_name,
      },
      {
        field: 'responsible_department',
        operator: 'eq',
        value: formValues.responsible_department,
      },
      {
        field: 'unit_price_rank_code',
        operator: 'eq',
        value: formValues.unit_price_rank_code,
      },
    ])
  }

  const handleCustomerClear = () => {
    searchFormProps.form?.resetFields()
    setFilters([], 'replace')
  }

  return (
    <List title="">
      <Form
        colon={false}
        {...searchFormProps}
        layout="vertical"
        onFinish={handleCustomerSearch}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={4}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t(
                    'agreed_price.customer_tab.search.business_partner_code_name',
                  )}
                </span>
              }
              name="business_partner_code_name"
            >
              <Input placeholder={t('agreed_price.search.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t('agreed_price.customer_tab.search.responsible_department')}
                </span>
              }
              name="responsible_department"
            >
              <Select
                {...departmentSelectProps}
                placeholder={t('agreed_price.search.please_select')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t('agreed_price.customer_tab.search.unit_price_rank_code')}
                </span>
              }
              name="unit_price_rank_code"
            >
              <Select
                {...rankSelectProps}
                placeholder={t('agreed_price.search.please_select')}
                showSearch={false}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item label={<></>}>
              <Space>
                <Button type="primary" htmlType="submit">
                  {t('agreed_price.action.search')}
                </Button>
                <Button onClick={handleCustomerClear}>
                  {t('agreed_price.action.clear')}
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <CommonTable
        className={'mt-6'}
        rowKey="id"
        columns={customerColumns}
        dataSource={customerMockData}
        pagination={{
          current: 1,
          pageSize: 10,
          total: 18,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}件`,
        }}
      />
    </List>
  )
}

export default AgreedPriceByCustomerTab

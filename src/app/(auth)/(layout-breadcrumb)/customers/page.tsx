/* eslint-disable */
'use client'

import { List } from '@components/crud/list'
import { EditButton, useTable } from '@refinedev/antd'
import { useGo, useTranslate } from '@refinedev/core'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  TableColumnsType,
  Typography,
} from 'antd'
import React, { useMemo } from 'react'
import CommonTable from '@components/common/table'
import boldText from '@utility/bold-text'
import Breadcrumbs from '@components/layout/breadcrumbs'
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { PRIMARY } from '@utility/color'
import { mockCustomers } from '@mockApi/customer'

const { RangePicker } = DatePicker
const { Title } = Typography

interface ICustomer {
  id: string
  code: string
  name: string
  country: string
  department: string
  unit_price_rank: string
  credit_rank: string
  anti_social_check_date: string
  registration_date: string
  suspension_date: string | null
}

export default function CustomerListPage() {
  const t = useTranslate()
  const go = useGo()

  const { tableProps, setFilters, searchFormProps } = useTable<ICustomer>({
    syncWithLocation: true,
  })

  const columns: TableColumnsType<ICustomer> = useMemo(
    () => [
      {
        title: t('customers.fields.code'),
        dataIndex: 'code',
        key: 'code',
        render: (text, record) => (
          <Button
            type="link"
            onClick={() => go({ to: `/customers/show/${record.id}` })}
          >
            {text}
          </Button>
        ),
      },
      {
        title: t('customers.fields.name'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: t('customers.fields.country'),
        dataIndex: 'country',
        key: 'country',
      },
      {
        title: t('customers.fields.department'),
        dataIndex: 'department',
        key: 'department',
      },
      {
        title: t('customers.fields.unit_price_rank'),
        dataIndex: 'unit_price_rank',
        key: 'unit_price_rank',
        render: (text) => <Button type="link">{text}</Button>,
      },
      {
        title: t('customers.fields.credit_rank'),
        dataIndex: 'credit_rank',
        key: 'credit_rank',
      },
      {
        title: t('customers.fields.anti_social_check_date'),
        dataIndex: 'anti_social_check_date',
        key: 'anti_social_check_date',
        width: 150,
      },
      {
        title: t('customers.fields.registration_date'),
        dataIndex: 'registration_date',
        key: 'registration_date',
      },
      {
        title: t('customers.fields.suspension_date'),
        dataIndex: 'suspension_date',
        key: 'suspension_date',
      },
      {
        title: t('customers.fields.actions'),
        key: 'actions',
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <Space>
            <EditButton hideText size="small" recordItemId={record.id} />
            <Button
              size="small"
              danger={!record.suspension_date}
              type={record.suspension_date ? 'default' : 'primary'}
              icon={
                record.suspension_date ? (
                  <PlayCircleOutlined />
                ) : (
                  <PauseCircleOutlined />
                )
              }
            />
          </Space>
        ),
      },
    ],
    [t, go],
  )

  const handleSearch = (values: any) => {
    console.log('Search values:', values)
    setFilters([
      { field: 'code', operator: 'contains', value: values.code },
      { field: 'name', operator: 'contains', value: values.name },
    ])
  }

  const handleClear = () => {
    searchFormProps.form?.resetFields()
    setFilters([], 'replace')
  }

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('customers.customers')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('customers.list.list')}</Title>,
    },
  ]

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={'customers.list.list'}
    >
      <Form
        colon={false}
        {...searchFormProps}
        layout="vertical"
        onFinish={handleSearch}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.filters.code_name'))}
              name="code_name"
            >
              <Input placeholder={t('placeholders.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.country'))}
              name="country"
            >
              <Select placeholder={t('placeholders.select')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.department'))}
              name="department"
            >
              <Select placeholder={t('placeholders.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('ranks.fields.code'))}
              name="unit_price_rank"
            >
              <Select placeholder={t('placeholders.select')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.credit_rank'))}
              name="credit_rank"
            >
              <Select placeholder={t('placeholders.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.anti_social_rank'))}
              name="date_range"
            >
              <Select placeholder={t('placeholders.select')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.filters.date_range'))}
              name="unit_price_rank"
            >
              <Select placeholder={t('customers.fields.registration_date')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item label={<></>} name="date_range">
              <RangePicker className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item label={<></>}>
              <Space>
                <Button type="primary" htmlType="submit">
                  {t('buttons.search')}
                </Button>
                <Button onClick={handleClear}>{t('buttons.clear')}</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Row justify="end" className="mb-4">
        <Space>
          <Button
            type="primary"
            onClick={() => go({ to: '/customers/create' })}
          >
            {t('buttons.new_create')}
          </Button>
          <Button
            onClick={() => {
              go({
                to: '/customers/csv',
              })
            }}
          >
            {t('buttons.csv_bulk_register')}
          </Button>
        </Space>
      </Row>

      <CommonTable
        {...tableProps}
        dataSource={mockCustomers}
        rowKey="id"
        columns={columns as any}
      />
    </List>
  )
}

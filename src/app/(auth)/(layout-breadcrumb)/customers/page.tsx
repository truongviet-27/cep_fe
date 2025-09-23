/* eslint-disable */
'use client'

import { List } from '@components/crud/list'
import { CreateButton, EditButton, useSelect, useTable } from '@refinedev/antd'
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
import { SimpleCustomer } from '@sdk/hey-api'
import Link from 'next/link'
import {
  antiSocialCheckOptions,
  countryOptions,
  creditCheckOptions,
  searchDateTypeOptions,
} from '@utility/options'
import dayjs from 'dayjs'
import { FORMAT_DATE_TIME } from '@utility/instances'

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

  const { selectProps: departmentSelectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
  })

  const { selectProps: ranksSelectProps } = useSelect({
    resource: 'ranks',
    optionLabel: 'name',
    optionValue: 'id',
  })

  const { tableProps, setFilters, searchFormProps } = useTable<ICustomer>({
    syncWithLocation: true,
    onSearch: (values: any) => [
      {
        field: 'q',
        operator: 'null',
        value: values?.q,
      },
      {
        field: 'country',
        operator: 'null',
        value: values?.country,
      },
      {
        field: 'person_in_charge_department',
        operator: 'contains',
        value: values?.person_in_charge_department,
      },
      {
        field: 'price_rank_id',
        operator: 'null',
        value: values?.price_rank_id,
      },
      {
        field: 'credit_rank',
        operator: 'null',
        value: values?.credit_rank,
      },
      {
        field: 'anti_social_rank',
        operator: 'null',
        value: values?.anti_social_rank,
      },
      {
        field: 'search_date_type',
        operator: 'null',
        value: values?.search_date_type,
      },
      {
        field: 'date_start',
        operator: 'null',
        value: values?.date_start,
      },
      {
        field: 'date_end',
        operator: 'null',
        value: values?.date_end,
      },
    ],
  })

  const handleSearch = (values: any) => {
    setFilters([
      {
        field: 'q',
        operator: 'null',
        value: values?.q,
      },
      {
        field: 'country',
        operator: 'null',
        value: values?.country,
      },
      {
        field: 'person_in_charge_department',
        operator: 'contains',
        value: values?.person_in_charge_department,
      },
      {
        field: 'price_rank_id',
        operator: 'null',
        value: values?.price_rank_id,
      },
      {
        field: 'credit_rank',
        operator: 'null',
        value: values?.credit_rank,
      },
      {
        field: 'anti_social_rank',
        operator: 'null',
        value: values?.anti_social_rank,
      },
      {
        field: 'search_date_type',
        operator: 'null',
        value: values?.search_date_type,
      },
      {
        field: 'date_start',
        operator: 'null',
        value: values?.date_start,
      },
      {
        field: 'date_end',
        operator: 'null',
        value: values?.date_end,
      },
    ])
  }

  const columns: TableColumnsType<SimpleCustomer> = useMemo(
    () => [
      {
        title: t('customers.fields.code'),
        dataIndex: 'customer_code',
        key: 'customer_code',
        render: (text, record) => (
          <Link href={`/customers/${record.id}`} key={record.id}>
            {text}
          </Link>
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
        dataIndex: 'person_in_charge_department',
        key: 'person_in_charge_department',
      },
      {
        title: t('customers.fields.unit_price_rank'),
        dataIndex: 'price_rank_code',
        key: 'price_rank_code',
        render: (text) => <Button type="link">{text}</Button>,
      },
      {
        title: t('customers.fields.credit_rank'),
        dataIndex: 'credit_rank',
        key: 'credit_rank',
      },
      {
        title: t('customers.fields.anti_social_check_date'),
        dataIndex: 'anti_social_rank_update_at',
        key: 'anti_social_rank_update_at',
        width: 150,
      },
      {
        title: t('customers.fields.registration_date'),
        dataIndex: 'created_at',
        key: 'created_at',
        render: (_, record) =>
          dayjs(record?.created_at).format(FORMAT_DATE_TIME),
      },
      {
        title: t('customers.fields.suspension_date'),
        dataIndex: 'deleted_at',
        key: 'deleted_at',
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
              danger={!record.deleted_at}
              type={record.deleted_at ? 'default' : 'primary'}
              icon={
                record.deleted_at ? (
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
              name="q"
            >
              <Input placeholder={t('placeholders.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.country'))}
              name="country"
            >
              <Select
                placeholder={t('placeholders.select')}
                options={countryOptions}
                showSearch
                filterOption={true}
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.department'))}
              name="department_id"
            >
              <Select
                {...departmentSelectProps}
                placeholder={t('placeholders.select')}
                style={{ maxWidth: 560 }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('ranks.fields.code'))}
              name="unit_price_rank"
            >
              <Select
                {...ranksSelectProps}
                placeholder={t('placeholders.select')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.credit_rank'))}
              name="credit_rank"
            >
              <Select
                placeholder={t('placeholders.partial_match')}
                options={creditCheckOptions}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.anti_social_rank'))}
              name="date_range"
            >
              <Select
                placeholder={t('placeholders.select')}
                options={antiSocialCheckOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.filters.date_range'))}
              name="unit_price_rank"
            >
              <Select
                placeholder={t('customers.fields.registration_date')}
                options={searchDateTypeOptions}
              />
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
                <Button type="primary" htmlType="submit" onClick={handleSearch}>
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
          <CreateButton icon={null}>{t('buttons.create_new')}</CreateButton>
          <Button>{t('buttons.csv_bulk_register')}</Button>
        </Space>
      </Row>

      <CommonTable {...tableProps} rowKey="id" columns={columns as any} />
    </List>
  )
}

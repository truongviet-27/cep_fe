/* eslint-disable */
'use client'
import { RightOutlined, WarningOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { EditButton, EmailField, ShowButton, useTable } from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from 'antd'
import React from 'react'
import boldText from '@utility/bold-text'

const { Title, Text } = Typography

function Page() {
  const t = useTranslate()

  const renderFieldNotSet = (value?: any) => {
    return (
      <Space>
        <Text>{value ? value : t('common.not_set')}</Text>
        {!value && <WarningOutlined style={{ color: '#AC3C00' }} />}
      </Space>
    )
  }

  const { tableProps, searchFormProps, setFilters } = useTable()
  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('employees.employees')}
        </Title>
      ),
    },
    { title: <Title level={5}>{t('employees.list.list')}</Title> },
  ]

  const getRowClassName = (record: BaseRecord) => {
    return !record.email || !record.code ? 'bg-gray-200' : ''
  }

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

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={'employees.list.list'}
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
              label={boldText(t('employees.filters.code_name'))}
              name="code_name"
            >
              <Input placeholder={t('placeholders.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('employees.filters.email'))}
              name="email"
            >
              <Input placeholder={t('placeholders.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('departments.departments'))}
              name="department"
            >
              <Select placeholder={t('placeholders.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('employees.fields.role'))}
              name="unit_price_rank"
            >
              <Select placeholder={t('placeholders.select')} />
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

      <CommonTable
        className={'mt-6'}
        {...tableProps}
        rowKey="id"
        onRow={(record) => ({
          className: getRowClassName(record),
        })}
      >
        <Table.Column
          dataIndex="code"
          title={t('employees.fields.code')}
          render={(value) => renderFieldNotSet(value)}
        />
        <Table.Column dataIndex="name" title={t('employees.fields.name')} />
        <Table.Column
          dataIndex={['department']}
          title={t('employees.fields.department')}
          render={(value) => renderFieldNotSet(value?.name)}
        />
        <Table.Column
          dataIndex={['email']}
          title={t('employees.fields.email')}
          render={(value) => <EmailField value={value} />}
        />
        <Table.Column
          dataIndex={['role.display_name']}
          title={t('employees.fields.role')}
          render={(value) => renderFieldNotSet(value)}
        />
        <Table.Column
          title={t('table.actions')}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </CommonTable>
    </List>
  )
}

export default Page

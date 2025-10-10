/* eslint-disable */
'use client'
import { RightOutlined, WarningOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { EditButton, EmailField, ShowButton, useTable } from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, Row, Space, Table, Typography } from 'antd'
import Link from 'next/link'
import { SelectPagination } from '@components/common/select-pagination'

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

  const { tableProps, searchFormProps, setFilters, setCurrent } = useTable()
  const breadcrumbItems = [
    {
      title: boldText(t('employees.employees')),
    },
    { title: boldText(t('employees.list.list'), PRIMARY) },
  ]

  const getRowClassName = (record: BaseRecord) => {
    return !record.email || !record.code ? 'bg-gray-200' : ''
  }

  const handleSearch = (values: any) => {
    setCurrent(1)
    setFilters([
      { field: 'q', operator: 'contains', value: values.q },
      { field: 'email', operator: 'contains', value: values.email },
      { field: 'department_id', operator: 'null', value: values.department_id },
      { field: 'role_id', operator: 'null', value: values.role_id },
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
        onFinishFailed={(errorInfo) => {
          console.error('Form validation failed:', errorInfo)
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('employees.filters.code_name'))}
              name="q"
              validateTrigger={['onChange', 'onBlur']}
              rules={[
                {
                  max: 100,
                  message: 'コード名は100文字以内で入力してください',
                },
              ]}
            >
              <Input placeholder={t('placeholders.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('employees.filters.email'))}
              name="email"
              validateTrigger={['onChange', 'onBlur']}
              rules={[
                {
                  max: 255,
                  message: 'メールアドレスは255文字以内で入力してください',
                },
              ]}
            >
              <Input placeholder={t('placeholders.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <SelectPagination
              selectProps={{
                resource: 'departments',
              }}
              formItemProps={{
                name: 'department_id',
                label: boldText(t('departments.departments')),
              }}
              selectComponentProps={{
                placeholder: t('placeholders.partial_match'),
              }}
            />
          </Col>
          <Col xs={24} md={4}>
            <SelectPagination
              selectProps={{
                resource: 'roles',
              }}
              optionLabel={'display_name'}
              optionValue={'id'}
              formItemProps={{
                name: 'role_id',
                label: boldText(t('employees.fields.role')),
              }}
              selectComponentProps={{
                placeholder: t('placeholders.select'),
              }}
            />
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
          render={(value, record) => (
            <Link
              style={{ textDecoration: 'underline' }}
              href={`/employees/show/${record?.id}`}
            >
              {value}
            </Link>
          )}
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
          dataIndex={['role']}
          title={t('employees.fields.role')}
          render={(value) => renderFieldNotSet(value?.display_name)}
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

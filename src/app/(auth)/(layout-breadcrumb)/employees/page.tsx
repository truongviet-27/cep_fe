/* eslint-disable */
'use client'
import { RightOutlined, WarningOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import {
  EditButton,
  EmailField,
  ShowButton,
  useSelect,
  useTable,
} from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
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
import Link from 'next/link'

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
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('employees.employees')}
        </Title>
      ),
    },
    { title: <Title level={5}>{t('employees.list.list')}</Title> },
  ]

  const { selectProps: departmentSelectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
    // @ts-ignore
    onSearch: (value) => [
      {
        field: 'q',
        operator: 'null',
        value,
      },
    ],
  })

  const { selectProps: rolesSelectProps } = useSelect({
    resource: 'roles',
    optionLabel: 'name',
    optionValue: 'id',
  })

  const getRowClassName = (record: BaseRecord) => {
    return !record.email || !record.code ? 'bg-gray-200' : ''
  }

  const handleSearch = (values: any) => {
    setCurrent(1)
    setFilters([
      { field: 'q', operator: 'contains', value: values.q },
      { field: 'email', operator: 'null', value: values.email },
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
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('employees.filters.code_name'))}
              name="q"
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
              name="department_id"
            >
              <Select
                {...departmentSelectProps}
                placeholder={t('placeholders.partial_match')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('employees.fields.role'))}
              name="role_id"
            >
              <Select
                {...rolesSelectProps}
                placeholder={t('placeholders.select')}
                showSearch={false}
              />
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

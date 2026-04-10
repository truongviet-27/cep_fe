/* eslint-disable */
'use client'
import { RightOutlined, WarningOutlined } from '@ant-design/icons'
import { CoreAutocompleteAPI } from '@components/common/autocomplete-api'
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
import { useEffect } from 'react'

const { Text } = Typography

function Page() {
  const t = useTranslate()

  const renderFieldNotSet = (value?: any) => {
    const text = value ? String(value) : t('common.not_set')
    return (
      <div
        style={{
          minWidth: 0,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          title={text}
          style={{
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Text
            style={{
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
              flex: '1 1 auto',
            }}
          >
            {text}
          </Text>
          {!value && <WarningOutlined style={{ color: '#AC3C00' }} />}
        </div>
      </div>
    )
  }

  const renderEmployeeName = (value: any, record: BaseRecord) => {
    const text = value ? String(value) : ''
    return (
      <div
        style={{
          minWidth: 0,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          title={text}
          style={{
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Text
            style={{
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
              flex: '1 1 auto',
            }}
          >
            {text}
          </Text>
          {record?.status === 'inactive' && (
            <WarningOutlined
              style={{ color: '#AC3C00' }}
              title={t('employees.deleted')}
            />
          )}
        </div>
      </div>
    )
  }

  const { tableProps, searchFormProps, setFilters, setCurrent } = useTable({
    pagination: { pageSize: 20 },
  })

  const breadcrumbItems = [
    {
      title: boldText(t('employees.employees')),
    },
    { title: boldText(t('employees.list.list'), PRIMARY) },
  ]
  const headerCellStyle = { textAlign: 'center' as const }
  const bodyCellStyle = { padding: '8px 12px' }

  const getRowClassName = (record: BaseRecord) => {
    return !record.email && !record.code ? 'bg-gray-200' : ''
  }

  useEffect(() => {
    searchFormProps.form?.resetFields()
    setFilters([], 'replace')
  }, [])

  const handleSearch = (values: any) => {
    setCurrent(1)
    setFilters([
      { field: 'q', operator: 'contains', value: values.q },
      { field: 'email', operator: 'contains', value: values.email },
      {
        field: 'department_id',
        operator: 'null',
        value: values.department_id?.value,
      },
      { field: 'role_id', operator: 'null', value: values.role_id?.value },
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
            <CoreAutocompleteAPI
              name={'department_id'}
              labelInValue={true}
              resource="departments"
              label={boldText(t('departments.departments'))}
              placeholder={t('placeholders.partial_match')}
            />
          </Col>
          <Col xs={24} md={4}>
            <CoreAutocompleteAPI
              name={'role_id'}
              optionLabel={'display_name'}
              optionValue={'id'}
              labelInValue={true}
              resource="roles"
              label={boldText(t('employees.fields.role'))}
              placeholder={t('placeholders.select')}
            />
          </Col>

          <Col xs={24} md={4}>
            <Form.Item label={<></>}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  autoInsertSpace={false}
                >
                  {t('buttons.search')}
                </Button>
                <Button type="default" onClick={handleClear}>
                  {t('buttons.clear')}
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <CommonTable
        {...tableProps}
        className={'mt-6'}
        rowKey="id"
        onRow={(record) => {
          const isRowDisabled = record.status === 'inactive'
          return {
            style: isRowDisabled
              ? {
                  opacity: 0.5,
                  cursor: 'not-allowed',
                }
              : {},
            className: getRowClassName(record),
          }
        }}
      >
        <Table.Column
          dataIndex="code"
          title={t('employees.fields.code')}
          align="left"
          width="12%"
          onHeaderCell={() => ({ style: headerCellStyle })}
          onCell={() => ({ style: bodyCellStyle })}
          render={(value, record) => {
            const isDisabled = record.status === 'inactive'
            return (
              <Link
                href={`/employees/show/${record?.id}`}
                style={{
                  textDecoration: 'underline',
                  pointerEvents: isDisabled ? 'none' : 'auto',
                  color: isDisabled ? '#999' : undefined,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
                title={isDisabled ? t('employees.deleted') : ''}
              >
                {value}
              </Link>
            )
          }}
        />
        <Table.Column
          dataIndex="name"
          title={t('employees.fields.name')}
          align={'left'}
          width="15%"
          onHeaderCell={() => ({ style: headerCellStyle })}
          onCell={() => ({ style: bodyCellStyle })}
          render={(value, record: BaseRecord) =>
            renderEmployeeName(value, record)
          }
        />
        <Table.Column
          dataIndex={['department']}
          title={t('employees.fields.department')}
          align={'left'}
          width="30%"
          onHeaderCell={() => ({ style: headerCellStyle })}
          onCell={() => ({ style: bodyCellStyle })}
          render={(value) => renderFieldNotSet(value?.name)}
        />
        <Table.Column
          dataIndex={['email']}
          title={t('employees.fields.email')}
          align="left"
          width="15%"
          onHeaderCell={() => ({ style: headerCellStyle })}
          onCell={() => ({ style: bodyCellStyle })}
          render={(value, record) => {
            const isDisabled = record.status === 'inactive'
            if (isDisabled) {
              return (
                <span
                  style={{
                    color: '#999',
                    cursor: 'not-allowed',
                  }}
                  title={t('employees.deleted')}
                >
                  {value}
                </span>
              )
            }
            return <EmailField value={value} />
          }}
        />
        <Table.Column
          dataIndex={['role']}
          title={t('employees.fields.role')}
          width="10%"
          render={(value) => renderFieldNotSet(value?.display_name)}
          align={'left'}
          onHeaderCell={() => ({ style: headerCellStyle })}
          onCell={() => ({ style: bodyCellStyle })}
        />
        <Table.Column
          title={t('table.actions')}
          dataIndex="actions"
          align="center"
          width="10%"
          onHeaderCell={() => ({ style: headerCellStyle })}
          onCell={() => ({
            style: { ...bodyCellStyle, overflow: 'hidden', minWidth: 0 },
          })}
          render={(_, record: BaseRecord) => {
            const isDisabled = record.status === 'inactive'

            return (
              <Space wrap size={4}>
                <ShowButton
                  disabled={isDisabled}
                  autoInsertSpace={false}
                  size="small"
                  icon={null}
                  recordItemId={record.id}
                  resource="employees"
                  style={{
                    color: '#2784FF',
                    borderColor: '#2784FF',
                  }}
                >
                  {t('buttons.show')}
                </ShowButton>
                <EditButton
                  disabled={isDisabled}
                  autoInsertSpace={false}
                  size="small"
                  icon={null}
                  recordItemId={record.id}
                  resource="employees"
                  style={{
                    color: '#FFFFFF',
                    background: '#1FDB51',
                  }}
                >
                  {t('buttons.edit')}
                </EditButton>
              </Space>
            )
          }}
        />
      </CommonTable>
    </List>
  )
}

export default Page

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
import { Space, Table, Typography } from 'antd'
import React from 'react'

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

  const { tableProps } = useTable()
  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('employees.employees')}
        </Title>
      ),
    },
    { title: <Title level={5}>社員一覧</Title> },
  ]

  const getRowClassName = (record: BaseRecord) => {
    return !record.email || !record.code ? 'bg-gray-200' : ''
  }

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={'employee.list.list'}
    >
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

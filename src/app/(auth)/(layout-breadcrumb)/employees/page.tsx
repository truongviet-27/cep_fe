'use client'
import { RightOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import {
  DateField,
  EditButton,
  EmailField,
  ShowButton,
  useTable,
} from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Space, Table, Typography } from 'antd'
import React from 'react'

const { Title } = Typography

function Page() {
  const t = useTranslate()

  const { tableProps } = useTable()

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('employees.employees')}
        </Title>
      ),
    },
  ]
  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
    >
      <CommonTable {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title={t('employees.fields.name')} />
        <Table.Column
          dataIndex={['email']}
          title={t('employees.fields.email')}
          render={(value) => <EmailField value={value} />}
        />
        <Table.Column
          dataIndex={['created_at']}
          title={t('employees.fields.created_at')}
          render={(value) => <DateField value={value} />}
        />
        <Table.Column
          dataIndex={['updated_at']}
          title={t('employees.fields.updated_at')}
          render={(value) => <DateField value={value} />}
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

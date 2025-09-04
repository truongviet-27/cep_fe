'use client'
import { RightOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { EditButton, EmailField, ShowButton, useTable } from '@refinedev/antd'
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
    { title: <Title level={5}>社員一覧</Title> },
  ]
  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={'社員一覧'}
    >
      <CommonTable className={'mt-6'} {...tableProps} rowKey="id">
        <Table.Column dataIndex="code" title={t('employees.fields.code')} />
        <Table.Column dataIndex="name" title={t('employees.fields.name')} />
        <Table.Column
          dataIndex={['email']}
          title={t('employees.fields.email')}
          render={(value) => <EmailField value={value} />}
        />
        <Table.Column
          dataIndex={['department.name']}
          title={t('employees.fields.department')}
        />
        <Table.Column
          dataIndex={['role.display_name']}
          title={t('employees.fields.role')}
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

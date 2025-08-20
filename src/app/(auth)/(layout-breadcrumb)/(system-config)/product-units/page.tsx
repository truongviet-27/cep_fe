'use client'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import { DeleteButton, EditButton, useTable } from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import { Button, Space, Table } from 'antd'
import React from 'react'

type Row = { name: string }

export default function Page() {
  const [tempRows, setTempRows] = React.useState<Row[]>([])
  // const [listEditingKey, setListEditingKey] = React.useState<string[]>([])

  const translate = useTranslate()
  const { tableProps } = useTable<Row>({
    syncWithLocation: true,
  })

  const dataSource = React.useMemo(() => {
    const server = tableProps.dataSource ?? []
    return [...tempRows, ...server]
  }, [tempRows, tableProps.dataSource])

  return (
    <List
      footer={
        <div className={'flex justify-end'}>
          <Button>create</Button>&nbsp;
          <Button type={'primary'}>{translate('buttons.save_all')}</Button>
        </div>
      }
      createButtonProps={{
        children: translate('buttons.create_new'),
        onClick: () => {
          {
            setTempRows([...tempRows, { name: 'test' }])
            console.log('????')
          }
        },
      }}
    >
      <CommonTable {...tableProps} rowKey="id" dataSource={dataSource}>
        <Table.Column
          dataIndex="name"
          title={translate('code_issue_settings.fields.code')}
        />

        <Table.Column
          title={translate('table.actions')}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </CommonTable>
    </List>
  )
}

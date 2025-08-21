/* eslint-disable */
'use client'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import { DeleteButton, EditButton, useTable } from '@refinedev/antd'
import { BaseRecord, useCreate, useTranslate } from '@refinedev/core'
import { Button, Input, Space, Table, Typography } from 'antd'
import React from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { PRIMARY } from '@utility/color'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { RightOutlined } from '@ant-design/icons'

const { Title } = Typography

type Row = { id?: string; name: string }
type FormValues = { tempRows: Row[] }

export default function Page() {
  const translate = useTranslate()

  const { tableProps } = useTable<Row>({ syncWithLocation: true })

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { tempRows: [] },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tempRows',
    keyName: '__key',
  })

  const { mutate: createRow } = useCreate()

  const [editingKey, setEditingKey] = React.useState<string | null>(null)
  const [serverEdits, setServerEdits] = React.useState<Record<string, Row>>({})

  const startEdit = (key: string, record: Row) => {
    setEditingKey(key)
    setServerEdits((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? {}), ...record },
    }))
  }

  const onChangeServerName = (key: string, value: string) => {
    setServerEdits((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? {}), id: key, name: value },
    }))
  }

  const dataSource = React.useMemo(() => {
    const server = (tableProps.dataSource ?? []) as Row[]
    return [...fields, ...server]
  }, [fields, tableProps.dataSource])

  // Save All
  const onSubmit = (values: FormValues) => {
    const creates = values.tempRows.map(({ name }) => ({ name }))
    const updates = Object.values(serverEdits).filter((r) => r.id)

    console.log('CREATE payload:', creates)
    console.log('UPDATE payload:', updates)
  }

  const handleAddRow = () => {
    const tempRow = { name: '', __key: Date.now().toString() }

    createRow(
      {
        resource: 'product-units',
        values: { name: 'product template ' + Date.now().toString() },
      },
      {
        onError: () => {
          const idx = fields.findIndex((f) => f.__key === tempRow.__key)
          if (idx > -1) remove(idx)
        },
      },
    )
  }

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {translate('system_config.system_config')}
        </Title>
      ),
    },
    {
      title: (
        <Title level={5}>
          {translate('product_categories.product_categories')}
        </Title>
      ),
    },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <List
        title={
          <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
        }
        footer={
          <div className="flex justify-end">
            <Button onClick={() => append({ name: 'test' })}>create</Button>
            &nbsp;
            <Button htmlType="submit" type="primary">
              {translate('buttons.save_all')}
            </Button>
          </div>
        }
        createButtonProps={{
          children: translate('buttons.create_new'),
          onClick: handleAddRow,
        }}
      >
        <CommonTable
          {...tableProps}
          rowKey={(r: any) => r.id ?? r.__key}
          dataSource={dataSource}
        >
          <Table.Column<Row>
            dataIndex="name"
            title={translate('code_issue_settings.fields.code')}
            render={(_, record: BaseRecord, index) => {
              if (!record.id) {
                return (
                  <Controller
                    control={control}
                    name={`tempRows.${index}.name`}
                    render={({ field }) => (
                      <Input {...field} placeholder="Enter code" />
                    )}
                  />
                )
              }

              const key = String(record.id)
              if (editingKey === key) {
                return (
                  <Input
                    value={serverEdits[key]?.name ?? record.name}
                    onChange={(e) => onChangeServerName(key, e.target.value)}
                    placeholder="Enter code"
                  />
                )
              }
              return record.name
            }}
          />

          <Table.Column
            title={translate('table.actions')}
            dataIndex="actions"
            render={(_, record: BaseRecord, index: number) => {
              if (record.id) {
                return (
                  <Space>
                    <EditButton
                      hideText
                      size="small"
                      recordItemId={record.id}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        startEdit(String(record.id), record as Row)
                      }}
                    />
                    <DeleteButton
                      hideText
                      size="small"
                      recordItemId={record.id}
                    />
                  </Space>
                )
              }

              return (
                <Space>
                  <Button size="small" danger onClick={() => remove(index)}>
                    Delete
                  </Button>
                </Space>
              )
            }}
          />
        </CommonTable>
      </List>
    </form>
  )
}

/* eslint-disable */
'use client'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import { DeleteButton, useTable } from '@refinedev/antd'
import { BaseRecord, useCreate, useTranslate } from '@refinedev/core'
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
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { PRIMARY } from '@utility/color'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { RightOutlined } from '@ant-design/icons'
import { CommonButton } from '@components/common/common-button'

const { Title } = Typography

type Row = { id?: string; name: string }
type FormValues = { tempRows: Row[] }

export default function Page() {
  const translate = useTranslate()

  const { tableProps, searchFormProps } = useTable<Row>({
    syncWithLocation: true,
  })

  const formProps = useForm<FormValues>({
    defaultValues: { tempRows: [] },
  })

  const { control, handleSubmit, reset } = formProps
  const { fields, remove } = useFieldArray({
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
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      footer={
        <div className="flex justify-end">
          <Button htmlType="submit">{translate('buttons.back')}</Button>
        </div>
      }
      createButtonProps={{
        children: translate('buttons.create_new'),
        onClick: handleAddRow,
      }}
    >
      <Form {...searchFormProps} layout="vertical">
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          <Col xs={12} sm={6} md={6}>
            <Form.Item name="q" label={'カテゴリレベル'}>
              <Select
                placeholder={translate('placeholders.select')}
                allowClear
                options={[
                  { value: 1, label: '大' },
                  { value: 2, label: '中' },
                  { value: 3, label: '小' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Form.Item name="customer" label={'カテゴリ名'}>
              <Input
                placeholder={translate('placeholders.partial_match')}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Form.Item label=" " colon={false}>
              <Space>
                <Button htmlType="submit" type="primary">
                  {translate('filters.search')}
                </Button>
                <Button onClick={() => searchFormProps.form?.resetFields()}>
                  {translate('filters.clear')}
                </Button>
              </Space>
            </Form.Item>
          </Col>

          {/*<Col xs={12} sm={12} md={9} style={{ textAlign: 'right' }}>*/}
          {/*  <Space>*/}
          {/*    <Button*/}
          {/*    >*/}
          {/*      {translate('buttons.create')}*/}
          {/*    </Button>*/}
          {/*    <Button*/}
          {/*      type="primary"*/}
          {/*    >*/}
          {/*      {translate('buttons.csv_export')}*/}
          {/*    </Button>*/}
          {/*  </Space>*/}
          {/*</Col>*/}
        </Row>
      </Form>

      <CommonTable
        {...tableProps}
        className={'mt-8'}
        rowKey={(r: any) => r.id ?? r.__key}
        dataSource={dataSource}
      >
        <Table.Column<Row>
          dataIndex="name"
          title={translate('code_issue_settings.fields.name')}
          render={(_, record: BaseRecord, index) => {
            if (!record.id) {
              return (
                <Controller
                  control={control}
                  name={`tempRows.${index}.name`}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter name" />
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
                  <CommonButton
                    type={'edit'}
                    onClick={() => {
                      startEdit(String(record.id), record as Row)
                    }}
                  />

                  {/*<SaveButton size="middle" recordItemId={record.id} />*/}

                  <DeleteButton size="middle" recordItemId={record.id}>
                    {translate('buttons.delete')}
                  </DeleteButton>
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
  )
}

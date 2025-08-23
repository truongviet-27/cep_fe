'use client'

import { RightOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { DeleteButton, EditButton, useTable } from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { useCreate, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Button, Col, Form, Input, Row, Space, Table, Typography } from 'antd'
import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

const { Title } = Typography

type Row = { id?: string; name: string }
type FormValues = { tempRows: Row[] }

const Page = () => {
  const translate = useTranslate()
  const { tableProps, searchFormProps } = useTable<Row>({
    syncWithLocation: true,
  })

  const formProps = useForm<FormValues>({
    defaultValues: { tempRows: [] },
  })

  const { control } = formProps
  const { fields, remove } = useFieldArray({
    control,
    name: 'tempRows',
    keyName: '__key',
  })

  const { mutate: createRow } = useCreate()

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

  const handleAddRow = () => {
    const tempRow = { name: '', __key: Date.now().toString() }

    createRow(
      {
        resource: 'tags',
        values: { name: 'laravel ' + Date.now().toString() },
      },
      {
        onError: () => {
          const idx = fields.findIndex((f) => f.__key === tempRow.__key)
          if (idx > -1) remove(idx)
        },
      },
    )
  }

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
    >
      <Form {...searchFormProps} layout="vertical" colon={false}>
        <Row
          align="middle"
          justify="space-between"
          wrap={false}
          gutter={[16, 16]}
          style={{ width: '100%' }}
        >
          <Col flex="auto">
            <Row align="middle" gutter={16} wrap={false}>
              <Col>
                <div style={{ fontWeight: 600 }}>単位名</div>
              </Col>

              <Col flex="360px">
                <Form.Item name="name" style={{ margin: 0 }}>
                  <Input placeholder="部分一致" allowClear size="large" />
                </Form.Item>
              </Col>

              <Col>
                <Space size="middle">
                  <Button htmlType="submit" type="primary" size="large">
                    検索
                  </Button>
                  <Button size="large" type="default">
                    クリア
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>

          <Col>
            <Button type="primary" size="large" onClick={handleAddRow}>
              新規登録
            </Button>
          </Col>
        </Row>
      </Form>

      <CommonTable className={'mt-8'} {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="name"
          title={translate('code_issue_settings.fields.name')}
        />
        <Table.Column
          title={translate('table.actions')}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id}>
                {translate('buttons.edit')}
              </EditButton>
              <DeleteButton size="middle" recordItemId={record.id}>
                {translate('buttons.delete')}
              </DeleteButton>
            </Space>
          )}
        />
      </CommonTable>
    </List>
  )
}
export default Page

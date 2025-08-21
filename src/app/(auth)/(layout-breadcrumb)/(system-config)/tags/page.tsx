'use client'

import { SearchOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import { DeleteButton, EditButton, ShowButton, useTable } from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import { Button, Col, Form, Input, Row, Space, Table } from 'antd'
import React from 'react'

const Page = () => {
  const translate = useTranslate()
  const { tableProps, searchFormProps } = useTable({
    syncWithLocation: true,
  })

  return (
    <List>
      <Form {...searchFormProps} layout="inline">
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          <Col xs={12} sm={6} md={6}>
            <Form.Item name="customer">
              <Input
                placeholder={translate('filters.customer_search_placeholder')}
                prefix={<SearchOutlined />}
              />
            </Form.Item>
          </Col>

          <Col xs={6} sm={4} md={3} style={{ textAlign: 'left' }}>
            <Space>
              <Button
                type={'primary'}
                onClick={() => searchFormProps.form?.resetFields()}
              >
                aaa
              </Button>

              <Button onClick={() => searchFormProps.form?.resetFields()}>
                bbb
              </Button>
            </Space>
          </Col>

          <Col xs={6} sm={4} md={3} style={{ textAlign: 'left' }}>
            <Button
              type={'primary'}
              onClick={() => searchFormProps.form?.resetFields()}
            >
              ddd
            </Button>
          </Col>
        </Row>
      </Form>

      <CommonTable className={'mt-8'} {...tableProps} rowKey="id">
        <Table.Column
          title={translate('table.actions')}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </CommonTable>
    </List>
  )
}
export default Page

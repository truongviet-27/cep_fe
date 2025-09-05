'use client'

import { RightOutlined } from '@ant-design/icons'
import useTags from '@app/(auth)/(layout-breadcrumb)/(system-config)/tags/useTags'
import TableDnd from '@components/common/table-dnd'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { Button, Col, Form, Input, Row, Space } from 'antd'
import React from 'react'

export type TagRow = {
  id?: number | string
  name: string
  order: number
  _isNew?: boolean
  _isEditing?: boolean
  _key?: string
}

type RowVM = TagRow & { __index: string }

export default function Page() {
  const {
    t,
    breadcrumbItems,
    addNew,
    columns,
    dataSource,
    onDragEnd,
    onSaveAll,
    savingAll,
    searchFormProps,
    tableProps,
    getRowIdForDnd,
    setFilters,
  } = useTags()

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      footer={
        <Col>
          <Button
            type="primary"
            onClick={onSaveAll}
            loading={savingAll}
            disabled={savingAll}
          >
            {t('buttons.save_all', { defaultValue: '並び順を保存' })}
          </Button>
        </Col>
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
                <Form.Item name="name_lk" style={{ margin: 0 }}>
                  <Input placeholder="部分一致" allowClear size="middle" />
                </Form.Item>
              </Col>
              <Col>
                <Space size="middle">
                  <Button htmlType="submit" type="primary" size="middle">
                    検索
                  </Button>
                  <Button
                    size="middle"
                    type="default"
                    onClick={() => {
                      searchFormProps.form?.resetFields()
                      setFilters([], 'replace')
                    }}
                  >
                    クリア
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>
          <Col>
            <Button type="primary" size="middle" onClick={addNew}>
              新規登録
            </Button>
          </Col>
        </Row>
      </Form>

      <div className="mt-8">
        <TableDnd<RowVM>
          {...tableProps}
          dataSource={dataSource}
          columns={columns}
          getRowId={getRowIdForDnd}
          onDragEnd={onDragEnd}
        />
      </div>
    </List>
  )
}

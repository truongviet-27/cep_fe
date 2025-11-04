'use client'

import { RightOutlined } from '@ant-design/icons'
import useTags from '@app/(auth)/(layout-breadcrumb)/(system-config)/tags/use-tags'
import TableDnd from '@components/common/table-dnd'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import boldText from '@utility/bold-text'
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
        <Row align="middle" gutter={[16, 0]}>
          <Col xs={24} sm={12} md={4}>
            <Form.Item
              name="name_lk"
              style={{ margin: 0 }}
              label={boldText(t('tags.filters.search_label'))}
            >
              <Input placeholder="部分一致" allowClear size="middle" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={20}>
            <Space className="mt-4 w-full justify-between">
              <Space>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="middle"
                  autoInsertSpace={false}
                >
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
              <Button type="primary" size="middle" onClick={addNew}>
                新規登録
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      <div className="mt-2">
        <TableDnd<RowVM>
          tableProps={tableProps}
          dataSource={dataSource}
          columns={columns}
          getRowId={getRowIdForDnd}
          onDragEnd={onDragEnd}
        />
      </div>
    </List>
  )
}

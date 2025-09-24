/* eslint-disable */
'use client'

import { RightOutlined } from '@ant-design/icons'
import TableDnd from '@components/common/table-dnd'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { Button, Col, Form, Input, Row, Space } from 'antd'
import React from 'react'
import useProductUnits, {
  RowVM,
} from '@app/(auth)/(layout-breadcrumb)/(system-config)/product-units/use-product-units'

export default function Page() {
  const {
    t,
    breadcrumbItems,
    addNew,
    saveAll: onSaveAll,
    columns,
    dataSource,
    tableProps,
    searchFormProps,
    savingAll,
    getRowIdForDnd,
    onDragEnd,
    setFilters,
  } = useProductUnits()

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
                <div style={{ fontWeight: 600 }}>
                  {t('product_units.columns.unit_name')}
                </div>
              </Col>
              <Col flex="360px">
                <Form.Item name="name_lk" style={{ margin: 0 }}>
                  <Input
                    placeholder={t('placeholders.partial_match')}
                    allowClear
                    size="middle"
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label={<></>}>
                  <Space size="middle">
                    <Button htmlType="submit" type="primary" size="middle">
                      {t('buttons.search')}
                    </Button>
                    <Button
                      htmlType="reset"
                      onClick={() => {
                        searchFormProps.form?.resetFields()
                        setFilters([], 'replace')
                      }}
                      size="middle"
                      type="default"
                    >
                      {t('buttons.clear')}
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col>
            <Button type="primary" size="middle" onClick={addNew}>
              {t('buttons.create_new')}
            </Button>
          </Col>
        </Row>
      </Form>

      <div className="mt-8">
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

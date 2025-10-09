/* eslint-disable */
'use client'

import { RightOutlined } from '@ant-design/icons'
import useProductUnits, {
  RowVM,
} from '@app/(auth)/(layout-breadcrumb)/(system-config)/product-units/use-product-units'
import TableDnd from '@components/common/table-dnd'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { CreateButton } from '@refinedev/antd'
import boldText from '@utility/bold-text'
import { Button, Col, Form, Input, Row, Space } from 'antd'

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
    isFullAccess,
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
            disabled={savingAll || !isFullAccess}
          >
            {t('buttons.save_all', { defaultValue: '並び順を保存' })}
          </Button>
        </Col>
      }
    >
      <Form {...searchFormProps} layout="vertical" colon={false}>
        <Row align="middle" gutter={[16, 0]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="name_lk"
              style={{ margin: 0 }}
              label={boldText(t('product_units.columns.unit_name'))}
            >
              <Input
                placeholder={t('placeholders.partial_match')}
                allowClear
                size="middle"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={18}>
            <Space size="middle" className="mt-4 flex w-full justify-between">
              <Space>
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
              <CreateButton
                type="primary"
                size="middle"
                onClick={addNew}
                icon={null}
                disabled={!isFullAccess}
              >
                {t('buttons.create_new')}
              </CreateButton>
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

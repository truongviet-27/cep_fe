'use client'

import { RightOutlined } from '@ant-design/icons'
import useProductCategories from '@app/(auth)/(layout-breadcrumb)/(merchandise)/product-categories/use-product-categories'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { CreateButton } from '@refinedev/antd'
import { useGo } from '@refinedev/core'
import { PermissionEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { CSV_LINK, LAYOUT_BG } from '@utility/color'
import { Button, Col, Empty, Form, Input, Row, Select, Space, Tree } from 'antd'

export default function Page() {
  const {
    breadcrumbItems,
    filteredTree,
    toTreeData,
    onDrop,
    tableProps,
    dirty,
    save,
    handleSearch,
    handleClear,
    addRootCategory,
    openAll,
    allOpen,
    expandedKeys,
    form,
    t,
  } = useProductCategories()
  const { hasFullAccessModule } = useUserStore.getState()
  const go = useGo()
  const isFullAccess = hasFullAccessModule(PermissionEnum.PRODUCT_CATEGORY_EDIT)

  return (
    <Create
      isLoading={!!tableProps.loading}
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      hiddenButtonBack
      contentProps={{
        className: 'no-actions-border',
      }}
    >
      <Form
        form={form}
        layout="horizontal"
        colon={false}
        onFinish={handleSearch}
      >
        <Row align="middle" gutter={24} wrap={false}>
          <Col>
            <div style={{ fontWeight: 600 }}>カテゴリレベル</div>
            <div style={{ marginTop: 8 }}>
              <Form.Item name="level" noStyle>
                <Select
                  allowClear
                  size="middle"
                  placeholder="選択してください"
                  style={{ width: 240 }}
                  options={[
                    { label: '大', value: 1 },
                    { label: '中', value: 2 },
                    { label: '小', value: 3 },
                  ]}
                />
              </Form.Item>
            </div>
          </Col>
          <Col>
            <div style={{ fontWeight: 600 }}>カテゴリ名</div>
            <div style={{ marginTop: 8 }}>
              <Form.Item name="name" noStyle>
                <Input
                  size="middle"
                  placeholder="部分一致"
                  allowClear
                  style={{ width: 360 }}
                  maxLength={255}
                />
              </Form.Item>
            </div>
          </Col>
          <Col>
            <div style={{ height: 28 }} />
            <div style={{ marginTop: 4 }}>
              <Space size="middle">
                <Button type="primary" size="middle" htmlType={'submit'}>
                  検索
                </Button>
                <Button size="middle" type="default" onClick={handleClear}>
                  クリア
                </Button>
              </Space>
            </div>
          </Col>
          <Col style={{ flex: 1 }} />
          <div style={{ marginTop: 4, display: 'block' }}>
            <CreateButton
              type="primary"
              size="middle"
              onClick={addRootCategory}
              icon={null}
            >
              新規登録
            </CreateButton>
            <Button
              disabled={!isFullAccess}
              type="link"
              onClick={() => {
                go({
                  to: '/product-categories/csv',
                })
              }}
              style={{ color: CSV_LINK }}
              className={'!underline'}
            >
              {t('projects.list.buttons.csv_export')}
            </Button>
          </div>
        </Row>
      </Form>

      <div className="space-y-3">
        <div className="flex items-center justify-end">
          <Button
            type="primary"
            disabled={!dirty || !isFullAccess}
            onClick={save}
            className="shadow-sm disabled:opacity-60"
          >
            {t('buttons.save_all')}
          </Button>
          <Button
            type="text"
            onClick={() => openAll(!allOpen)}
            // icon={allOpen ? <UpOutlined /> : <DownOutlined />}
          >
            {allOpen
              ? t('product_categories.all_open')
              : t('product_categories.all_close')}
          </Button>
        </div>

        <div
          className={`relative rounded-lg border border-zinc-200 bg-white transition-colors`}
        >
          {filteredTree.length === 0 ? (
            <Empty description={t('table.noData')} />
          ) : (
            <Tree
              className={`draggable-tree [&_.ant-tree-list-holder-inner]:!w-full [&_.ant-tree-switcher]:hidden`}
              style={{
                backgroundColor: LAYOUT_BG,
                paddingTop: 4,
              }}
              blockNode
              draggable
              selectable={false}
              expandedKeys={expandedKeys}
              onDrop={onDrop}
              treeData={toTreeData(filteredTree)}
              virtual={false}
              showLine
            />
          )}
        </div>
      </div>
    </Create>
  )
}

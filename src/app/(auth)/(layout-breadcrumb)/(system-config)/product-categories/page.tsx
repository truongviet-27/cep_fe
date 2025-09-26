'use client'

import { DownOutlined, RightOutlined, UpOutlined } from '@ant-design/icons'
import useProductCategories from '@app/(auth)/(layout-breadcrumb)/(system-config)/product-categories/use-product-categories'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { CreateButton } from '@refinedev/antd'
import { useGo } from '@refinedev/core'
import { PermissionEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { LAYOUT_BG } from '@utility/color'
import { Button, Col, Form, Input, Row, Select, Space, Tree } from 'antd'

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
  const { permission } = useUserStore.getState()
  const go = useGo()
  const hasProductCategoryEditPermission = !!permission?.permissions.has(
    PermissionEnum.PRODUCT_CATEGORY_EDIT,
  )

  return (
    <Create
      isLoading={!!tableProps.loading}
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      rightFooterButtons={
        <Space size={8}>
          <Button
            type="primary"
            disabled={!dirty || hasProductCategoryEditPermission}
            onClick={save}
            className="shadow-sm disabled:opacity-60"
          >
            並べ替えを保存
          </Button>
          <Button>その他の操作</Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="horizontal"
        colon={false}
        onFinish={handleSearch}
      >
        <Row
          align="middle"
          justify="space-between"
          wrap={false}
          gutter={[16, 16]}
          style={{ width: '100%' }}
        >
          <Col flex="auto">
            <Row align="middle" gutter={24} wrap={false}>
              <Col>
                <div style={{ fontWeight: 600 }}>カテゴリレベル</div>
                <div style={{ marginTop: 8 }}>
                  <Form.Item name="level" noStyle>
                    <Select
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
            </Row>
          </Col>
          <Col className="mt-6">
            <CreateButton
              type="primary"
              size="middle"
              onClick={addRootCategory}
              icon={null}
            >
              新規登録
            </CreateButton>
          </Col>
        </Row>
      </Form>

      <div className="space-y-3">
        <div className="flex items-center justify-end">
          <Button
            type="text"
            onClick={() => openAll(!allOpen)}
            icon={allOpen ? <UpOutlined /> : <DownOutlined />}
          >
            {allOpen
              ? t('product_categories.all_open')
              : t('product_categories.all_close')}
          </Button>
          <Button
            disabled={!hasProductCategoryEditPermission}
            type="link"
            onClick={() => {
              go({
                to: '/product-categories/csv',
              })
            }}
          >
            {t('projects.csv_upload.title')}
          </Button>
        </div>

        <div
          className={`relative rounded-lg border border-zinc-200 bg-white transition-colors`}
        >
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
        </div>
      </div>
    </Create>
  )
}

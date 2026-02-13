/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ActionType } from '@components/common/action'
import { Action } from '@components/common/action'
import ProductSelect from '@components/common/product-select'
import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import type {
  QuotaTemplateProductGroupRequest,
  QuotaTemplateProductItemRequest,
} from '@sdk/hey-api'
import { PRIMARY } from '@utility/color'
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { type FC, useState } from 'react'

import { ProductCategoryModal } from '../modal/product-category'
import PackageSelect from '../package-select'
import { useController } from './controller'

const { Title } = Typography

const OptionalInfo: FC = () => {
  const t = useTranslate()
  const {
    form,
    optionalProducts,
    handleAddProduct,
    handleRemoveProduct,
    onChangeProductName,
  } = useController()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Title
        level={5}
        style={{ color: PRIMARY }}
        className="!mb-4 border-b-1 border-gray-200 pb-2 text-[14px]"
      >
        {t('quota_templates.form.titleOptionalInfo')}
      </Title>
      <Form.List name={'optional_product'}>
        {(_, { add, remove }) => {
          const mainProduct = (form?.getFieldValue('optional_product') ??
            []) as QuotaTemplateProductGroupRequest[]
          const dataSource = mainProduct.flatMap(
            (item: QuotaTemplateProductGroupRequest, index: number) => [
              {
                index,
                key: `header-${index}`,
                isHeader: true,
                title: item.group_name,
              },
              ...(item.products ?? []).flatMap(
                (item2: QuotaTemplateProductItemRequest, index2: number) => [
                  {
                    index,
                    index2,
                    ...item2,
                  },
                ],
              ),
            ],
          )

          const columns: ColumnsType = [
            {
              title: '商品コード',
              dataIndex: 'code',
              key: 'code',
              align: 'left',
              width: 200,
              render: (_, record) => {
                if (record.isHeader) {
                  return {
                    children: (
                      <Form.Item
                        name={[record.index, 'group_name']}
                        className="ant-form-item-hidden-margin"
                      >
                        <Input
                          placeholder="タイトル入力"
                          style={{
                            width: 400,
                          }}
                        />
                      </Form.Item>
                    ),
                    props: { colSpan: columns.length - 1 },
                  }
                }
                return form.getFieldValue([
                  'optional_product',
                  record.index,
                  'products',
                  record.index2,
                  'code',
                ])
              },
            },
            {
              title: '商品・サービス名',
              dataIndex: 'name',
              key: 'name',
              align: 'left',
              width: 200,
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }

                const productId = form.getFieldValue([
                  'optional_product',
                  record.index,
                  'products',
                  record.index2,
                  'product_id',
                ])

                const defaultValue = productId
                  ? {
                      value: productId,
                      label: form.getFieldValue([
                        'optional_product',
                        record.index,
                        'products',
                        record.index2,
                        'name',
                      ]),
                    }
                  : null

                return (
                  <Form.Item
                    name={[
                      record.index,
                      'products',
                      record.index2,
                      'product_id',
                    ]}
                    className="ant-form-item-hidden-margin"
                    rules={[
                      {
                        required: false,
                        message: '',
                      },
                      {
                        validator: async () => {
                          const products =
                            form.getFieldValue([
                              'optional_product',
                              record.index,
                              'products',
                            ]) || []
                          const currentProductId =
                            products[record.index2]?.product_id
                          if (!currentProductId) return Promise.resolve()
                          const isDuplicate = products.some(
                            (item: any, idx: number) =>
                              item.product_id === currentProductId &&
                              idx !== record.index2,
                          )
                          if (isDuplicate) {
                            notification.error({
                              message: t(
                                'quotas.action.detail_info.duplicate_product',
                              ),
                              key: `name-optional-product`,
                              placement: 'topRight',
                            })
                            return Promise.reject()
                          }
                          return Promise.resolve()
                        },
                      },
                    ]}
                  >
                    <ProductSelect
                      defaultValue={defaultValue}
                      onChange={(value) =>
                        onChangeProductName(value, record.index, record.index2)
                      }
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: '単位',
              dataIndex: 'unit',
              key: 'unit',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return (
                  form.getFieldValue([
                    'optional_product',
                    record.index,
                    'products',
                    record.index2,
                    'unit',
                  ]) ??
                  form.getFieldValue([
                    'optional_product',
                    record.index,
                    'products',
                    record.index2,
                    'unit_name',
                  ])
                )
              },
            },
            {
              title: '荷姿',
              dataIndex: 'package_id',
              key: 'package_id',
              width: 200,
              align: 'left',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }

                const packageId = form.getFieldValue([
                  'optional_product',
                  record.index,
                  'products',
                  record.index2,
                  'package_id',
                ])
                const defaultValue = packageId
                  ? {
                      value: packageId,
                      label: form.getFieldValue([
                        'optional_product',
                        record.index,
                        'products',
                        record.index2,
                        'package_name',
                      ]),
                    }
                  : null

                return (
                  <Form.Item
                    name={[
                      'optional_product',
                      record.index,
                      'products',
                      record.index2,
                      'package_id',
                    ]}
                    className="ant-form-item-hidden-margin"
                  >
                    <PackageSelect
                      key={
                        record.index +
                        '-' +
                        record.index2 +
                        '-' +
                        optionalProducts?.[record.index]?.products?.[
                          record.index2
                        ].product_id
                      }
                      productId={form.getFieldValue([
                        'optional_product',
                        record.index,
                        'products',
                        record.index2,
                        'product_id',
                      ])}
                      onChange={(value, option) => {
                        form.setFieldValue(
                          [
                            'optional_product',
                            record.index,
                            'products',
                            record.index2,
                            'package_id',
                          ],
                          value,
                        )

                        form.setFieldValue(
                          [
                            'optional_product',
                            record.index,
                            'products',
                            record.index2,
                            'selling_price',
                          ],
                          option.selling_price,
                        )
                      }}
                      defaultOptions={
                        optionalProducts?.[record.index].products[record.index2]
                          ?.packagings ?? []
                      }
                      defaultValue={defaultValue}
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: '原価',
              dataIndex: 'cost_price',
              key: 'cost_price',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                if (
                  form.getFieldValue([
                    'optional_product',
                    record.index,
                    'products',
                    record.index2,
                    'cost_price',
                  ]) === null
                ) {
                  return null
                }
                return form
                  .getFieldValue([
                    'optional_product',
                    record.index,
                    'products',
                    record.index2,
                    'cost_price',
                  ])
                  .toLocaleString()
              },
            },
            {
              title: '売単価',
              dataIndex: 'selling_price',
              key: 'selling_price',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return (
                  <Form.Item
                    name={[
                      record.index,
                      'products',
                      record.index2,
                      'selling_price',
                    ]}
                    className="ant-form-item-hidden-margin"
                  >
                    <InputNumber min={0} controls={false} />
                  </Form.Item>
                )
              },
            },
            {
              title: '数量',
              dataIndex: 'quantity',
              key: 'quantity',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return (
                  <Form.Item
                    name={[record.index, 'products', record.index2, 'quantity']}
                    className="ant-form-item-hidden-margin"
                  >
                    <InputNumber min={0} controls={false} />
                  </Form.Item>
                )
              },
            },
            {
              title: '利益率',
              dataIndex: 'profit_margin',
              key: 'profit_margin',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                if (
                  form.getFieldValue([
                    'optional_product',
                    record.index,
                    'products',
                    record.index2,
                    'cost_price',
                  ]) === null
                ) {
                  form.setFieldValue(
                    [
                      'optional_product',
                      record.index,
                      'products',
                      record.index2,
                      'profit_margin',
                    ],
                    0,
                  )
                  return '0%'
                }
                const cost =
                  form.getFieldValue([
                    'optional_product',
                    record.index,
                    'products',
                    record.index2,
                    'cost_price',
                  ]) || 0

                const selling =
                  form.getFieldValue([
                    'optional_product',
                    record.index,
                    'products',
                    record.index2,
                    'selling_price',
                  ]) || 0

                form.setFieldValue(
                  [
                    'optional_product',
                    record.index,
                    'products',
                    record.index2,
                    'profit_margin',
                  ],
                  (selling > 0
                    ? ((selling - cost) / selling) * 100
                    : 0
                  ).toFixed(2),
                )

                return `${(selling > 0 ? ((selling - cost) / selling) * 100 : 0).toFixed(2)}%`
              },
            },
            {
              title: '売価金額',
              dataIndex: 'sellingAmount',
              key: 'sellingAmount',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                const quantity =
                  form.getFieldValue([
                    'optional_product',
                    record.index,
                    'products',
                    record.index2,
                    'quantity',
                  ]) || 0

                const selling =
                  form.getFieldValue([
                    'optional_product',
                    record.index,
                    'products',
                    record.index2,
                    'selling_price',
                  ]) || 0
                return (quantity * selling).toLocaleString()
              },
            },
            {
              title: t('quotas.action.detail_info.table.tax_rate'),
              dataIndex: 'tax_rate',
              key: 'tax_rate',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }

                return (
                  form.getFieldValue([
                    'optional_product',
                    record.index,
                    'products',
                    record.index2,
                    'tax_rate',
                  ]) + '%'
                )
              },
            },
            {
              title: '行編集',
              key: 'action',
              render: (_, record) => {
                const isHeader = record.isHeader

                const lengthOriginalProduct =
                  form.getFieldValue('optional_product').length > 1
                const lengthProduct =
                  form.getFieldValue([
                    'optional_product',
                    record.index,
                    'products',
                  ]).length > 1

                const actionList: ActionType[] = isHeader
                  ? lengthOriginalProduct
                    ? ['append', 'remove']
                    : ['append']
                  : lengthProduct
                    ? ['append', 'remove']
                    : ['append']

                const handleAppend = () => {
                  if (isHeader) {
                    add(
                      {
                        group_name: '',
                        products: [
                          {
                            product_id: null,
                            package_id: null,
                            name: '',
                            code: '自動採番',
                            quantity: 0,
                            cost_price: null,
                            selling_price: 0,
                            profit_margin: 0,
                            is_add_total: false,
                          },
                        ],
                      },
                      record.index + 1,
                    )
                  } else {
                    handleAddProduct(record.index)
                  }
                }

                const handleRemove = () => {
                  if (isHeader) {
                    remove(record.index)
                  } else {
                    handleRemoveProduct(record.index, record.index2)
                  }
                }

                return (
                  <Action
                    actionList={actionList}
                    onAppendAction={handleAppend}
                    onRemoveAction={handleRemove}
                  />
                )
              },
            },
          ]

          return (
            <Flex vertical>
              <Flex
                justify="end"
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                  カテゴリから入力
                </Button>
              </Flex>
              <CommonTable
                columns={columns}
                dataSource={dataSource}
                rowClassName={(record) =>
                  record.isHeader ? 'bg-[#E6F7FF] font-bold' : ''
                }
                pagination={false}
              />
            </Flex>
          )
        }}
      </Form.List>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        title={'カテゴリから商品を追加'}
        footer={null}
      >
        <ProductCategoryModal
          name="optional_product"
          close={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  )
}

export default OptionalInfo

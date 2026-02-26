/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_TAX_RATES } from '@components/cep/estimates/quotas/utils'
import type { ActionType, CreateProductType } from '@components/common/action'
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
  Select,
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
    <div style={{ marginTop: 8 }}>
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
                    isSelfCreate: !item2.product_id,
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
              width: '8%',
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
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    ),
                    props: { colSpan: columns.length - 1 },
                  }
                }
                if (!record.isSelfCreate) {
                  return form.getFieldValue([
                    'optional_product',
                    record.index,
                    'products',
                    record.index2,
                    'code',
                  ])
                }
                return (
                  <Form.Item
                    name={[record.index, 'products', record.index2, 'code']}
                    className="ant-form-item-hidden-margin"
                    rules={[
                      {
                        whitespace: true,
                        message: '',
                      },
                      {
                        max: 255,
                        message: '',
                      },
                      {
                        pattern: /^[A-Z0-9-]+$/,
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
                          const currentCode = products[record.index2]?.code
                          if (!currentCode) return Promise.resolve()
                          const isDuplicate = products.some(
                            (item: any, idx: number) =>
                              item.code === currentCode &&
                              idx !== record.index2,
                          )
                          if (isDuplicate) {
                            notification.error({
                              message: t(
                                'quotas.action.detail_info.duplicate_product',
                              ),
                              key: `code-optional-product`,
                              placement: 'topRight',
                            })
                            return Promise.reject()
                          }
                          return Promise.resolve()
                        },
                      },
                    ]}
                  >
                    <Input
                      placeholder={t('placeholders.input_please')}
                      title={form.getFieldValue([
                        'optional_product',
                        record.index,
                        'products',
                        record.index2,
                        'code',
                      ])}
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: '商品・サービス名',
              dataIndex: 'name',
              key: 'name',
              align: 'left',
              width: '22%',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }

                if (!record.isSelfCreate) {
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
                            const allOptionalGroups =
                              form.getFieldValue('optional_product') || []
                            const currentProduct =
                              allOptionalGroups[record.index]?.products?.[
                                record.index2
                              ]
                            const currentProductId = currentProduct?.product_id

                            if (!currentProductId) return Promise.resolve()

                            let count = 0

                            for (const group of allOptionalGroups) {
                              const products = group?.products || []
                              for (const item of products) {
                                if (item?.product_id === currentProductId) {
                                  count++
                                }
                                if (count > 1) {
                                  notification.error({
                                    message: t(
                                      'quotas.action.detail_info.duplicate_product',
                                    ),
                                    key: `name-optional-product`,
                                    placement: 'topRight',
                                  })
                                  return Promise.reject()
                                }
                              }
                            }
                            return Promise.resolve()
                          },
                        },
                      ]}
                    >
                      <ProductSelect
                        defaultValue={defaultValue}
                        onChange={(value) =>
                          onChangeProductName(
                            value,
                            record.index,
                            record.index2,
                          )
                        }
                      />
                    </Form.Item>
                  )
                }
                return (
                  <Form.Item
                    name={[record.index, 'products', record.index2, 'name']}
                    className="ant-form-item-hidden-margin"
                    rules={[
                      {
                        whitespace: true,
                        message: '',
                      },
                      {
                        max: 255,
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
                          const currentName = products[record.index2]?.name
                          console.log('products', products)
                          if (!currentName) return Promise.resolve()
                          const isDuplicate = products.some(
                            (item: any, idx: number) =>
                              item.name === currentName &&
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
                    <Input
                      placeholder={t('placeholders.input_please')}
                      title={form.getFieldValue([
                        'optional_product',
                        record.index,
                        'products',
                        record.index2,
                        'name',
                      ])}
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: '単位',
              dataIndex: 'unit',
              key: 'unit',
              width: '5%',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                if (!record.isSelfCreate) {
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
                }
                return (
                  <Form.Item
                    name={[
                      record.index,
                      'products',
                      record.index2,
                      'unit_name',
                    ]}
                    className="ant-form-item-hidden-margin"
                    rules={[
                      {
                        whitespace: true,
                        message: '',
                      },
                      {
                        max: 255,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      placeholder={t('placeholders.input_please')}
                      title={form.getFieldValue([
                        'optional_product',
                        record.index,
                        'products',
                        record.index2,
                        'unit_name',
                      ])}
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: '荷姿',
              dataIndex: 'package_id',
              key: 'package_id',
              width: '10%',
              align: 'left',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }

                if (!record.isSelfCreate) {
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
                          optionalProducts?.[record.index].products[
                            record.index2
                          ]?.packagings ?? []
                        }
                        defaultValue={defaultValue}
                      />
                    </Form.Item>
                  )
                }
                return (
                  <Form.Item
                    name={[
                      record.index,
                      'products',
                      record.index2,
                      'package_name',
                    ]}
                    className="ant-form-item-hidden-margin"
                    rules={[
                      {
                        whitespace: true,
                        message: '',
                      },
                      {
                        max: 255,
                        message: '',
                      },
                    ]}
                  >
                    <Input disabled={record.isSelfCreate} />
                  </Form.Item>
                )
              },
            },
            {
              title: '原価',
              dataIndex: 'cost_price',
              key: 'cost_price',
              width: '8%',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                if (!record.isSelfCreate) {
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
                  return (
                    form.getFieldValue([
                      'optional_product',
                      record.index,
                      'products',
                      record.index2,
                      'cost_price',
                    ]) | 0
                  ).toLocaleString()
                }
                return (
                  <Form.Item
                    name={[
                      record.index,
                      'products',
                      record.index2,
                      'cost_price',
                    ]}
                    className="ant-form-item-hidden-margin"
                  >
                    <InputNumber
                      title={(
                        form.getFieldValue([
                          'optional_product',
                          record.index,
                          'products',
                          record.index2,
                          'cost_price',
                        ]) | 0
                      ).toLocaleString()}
                      min={0}
                      precision={0}
                      controls={false}
                      style={{
                        maxWidth: '100px',
                        width: '100%',
                      }}
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: '売単価',
              dataIndex: 'selling_price',
              key: 'selling_price',
              width: '8%',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return (
                  <Form.Item
                    rules={[
                      {
                        validator(_, value) {
                          const name = form.getFieldValue([
                            'optional_product',
                            record.index,
                            'products',
                            record.index2,
                            'name',
                          ])

                          if (name && !value) {
                            return Promise.reject()
                          }

                          return Promise.resolve()
                        },
                      },
                    ]}
                    name={[
                      record.index,
                      'products',
                      record.index2,
                      'selling_price',
                    ]}
                    className="ant-form-item-hidden-margin"
                    style={{ width: '100%' }}
                  >
                    <InputNumber
                      min={0}
                      controls={false}
                      style={{ width: '100%', minWidth: 0 }}
                      title={(
                        form.getFieldValue([
                          'optional_product',
                          record.index,
                          'products',
                          record.index2,
                          'selling_price',
                        ]) | 0
                      ).toLocaleString()}
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: '数量',
              dataIndex: 'quantity',
              key: 'quantity',
              width: '8%',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return (
                  <Form.Item
                    rules={[
                      {
                        validator(_, value) {
                          const name = form.getFieldValue([
                            'optional_product',
                            record.index,
                            'products',
                            record.index2,
                            'name',
                          ])

                          if (name && !value) {
                            return Promise.reject()
                          }

                          return Promise.resolve()
                        },
                      },
                    ]}
                    name={[record.index, 'products', record.index2, 'quantity']}
                    className="ant-form-item-hidden-margin"
                    style={{ width: '100%' }}
                  >
                    <InputNumber
                      min={0}
                      controls={false}
                      style={{ width: '100%', minWidth: 0 }}
                      title={(
                        form.getFieldValue([
                          'optional_product',
                          record.index,
                          'products',
                          record.index2,
                          'quantity',
                        ]) | 0
                      ).toLocaleString()}
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: '利益率',
              dataIndex: 'profit_margin',
              key: 'profit_margin',
              width: '6%',
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
              width: '8%',
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
              width: '5%',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }

                if (!record.isSelfCreate) {
                  return (
                    form.getFieldValue([
                      'optional_product',
                      record.index,
                      'products',
                      record.index2,
                      'tax_rate',
                    ]) + '%'
                  )
                }
                return (
                  <Form.Item
                    name={[record.index, 'products', record.index2, 'tax_rate']}
                    className="ant-form-item-hidden-margin"
                    rules={[
                      {
                        required: false,
                        message: '',
                      },
                    ]}
                  >
                    <Select options={DEFAULT_TAX_RATES} />
                  </Form.Item>
                )
              },
            },
            {
              title: '行編集',
              key: 'action',
              width: '12%',
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
                    ? ['onAppendFromMasterOrCreateNewAction', 'remove']
                    : ['onAppendFromMasterOrCreateNewAction']

                const handleAppend = () => {
                  if (isHeader) {
                    add(
                      {
                        group_name: '',
                        products: [
                          {
                            product_id: null,
                            package_id: null,
                            isSelfCreate: false,
                            name: '',
                            code: '',
                            quantity: 1,
                            cost_price: null,
                            selling_price: 1,
                            tax_rate: 0,
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
                const onAppendFromMasterOrCreateNewAction = (
                  type: CreateProductType,
                ) => {
                  const _isSelfCreate = type === 'create_new'
                  handleAddProduct(record.index, _isSelfCreate)
                }

                return (
                  <Action
                    actionList={actionList}
                    onAppendFromMasterOrCreateNewAction={
                      onAppendFromMasterOrCreateNewAction
                    }
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
                scroll={undefined}
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
    </div>
  )
}

export default OptionalInfo

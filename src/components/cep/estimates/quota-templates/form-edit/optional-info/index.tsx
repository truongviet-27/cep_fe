/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_TAX_RATES } from '@components/cep/estimates/quotas/utils'
import type { ActionType, CreateProductType } from '@components/common/action'
import { Action } from '@components/common/action'
import ProductSelect from '@components/common/product-select'
import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import type { QuotaCategoryEnum } from '@sdk/hey-api'
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
import { type FC, useEffect, useState } from 'react'

import type {
  TemplatePriceChange,
  TemplatePriceChangeParent,
} from '../../utils/price-changes'
import { ProductCategoryModal } from '../modal/product-category'
import PackageSelect from '../package-select'
import { useController } from './controller'

const { Title } = Typography

interface Props {
  confirmedCategory: QuotaCategoryEnum
  priceChanges?: TemplatePriceChange[]
  onProductChanged?: (
    parent: TemplatePriceChangeParent,
    oldProductId: number | null,
  ) => void
}

const OptionalInfo: FC<Props> = ({
  confirmedCategory,
  priceChanges,
  onProductChanged,
}) => {
  const t = useTranslate()
  const {
    form,
    optionalProducts,
    handleAddProduct,
    handleRemoveProduct,
    onChangeProductName,
  } = useController()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [categoryModalKey, setCategoryModalKey] = useState(0)

  useEffect(() => {
    if (isModalOpen) {
      form?.setFieldsValue({
        category_id: null,
        parent: undefined,
      } as Parameters<NonNullable<typeof form>['setFieldsValue']>[0])
    }
  }, [isModalOpen, form])

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
          const optionalProduct = form?.getFieldValue('optional_product') ?? []
          const dataSource: any[] = (optionalProduct ?? []).map(
            (item: any, index: number) => {
              if (item.kind === 'group') {
                return {
                  ...item,
                  index,
                  key: `header-optional-${index}`,
                  isHeader: true,
                  title: item.name,
                }
              }
              return {
                index,
                isSelfCreate: !item.product_id && item.name,
                ...item,
              }
            },
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
                        name={[record.index, 'name']}
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
                    'code',
                  ])
                }
                return (
                  <Form.Item
                    name={[record.index, 'code']}
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
                        pattern: /^[A-Za-z0-9_-]+$/,
                        message: '',
                      },
                      {
                        validator: async () => {
                          const allProducts =
                            form.getFieldValue('optional_product') || []
                          const currentCode = allProducts[record.index]?.code
                          if (
                            !currentCode ||
                            allProducts[record.index]?.kind === 'group'
                          ) {
                            return Promise.resolve()
                          }
                          const isDuplicate = allProducts.some(
                            (item: any, idx: number) =>
                              item.kind !== 'group' &&
                              item.code === currentCode &&
                              idx !== record.index,
                          )
                          if (isDuplicate) {
                            notification.error({
                              message: `${currentCode}${t('quotas.action.detail_info.duplicate_product_code')}`,
                              key: `${currentCode}-code-optional-product`,
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
                    'product_id',
                  ])

                  const defaultValue = productId
                    ? {
                        value: productId,
                        label: form.getFieldValue([
                          'optional_product',
                          record.index,
                          'name',
                        ]),
                      }
                    : null

                  return (
                    <ProductSelect
                      key={`optional-product-${record.index}-${confirmedCategory}`}
                      name={[record.index, 'product_id']}
                      filters={[
                        {
                          field: 'resource',
                          operator: 'eq',
                          value: confirmedCategory,
                        },
                      ]}
                      rules={[
                        {
                          required: false,
                          message: '',
                        },
                        {
                          validator: async () => {
                            const allProducts =
                              form.getFieldValue('optional_product') || []
                            const currentProductId =
                              allProducts[record.index]?.product_id
                            if (
                              !currentProductId ||
                              allProducts[record.index]?.kind === 'group'
                            ) {
                              return Promise.resolve()
                            }
                            let count = 0
                            for (const item of allProducts) {
                              if (
                                item?.kind !== 'group' &&
                                item?.product_id === currentProductId
                              ) {
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
                            return Promise.resolve()
                          },
                        },
                      ]}
                      defaultValue={defaultValue}
                      onChangeValue={(value: any) => {
                        onProductChanged?.('optional_product', productId)
                        onChangeProductName(value, record.index)
                      }}
                      allowClear={true}
                    />
                  )
                }
                return (
                  <Form.Item
                    name={[record.index, 'name']}
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
                          const allProducts =
                            form.getFieldValue('optional_product') || []
                          const currentName = allProducts[record.index]?.name
                          if (
                            !currentName ||
                            allProducts[record.index]?.kind === 'group'
                          ) {
                            return Promise.resolve()
                          }
                          const isDuplicate = allProducts.some(
                            (item: any, idx: number) =>
                              item.kind !== 'group' &&
                              item.name === currentName &&
                              idx !== record.index,
                          )
                          if (isDuplicate) {
                            notification.error({
                              message: `${currentName}${t('quotas.action.detail_info.duplicate_product_name')}`,
                              key: `${currentName}-name-optional-product`,
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
                      'unit',
                    ]) ??
                    form.getFieldValue([
                      'optional_product',
                      record.index,
                      'unit_name',
                    ])
                  )
                }
                return (
                  <Form.Item
                    name={[record.index, 'unit_name']}
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
              width: '8%',
              onHeaderCell: () => ({
                style: {
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: '1.2',
                },
              }),
              ellipsis: true,
              align: 'left',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }

                if (!record.isSelfCreate) {
                  const packageId = form.getFieldValue([
                    'optional_product',
                    record.index,
                    'package_id',
                  ])
                  const packagings =
                    form.getFieldValue([
                      'optional_product',
                      record.index,
                      'packagings',
                    ]) || []
                  const defaultValue = packageId
                    ? {
                        value: packageId,
                        label:
                          packagings.find((pkg: any) => pkg.id === packageId)
                            ?.name ||
                          form.getFieldValue([
                            'optional_product',
                            record.index,
                            'package_name',
                          ]),
                      }
                    : {
                        value: packagings[0]?.id,
                        label: packagings[0]?.name,
                      }

                  return (
                    <Form.Item
                      name={['optional_product', record.index, 'package_id']}
                      className="ant-form-item-hidden-margin"
                    >
                      <PackageSelect
                        key={
                          record.index +
                          '-' +
                          optionalProducts?.[record.index]?.product_id
                        }
                        productId={form.getFieldValue([
                          'optional_product',
                          record.index,
                          'product_id',
                        ])}
                        onChange={(value, option) => {
                          form.setFieldValue(
                            ['optional_product', record.index, 'package_id'],
                            value,
                          )

                          form.setFieldValue(
                            ['optional_product', record.index, 'selling_price'],
                            option.selling_price,
                          )
                        }}
                        defaultOptions={
                          optionalProducts?.[record.index]?.packagings ?? []
                        }
                        defaultValue={defaultValue}
                        style={{
                          maxWidth: '200px',
                          width: '100%',
                        }}
                      />
                    </Form.Item>
                  )
                }
                return (
                  <Form.Item
                    name={[record.index, 'package_name']}
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
              onCell: (record: any) => ({
                style: {
                  backgroundColor: priceChanges?.some(
                    (c) =>
                      c.parent === 'optional_product' &&
                      c.productId === record.product_id &&
                      c.field === 'cost_price',
                  )
                    ? '#FFF9C4'
                    : undefined,
                },
              }),
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                if (!record.isSelfCreate) {
                  if (
                    form.getFieldValue([
                      'optional_product',
                      record.index,
                      'cost_price',
                    ]) === null
                  ) {
                    return null
                  }
                  return (
                    form.getFieldValue([
                      'optional_product',
                      record.index,
                      'cost_price',
                    ]) | 0
                  ).toLocaleString()
                }
                return (
                  <Form.Item
                    name={[record.index, 'cost_price']}
                    className="ant-form-item-hidden-margin"
                  >
                    <InputNumber
                      title={(
                        form.getFieldValue([
                          'optional_product',
                          record.index,
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
                const isPriceChanged = priceChanges?.some(
                  (c) =>
                    c.parent === 'optional_product' &&
                    c.productId === record.product_id &&
                    c.field === 'selling_price',
                )
                return (
                  <Form.Item
                    rules={[
                      {
                        validator(_, value) {
                          const name = form.getFieldValue([
                            'optional_product',
                            record.index,
                            'name',
                          ])

                          if (name && !value) {
                            return Promise.reject()
                          }

                          return Promise.resolve()
                        },
                      },
                    ]}
                    name={[record.index, 'selling_price']}
                    className="ant-form-item-hidden-margin"
                    style={{ width: '100%' }}
                  >
                    <InputNumber
                      className="quota-template-number-input-right"
                      min={0}
                      controls={false}
                      style={{
                        width: '100%',
                        minWidth: 0,
                        backgroundColor: isPriceChanged ? '#FFF9C4' : undefined,
                      }}
                      title={(
                        form.getFieldValue([
                          'optional_product',
                          record.index,
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
                            'name',
                          ])

                          if (name && !value) {
                            return Promise.reject()
                          }

                          return Promise.resolve()
                        },
                      },
                    ]}
                    name={[record.index, 'quantity']}
                    className="ant-form-item-hidden-margin"
                    style={{ width: '100%' }}
                  >
                    <InputNumber
                      className="quota-template-number-input-right"
                      min={0}
                      controls={false}
                      style={{ width: '100%', minWidth: 0 }}
                      title={(
                        form.getFieldValue([
                          'optional_product',
                          record.index,
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
                    'cost_price',
                  ]) === null
                ) {
                  form.setFieldValue(
                    ['optional_product', record.index, 'profit_margin'],
                    0,
                  )
                  return '0%'
                }
                const cost =
                  form.getFieldValue([
                    'optional_product',
                    record.index,
                    'cost_price',
                  ]) || 0

                const selling =
                  form.getFieldValue([
                    'optional_product',
                    record.index,
                    'selling_price',
                  ]) || 0

                form.setFieldValue(
                  ['optional_product', record.index, 'profit_margin'],
                  (selling > 0
                    ? ((selling - cost) / selling) * 100
                    : 0
                  ).toFixed(2),
                )
                return `${Number(selling > 0 ? ((selling - cost) / selling) * 100 : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
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
                    'quantity',
                  ]) || 0

                const selling =
                  form.getFieldValue([
                    'optional_product',
                    record.index,
                    'selling_price',
                  ]) || 0
                return (quantity * selling).toLocaleString()
              },
            },
            {
              title: t('quotas.action.detail_info.table.tax_rate'),
              dataIndex: 'tax_rate',
              key: 'tax_rate',
              width: '7%',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }

                if (!record.isSelfCreate) {
                  return (
                    form.getFieldValue([
                      'optional_product',
                      record.index,
                      'tax_rate',
                    ]) + '%'
                  )
                }
                return (
                  <Form.Item
                    name={[record.index, 'tax_rate']}
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
              render: (_, record, index) => {
                const isHeader = record.isHeader
                const isFirstRow = index === 0
                const optionalProduct =
                  form.getFieldValue('optional_product') || []

                const actionList: ActionType[] = []
                if (isHeader) {
                  actionList.push('append')
                  actionList.push('remove')
                } else {
                  actionList.push('onAppendFromMasterOrCreateNewAction')
                  if (
                    optionalProduct?.[index - 1]?.kind === 'product' ||
                    optionalProduct?.[index + 1]?.kind === 'product'
                  ) {
                    actionList.push('remove')
                  }
                }

                const handleAppend = () => {
                  const nextHeaderIndex = optionalProduct.findIndex(
                    (item: any, i: number) =>
                      i > index && item.kind === 'group',
                  )
                  const insertAt =
                    nextHeaderIndex === -1
                      ? optionalProduct.length
                      : nextHeaderIndex
                  if (isHeader) {
                    add(
                      {
                        name: '',
                        kind: 'group',
                        isHeader: true,
                        quantity: 1,
                      },
                      insertAt,
                    )
                    add(
                      {
                        product_id: null,
                        package_id: null,
                        name: '',
                        code: '',
                        isSelfCreate: false,
                        quantity: 0,
                        cost_price: 0,
                        selling_price: 0,
                        profit_margin: 0,
                        tax_rate: 10,
                        is_add_total: true,
                        kind: 'product',
                      },
                      insertAt + 1,
                    )
                  } else {
                    handleAddProduct(record.index)
                  }
                }

                const onAppendFromMasterOrCreateNewAction = (
                  type: CreateProductType,
                ) => {
                  handleAddProduct(index, type === 'create_new')
                }

                const handleRemove = () => {
                  if (isFirstRow && isHeader) {
                    const newData = [...optionalProduct]
                    newData[0] = {
                      ...newData[0],
                      name: '',
                      title: '',
                    }
                    form.setFieldValue('optional_product', newData)
                  } else {
                    if (isHeader) {
                      remove(index)
                    } else {
                      handleRemoveProduct(index)
                    }
                  }
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

          const numericColumnKeys = new Set([
            'cost_price',
            'selling_price',
            'quantity',
            'profit_margin',
            'sellingAmount',
            'tax_rate',
          ])
          const centerColumnKeys = new Set(['action'])
          const normalizedColumns: ColumnsType = columns.map((column) => {
            const originalOnHeaderCell = column.onHeaderCell
            return {
              ...column,
              onHeaderCell: (col: any) => {
                const originalHeaderCell =
                  originalOnHeaderCell?.(col) ?? ({} as any)
                return {
                  ...originalHeaderCell,
                  style: {
                    ...(originalHeaderCell as any).style,
                    textAlign: 'center',
                  },
                }
              },
              align: centerColumnKeys.has(String(column.key))
                ? 'center'
                : numericColumnKeys.has(String(column.key))
                  ? 'right'
                  : 'left',
            }
          })

          return (
            <Flex vertical>
              <Flex
                justify="end"
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    setCategoryModalKey((k) => k + 1)
                    setIsModalOpen(true)
                  }}
                >
                  カテゴリから入力
                </Button>
              </Flex>
              <CommonTable
                columns={normalizedColumns}
                dataSource={dataSource}
                rowClassName={(record) =>
                  record.isHeader ? 'bg-[#E6F7FF] font-bold' : ''
                }
                pagination={false}
                scroll={undefined}
              />
              <style jsx global>{`
                .quota-template-number-input-right .ant-input-number-input {
                  text-align: right !important;
                }
              `}</style>
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
          key={categoryModalKey}
          name="optional_product"
          close={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default OptionalInfo

/* eslint-disable @typescript-eslint/no-explicit-any */

import { DEFAULT_TAX_RATES } from '@components/cep/estimates/quotas/utils'
import type { ActionType, CreateProductType } from '@components/common/action'
import { Action } from '@components/common/action'
import ProductSelect from '@components/common/product-select'
import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import { calculateTax } from '@shared/tax/tax.utils'
import { PRIMARY } from '@utility/color'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { ProductCategoryModal } from '../modal/product-category'
import PackageSelect from '../package-select'
import { useController } from './controller'

const { Title, Text } = Typography

const DetailInfo: FC = () => {
  const {
    form,
    mainProducts,
    totalPriceWatch,
    costTotal,
    sellTotalWithTax,
    profitRate,
    handleAddProduct,
    handleRemoveProduct,
    onChangeProductName,
  } = useController()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [categoryModalKey, setCategoryModalKey] = useState(0)
  const taxRoundingMethodWatch = Form.useWatch('tax_rounding_method', form)

  useEffect(() => {
    if (isModalOpen) {
      form?.setFieldsValue({
        category_id: null,
        parent: undefined,
      } as Parameters<NonNullable<typeof form>['setFieldsValue']>[0])
    }
  }, [isModalOpen, form])

  const t = useTranslate()

  const mainProduct = form?.getFieldValue('main_product') ?? []
  const dataSource: any[] = (mainProduct ?? []).map(
    (item: any, index: number) => {
      if (item.kind === 'group') {
        return {
          ...item,
          index,
          key: `header-main-${index}`,
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
  const calculateGroupedTotal = (data: any) => {
    const totalByTaxRate = data.reduce((acc: any, item: any) => {
      if (item.isHeader || !item.is_add_total) {
        return acc
      }
      const sellingPrice = parseFloat(item.selling_price || 0)
      const quantity = parseFloat(item.quantity || 0)
      const taxRate = parseFloat(item.tax_rate || 0)
      const sellingAmount = sellingPrice * quantity
      const key = String(taxRate)

      // Group selling amounts by tax rate
      if (!acc[key]) {
        acc[key] = { sellingTotal: 0, taxRate }
      }
      acc[key].sellingTotal += sellingAmount

      return acc
    }, {})

    return Object.entries(totalByTaxRate).map(
      ([taxRateKey, group]: [string, any]) => {
        const rawTax = (group.sellingTotal * group.taxRate) / 100
        const roundedTax = calculateTax(rawTax, taxRoundingMethodWatch)
        return {
          taxRate: parseFloat(taxRateKey),
          total: roundedTax.toString(),
        }
      },
    )
  }

  const groupedTotals = useMemo(() => {
    const taxRate = calculateGroupedTotal(dataSource)
    form.setFieldValue('tax_rate_group', taxRate)
    return taxRate
  }, [dataSource, taxRoundingMethodWatch])

  return (
    <div style={{ marginBottom: 32 }}>
      <Title
        level={5}
        style={{ color: PRIMARY }}
        className="!mb-2 border-b-1 border-gray-200 pb-2 text-[14px]"
      >
        {t('quota_templates.form.titleDetailInfo')}
      </Title>

      <Form.Item name={'tax_rate_group'} hidden></Form.Item>
      <Form.List name={'main_product'}>
        {(_, { add, remove }) => {
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
                    'main_product',
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
                        required: true,
                        message: '',
                      },
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
                            form.getFieldValue('main_product') || []
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
                              key: `${currentCode}-code-main-product`,
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
                        'main_product',
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
              width: '18%',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }

                if (!record.isSelfCreate) {
                  const productId = form.getFieldValue([
                    'main_product',
                    record.index,
                    'product_id',
                  ])

                  const defaultValue = productId
                    ? {
                        value: productId,
                        label: form.getFieldValue([
                          'main_product',
                          record.index,
                          'name',
                        ]),
                      }
                    : null

                  return (
                    <ProductSelect
                      name={[record.index, 'product_id']}
                      rules={[
                        {
                          required: true,
                          message: '',
                        },
                        {
                          validator: async () => {
                            const allProducts =
                              form.getFieldValue('main_product') || []
                            const currentProductId =
                              allProducts[record.index]?.product_id
                            if (!currentProductId) return Promise.resolve()
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
                                  key: `name-main-product`,
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
                      onChangeValue={(value: any) =>
                        onChangeProductName(value, record.index)
                      }
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
                        required: true,
                        message: '',
                      },
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
                            form.getFieldValue('main_product') || []
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
                              key: `${currentName}-name-main-product`,
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
                        'main_product',
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
                      'main_product',
                      record.index,
                      'unit',
                    ]) ??
                    form.getFieldValue([
                      'main_product',
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
                        'main_product',
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
              align: 'left',
              onHeaderCell: () => ({
                style: {
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: '1.2',
                },
              }),
              ellipsis: true,
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }

                if (!record.isSelfCreate) {
                  const packageId = form.getFieldValue([
                    'main_product',
                    record.index,
                    'package_id',
                  ])
                  const packagings =
                    form.getFieldValue([
                      'main_product',
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
                            'main_product',
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
                      name={['main_product', record.index, 'package_id']}
                      className="ant-form-item-hidden-margin"
                    >
                      <PackageSelect
                        key={
                          record.index +
                          '-' +
                          mainProducts?.[record.index]?.product_id
                        }
                        productId={form.getFieldValue([
                          'main_product',
                          record.index,
                          'product_id',
                        ])}
                        onChange={(value, option) => {
                          form.setFieldValue(
                            ['main_product', record.index, 'package_id'],
                            value,
                          )

                          form.setFieldValue(
                            ['main_product', record.index, 'selling_price'],
                            option?.selling_price,
                          )
                        }}
                        defaultOptions={
                          mainProducts?.[record.index]?.packagings ?? []
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
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                if (!record.isSelfCreate) {
                  if (
                    form.getFieldValue([
                      'main_product',
                      record.index,
                      'cost_price',
                    ]) === null
                  ) {
                    return null
                  }
                  return form
                    .getFieldValue(['main_product', record.index, 'cost_price'])
                    .toLocaleString()
                }
                return (
                  <Form.Item
                    name={[record.index, 'cost_price']}
                    className="ant-form-item-hidden-margin"
                  >
                    <InputNumber
                      title={(
                        form.getFieldValue([
                          'main_product',
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
                return (
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      style={{ width: '100%', minWidth: 0 }}
                      title={(
                        form.getFieldValue([
                          'main_product',
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
                        required: true,
                        message: '',
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
                          'main_product',
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
                    'main_product',
                    record.index,

                    'cost_price',
                  ]) === null
                ) {
                  form.setFieldValue(
                    ['main_product', record.index, 'profit_margin'],
                    0,
                  )
                  return '0%'
                }
                const cost =
                  form.getFieldValue([
                    'main_product',
                    record.index,

                    'cost_price',
                  ]) || 0

                const selling =
                  form.getFieldValue([
                    'main_product',
                    record.index,

                    'selling_price',
                  ]) || 0

                form.setFieldValue(
                  ['main_product', record.index, 'profit_margin'],
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
                    'main_product',
                    record.index,

                    'quantity',
                  ]) || 0

                const selling =
                  form.getFieldValue([
                    'main_product',
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
                      'main_product',
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
              title: '合計計算',
              dataIndex: 'is_add_total',
              key: 'is_add_total',
              width: '6%',
              align: 'center',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Form.Item
                      name={[record.index, 'is_add_total']}
                      className="ant-form-item-hidden-margin"
                      valuePropName="checked"
                    >
                      <Checkbox
                        style={{
                          transform: 'scale(1.3)',
                          marginBottom: 0,
                        }}
                        defaultChecked={form.getFieldValue([
                          'main_product',
                          record.index,
                          'is_add_total',
                        ])}
                      />
                    </Form.Item>
                  </div>
                )
              },
            },
            {
              title: '行編集',
              key: 'action',
              width: '10%',
              render: (_, record, index) => {
                const isHeader = record.isHeader
                const mainProduct = form.getFieldValue('main_product') || []
                const isFirstRow = index === 0

                const actionList: ActionType[] = []
                if (isHeader) {
                  actionList.push('append')
                  actionList.push('remove')
                } else {
                  actionList.push('onAppendFromMasterOrCreateNewAction')
                  if (
                    mainProduct?.[index - 1]?.kind === 'product' ||
                    mainProduct?.[index + 1]?.kind === 'product'
                  ) {
                    actionList.push('remove')
                  }
                }

                const handleAppend = () => {
                  const nextHeaderIndex = mainProduct.findIndex(
                    (item: any, i: number) =>
                      i > index && item.kind === 'group',
                  )
                  const insertAt =
                    nextHeaderIndex === -1
                      ? mainProduct.length
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
                    const newData = [...mainProduct]
                    newData[0] = {
                      ...newData[0],
                      name: '',
                      title: '',
                    }
                    form.setFieldValue('main_product', newData)
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
          const centerColumnKeys = new Set(['action', 'is_add_total'])
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
                  marginTop: 10,
                  marginBottom: 10,
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
                summary={() => {
                  return (
                    <Table.Summary.Row
                      style={{
                        background: '#F0F9FF',
                        color: PRIMARY,
                        fontWeight: 700,
                      }}
                    >
                      <Table.Summary.Cell index={0} colSpan={8} align="center">
                        小計
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="center">
                        {totalPriceWatch?.toLocaleString()}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={2}
                        colSpan={3}
                      ></Table.Summary.Cell>
                    </Table.Summary.Row>
                  )
                }}
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
      <Card bordered={false}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    border: '1px solid #f0f0f0',
                    borderRadius: 6,
                    background: '#F8F9FA',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {t('quotas.action.detail_info.summary.cost_total')}
                  </Text>
                  <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                    ¥{Number(costTotal).toLocaleString() || 0}
                  </Text>
                  <Form.Item name="total_price" hidden>
                    <InputNumber />
                  </Form.Item>
                </div>
              </Col>

              <Col span={24}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    border: '1px solid #f0f0f0',
                    borderRadius: 6,
                    background: '#F8F9FA',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {t('quotas.action.detail_info.summary.total_profit_margin')}
                  </Text>
                  <Text style={{ color: '#1890ff', fontWeight: 'bold' }}>
                    {Number(profitRate).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    }) || 0}
                    %
                  </Text>
                  <Form.Item name="total_profit_margin" hidden>
                    <InputNumber />
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row gutter={[16, 16]}>
              {groupedTotals.map((item, index) => (
                <Col span={24} key={index}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      border: '1px solid #f0f0f0',
                      borderRadius: 6,
                      background: '#F8F9FA',
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 700,
                      }}
                    >
                      {`${t('quotas.action.detail_info.summary.tax_amount')} (${item.taxRate}%)`}
                    </Text>
                    <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                      ¥{Number(item.total).toLocaleString()}
                    </Text>
                  </div>
                </Col>
              ))}
              <Col span={24}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    border: '1px solid #f0f0f0',
                    borderRadius: 6,
                    background: '#F8F9FA',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {t('quotas.action.detail_info.summary.total_amount')}（
                    {t('quotas.action.detail_info.summary.tax_inclusive')}）
                  </Text>
                  <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                    ¥{Number(sellTotalWithTax).toLocaleString() || 0}
                  </Text>
                  <Form.Item name="total_price_tax_included" hidden>
                    <InputNumber />
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
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
          name="main_product"
          close={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default DetailInfo

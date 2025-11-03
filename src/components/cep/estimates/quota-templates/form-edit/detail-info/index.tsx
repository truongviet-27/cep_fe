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
  Card,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import { type FC, useMemo, useState } from 'react'

import { ProductCategoryModal } from '../modal/product-category'
import PackageSelect from '../package-select'
import { useController } from './controller'

const { Title, Text } = Typography

const DetailInfo: FC = () => {
  const {
    form,
    mainProducts,
    totalPriceWatch,
    taxTotal,
    costTotal,
    sellTotalWithTax,
    handleAddProduct,
    handleRemoveProduct,
    onChangeProductName,
  } = useController()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const t = useTranslate()

  const mainProduct = (form?.getFieldValue('main_product') ??
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
  const calculateGroupedTotal = (data: any) => {
    const totalByTaxRate = data.reduce((acc: any, item: any) => {
      if (item.isHeader || !item.is_add_total) {
        return acc
      }
      const sellingPrice = parseFloat(item.selling_price || 0)
      const quantity = parseFloat(item.quantity || 0)
      const taxRate = parseFloat(item.tax_rate || 0)
      const calculatedValue = (sellingPrice * quantity * taxRate) / 100
      const key = String(taxRate)
      acc[key] = (acc[key] || 0) + calculatedValue

      return acc
    }, {})

    return Object.entries(totalByTaxRate).map(([taxRate, total]) => ({
      taxRate: parseFloat(taxRate),
      total: (total as number).toFixed(2),
    }))
  }

  const groupedTotals = useMemo(() => {
    return calculateGroupedTotal(dataSource)
  }, [dataSource])

  return (
    <>
      <Title
        level={5}
        style={{ color: PRIMARY }}
        className="!mb-2 border-b-1 border-gray-200 pb-2 text-[14px]"
      >
        {t('quota_templates.form.titleDetailInfo')}
      </Title>
      <Form.List name={'main_product'}>
        {(_, { add, remove }) => {
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
                        required
                        rules={[
                          {
                            required: true,
                            message: '',
                          },
                        ]}
                      >
                        <Input
                          placeholder="商品リスト名入力"
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
                  'main_product',
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
                  'main_product',
                  record.index,
                  'products',
                  record.index2,
                  'product_id',
                ])

                const defaultValue = productId
                  ? {
                      value: productId,
                      label: form.getFieldValue([
                        'main_product',
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
                    required
                    rules={[
                      {
                        required: true,
                        message: '',
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
                    'main_product',
                    record.index,
                    'products',
                    record.index2,
                    'unit',
                  ]) ??
                  form.getFieldValue([
                    'main_product',
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
                  'main_product',
                  record.index,
                  'products',
                  record.index2,
                  'package_id',
                ])

                const defaultValue = packageId
                  ? {
                      value: packageId,
                      label: form.getFieldValue([
                        'main_product',
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
                      'main_product',
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
                        mainProducts?.[record.index]?.products?.[record.index2]
                          .product_id
                      }
                      productId={form.getFieldValue([
                        'main_product',
                        record.index,
                        'products',
                        record.index2,
                        'product_id',
                      ])}
                      onChange={(value, option) => {
                        form.setFieldValue(
                          [
                            'main_product',
                            record.index,
                            'products',
                            record.index2,
                            'package_id',
                          ],
                          value,
                        )

                        form.setFieldValue(
                          [
                            'main_product',
                            record.index,
                            'products',
                            record.index2,
                            'selling_price',
                          ],
                          option.selling_price,
                        )
                      }}
                      defaultOptions={
                        mainProducts?.[record.index]?.products?.[record.index2]
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
                return form
                  .getFieldValue([
                    'main_product',
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
                const cost =
                  form.getFieldValue([
                    'main_product',
                    record.index,
                    'products',
                    record.index2,
                    'cost_price',
                  ]) || 0

                const selling =
                  form.getFieldValue([
                    'main_product',
                    record.index,
                    'products',
                    record.index2,
                    'selling_price',
                  ]) || 0

                form.setFieldValue(
                  [
                    'main_product',
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
                    'main_product',
                    record.index,
                    'products',
                    record.index2,
                    'quantity',
                  ]) || 0

                const selling =
                  form.getFieldValue([
                    'main_product',
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
                    'main_product',
                    record.index,
                    'products',
                    record.index2,
                    'tax_rate',
                  ]) + '%'
                )
              },
            },
            {
              title: '合計計算',
              dataIndex: 'is_add_total',
              key: 'is_add_total',
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
                      'is_add_total',
                    ]}
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
                        'products',
                        record.index2,
                        'is_add_total',
                      ])}
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: '行編集',
              key: 'action',
              render: (_, record) => {
                const isHeader = record.isHeader

                const lengthOriginalProduct =
                  form.getFieldValue('main_product').length > 1
                const lengthProduct =
                  form.getFieldValue(['main_product', record.index, 'products'])
                    .length > 1

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
                            cost_price: 0,
                            selling_price: 0,
                            profit_margin: 0,
                            tax_rate: 0,
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
                    ¥{costTotal || 0}
                  </Text>
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
                    {t('quotas.action.detail_info.summary.tax_amount')}
                  </Text>
                  <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                    ¥{(taxTotal || 0).toLocaleString()}
                  </Text>
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
                      {`${t('quotas.action.detail_info.summary.total_profit_margin')} (${item.taxRate}%)`}
                    </Text>
                    <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                      ¥{item.total}
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
                    ¥{sellTotalWithTax || 0}
                  </Text>
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
          name="main_product"
          close={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  )
}

export default DetailInfo

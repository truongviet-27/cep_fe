/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CoreAutoComplete from '@components/cep/estimates/quotas/action/components/auto-complete'
import { Action, type ActionType } from '@components/common/action'
import CommonTable from '@components/common/table'
import { useSelect } from '@refinedev/antd'
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
  Row,
  Select,
  Typography,
} from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import { useState } from 'react'

const { Text } = Typography

function DetailInfo() {
  const form = Form.useFormInstance()

  const [costPrice, setCostPrice] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  const { selectProps: selectPropsProduct, query } = useSelect({
    resource: 'products',
    optionLabel: 'name',
    optionValue: 'id',
    onSearch(value) {
      return [
        {
          field: 'name',
          operator: 'contains',
          value,
        },
      ]
    },
  })

  const handleAddProduct = (groupIndex: number) => {
    const values = form?.getFieldValue('main_product') || []
    const products = values[groupIndex].products || []

    values[groupIndex].products = [...products, {}]

    form.setFieldsValue({ main_product: values })
  }

  const handleRemoveProduct = (groupIndex: number, productIndex: number) => {
    const values = form.getFieldValue('main_product') || []
    const products = values[groupIndex].products || []

    values[groupIndex].products = products.filter(
      (_: any, idx: number) => idx !== productIndex,
    )

    form.setFieldsValue({ main_product: values })
  }

  return (
    <Card
      title={'詳細情報'}
      headStyle={{
        padding: 0,
        minHeight: 0,
      }}
      bodyStyle={{
        padding: 0,
      }}
      style={{
        border: 'none',
        marginTop: 40,
      }}
    >
      <Form.List name={'main_product'}>
        {(_, { add, remove }) => {
          const dataSource: any[] = (
            form?.getFieldValue('main_product') ?? []
          ).flatMap((item: any, index: number) => [
            {
              index,
              key: `header-${index}`,
              isHeader: true,
              title: item.group_name,
            },
            ...(item.products ?? []).flatMap((item2: any, index2: number) => [
              {
                index,
                index2,
                ...item2,
              },
            ]),
          ])

          const columns: ColumnsType = [
            {
              title: '商品コード',
              dataIndex: 'code',
              key: 'code',
              align: 'left',
              render: (_, record) => {
                if (record.isHeader) {
                  return {
                    children: (
                      <Form.Item
                        name={[record.index, 'group_name']}
                        style={{
                          marginBottom: 0,
                        }}
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

                return (
                  <Form.Item
                    name={[
                      record.index,
                      'products',
                      record.index2,
                      'product_id',
                    ]}
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Select
                      placeholder="商品名・サービス名で検索"
                      allowClear
                      showSearch
                      filterOption={false}
                      style={{
                        width: 200,
                      }}
                      {...selectPropsProduct}
                      onChange={(value) => {
                        const item: any = query.data?.data.find(
                          (item: any) => item.id === value,
                        )
                        form.setFieldValue(
                          [
                            record.index,
                            'products',
                            record.index2,
                            'package_id',
                          ],
                          null,
                        )
                        form.setFieldValue(
                          [
                            'main_product',
                            record.index,
                            'products',
                            record.index2,
                            'name',
                          ],
                          item?.name,
                        )
                        form.setFieldValue(
                          [
                            'main_product',
                            record.index,
                            'products',
                            record.index2,
                            'code',
                          ],
                          item?.code,
                        )
                      }}
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
                return form.getFieldValue([
                  'main_product',
                  record.index,
                  'products',
                  record.index2,
                  'unit',
                ])
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
                return (
                  <Form.Item
                    name={[
                      record.index,
                      'products',
                      record.index2,
                      'package_id',
                    ]}
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <CoreAutoComplete
                      filterPath1={[
                        'main_product',
                        record.index,
                        'products',
                        record.index2,
                        'product_id',
                      ]}
                      index={record.index}
                      index2={record.index2}
                      filterPath2={['customer']}
                      resource={`products`}
                      style={{ width: 200 }}
                      parent="main_product"
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
                return form.getFieldValue([
                  'main_product',
                  record.index,
                  'products',
                  record.index2,
                  'cost_price',
                ])
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
                    style={{
                      marginBottom: 0,
                    }}
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
                    style={{
                      marginBottom: 0,
                    }}
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

                return selling > 0 ? ((selling - cost) / selling) * 100 : 0
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
                return quantity * selling
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
                    style={{
                      marginBottom: 0,
                    }}
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
                      onChange={() => {
                        const totalCostPrice = (
                          form.getFieldValue('main_product') ?? []
                        ).reduce((accGroup: any, group: any) => {
                          const groupTotal = group.products.reduce(
                            (accProd: any, prod: any) => {
                              if (prod.is_add_total) {
                                return (
                                  accProd +
                                  (prod.selling_price || 0) *
                                    (prod.quantity || 0)
                                )
                              }
                            },
                            0,
                          )
                          return accGroup + groupTotal
                        }, 0)

                        setCostPrice(totalCostPrice)
                      }}
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
                        products: [{}],
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
                <Button type="primary">カテゴリから入力</Button>
              </Flex>
              <CommonTable
                columns={columns}
                dataSource={dataSource}
                rowClassName={(record) =>
                  record.isHeader ? 'bg-[#E6F7FF] font-bold' : ''
                }
                pagination={false}
                summary={() => {
                  const total = (
                    form.getFieldValue('main_product') ?? []
                  ).reduce((accGroup: any, group: any) => {
                    const groupTotal = group.products.reduce(
                      (accProd: any, prod: any) => {
                        if (prod.is_add_total) {
                          return (
                            accProd +
                            (prod.selling_price || 0) * (prod.quantity || 0)
                          )
                        }
                      },
                      0,
                    )
                    return accGroup + groupTotal
                  }, 0)
                  console.log(total, 'total')
                  return (
                    <Table.Summary.Row
                      style={{
                        background: '#F0F9FF',
                        color: PRIMARY,
                        fontWeight: 700,
                      }}
                    >
                      <Table.Summary.Cell index={0} colSpan={3} align="center">
                        小計
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}></Table.Summary.Cell>
                      <Table.Summary.Cell index={2}></Table.Summary.Cell>
                      <Table.Summary.Cell index={3}></Table.Summary.Cell>
                      <Table.Summary.Cell index={4}></Table.Summary.Cell>
                      <Table.Summary.Cell index={5}></Table.Summary.Cell>
                      <Table.Summary.Cell index={6} align="center">
                        {total}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7}></Table.Summary.Cell>
                      <Table.Summary.Cell index={8}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  )
                }}
              />

              <Card bordered={false}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
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
                        原価合計
                      </Text>
                      <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                        {costPrice}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
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
                        消費税金額（{form.getFieldValue('tax_rate')}%）
                      </Text>
                      <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                        {0}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
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
                        合計利益率
                      </Text>
                      <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                        {totalProfit}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
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
                        合計金額（税込）
                      </Text>
                      <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                        {totalPrice}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Flex>
          )
        }}
      </Form.List>
    </Card>
  )
}

export default DetailInfo

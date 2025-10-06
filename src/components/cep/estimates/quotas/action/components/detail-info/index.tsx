/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CoreAutoComplete from '@components/cep/estimates/quotas/action/components/auto-complete'
import { ProductCategoryModal } from '@components/cep/estimates/quotas/action/components/modal/product-category'
import { TaxRoundingMethod } from '@components/cep/estimates/quotas/enum'
import { Action, type ActionType } from '@components/common/action'
import CommonTable from '@components/common/table'
import { useModalForm, useSelect } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
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
  Select,
  Typography,
} from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import { useEffect, useState } from 'react'

const { Text } = Typography

function DetailInfo() {
  const t = useTranslate()
  const form = Form.useFormInstance()

  const mainProductWatch = Form.useWatch('main_product', form)
  const taxRateWatch = Form.useWatch('tax_rate', form)
  const taxRoundingMethodWatch = Form.useWatch('tax_rounding_method', form)
  const consumptionTaxWatch = Form.useWatch('consumption_tax', form)

  const [costTotal, setCostTotal] = useState(0)
  const [profitRate, setProfitRate] = useState(0)
  const [taxTotal, setTaxTotal] = useState(0)
  const [sellTotalWithTax, setSellTotalWithTax] = useState(0)

  const calculateSummary = (main_product_groups: any[], tax_rate: number) => {
    let costTotal = 0
    let sellTotal = 0

    ;(main_product_groups ?? []).forEach((group: any) => {
      ;(group.products ?? []).forEach((product: any) => {
        if (product.is_add_total) {
          costTotal += (product.cost_price || 0) * (product.quantity || 0)
          sellTotal += (product.selling_price || 0) * (product.quantity || 0)
        }
      })
    })

    let taxTotal = 0
    let sellTotalWithTax = 0
    if (consumptionTaxWatch === 'inclusive') {
      if (taxRoundingMethodWatch === TaxRoundingMethod.RoundDown) {
        taxTotal = Math.floor(sellTotal - sellTotal / 1.1)
      } else if (taxRoundingMethodWatch === TaxRoundingMethod.RoundUp) {
        taxTotal = Math.ceil(sellTotal - sellTotal / 1.1)
      } else {
        taxTotal = Number((sellTotal - sellTotal / 1.1).toFixed(0))
      }
    } else {
      if (taxRoundingMethodWatch === TaxRoundingMethod.RoundDown) {
        taxTotal = Math.floor((sellTotal * tax_rate) / 100)
      } else if (taxRoundingMethodWatch === TaxRoundingMethod.RoundUp) {
        taxTotal = Math.ceil((sellTotal * tax_rate) / 100)
      } else {
        taxTotal = Number(((sellTotal * tax_rate) / 100).toFixed(0))
      }
    }

    if (consumptionTaxWatch === 'exclusive') {
      sellTotalWithTax = sellTotal + taxTotal
    } else {
      sellTotalWithTax = sellTotal
    }
    const profitRate =
      costTotal > 0 ? ((sellTotal - costTotal) / sellTotal) * 100 : 0

    setCostTotal(costTotal)
    setTaxTotal(taxTotal)
    setProfitRate(profitRate)
    setSellTotalWithTax(sellTotalWithTax)
  }

  useEffect(() => {
    form.setFieldValue('total_cost', costTotal)
    form.setFieldValue('consumption_tax_amount', taxTotal)
    form.setFieldValue('total_profit_margin', profitRate)
    form.setFieldValue('total_price_tax_included', sellTotalWithTax)
  }, [costTotal, profitRate, taxTotal, sellTotalWithTax])

  useEffect(() => {
    calculateSummary(
      form.getFieldValue('main_product'),
      form.getFieldValue('tax_rate'),
    )
  }, [taxRateWatch, mainProductWatch, consumptionTaxWatch])

  const { selectProps: selectPropsProduct, query } = useSelect({
    resource: 'products',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: {
      mode: 'server',
      pageSize: 100,
    },
    onSearch(value) {
      return [
        {
          field: 'q',
          operator: 'eq',
          value,
        },
      ]
    },
  })

  const handleAddProduct = (groupIndex: number) => {
    const values = form?.getFieldValue('main_product') || []
    const products = values[groupIndex].products || []

    values[groupIndex].products = [
      ...products,
      {
        product_id: null,
        package_id: null,
        name: '',
        code: '自動採番',
        quantity: 0,
        cost_price: 0,
        selling_price: 0,
        profit_margin: 0,
        is_add_total: true,
      },
    ]

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

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClose = () => {
    setIsModalOpen(false)
  }

  return (
    <Card
      title={boldText('詳細情報', PRIMARY, 16)}
      style={{
        border: 'none',
        marginTop: 40,
      }}
      styles={{
        body: { padding: 0 },
        header: { padding: 0, minHeight: 0 },
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
              width: 200,
              render: (_, record) => {
                if (record.isHeader) {
                  return {
                    children: (
                      <Form.Item
                        name={[record.index, 'group_name']}
                        style={{
                          marginBottom: 0,
                        }}
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
                            'main_product',
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
                        form.setFieldValue(
                          [
                            'main_product',
                            record.index,
                            'products',
                            record.index2,
                            'unit',
                          ],
                          item?.unit,
                        )
                        form.setFieldValue(
                          [
                            'main_product',
                            record.index,
                            'products',
                            record.index2,
                            'cost_price',
                          ],
                          item?.cost_price,
                        )
                        form.setFieldValue(
                          [
                            'main_product',
                            record.index,
                            'products',
                            record.index2,
                            'selling_price',
                          ],
                          item?.sale_price,
                        )
                        form.setFieldValue(
                          [
                            'main_product',
                            record.index,
                            'products',
                            record.index2,
                            'quantity',
                          ],
                          1,
                        )

                        if (!value) {
                          form.setFieldValue(
                            [
                              'main_product',
                              record.index,
                              'products',
                              record.index2,
                              'quantity',
                            ],
                            0,
                          )
                        }
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
                      // onChange={() => {
                      //   // form.setFieldValue(
                      //   //   [
                      //   //     'main_product',
                      //   //     record.index,
                      //   //     'products',
                      //   //     record.index2,
                      //   //     'cost_price',
                      //   //   ],
                      //   //   item?.cost_price,
                      //   // )
                      //   // form.setFieldValue(
                      //   //   [
                      //   //     'main_product',
                      //   //     record.index,
                      //   //     'products',
                      //   //     record.index2,
                      //   //     'selling_price',
                      //   //   ],
                      //   //   item?.sale_price,
                      //   // )
                      // }}
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
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
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
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <InputNumber min={1} precision={0} controls={false} />
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
                  Number(
                    (selling > 0
                      ? ((selling - cost) / selling) * 100
                      : 0
                    ).toFixed(2),
                  ),
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
                        calculateSummary(
                          form.getFieldValue('main_product'),
                          form.getFieldValue('tax_rate'),
                        )
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
                        group_name: 'エアロン利用料',
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
                            is_add_total: true,
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
                  const total = (
                    form.getFieldValue('main_product') ?? []
                  ).reduce((accGroup: number, group: any) => {
                    const groupTotal = (group.products ?? []).reduce(
                      (accProd: number, prod: any) => {
                        if (prod.is_add_total) {
                          return (
                            accProd +
                            (prod.selling_price || 0) * (prod.quantity || 0)
                          )
                        }
                        return accProd
                      },
                      0,
                    )
                    return accGroup + groupTotal
                  }, 0)
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
                        {total || 0}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7}></Table.Summary.Cell>
                      <Table.Summary.Cell index={8}></Table.Summary.Cell>
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
                {costTotal || 0}
              </Text>
              <Form.Item name="total_cost" hidden>
                <InputNumber />
              </Form.Item>
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
                消費税金額（{taxRateWatch}%）
              </Text>
              <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                {taxTotal || 0}
              </Text>
              <Form.Item name="consumption_tax_amount" hidden>
                <InputNumber />
              </Form.Item>
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
                {profitRate.toFixed(2) || 0}%
              </Text>
              <Form.Item name="total_profit_margin" hidden>
                <InputNumber />
              </Form.Item>
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
                合計金額（
                {consumptionTaxWatch === 'external' ? '税抜）' : '税込）'}
              </Text>
              <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                {sellTotalWithTax || 0}
              </Text>
              <Form.Item name="total_price_tax_included" hidden>
                <InputNumber />
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Card>
      <Modal
        open={isModalOpen}
        onCancel={handleClose}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        title={'カテゴリから商品を追加'}
        footer={null}
      >
        <ProductCategoryModal name="main_product" close={handleClose} />
      </Modal>
    </Card>
  )
}

export default DetailInfo

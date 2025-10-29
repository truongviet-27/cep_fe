/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CoreAutoComplete from '@components/cep/estimates/quotas/action/components/auto-complete'
import { ProductCategoryModal } from '@components/cep/estimates/quotas/action/components/modal/product-category'
import { TaxRoundingMethod } from '@components/cep/estimates/quotas/enum'
import { Action, type ActionType } from '@components/common/action'
import { CoreAutocompleteAPI } from '@components/common/autocomplete-api'
import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import { ConsumptionTaxEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
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
  const customerWatch = Form.useWatch('customer', form)

  const [costTotal, setCostTotal] = useState(0)
  const [profitRate, setProfitRate] = useState(0)
  const [taxTotal, setTaxTotal] = useState(0)
  const [sellTotalWithTax, setSellTotalWithTax] = useState(0)

  const parameterSettings = useUserStore((state) => state.parameterSettings)
  const isProductManager =
    parameterSettings?.get && parameterSettings?.get('products')

  const calculateSummary = (main_product_groups: any[], tax_rate: number) => {
    let costTotal = 0
    let sellTotal = 0
    let taxTotal = 0

    // Calculate per-product totals and per-product tax using each product's tax_rate
    ;(main_product_groups ?? []).forEach((group: any) => {
      ;(group.products ?? []).forEach((product: any) => {
        if (!product.is_add_total) return

        const qty = product.quantity || 0
        const selling = (product.selling_price || 0) * qty
        const cost = (product.cost_price || 0) * qty

        costTotal += cost
        sellTotal += selling

        // Use product's individual tax rate, fallback to global tax_rate if not set

        const productTaxRate = product.tax_rate ?? 0

        // Calculate tax for this specific product
        let productTax = 0

        const rawTax = selling * (productTaxRate / 100)
        if (taxRoundingMethodWatch === TaxRoundingMethod.RoundDown) {
          productTax = Math.floor(rawTax)
        } else if (taxRoundingMethodWatch === TaxRoundingMethod.RoundUp) {
          productTax = Math.ceil(rawTax)
        } else {
          productTax = Number(rawTax.toFixed(0))
        }

        // if (consumptionTaxWatch === ConsumptionTaxEnum.INCLUSIVE) {
        //   // For inclusive tax, extract tax portion from selling price

        // } else {
        //   // For exclusive tax, calculate tax on top of selling price
        //   const rawTax = (selling * productTaxRate) / 100
        //   if (taxRoundingMethodWatch === TaxRoundingMethod.RoundDown) {
        //     productTax = Math.floor(rawTax)
        //   } else if (taxRoundingMethodWatch === TaxRoundingMethod.RoundUp) {
        //     productTax = Math.ceil(rawTax)
        //   } else {
        //     productTax = Number(rawTax.toFixed(0))
        //   }
        // }

        taxTotal += productTax
      })
    })

    let sellTotalWithTax = 0
    if (consumptionTaxWatch === ConsumptionTaxEnum.INCLUSIVE) {
      // For inclusive tax, selling total already includes tax
      sellTotalWithTax = sellTotal
    } else {
      // For exclusive tax, add tax to selling total
      sellTotalWithTax = sellTotal + taxTotal
    }
    const profitRate = Number(
      (sellTotal > 0 ? ((sellTotal - costTotal) / sellTotal) * 100 : 0).toFixed(
        2,
      ),
    )

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

  const handleAddProduct = (groupIndex: number, productIndex: number) => {
    const values = form?.getFieldValue('main_product') || []
    const products = values[groupIndex].products || []

    const newProduct = {
      product_id: null,
      package_id: null,
      name: '',
      code: '',
      quantity: 0,
      cost_price: 0,
      selling_price: 0,
      profit_margin: 0,
      tax_rate: 0,
      is_add_total: true,
      unit: t('quotas.action.detail_info.default_values.default_unit'),
    }

    const newProducts = [...products]
    newProducts.splice(productIndex, 0, newProduct)

    values[groupIndex].products = newProducts
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
      title={boldText(t('quotas.action.detail_info.title'), PRIMARY, 16)}
      style={{
        border: 'none',
        marginTop: 20,
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
              title: t('quotas.action.detail_info.table.product_code'),
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
                          placeholder={t(
                            'quotas.action.detail_info.placeholders.product_list_name',
                          )}
                          style={{
                            width: 400,
                            marginBottom: 0,
                          }}
                        />
                      </Form.Item>
                    ),
                    props: { colSpan: columns.length - 1 },
                  }
                } else {
                  if (isProductManager) {
                    return form.getFieldValue([
                      'main_product',
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
                          pattern: /^[A-Z0-9-]+$/,
                          message: '',
                        },
                      ]}
                      style={{
                        width: 300,
                      }}
                    >
                      <Input placeholder={t('placeholders.input_please')} />
                    </Form.Item>
                  )
                }
              },
            },
            {
              title: t('quotas.action.detail_info.table.product_service_name'),
              dataIndex: 'name',
              key: 'name',
              align: 'left',
              width: 200,
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                } else {
                  if (isProductManager) {
                    return (
                      <CoreAutocompleteAPI
                        name={[
                          record.index,
                          'products',
                          record.index2,
                          'product_id',
                        ]}
                        rules={[
                          {
                            required: true,
                            message: '',
                          },
                        ]}
                        labelInValue={false}
                        resource="products"
                        placeholder={t(
                          'quotas.action.detail_info.placeholders.product_search',
                        )}
                        disabled={!customerWatch}
                        pageSize={20}
                        onChangeValue={(valueOption) => {
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
                            valueOption?.name,
                          )
                          form.setFieldValue(
                            [
                              'main_product',
                              record.index,
                              'products',
                              record.index2,
                              'code',
                            ],
                            valueOption?.code,
                          )
                          form.setFieldValue(
                            [
                              'main_product',
                              record.index,
                              'products',
                              record.index2,
                              'unit',
                            ],
                            valueOption?.unit,
                          )
                          form.setFieldValue(
                            [
                              'main_product',
                              record.index,
                              'products',
                              record.index2,
                              'cost_price',
                            ],
                            valueOption?.cost_price,
                          )
                          form.setFieldValue(
                            [
                              'main_product',
                              record.index,
                              'products',
                              record.index2,
                              'selling_price',
                            ],
                            valueOption?.sale_price,
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
                          if (!valueOption) {
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
                    )
                  }
                  return (
                    <Form.Item
                      name={[record.index, 'products', record.index2, 'name']}
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
                      ]}
                      style={{
                        width: 300,
                      }}
                    >
                      <Input placeholder={t('placeholders.input_please')} />
                    </Form.Item>
                  )
                }
              },
            },
            {
              title: t('quotas.action.detail_info.table.unit'),
              dataIndex: 'unit',
              key: 'unit',
              align: 'center',
              width: 200,
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                } else {
                  if (isProductManager) {
                    return (
                      form.getFieldValue([
                        'main_product',
                        record.index,
                        'products',
                        record.index2,
                        'unit',
                      ]) ?? '-'
                    )
                  }

                  return (
                    <Form.Item
                      name={[record.index, 'products', record.index2, 'unit']}
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
                      ]}
                      style={{
                        width: '100%',
                      }}
                    >
                      <Input placeholder={t('placeholders.input_please')} />
                    </Form.Item>
                  )
                }
              },
            },
            {
              title: t('quotas.action.detail_info.table.package'),
              dataIndex: 'package_id',
              key: 'package_id',
              width: 200,
              align: 'left',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                } else {
                  if (isProductManager) {
                    return (
                      <Form.Item
                        className="ant-form-item-hidden-margin"
                        name={[
                          record.index,
                          'products',
                          record.index2,
                          'package_id',
                        ]}
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
                      <Input placeholder={t('placeholders.input_please')} />
                    </Form.Item>
                  )
                }
              },
            },
            {
              title: t('quotas.action.detail_info.table.cost_price'),
              dataIndex: 'cost_price',
              key: 'cost_price',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                } else {
                  if (isProductManager) {
                    return form.getFieldValue([
                      'main_product',
                      record.index,
                      'products',
                      record.index2,
                      'cost_price',
                    ])
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
                      rules={[
                        {
                          required: true,
                          message: '',
                        },
                      ]}
                    >
                      <InputNumber min={0} precision={0} controls={false} />
                    </Form.Item>
                  )
                }
              },
            },
            {
              title: t('quotas.action.detail_info.table.selling_price'),
              dataIndex: 'selling_price',
              key: 'selling_price',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return (
                  <Form.Item
                    className="ant-form-item-hidden-margin"
                    name={[
                      record.index,
                      'products',
                      record.index2,
                      'selling_price',
                    ]}
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                    normalize={(val) => val ?? 0}
                  >
                    <InputNumber min={0} precision={0} controls={false} />
                  </Form.Item>
                )
              },
            },
            {
              title: t('quotas.action.detail_info.table.quantity'),
              dataIndex: 'quantity',
              key: 'quantity',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return (
                  <Form.Item
                    className="ant-form-item-hidden-margin"
                    name={[record.index, 'products', record.index2, 'quantity']}
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                    normalize={(val) => val ?? 1}
                  >
                    <InputNumber min={1} precision={0} controls={false} />
                  </Form.Item>
                )
              },
            },
            {
              title: t('quotas.action.detail_info.table.profit_margin'),
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
                  ]) *
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
                  ]) *
                    form.getFieldValue([
                      'main_product',
                      record.index,
                      'products',
                      record.index2,
                      'quantity',
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
                    selling > 0
                      ? (((selling - cost) / selling) * 100).toFixed(2)
                      : 0,
                  ),
                )

                return `${selling > 0 ? (((selling - cost) / selling) * 100).toFixed(2) : 0}%`
              },
            },
            {
              title: t('quotas.action.detail_info.table.selling_amount'),
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
              title: t('quotas.action.detail_info.table.tax_rate'),
              dataIndex: 'tax_rate',
              key: 'tax_rate',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                if (isProductManager) {
                  const taxRate =
                    form.getFieldValue([
                      'main_product',
                      record.index,
                      'products',
                      record.index2,
                      'tax_rate',
                    ]) || 0
                  return `${taxRate}%`
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
                    normalize={(val) => val ?? 0}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      style={{ width: 100 }}
                      precision={0}
                      addonAfter="%"
                      controls={false}
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: t('quotas.action.detail_info.table.total_calculation'),
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
                    valuePropName="checked"
                    className="ant-form-item-hidden-margin"
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
              title: t('quotas.action.detail_info.table.row_edit'),
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
                            code: '',
                            quantity: 0,
                            cost_price: 0,
                            selling_price: 0,
                            profit_margin: 0,
                            tax_rate: 0,
                            is_add_total: true,
                            unit: t(
                              'quotas.action.detail_info.default_values.default_unit',
                            ),
                          },
                        ],
                      },
                      record.index + 1,
                    )
                  } else {
                    handleAddProduct(record.index, record.index2 + 1)
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
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <Button
                  type="primary"
                  onClick={async () => {
                    await form.validateFields(['customer'])
                    setIsModalOpen(true)
                  }}
                >
                  {t('quotas.action.detail_info.buttons.add_from_category')}
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
                        {t('quotas.action.detail_info.summary.subtotal')}
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
                      <Table.Summary.Cell index={9}></Table.Summary.Cell>
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
                {t('quotas.action.detail_info.summary.cost_total')}
              </Text>
              <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                ¥{costTotal || 0}
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
                {t('quotas.action.detail_info.summary.tax_amount')}
              </Text>
              <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                ¥{taxTotal || 0}
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
                {t('quotas.action.detail_info.summary.total_profit_margin')}
              </Text>
              <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                {profitRate}%
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
                {t('quotas.action.detail_info.summary.total_amount')}（
                {consumptionTaxWatch === 'external'
                  ? t('quotas.action.detail_info.summary.tax_exclusive')
                  : t('quotas.action.detail_info.summary.tax_inclusive')}
                ）
              </Text>
              <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                ¥{sellTotalWithTax || 0}
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
        title={t('quotas.action.detail_info.modal.add_from_category')}
        footer={null}
      >
        <ProductCategoryModal name="main_product" close={handleClose} />
      </Modal>
    </Card>
  )
}

export default DetailInfo

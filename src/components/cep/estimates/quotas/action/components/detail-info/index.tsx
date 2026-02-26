/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// done
import AutoComplete from '@components/cep/estimates/quotas/action/components/auto-complete'
import { ProductCategoryModal } from '@components/cep/estimates/quotas/action/components/modal/product-category'
import { TaxRoundingMethod } from '@components/cep/estimates/quotas/enum'
import {
  DEFAULT_TAX_RATES,
  getDefaultTaxRate,
} from '@components/cep/estimates/quotas/utils'
import {
  Action,
  type ActionType,
  type CreateProductType,
} from '@components/common/action'
import { CoreAutocompleteAPI } from '@components/common/autocomplete-api'
import CommonTable from '@components/common/table'
import { useApiUrl, useCustom, useTranslate } from '@refinedev/core'
import type { RoundingMethodEnumType } from '@sdk/hey-api'
import { ConsumptionTaxEnum } from '@sdk/hey-api'
import { calculateTax } from '@shared/tax/tax.utils'
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
  notification,
  Row,
  Select,
  Typography,
} from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import { useCallback, useEffect, useMemo, useState } from 'react'

const { Text } = Typography

function DetailInfo({
  productPrincing,
  taxRoundingMethod,
  // handleChangeProductPrincing,
  mainProduct,
}: {
  productPrincing?: number[]
  taxRoundingMethod: RoundingMethodEnumType
  // handleChangeProductPrincing: (productIds: number[]) => void
  mainProduct: any
}) {
  const t = useTranslate()
  const form = Form.useFormInstance()

  const [productList, setProductList] = useState<any[]>([])

  const mainProductWatch = Form.useWatch('main_product', form)
  const taxRateWatch = Form.useWatch('tax_rate', form)
  const consumptionTaxWatch = Form.useWatch('consumption_tax', form)
  const customerWatch = Form.useWatch('customer', form)
  const costPriceWatch = Form.useWatch('cost_price', form)

  const [costTotal, setCostTotal] = useState(0)
  const [profitRate, setProfitRate] = useState(0)
  const [taxTotal, setTaxTotal] = useState(0)
  const [sellTotalWithTax, setSellTotalWithTax] = useState(0)

  const calculateSummary = (main_product_groups: any[], tax_rate: number) => {
    let costTotal = 0
    let sellTotal = 0
    let hasNullCost = false

    // Group products by tax rate for separate calculation
    const taxGroups: { [key: string]: { selling: number; taxRate: number } } =
      {}

    // Calculate per-product totals and group by tax_rate
    ;(main_product_groups ?? []).forEach((group: any) => {
      ;(group.products ?? []).forEach((product: any) => {
        if (!product.is_add_total) return

        const qty = product.quantity || 0
        const selling = (product.selling_price || 0) * qty
        const cost = (product.cost_price || 0) * qty

        if (product.cost_price === null) hasNullCost = true

        costTotal += cost
        sellTotal += selling

        // Use product's individual tax rate, fallback to 0 if not set
        const productTaxRate = product.tax_rate ?? 0
        const taxRateKey = productTaxRate.toString()

        // Group products by tax rate
        if (!taxGroups[taxRateKey]) {
          taxGroups[taxRateKey] = { selling: 0, taxRate: productTaxRate }
        }
        taxGroups[taxRateKey].selling += selling
      })
    })

    // Calculate tax for each tax rate group with rounding
    let taxTotal = 0
    Object.values(taxGroups).forEach((group) => {
      const rawTax = (group.selling * group.taxRate) / 100
      const roundedTax = calculateTax(rawTax, taxRoundingMethod)
      taxTotal += roundedTax
    })

    let sellTotalWithTax = 0
    if (consumptionTaxWatch === ConsumptionTaxEnum.EXTERNAL) {
      // For inclusive tax, selling total already includes tax
      sellTotalWithTax = sellTotal
    } else {
      // For internal tax, add tax to selling total
      sellTotalWithTax = sellTotal + taxTotal
    }

    const profitRate = Number(
      (sellTotal > 0 ? ((sellTotal - costTotal) / sellTotal) * 100 : 0).toFixed(
        2,
      ),
    )

    setCostTotal(costTotal)
    setTaxTotal(taxTotal)
    setProfitRate(hasNullCost ? 0 : profitRate)
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

  const handleAddProduct = (
    groupIndex: number,
    productIndex: number,
    isSelfCreate = false,
  ) => {
    const values = form?.getFieldValue('main_product') || []
    const products = values[groupIndex].products || []

    const newProduct = {
      product: null,
      isSelfCreate: isSelfCreate,
      package: null,
      product_id: null,
      package_id: null,
      package_name: '-',
      name: '',
      code: '',
      quantity: 0,
      cost_price: 0,
      selling_price: 0,
      profit_margin: 0,
      tax_rate: isSelfCreate ? getDefaultTaxRate() : 0,
      is_add_total: true,
      unit: t('quotas.action.detail_info.default_values.default_unit'),
      unit_name: t('quotas.action.detail_info.default_values.default_unit'),
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

  const dataSource: any[] = (form?.getFieldValue('main_product') ?? []).flatMap(
    (item: any, index: number) => [
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
          isSelfCreate: !item2.product_id,
          ...item2,
        },
      ]),
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
        const roundedTax = calculateTax(rawTax, taxRoundingMethod)
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
  }, [dataSource, taxRoundingMethod])

  const apiUrl = useApiUrl()

  const [productPrincingState, setProductPrincingState] = useState<number[]>([])

  const productIds = (Form.useWatch(['main_product'], form) ?? []).flatMap(
    (item: any) => item.products.map((p: any) => p.product_id),
  )

  const customer = Form.useWatch(['customer'], form)

  useEffect(() => {
    if (productPrincing) {
      setProductPrincingState(productPrincing)
    }
  }, [productPrincing])

  const watchedProductIds = useMemo(() => {
    return (mainProductWatch ?? [])
      .flatMap((item: any) =>
        (item.products ?? []).map((p: any) => p.product_id),
      )
      .filter(Boolean)
  }, [mainProductWatch])

  const { data } = useCustom<any>({
    url: `${apiUrl}/products/customer-pricing/${customer?.value}`,
    method: 'get',
    queryOptions: {
      enabled:
        !!customer?.value &&
        productPrincingState.filter((x) => x != null).length > 0,
    },

    config: {
      filters: [
        {
          field: 'ids',
          operator: 'eq',
          value: productPrincingState.join(','),
        },
      ],
    },
  })

  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      setProductList((prev) => {
        const productMap = new Map(prev.map((item) => [item.id, item]))
        data.data.forEach((newItem: any) => {
          productMap.set(newItem.id, newItem)
        })
        return Array.from(productMap.values())
      })
    }
  }, [data])

  const handleChangeProductPrincingMain = useCallback(
    (productIds: number[], isSimple?: boolean, isCallApi?: boolean) => {
      setProductPrincingState((prev) => [
        ...new Set(isSimple ? [...productIds] : [...prev, ...productIds]),
      ])
    },
    [],
  )

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
      <Form.Item name={'total_cost'} hidden></Form.Item>
      <Form.Item name={'consumption_tax_amount'} hidden></Form.Item>
      <Form.Item name={'total_profit_margin'} hidden></Form.Item>
      <Form.Item name={'total_price_tax_included'} hidden></Form.Item>
      <Form.Item name={'tax_rate_group'} hidden></Form.Item>

      <Form.List name={'main_product'}>
        {(_, { add, remove }) => {
          const columns: ColumnsType = [
            {
              title: t('quotas.action.detail_info.table.product_code'),
              dataIndex: 'code',
              key: 'code',
              align: 'left',
              width: '10%',
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
                  return {
                    children: (
                      <Form.Item
                        name={[record.index, 'group_name']}
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
                          placeholder={t(
                            'quotas.action.detail_info.placeholders.product_list_name',
                          )}
                          style={{
                            marginBottom: 0,
                          }}
                        />
                      </Form.Item>
                    ),
                    props: { colSpan: columns.length - 1 },
                  }
                } else {
                  if (!record.isSelfCreate) {
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
                        {
                          validator: async () => {
                            const allGroups =
                              form.getFieldValue('main_product') || []

                            const currentProduct =
                              allGroups[record.index]?.products?.[record.index2]
                            const currentCode = currentProduct?.code

                            if (!currentCode) return Promise.resolve()

                            let count = 0
                            for (const group of allGroups) {
                              const products = group?.products || []
                              for (const item of products) {
                                if (item?.code === currentCode) {
                                  count++
                                }
                                if (count > 1) {
                                  notification.error({
                                    message: `${currentCode}${t('quotas.action.detail_info.duplicate_product_code')}`,
                                    key: `${currentCode}-code-main-product`,
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
              width: '15%',
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
                } else {
                  if (!record.isSelfCreate) {
                    return (
                      <CoreAutocompleteAPI
                        name={[
                          record.index,
                          'products',
                          record.index2,
                          'product',
                        ]}
                        rules={[
                          {
                            required: true,
                            message: '',
                          },
                          {
                            validator: async () => {
                              const allGroups =
                                form.getFieldValue('main_product') || []
                              const currentProduct =
                                allGroups[record.index]?.products?.[
                                  record.index2
                                ]

                              if (!currentProduct?.product_id)
                                return Promise.resolve()

                              let count = 0
                              for (const group of allGroups) {
                                const products = group?.products || []
                                for (const item of products) {
                                  if (
                                    item?.product_id ===
                                    currentProduct?.product_id
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
                              }
                            },
                          },
                        ]}
                        resource="products/list-all"
                        placeholder={t(
                          'quotas.action.detail_info.placeholders.product_search',
                        )}
                        pageSize={30}
                        disabled={!customerWatch}
                        defaultValue={{
                          value: form.getFieldValue([
                            'main_product',
                            record.index,
                            'products',
                            record.index2,
                            'product',
                          ])?.value,
                          label: form.getFieldValue([
                            'main_product',
                            record.index,
                            'products',
                            record.index2,
                            'name',
                          ]),
                        }}
                        onChangeValue={(valueOption) => {
                          if (!valueOption) {
                            form.setFieldValue(
                              [
                                'main_product',
                                record.index,
                                'products',
                                record.index2,
                                'package',
                              ],
                              null,
                            )
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

                          if (valueOption) {
                            handleChangeProductPrincingMain(
                              [valueOption.id],
                              true,
                            )
                          }
                        }}
                        onSelect={(valueOption) => {
                          // Cập nhật field product với tên mới từ API khi select
                          if (valueOption) {
                            form.setFieldValue(
                              [
                                'main_product',
                                record.index,
                                'products',
                                record.index2,
                                'product',
                              ],
                              {
                                value: valueOption.id,
                                label: valueOption.name, // Luôn lấy tên mới từ API
                              },
                            )
                          }
                          form.setFieldValue(
                            [
                              'main_product',
                              record.index,
                              'products',
                              record.index2,
                              'product_id',
                            ],
                            valueOption?.id,
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
                              'package_id',
                            ],
                            (valueOption?.packagings ?? [])[0]?.id,
                          )
                          form.setFieldValue(
                            [
                              'main_product',
                              record.index,
                              'products',
                              record.index2,
                              'package',
                            ],
                            {
                              value: (valueOption?.packagings ?? [])[0]?.id,
                              label: '-',
                            },
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
                              'unit_name',
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
                            null,
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
                          form.setFieldValue(
                            [
                              'main_product',
                              record.index,
                              'products',
                              record.index2,
                              'tax_rate',
                            ],
                            valueOption?.tax_rate,
                          )
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
                        {
                          validator: async () => {
                            const allGroups =
                              form.getFieldValue('main_product') || []
                            const currentProduct =
                              allGroups[record.index]?.products?.[record.index2]
                            const currentName = currentProduct?.name

                            if (!currentName) return Promise.resolve()

                            let count = 0
                            for (const group of allGroups) {
                              const products = group?.products || []
                              for (const item of products) {
                                if (item?.name === currentName) {
                                  count++
                                }
                                if (count > 1) {
                                  notification.error({
                                    message: `${currentName}${t('quotas.action.detail_info.duplicate_product_name')}`,
                                    key: `${currentName}-name-main-product`,
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
              width: '7%',
              align: 'center',
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
                } else {
                  if (!record.isSelfCreate) {
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
                    >
                      <Input placeholder={t('placeholders.input_please')} />
                    </Form.Item>
                  )
                }
              },
            },
            {
              title: t('quotas.action.detail_info.table.package'),
              dataIndex: 'package',
              key: 'package',
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
                } else {
                  if (!record.isSelfCreate) {
                    let product = null
                    if (productList.length > 0) {
                      product = productList.find(
                        (item: any) => item.id === record?.product_id,
                      )
                    } else {
                      product = mainProduct
                        ?.flatMap((group: any) => group.products || [])
                        .find(
                          (item: any) => item.product_id === record?.product_id,
                        )
                    }

                    const productInit =
                      mainProduct &&
                      mainProduct[record?.index ?? 0]?.products[
                        record?.index2 ?? 0
                      ]?.product

                    return (
                      <Form.Item
                        className="ant-form-item-hidden-margin"
                        name={[
                          record.index,
                          'products',
                          record.index2,
                          'package',
                        ]}
                      >
                        <AutoComplete
                          filterPath1={[
                            'main_product',
                            record.index,
                            'products',
                            record.index2,
                            'product',
                          ]}
                          labelInValue={true}
                          productsData={productInit}
                          customer={customer}
                          data={product}
                          index={record.index}
                          index2={record.index2}
                          filterPath2={['customer']}
                          resource={`products`}
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
                      <Input disabled={record.isSelfCreate} />
                    </Form.Item>
                  )
                }
              },
            },
            {
              title: t('quotas.action.detail_info.table.cost_price'),
              dataIndex: 'cost_price',
              key: 'cost_price',
              width: '8%',
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
                } else {
                  if (!record.isSelfCreate) {
                    const cost_price = form.getFieldValue([
                      'main_product',
                      record.index,
                      'products',
                      record.index2,
                      'cost_price',
                    ])
                    if (cost_price === undefined || cost_price === null)
                      return '-'
                    return Number(cost_price).toLocaleString()
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
                }
              },
            },
            {
              title: t('quotas.action.detail_info.table.selling_price'),
              dataIndex: 'selling_price',
              key: 'selling_price',
              width: '8%',
              onHeaderCell: () => ({
                style: {
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: '1.2',
                },
              }),
              onCell: () => ({
                style: {
                  maxWidth: 12,
                },
              }),
              ellipsis: true,
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
                  >
                    <InputNumber
                      min={0}
                      precision={0}
                      controls={false}
                      onChange={() => {
                        handleChangeProductPrincingMain(
                          productPrincingState.filter(
                            (item) => item !== record?.product_id,
                          ),
                          true,
                        )
                      }}
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
              title: t('quotas.action.detail_info.table.quantity'),
              dataIndex: 'quantity',
              key: 'quantity',
              width: '8%',
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
                  >
                    <InputNumber
                      min={1}
                      precision={0}
                      controls={false}
                      onChange={() => {
                        handleChangeProductPrincingMain(
                          productPrincingState.filter(
                            (item) => item !== record?.product_id,
                          ),
                          true,
                          false,
                        )
                      }}
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
              title: t('quotas.action.detail_info.table.profit_margin'),
              dataIndex: 'profit_margin',
              key: 'profit_margin',
              width: '7%',
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
                if (
                  form.getFieldValue([
                    'main_product',
                    record.index,
                    'products',
                    record.index2,
                    'cost_price',
                  ]) === null
                ) {
                  form.setFieldValue(
                    [
                      'main_product',
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

                return `${selling > 0 ? Number(((selling - cost) / selling) * 100).toLocaleString(undefined, { maximumFractionDigits: 2 }) : 0}%`
              },
            },
            {
              title: t('quotas.action.detail_info.table.selling_amount'),
              dataIndex: 'sellingAmount',
              key: 'sellingAmount',
              width: '8%',
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
                return Number(quantity * selling).toLocaleString()
              },
            },
            {
              title: t('quotas.action.detail_info.table.tax_rate'),
              dataIndex: 'tax_rate',
              key: 'tax_rate',
              width: '7%',
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
                  const taxRate =
                    form.getFieldValue([
                      'main_product',
                      record.index,
                      'products',
                      record.index2,
                      'tax_rate',
                    ]) || 0
                  return `${Number(taxRate).toLocaleString()}%`
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
              title: t('quotas.action.detail_info.table.total_calculation'),
              dataIndex: 'is_add_total',
              key: 'is_add_total',
              width: '4%',
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
              width: '10%',
              onHeaderCell: () => ({
                style: {
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: '1.2',
                },
              }),
              ellipsis: true,
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
                    ? ['onAppendFromMasterOrCreateNewAction', 'remove']
                    : ['onAppendFromMasterOrCreateNewAction']

                const handleAppend = () => {
                  if (isHeader) {
                    add(
                      {
                        group_name: '',
                        products: [
                          {
                            product: null,
                            package: null,
                            product_id: null,
                            package_id: null,
                            isSelfCreate: false,
                            package_name: '-',
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
                            unit_name: t(
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

                const onAppendFromMasterOrCreateNewAction = (
                  type: CreateProductType,
                ) => {
                  const _isSelfCreate = type === 'create_new'
                  handleAddProduct(
                    record.index,
                    record.index2 + 1,
                    _isSelfCreate,
                  )
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
                scroll={{ x: 800 }}
                tableLayout="fixed"
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
                        {Number(total).toLocaleString() || 0}
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
                  <Form.Item name="total_cost" hidden>
                    <InputNumber />
                  </Form.Item>
                  <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                    ¥{costTotal?.toLocaleString() || 0}
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
                    {t('quotas.action.detail_info.summary.total_profit_margin')}
                  </Text>
                  <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                    {Number(profitRate).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
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
                    {consumptionTaxWatch === 'external'
                      ? t('quotas.action.detail_info.summary.tax_exclusive')
                      : t('quotas.action.detail_info.summary.tax_inclusive')}
                    ）
                  </Text>
                  <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                    ¥{sellTotalWithTax?.toLocaleString() || 0}
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
        onCancel={handleClose}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        title={t('quotas.action.detail_info.modal.add_from_category')}
        footer={null}
        destroyOnHidden
      >
        <ProductCategoryModal
          name="main_product"
          close={handleClose}
          handleChangeProductPrincing={handleChangeProductPrincingMain}
        />
      </Modal>
    </Card>
  )
}

export default DetailInfo

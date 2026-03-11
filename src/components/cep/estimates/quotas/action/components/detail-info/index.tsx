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

  const calculateSummary = (main_product: any[]) => {
    // Bỏ tham số tax_rate thừa nếu không dùng
    let costTotal = 0
    let sellTotal = 0
    let hasNullCost = false
    const taxGroups: { [key: string]: { selling: number; taxRate: number } } =
      {}

    ;(main_product ?? []).forEach((product: any) => {
      if (product.isHeader || !product.is_add_total) return

      const qty = Number(product.quantity) || 0
      const selling = (Number(product.selling_price) || 0) * qty
      const cost =
        (product.cost_price === null ? 0 : Number(product.cost_price)) * qty

      if (product.cost_price === null) hasNullCost = true

      costTotal += cost
      sellTotal += selling

      const productTaxRate = product.tax_rate ?? 0
      const taxRateKey = productTaxRate.toString()

      if (!taxGroups[taxRateKey]) {
        taxGroups[taxRateKey] = { selling: 0, taxRate: productTaxRate }
      }
      taxGroups[taxRateKey].selling += selling
    })

    let taxTotal = 0
    Object.values(taxGroups).forEach((group) => {
      const rawTax = (group.selling * group.taxRate) / 100
      taxTotal += calculateTax(rawTax, taxRoundingMethod)
    })

    const sellTotalWithTax = sellTotal + taxTotal

    const profitRate =
      sellTotal > 0
        ? Number((((sellTotal - costTotal) / sellTotal) * 100).toFixed(2))
        : 0

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
    calculateSummary(form.getFieldValue('main_product'))
  }, [taxRateWatch, mainProductWatch, consumptionTaxWatch])

  const handleAddProduct = (productIndex: number, isSelfCreate = false) => {
    const currentList = form?.getFieldValue('main_product') || []

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
      kind: 'product',
    }

    // 3. Tạo mảng mới và chèn vào ngay sau vị trí hiện tại (productIndex + 1)
    const newList = [...currentList]
    newList.splice(productIndex + 1, 0, newProduct)

    // 4. Cập nhật lại Form
    form.setFieldsValue({ main_product: newList })
  }

  const handleRemoveProduct = (index: number) => {
    const currentList = form.getFieldValue('main_product') || []
    const newList = currentList.filter((_: any, idx: number) => idx !== index)
    form.setFieldsValue({ main_product: newList })
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClose = () => {
    setIsModalOpen(false)
  }

  const dataSource: any[] = (form?.getFieldValue('main_product') ?? []).map(
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
        isSelfCreate: !item.product_id,
        ...item,
      }
    },
  )

  useEffect(() => {
    if (mainProductWatch && Array.isArray(mainProductWatch)) {
      const updatedList = mainProductWatch.map((item: any, index: number) => {
        if (item.display_order !== index + 1) {
          return { ...item, display_order: index + 1 }
        }
        return item
      })
      if (JSON.stringify(updatedList) !== JSON.stringify(mainProductWatch)) {
        form.setFieldsValue({ main_product: updatedList })
      }
    }
  }, [mainProductWatch, form])

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

  const customer = Form.useWatch(['customer'], form)

  useEffect(() => {
    if (productPrincing) {
      setProductPrincingState(productPrincing)
    }
  }, [productPrincing])

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
                ;<Form.Item name={[record.index, 'display_order']} hidden>
                  <InputNumber />
                </Form.Item>
                if (record.isHeader) {
                  return {
                    children: (
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
                          pattern: /^[A-Z0-9-]+$/,
                          message: '',
                        },
                        {
                          validator: async () => {
                            const allProducts =
                              form.getFieldValue('main_product') || []
                            const currentCode = allProducts[record.index]?.code
                            if (!currentCode) return Promise.resolve()
                            let count = 0
                            for (const item of allProducts) {
                              if (
                                item?.kind !== 'group' &&
                                item?.code === currentCode
                              ) {
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
                        name={[record.index, 'product']}
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
                            'product',
                          ])?.value,
                          label: form.getFieldValue([
                            'main_product',
                            record.index,
                            'name',
                          ]),
                        }}
                        onChangeValue={(valueOption) => {
                          if (!valueOption) {
                            form.setFieldValue(
                              ['main_product', record.index, 'package'],
                              null,
                            )
                            form.setFieldValue(
                              ['main_product', record.index, 'quantity'],
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
                              ['main_product', record.index, 'product'],
                              {
                                value: valueOption.id,
                                label: valueOption.name, // Luôn lấy tên mới từ API
                              },
                            )
                          }
                          form.setFieldValue(
                            ['main_product', record.index, 'product_id'],
                            valueOption?.id,
                          )
                          form.setFieldValue(
                            ['main_product', record.index, 'name'],
                            valueOption?.name,
                          )
                          form.setFieldValue(
                            ['main_product', record.index, 'code'],
                            valueOption?.code,
                          )
                          form.setFieldValue(
                            ['main_product', record.index, 'package_id'],
                            (valueOption?.packagings ?? [])[0]?.id,
                          )
                          form.setFieldValue(
                            ['main_product', record.index, 'package'],
                            {
                              value: (valueOption?.packagings ?? [])[0]?.id,
                              label: '-',
                            },
                          )
                          form.setFieldValue(
                            ['main_product', record.index, 'unit'],
                            valueOption?.unit,
                          )
                          form.setFieldValue(
                            ['main_product', record.index, 'unit_name'],
                            valueOption?.unit,
                          )
                          form.setFieldValue(
                            ['main_product', record.index, 'cost_price'],
                            valueOption?.cost_price,
                          )
                          form.setFieldValue(
                            ['main_product', record.index, 'selling_price'],
                            valueOption?.sale_price,
                          )
                          form.setFieldValue(
                            ['main_product', record.index, 'quantity'],
                            1,
                          )
                          form.setFieldValue(
                            ['main_product', record.index, 'tax_rate'],
                            valueOption?.tax_rate,
                          )
                        }}
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
                            if (!currentName) return Promise.resolve()
                            let count = 0
                            for (const item of allProducts) {
                              if (
                                item?.kind !== 'group' &&
                                item?.name === currentName
                              ) {
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
                        'unit',
                      ]) ?? '-'
                    )
                  }

                  return (
                    <Form.Item
                      name={[record.index, 'unit']}
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
                      product = mainProduct?.find(
                        (item: any) => item.product_id === record?.product_id,
                      )
                    }

                    const productInit =
                      mainProduct && mainProduct[record?.index ?? 0]?.product

                    return (
                      <Form.Item
                        className="ant-form-item-hidden-margin"
                        name={[record.index, 'package']}
                      >
                        <AutoComplete
                          filterPath1={[
                            'main_product',
                            record.index,
                            'product',
                          ]}
                          labelInValue={true}
                          productsData={productInit}
                          customer={customer}
                          data={product}
                          index={record.index}
                          filterPath2={['customer']}
                          resource={`products`}
                          parent="main_product"
                        />
                      </Form.Item>
                    )
                  }

                  return (
                    <Form.Item
                      name={[record.index, 'package_name']}
                      className="ant-form-item-hidden-margin"
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
                      'cost_price',
                    ])
                    if (cost_price === undefined || cost_price === null)
                      return '-'
                    return Number(cost_price).toLocaleString()
                  }

                  return (
                    <Form.Item
                      name={[record.index, 'cost_price']}
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
                    name={[record.index, 'selling_price']}
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
                    name={[record.index, 'quantity']}
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
                  ]) *
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
                  ]) *
                    form.getFieldValue([
                      'main_product',
                      record.index,
                      'quantity',
                    ]) || 0

                form.setFieldValue(
                  ['main_product', record.index, 'profit_margin'],
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
                    'quantity',
                  ]) || 0

                const selling =
                  form.getFieldValue([
                    'main_product',
                    record.index,
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
                      'tax_rate',
                    ]) || 0
                  return `${Number(taxRate).toLocaleString()}%`
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
                    name={[record.index, 'is_add_total']}
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
                        'is_add_total',
                      ])}
                      onChange={() => {
                        calculateSummary(form.getFieldValue('main_product'))
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
              render: (_, record, index) => {
                const isHeader = record.isHeader
                const isFirstRow = index === 0
                const mainProduct = form.getFieldValue('main_product') || []

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
                        product: null,
                        isSelfCreate: false,
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
                        tax_rate: 0,
                        is_add_total: true,
                        unit: t(
                          'quotas.action.detail_info.default_values.default_unit',
                        ),
                        unit_name: t(
                          'quotas.action.detail_info.default_values.default_unit',
                        ),
                        kind: 'product',
                      },
                      insertAt + 1,
                    )
                  } else {
                    handleAddProduct(index)
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
                  ).reduce((acc: number, prod: any) => {
                    if (prod.is_add_total) {
                      return (
                        acc + (prod.selling_price || 0) * (prod.quantity || 0)
                      )
                    }
                    return acc
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import AutoComplete from '@components/cep/estimates/quotas/action/components/auto-complete'
import { ProductCategoryModal } from '@components/cep/estimates/quotas/action/components/modal/product-category'
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
import type { QuotaCategoryEnum } from '@sdk/hey-api'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
} from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useState } from 'react'

function OptionalInfo({
  confirmedCategory,
  productPrincing,
  optionalProduct,
  priceReflectionChanges,
  onPriceComputed,
  isAwaitingPriceDecision,
  onPricingFetchingChange,
}: {
  confirmedCategory: QuotaCategoryEnum
  productPrincing?: number[]
  optionalProduct: any
  priceReflectionChanges?: Array<{
    parent: 'main_product' | 'optional_product'
    index: number
    field: 'selling_price' | 'cost_price'
    oldPrice: number
    newPrice: number
  }>
  onPriceComputed?: (
    parent: string,
    index: number,
    oldPrice: number,
    newPrice: number,
    field?: 'selling_price' | 'cost_price',
  ) => void
  isAwaitingPriceDecision?: boolean
  onPricingFetchingChange?: (isFetching: boolean) => void
}) {
  const t = useTranslate()
  const form = Form.useFormInstance()

  const customerWatch = Form.useWatch('customer', form)
  const optionalProductWatch = Form.useWatch('optional_product', form)
  const [productList, setProductList] = useState<any[]>([])

  const handleAddProduct = (productIndex: number, isSelfCreate = false) => {
    const currentList = form?.getFieldValue('optional_product') || []

    const newProduct = {
      product: null,
      isSelfCreate: isSelfCreate,
      package: null,
      product_id: null,
      package_id: null,
      package_name: '-',
      name: '',
      code: '',
      quantity: 1,
      cost_price: 0,
      selling_price: 0,
      profit_margin: 0,
      tax_rate: isSelfCreate ? getDefaultTaxRate() : 10,
      is_add_total: true,
      unit: t('quotas.action.detail_info.default_values.default_unit'),
      unit_name: t('quotas.action.detail_info.default_values.default_unit'),
      kind: 'product',
    }

    // 3. Tạo mảng mới và chèn vào ngay sau vị trí hiện tại (productIndex + 1)
    const newList = [...currentList]
    newList.splice(productIndex + 1, 0, newProduct)

    // 4. Cập nhật lại Form
    form.setFieldsValue({ optional_product: newList })
  }

  const handleRemoveProduct = (index: number) => {
    const currentList = form.getFieldValue('optional_product') || []
    const newList = currentList.filter((_: any, idx: number) => idx !== index)
    form.setFieldsValue({ optional_product: newList })
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClose = () => {
    setIsModalOpen(false)
  }

  const apiUrl = useApiUrl()

  // const productIds = (Form.useWatch(['optional_product'], form) ?? []).flatMap(
  //   (item: any) => item.products.map((p: any) => p.product_id),
  // )
  const [productPrincingState, setProductPrincingState] = useState<number[]>([])

  useEffect(() => {
    if (productPrincing) {
      setProductPrincingState(productPrincing)
    }
  }, [productPrincing])

  const customer = Form.useWatch(['customer'], form)

  const pricingEnabled =
    !!customer?.value &&
    productPrincingState.filter((x) => x != null).length > 0

  const { data, isFetching: isPricingFetching } = useCustom<any>({
    url: `${apiUrl}/products/customer-pricing/${customer?.value}`,
    method: 'get',
    queryOptions: {
      enabled: pricingEnabled,
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
    onPricingFetchingChange?.(pricingEnabled && isPricingFetching)
  }, [pricingEnabled, isPricingFetching, onPricingFetchingChange])

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

  const handleChangeProductPrincingOptional = useCallback(
    (productIds: number[], isSimple?: boolean) => {
      setProductPrincingState((prev) => [
        ...new Set(isSimple ? productIds : [...prev, ...productIds]),
      ])
    },
    [],
  )

  useEffect(() => {
    if (optionalProductWatch && Array.isArray(optionalProductWatch)) {
      const updatedList = optionalProductWatch.map(
        (item: any, index: number) => {
          if (item.display_order !== index + 1) {
            return { ...item, display_order: index + 1 }
          }
          return item
        },
      )
      if (
        JSON.stringify(updatedList) !== JSON.stringify(optionalProductWatch)
      ) {
        form.setFieldsValue({ optional_product: updatedList })
      }
    }
  }, [optionalProductWatch, form])

  const dataSource: any[] = (form?.getFieldValue('optional_product') ?? []).map(
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
        isSelfCreate: !item.product_id,
        ...item,
      }
    },
  )

  return (
    <Card
      title={boldText(t('quotas.action.optional_info.title'), PRIMARY, 16)}
      styles={{
        header: { padding: 0, minHeight: 0 },
        body: { padding: 0 },
      }}
      style={{
        border: 'none',
        marginTop: 20,
      }}
    >
      <Form.List name={'optional_product'}>
        {(_, { add, remove }) => {
          const columns: ColumnsType = [
            {
              title: t('quotas.action.optional_info.table.product_code'),
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
                        className="ant-form-item-hidden-margin"
                        name={[record.index, 'name']}
                        style={{
                          marginBottom: 0,
                        }}
                      >
                        <Input
                          placeholder={t(
                            'quotas.action.optional_info.placeholders.optional_list_name',
                          )}
                        />
                      </Form.Item>
                    ),
                    props: { colSpan: columns.length - 1 },
                  }
                } else {
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
                                  key: `${currentCode}-code-optional-product`,
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
                      <Input
                        placeholder={t('placeholders.input_please')}
                        style={{
                          maxWidth: '200px',
                          width: '100%',
                        }}
                      />
                    </Form.Item>
                  )
                }
              },
            },
            {
              title: t(
                'quotas.action.optional_info.table.product_service_name',
              ),
              dataIndex: 'name',
              key: 'name',
              align: 'left',
              width: '15%',
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
                        key={`optional-product-${record.index}-${confirmedCategory}`}
                        rules={[
                          {
                            validator: async () => {
                              const allProducts =
                                form.getFieldValue('optional_product') || []
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
                        name={[record.index, 'product']}
                        labelInValue={true}
                        resource="products/list-all"
                        filters={[
                          {
                            field: 'resource',
                            operator: 'eq',
                            value: confirmedCategory,
                          },
                        ]}
                        placeholder={t(
                          'quotas.action.detail_info.placeholders.product_search',
                        )}
                        disabled={!customerWatch}
                        defaultValue={{
                          value: form.getFieldValue([
                            'optional_product',
                            record.index,

                            'product',
                          ])?.value,
                          label: form.getFieldValue([
                            'optional_product',
                            record.index,

                            'name',
                          ]),
                        }}
                        onChangeValue={(valueOption) => {
                          if (!valueOption) {
                            form.setFieldValue(
                              ['optional_product', record.index, 'product_id'],
                              null,
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'name'],
                              '',
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'code'],
                              '',
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'package'],
                              null,
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'package_id'],
                              null,
                            )
                            form.setFieldValue(
                              [
                                'optional_product',
                                record.index,
                                'package_name',
                              ],
                              '-',
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'unit'],
                              '-',
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'unit_name'],
                              '-',
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'cost_price'],
                              0,
                            )
                            form.setFieldValue(
                              [
                                'optional_product',
                                record.index,
                                'selling_price',
                              ],
                              0,
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'tax_rate'],
                              10,
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'quantity'],
                              1,
                            )
                          } else {
                            form.setFieldValue(
                              ['optional_product', record.index, 'package'],
                              {
                                value: (valueOption?.packagings ?? [])[0]?.id,
                                label: '-',
                              },
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'package_id'],
                              (valueOption?.packagings ?? [])[0]?.id,
                            )
                            form.setFieldValue(
                              [
                                'optional_product',
                                record.index,
                                'package_name',
                              ],
                              '-',
                            )
                            if (valueOption) {
                              handleChangeProductPrincingOptional([
                                valueOption.id,
                              ])
                            }

                            form.setFieldValue(
                              ['optional_product', record.index, 'product_id'],
                              valueOption?.id,
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'name'],
                              valueOption?.name,
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'code'],
                              valueOption?.code,
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'unit'],
                              valueOption?.unit,
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'unit_name'],
                              valueOption?.unit,
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'cost_price'],
                              valueOption?.cost_price,
                            )
                            form.setFieldValue(
                              [
                                'optional_product',
                                record.index,
                                'selling_price',
                              ],
                              valueOption?.sale_price,
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'tax_rate'],
                              valueOption?.tax_rate,
                            )
                            form.setFieldValue(
                              ['optional_product', record.index, 'quantity'],
                              1,
                            )
                          }
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
                                  key: `${currentName}-name-optional-product`,
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
                      <Input
                        placeholder={t('placeholders.input_please')}
                        style={{
                          maxWidth: '500px',
                          width: '100%',
                        }}
                      />
                    </Form.Item>
                  )
                }
              },
            },
            {
              title: t('quotas.action.optional_info.table.unit'),
              dataIndex: 'unit',
              key: 'unit',
              align: 'center',
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
                } else {
                  if (!record.isSelfCreate) {
                    return (
                      form.getFieldValue([
                        'optional_product',
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
                        style={{
                          maxWidth: '200px',
                          width: '100%',
                        }}
                      />
                    </Form.Item>
                  )
                }
              },
            },
            {
              title: t('quotas.action.optional_info.table.package'),
              dataIndex: 'package',
              key: 'package',
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
                } else {
                  if (!record.isSelfCreate) {
                    let product = null
                    if (productList.length > 0) {
                      product = productList.find(
                        (item: any) => item.id === record?.product_id,
                      )
                    } else {
                      product = optionalProduct?.find(
                        (item: any) => item.product_id === record?.product_id,
                      )
                    }
                    const productInit =
                      optionalProduct && optionalProduct[record.index]?.product

                    return (
                      <Form.Item
                        className="ant-form-item-hidden-margin"
                        name={[record.index, 'package']}
                      >
                        <AutoComplete
                          filterPath1={[
                            'optional_product',
                            record.index,
                            'product',
                          ]}
                          labelInValue={true}
                          productsData={productInit}
                          customer={customer}
                          data={product}
                          parent="optional_product"
                          index={record.index}
                          filterPath2={['customer']}
                          resource={`products`}
                          style={{
                            maxWidth: '200px',
                            width: '100%',
                          }}
                          isAwaitingDecision={isAwaitingPriceDecision}
                          onPriceComputed={onPriceComputed}
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
                }
              },
            },
            {
              title: t('quotas.action.optional_info.table.cost_price'),
              dataIndex: 'cost_price',
              key: 'cost_price',
              width: '10%',
              onHeaderCell: () => ({
                style: {
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: '1.2',
                },
              }),
              onCell: (record) => {
                const isCostPriceChanged = priceReflectionChanges?.some(
                  (c) =>
                    c.parent === 'optional_product' &&
                    c.index === record.index &&
                    c.field === 'cost_price',
                )
                return {
                  style: {
                    backgroundColor: isCostPriceChanged ? '#FFF9C4' : undefined,
                  },
                }
              },
              ellipsis: true,
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                } else {
                  if (!record.isSelfCreate) {
                    const cost_price = form.getFieldValue([
                      'optional_product',
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
              title: t('quotas.action.optional_info.table.selling_price'),
              dataIndex: 'selling_price',
              key: 'selling_price',
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
                  return { props: { colSpan: 0 } }
                }
                const isPriceChanged = priceReflectionChanges?.some(
                  (c) =>
                    c.parent === 'optional_product' &&
                    c.index === record.index &&
                    c.field === 'selling_price',
                )
                return (
                  <Form.Item
                    className="ant-form-item-hidden-margin"
                    name={[record.index, 'selling_price']}
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
                  >
                    <InputNumber
                      className="quota-number-input-right"
                      min={0}
                      precision={0}
                      controls={false}
                      onChange={() => {
                        setProductPrincingState((prev) =>
                          prev.filter((item) => item !== record?.product_id),
                        )
                      }}
                      style={{
                        maxWidth: '100px',
                        width: '100%',
                        backgroundColor: isPriceChanged ? '#FFF9C4' : undefined,
                      }}
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: t('quotas.action.optional_info.table.quantity'),
              dataIndex: 'quantity',
              key: 'quantity',
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
                  return { props: { colSpan: 0 } }
                }
                return (
                  <Form.Item
                    className="ant-form-item-hidden-margin"
                    name={[record.index, 'quantity']}
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
                  >
                    <InputNumber
                      className="quota-number-input-right"
                      min={0}
                      precision={0}
                      controls={false}
                      onChange={() => {
                        setProductPrincingState((prev) =>
                          prev.filter((item) => item !== record?.product_id),
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
              title: t('quotas.action.optional_info.table.profit_margin'),
              dataIndex: 'profit_margin',
              key: 'profit_margin',
              width: '6%',
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
                  ]) *
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
                  ]) *
                    form.getFieldValue([
                      'optional_product',
                      record.index,
                      'quantity',
                    ]) || 0

                form.setFieldValue(
                  ['optional_product', record.index, 'profit_margin'],
                  selling > 0
                    ? (((selling - cost) / selling) * 100).toFixed(2)
                    : 0,
                )

                return `${selling > 0 ? (((selling - cost) / selling) * 100).toFixed(2) : 0}%`
              },
            },
            {
              title: t('quotas.action.optional_info.table.selling_amount'),
              dataIndex: 'sellingAmount',
              key: 'sellingAmount',
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
                      'optional_product',
                      record.index,
                      'tax_rate',
                    ]) || 0
                  return `${taxRate}%`
                }
                return (
                  <Form.Item
                    name={[record.index, 'tax_rate']}
                    className="ant-form-item-hidden-margin"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Select
                      options={DEFAULT_TAX_RATES}
                      style={{
                        maxWidth: '200px',
                        width: '100%',
                      }}
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: t('quotas.action.optional_info.table.row_edit'),
              key: 'action',
              width: '7%',
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
                const optionalProduct =
                  form.getFieldValue('optional_product') || []

                // Xác định danh sách hành động
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
                        product: null,
                        isSelfCreate: false,
                        package: null,
                        product_id: null,
                        package_id: null,
                        package_name: '-',
                        name: '',
                        code: '',
                        quantity: 1,
                        cost_price: 0,
                        selling_price: 0,
                        profit_margin: 0,
                        tax_rate: 10,
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
                columns={normalizedColumns}
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
        onCancel={handleClose}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        title={t('products.productCategoryEdit')}
        footer={null}
        destroyOnHidden
      >
        <ProductCategoryModal
          name="optional_product"
          close={handleClose}
          handleChangeProductPrincing={handleChangeProductPrincingOptional}
        />
      </Modal>
      <style jsx global>{`
        .quota-number-input-right .ant-input-number-input {
          text-align: right !important;
        }
      `}</style>
    </Card>
  )
}

export default OptionalInfo

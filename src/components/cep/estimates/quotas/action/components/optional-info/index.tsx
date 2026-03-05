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
  productPrincing,
  optionalProduct,
}: {
  productPrincing?: number[]
  optionalProduct: any
}) {
  const t = useTranslate()
  const form = Form.useFormInstance()

  const customerWatch = Form.useWatch('customer', form)

  const handleAddProduct = (
    groupIndex: number,
    productIndex: number,
    isSelfCreate = false,
  ) => {
    const values = form?.getFieldValue('optional_product') || []
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

    form.setFieldsValue({ optional_product: values })
  }

  const handleRemoveProduct = (groupIndex: number, productIndex: number) => {
    const values = form?.getFieldValue('optional_product') || []
    const products = values[groupIndex].products || []

    values[groupIndex].products = products.filter(
      (_: any, idx: number) => idx !== productIndex,
    )

    form.setFieldsValue({ optional_product: values })
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

  const { data } = useCustom<any>({
    url: `${apiUrl}/products/customer-pricing/${customer?.value}`,
    method: 'get',
    queryOptions: {
      // enabled: !!customer?.value && productIds.every((p: any) => !!p),
      enabled:
        !!customer?.value &&
        productPrincingState.filter((x) => x != null).length > 0,
    },
    config: {
      filters: [
        {
          field: 'ids',
          operator: 'eq',
          value: productPrincingState.join(', '),
        },
      ],
    },
  })

  const handleChangeProductPrincingOptional = useCallback(
    (productIds: number[], isSimple?: boolean) => {
      setProductPrincingState((prev) => [
        ...new Set(isSimple ? productIds : [...prev, ...productIds]),
      ])
    },
    [],
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
          const dataSource: any[] = (
            form.getFieldValue('optional_product') ?? []
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
                isSelfCreate: !item2.product_id,
                ...item2,
              },
            ]),
          ])

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
                if (record.isHeader) {
                  return {
                    children: (
                      <Form.Item
                        className="ant-form-item-hidden-margin"
                        name={[record.index, 'group_name']}
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
                            const allOptionalGroups =
                              form.getFieldValue('optional_product') || []
                            const currentProduct =
                              allOptionalGroups[record.index]?.products?.[
                                record.index2
                              ]
                            const currentCode = currentProduct?.code

                            if (!currentCode) return Promise.resolve()

                            let count = 0

                            for (const group of allOptionalGroups) {
                              const products = group?.products || []
                              for (const item of products) {
                                if (item?.code === currentCode) {
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
                        rules={[
                          {
                            validator: async () => {
                              const allOptionalGroups =
                                form.getFieldValue('optional_product') || []
                              const currentProduct =
                                allOptionalGroups[record.index]?.products?.[
                                  record.index2
                                ]
                              const currentProductId =
                                currentProduct?.product_id

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
                        name={[
                          record.index,
                          'products',
                          record.index2,
                          'product',
                        ]}
                        labelInValue={true}
                        resource="products/list-all"
                        placeholder={t(
                          'quotas.action.detail_info.placeholders.product_search',
                        )}
                        disabled={!customerWatch}
                        defaultValue={{
                          value: form.getFieldValue([
                            'optional_product',
                            record.index,
                            'products',
                            record.index2,
                            'product',
                          ])?.value,
                          label: form.getFieldValue([
                            'optional_product',
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
                                'optional_product',
                                record.index,
                                'products',
                                record.index2,
                                'package',
                              ],
                              null,
                            )
                            form.setFieldValue(
                              [
                                'optional_product',
                                record.index,
                                'products',
                                record.index2,
                                'quantity',
                              ],
                              0,
                            )
                          }

                          form.setFieldValue(
                            [
                              'optional_product',
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
                              'optional_product',
                              record.index,
                              'products',
                              record.index2,
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
                            [
                              'optional_product',
                              record.index,
                              'products',
                              record.index2,
                              'product_id',
                            ],
                            valueOption?.id,
                          )
                          form.setFieldValue(
                            [
                              'optional_product',
                              record.index,
                              'products',
                              record.index2,
                              'name',
                            ],
                            valueOption?.name,
                          )
                          form.setFieldValue(
                            [
                              'optional_product',
                              record.index,
                              'products',
                              record.index2,
                              'code',
                            ],
                            valueOption?.code,
                          )
                          form.setFieldValue(
                            [
                              'optional_product',
                              record.index,
                              'products',
                              record.index2,
                              'unit',
                            ],
                            valueOption?.unit,
                          )
                          form.setFieldValue(
                            [
                              'optional_product',
                              record.index,
                              'products',
                              record.index2,
                              'unit_name',
                            ],
                            valueOption?.unit,
                          )
                          form.setFieldValue(
                            [
                              'optional_product',
                              record.index,
                              'products',
                              record.index2,
                              'cost_price',
                            ],
                            valueOption?.cost_price,
                          )
                          form.setFieldValue(
                            [
                              'optional_product',
                              record.index,
                              'products',
                              record.index2,
                              'selling_price',
                            ],
                            valueOption?.sale_price,
                          )
                          form.setFieldValue(
                            [
                              'optional_product',
                              record.index,
                              'products',
                              record.index2,
                              'tax_rate',
                            ],
                            valueOption?.tax_rate,
                          )
                          form.setFieldValue(
                            [
                              'optional_product',
                              record.index,
                              'products',
                              record.index2,
                              'quantity',
                            ],
                            1,
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
                          whitespace: true,
                          message: '',
                        },
                        {
                          max: 255,
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
                            const currentName = currentProduct?.name

                            if (!currentName) return Promise.resolve()

                            let count = 0

                            for (const group of allOptionalGroups) {
                              const products = group?.products || []
                              for (const item of products) {
                                if (item?.name === currentName) {
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
                    const product = (data?.data ?? []).find(
                      (item: any) => item.id === record?.product_id,
                    )
                    const productInit =
                      optionalProduct &&
                      optionalProduct[record.index]?.products[record.index2]
                        ?.product

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
                            'optional_product',
                            record.index,
                            'products',
                            record.index2,
                            'product',
                          ]}
                          productsData={productInit}
                          customer={customer}
                          data={product}
                          parent="optional_product"
                          index={record.index}
                          index2={record.index2}
                          filterPath2={['customer']}
                          resource={`products`}
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
              ellipsis: true,
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                } else {
                  if (!record.isSelfCreate) {
                    const cost_price = form.getFieldValue([
                      'optional_product',
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
                  >
                    <InputNumber
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
                    name={[record.index, 'products', record.index2, 'quantity']}
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
                  >
                    <InputNumber
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
                  ]) *
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
                  ]) *
                    form.getFieldValue([
                      'optional_product',
                      record.index,
                      'products',
                      record.index2,
                      'quantity',
                    ]) || 0

                form.setFieldValue(
                  [
                    'optional_product',
                    record.index,
                    'products',
                    record.index2,
                    'profit_margin',
                  ],
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
                            product: null,
                            package: null,
                            product_id: null,
                            package_id: null,
                            package_name: '-',
                            isSelfCreate: false,
                            name: '',
                            code: '',
                            quantity: 0,
                            cost_price: 0,
                            selling_price: 0,
                            profit_margin: 0,
                            is_add_total: true,
                            tax_rate: 0,
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
    </Card>
  )
}

export default OptionalInfo

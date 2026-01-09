/* eslint-disable @typescript-eslint/no-explicit-any */
import AutoComplete from '@components/cep/estimates/quotas/action/components/auto-complete'
import { ProductCategoryModal } from '@components/cep/estimates/quotas/action/components/modal/product-category'
import { Action, type ActionType } from '@components/common/action'
import { CoreAutocompleteAPI } from '@components/common/autocomplete-api'
import CommonTable from '@components/common/table'
import { useApiUrl, useCustom, useTranslate } from '@refinedev/core'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Button, Card, Flex, Form, Input, InputNumber, Modal } from 'antd'
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

  const parameterSettings = useUserStore((state) => state.parameterSettings)
  const isProductManager =
    parameterSettings?.get && parameterSettings?.get('products')

  const handleAddProduct = (groupIndex: number, productIndex: number) => {
    const values = form?.getFieldValue('optional_product') || []
    const products = values[groupIndex].products || []

    const newProduct = {
      product: null,
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
      unit: '-',
      unit_name: '-',
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
              width: 200,
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
                          style={{
                            width: 400,
                          }}
                        />
                      </Form.Item>
                    ),
                    props: { colSpan: columns.length - 1 },
                  }
                } else {
                  if (isProductManager) {
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
              title: t(
                'quotas.action.optional_info.table.product_service_name',
              ),
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
                          // form.setFieldValue(
                          //   [
                          //     'optional_product',
                          //     record.index,
                          //     'products',
                          //     record.index2,
                          //     'tax_rate',
                          //   ],
                          //   valueOption?.tax_rate,
                          // )
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
              title: t('quotas.action.optional_info.table.unit'),
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
              title: t('quotas.action.optional_info.table.package'),
              dataIndex: 'package',
              key: 'package',
              width: 200,
              align: 'left',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                } else {
                  if (isProductManager) {
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
                          style={{ width: 200 }}
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
                      <Input placeholder={t('placeholders.input_please')} />
                    </Form.Item>
                  )
                }
              },
            },
            {
              title: t('quotas.action.optional_info.table.cost_price'),
              dataIndex: 'cost_price',
              key: 'cost_price',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                } else {
                  if (isProductManager) {
                    return form.getFieldValue([
                      'optional_product',
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
                    >
                      <InputNumber min={0} precision={0} controls={false} />
                    </Form.Item>
                  )
                }
              },
            },
            {
              title: t('quotas.action.optional_info.table.selling_price'),
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
                    normalize={(val) => val ?? 0}
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
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: t('quotas.action.optional_info.table.quantity'),
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
                    normalize={(val) => val ?? 0}
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
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: t('quotas.action.optional_info.table.profit_margin'),
              dataIndex: 'profit_margin',
              key: 'profit_margin',
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
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      precision={0}
                      style={{ width: 100 }}
                      addonAfter="%"
                      controls={false}
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: t('quotas.action.optional_info.table.selling_amount'),
              dataIndex: 'sellingAmount',
              key: 'sellingAmount',
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
                return quantity * selling
              },
            },

            {
              title: t('quotas.action.optional_info.table.row_edit'),
              key: 'action',
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
                    ? ['append', 'remove']
                    : ['append']

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
                            name: '',
                            code: '',
                            quantity: 0,
                            cost_price: 0,
                            selling_price: 0,
                            profit_margin: 0,
                            is_add_total: true,
                            tax_rate: 0,
                            unit: '-',
                            unit_name: '-',
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

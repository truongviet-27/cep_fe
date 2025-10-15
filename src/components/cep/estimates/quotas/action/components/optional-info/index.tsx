/* eslint-disable @typescript-eslint/no-explicit-any */
import CoreAutoComplete from '@components/cep/estimates/quotas/action/components/auto-complete'
import { ProductCategoryModal } from '@components/cep/estimates/quotas/action/components/modal/product-category'
import { Action, type ActionType } from '@components/common/action'
import CommonTable from '@components/common/table'
import { useSelect } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import { useUserStore } from '@stores/useUserStore'
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
  Select,
} from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { useState } from 'react'

function OptionalInfo() {
  const t = useTranslate()
  const form = Form.useFormInstance()

  // const taxRateWatch = Form.useWatch('tax_rate', form)
  // const consumptionTaxWatch = Form.useWatch('consumption_tax', form)
  const customerWatch = Form.useWatch('customer', form)

  const parameterSettings = useUserStore((state) => state.parameterSettings)
  const isProductManager = parameterSettings.get('products')

  const { selectProps: selectPropsProduct, query } = useSelect({
    resource: 'products',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: {
      mode: 'server',
      pageSize: 100,
    },
    queryOptions: {
      enabled: isProductManager,
    },
  })

  const handleAddProduct = (groupIndex: number, productIndex: number) => {
    const values = form?.getFieldValue('optional_product') || []
    const products = values[groupIndex].products || []

    const newProduct = {
      product_id: null,
      package_id: null,
      name: '',
      code: t('quotas.action.detail_info.default_values.auto_numbering'),
      quantity: 0,
      cost_price: 0,
      selling_price: 0,
      profit_margin: 0,
      is_add_total: true,
      unit: '-',
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

  return (
    <Card
      title={boldText(t('quotas.action.optional_info.title'), PRIMARY, 16)}
      styles={{
        header: { padding: 0, minHeight: 0 },
        body: { padding: 0 },
      }}
      style={{
        border: 'none',
        marginTop: 40,
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
                      ]}
                      style={{
                        width: 300,
                      }}
                    >
                      <Input placeholder={t('quotas.filters.partial_match')} />
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
                      <Form.Item
                        className="ant-form-item-hidden-margin"
                        name={[
                          record.index,
                          'products',
                          record.index2,
                          'product_id',
                        ]}
                      >
                        <Select
                          {...selectPropsProduct}
                          placeholder={t(
                            'quotas.action.detail_info.placeholders.product_search',
                          )}
                          allowClear
                          showSearch
                          filterOption={(input, option) =>
                            ((option?.label ?? '') as string)
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          onSearch={() => {}}
                          style={{
                            width: 200,
                          }}
                          disabled={!customerWatch}
                          onChange={(value) => {
                            const item: any = query.data?.data.find(
                              (item: any) => item.id === value,
                            )
                            form.setFieldValue(
                              [
                                'optional_product',
                                record.index,
                                'products',
                                record.index2,
                                'package_id',
                              ],
                              null,
                            )
                            form.setFieldValue(
                              [
                                'optional_product',
                                record.index,
                                'products',
                                record.index2,
                                'name',
                              ],
                              item?.name,
                            )
                            form.setFieldValue(
                              [
                                'optional_product',
                                record.index,
                                'products',
                                record.index2,
                                'code',
                              ],
                              item?.code,
                            )
                            form.setFieldValue(
                              [
                                'optional_product',
                                record.index,
                                'products',
                                record.index2,
                                'unit',
                              ],
                              item?.unit,
                            )
                            form.setFieldValue(
                              [
                                'optional_product',
                                record.index,
                                'products',
                                record.index2,
                                'cost_price',
                              ],
                              item?.cost_price,
                            )
                            form.setFieldValue(
                              [
                                'optional_product',
                                record.index,
                                'products',
                                record.index2,
                                'selling_price',
                              ],
                              item?.sale_price,
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

                            if (!value) {
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
                          }}
                        />
                      </Form.Item>
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
                      <Input placeholder={t('quotas.filters.partial_match')} />
                    </Form.Item>
                  )
                }
              },
            },
            {
              title: t('quotas.action.optional_info.table.unit'),
              dataIndex: 'unit',
              key: 'unit',
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
                        width: 100,
                      }}
                    >
                      <Input placeholder={t('quotas.filters.partial_match')} />
                    </Form.Item>
                  )
                }
              },
            },
            {
              title: t('quotas.action.optional_info.table.package'),
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
                            'optional_product',
                            record.index,
                            'products',
                            record.index2,
                            'product_id',
                          ]}
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
                      <Input placeholder={t('quotas.filters.partial_match')} />
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
                  >
                    <InputNumber min={0} precision={0} controls={false} />
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
                  >
                    <InputNumber min={0} precision={0} controls={false} />
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
                const cost =
                  form.getFieldValue([
                    'optional_product',
                    record.index,
                    'products',
                    record.index2,
                    'cost_price',
                  ]) || 0

                const selling =
                  form.getFieldValue([
                    'optional_product',
                    record.index,
                    'products',
                    record.index2,
                    'selling_price',
                  ]) || 0

                form.setFieldValue(
                  [
                    'optional_product',
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
                        group_name: t(
                          'quotas.action.optional_info.placeholders.optional_list_name',
                        ),
                        products: [
                          {
                            product_id: null,
                            package_id: null,
                            name: '',
                            code: t(
                              'quotas.action.detail_info.default_values.auto_numbering',
                            ),
                            quantity: 0,
                            cost_price: 0,
                            selling_price: 0,
                            profit_margin: 0,
                            is_add_total: true,
                            unit: '-',
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
                  marginTop: 20,
                  marginBottom: 20,
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
      >
        <ProductCategoryModal name="optional_product" close={handleClose} />
      </Modal>
    </Card>
  )
}

export default OptionalInfo

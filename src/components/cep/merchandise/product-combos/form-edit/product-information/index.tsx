/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CoreAutocompleteAPI } from '@components/common/autocomplete-api'
import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import type { FormInstance } from 'antd'
import { Button, Card, Flex, Form, InputNumber, notification } from 'antd'
import { type ColumnsType } from 'antd/es/table'
import type { AlignType } from 'rc-table/lib/interface'
import { type MutableRefObject, useEffect } from 'react'

import type { ProductComboFormType } from '../use-product-combo-form'

interface ProductInformationProps {
  form: FormInstance<ProductComboFormType>
  addRef: MutableRefObject<
    ((defaultValue?: object, insertIndex?: number) => void) | undefined
  >
}
const ProductInformation: React.FC<ProductInformationProps> = (props) => {
  const { form, addRef } = props
  const t = useTranslate()

  const productsWatch = Form.useWatch('products', form) ?? []
  const idWatch = Form.useWatch('id', form)
  const nameWatch = Form.useWatch('name', form)
  const quantityWatch = Form.useWatch('quantity', form)

  const defaultRow = {
    id: '',
    code: '',
    name: '',
    quantity: 0,
    unit: null,
    cost_price: 0,
    selling_price: 0,
  }

  useEffect(() => {
    if (!productsWatch || productsWatch.length === 0) {
      form.setFieldsValue({
        products: [defaultRow],
      })
    }
  }, [productsWatch, form])

  return (
    <Card
      style={{
        border: 'none',
        marginTop: 20,
      }}
      styles={{
        body: { padding: 0 },
        header: { padding: 0, minHeight: 0 },
      }}
    >
      <Form.List name={'products'}>
        {(fields, { add, remove }) => {
          addRef.current = add
          const columns: ColumnsType = [
            {
              title: t('quotas.action.detail_info.table.product_code'),
              dataIndex: 'code',
              key: 'code',
              align: 'left',
              width: 200,
              render: (_, record) => {
                return form.getFieldValue(['products', record.name, 'code'])
              },
            },
            {
              title: t('product_combos.productInfoTable.header.productName'),
              dataIndex: 'name',
              key: 'name',
              align: 'left',
              width: 200,
              render: (_, record, index: number) => {
                return (
                  <CoreAutocompleteAPI
                    name={[index, 'name']}
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                      {
                        validator: async (_: any, value: any) => {
                          const products = form.getFieldValue('products') || []
                          const currentId = products[index]?.id
                          console.log(value)
                          if (!currentId) return Promise.resolve()
                          const isDuplicate = products.some(
                            (item: any, idx: number) =>
                              item.id === currentId && idx !== index,
                          )
                          if (isDuplicate) {
                            notification.error({
                              message: '',
                              description: `${value?.label ?? value}という商品名は複数です。`,
                              key: `name-${value?.label ?? value}`,
                              placement: 'topRight',
                            })
                            return Promise.reject()
                          }
                          return Promise.resolve()
                        },
                      },
                    ]}
                    defaultValue={{
                      value: form.getFieldValue(['products', record.name, 'id'])
                        ?.value,
                      label: form.getFieldValue([
                        'products',
                        record.name,
                        'name',
                      ]),
                    }}
                    resource="products"
                    placeholder={t(
                      'quotas.action.detail_info.placeholders.product_search',
                    )}
                    onChangeValue={(valueOption) => {
                      form.setFieldValue(
                        ['products', record.name, 'id'],
                        valueOption?.id,
                      )
                      form.setFieldValue(
                        ['products', record.name, 'name'],
                        valueOption?.name,
                      )
                      form.setFieldValue(
                        ['products', record.name, 'code'],
                        valueOption?.code,
                      )
                      form.setFieldValue(
                        ['products', record.name, 'unit_name'],
                        valueOption?.unit,
                      )
                      form.setFieldValue(
                        ['products', record.name, 'cost_price'],
                        valueOption?.cost_price,
                      )
                      form.setFieldValue(
                        ['products', record.name, 'selling_price'],
                        valueOption?.sale_price,
                      )
                      form.setFieldValue(
                        ['products', record.name, 'quantity'],
                        1,
                      )
                      if (!valueOption) {
                        form.setFieldValue(
                          ['products', record.name, 'quantity'],
                          0,
                        )
                      }
                    }}
                  />
                )
              },
            },
            {
              title: t('quotas.action.detail_info.table.unit'),
              dataIndex: 'unit_name',
              key: 'unit_name',
              align: 'center',
              width: 200,
              render: (_, record) => {
                return (
                  form.getFieldValue(['products', record.name, 'unit_name']) ??
                  '-'
                )
              },
            },
            {
              title: t('quotas.action.detail_info.table.quantity'),
              dataIndex: 'quantity',
              key: 'quantity',
              render: (_: unknown, __: unknown, index: number) => {
                return (
                  <Form.Item
                    className="ant-form-item-hidden-margin"
                    name={[index, 'quantity']}
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                    normalize={(val) => val ?? 1}
                  >
                    <InputNumber
                      min={1}
                      precision={0}
                      controls={false}
                      className="product-combo-quantity-input-right"
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: t('product_combos.productInfoTable.header.costPrice'),
              dataIndex: 'cost_price',
              key: 'cost_price',
              render: (_, record) => {
                return Number(
                  form.getFieldValue(['products', record.name, 'cost_price']) ??
                    0,
                ).toLocaleString()
              },
            },
            {
              title: t('product_combos.productInfoTable.header.sellingPrice'),
              dataIndex: 'selling_price',
              key: 'selling_price',
              render: (_, record) => {
                return Number(
                  form.getFieldValue([
                    'products',
                    record.name,
                    'selling_price',
                  ]),
                ).toLocaleString()
              },
            },
            {
              title: t('products.fields.actions'),
              dataIndex: 'action',
              className: '!content-start',
              render: (_: unknown, __: unknown, index: number) => (
                <Button
                  size="small"
                  autoInsertSpace={false}
                  style={{
                    color: '#FFFFFF',
                    background: '#E74C3C',
                    borderColor: '#E74C3C',
                  }}
                  onClick={() => {
                    remove(index)
                  }}
                >
                  {t('buttons.delete')}
                </Button>
              ),
            },
          ]
          const numberColumnKeys = ['cost_price', 'selling_price']
          const centerColumnKeys = ['action', 'quantity']
          const mappedColumns = columns.map((column) => {
            const key = String(
              (column as any).key ?? (column as any).dataIndex ?? '',
            )
            const originalOnCell = (column as any).onCell

            return {
              ...column,
              align: (centerColumnKeys.includes(key)
                ? 'center'
                : numberColumnKeys.includes(key)
                  ? 'right'
                  : 'left') as AlignType,
              onHeaderCell: (col: unknown) => {
                const originalHeaderCell =
                  (column as any).onHeaderCell?.(col) ?? {}
                return {
                  ...originalHeaderCell,
                  style: {
                    ...(originalHeaderCell as any).style,
                    textAlign: 'center',
                  },
                }
              },
              onCell: (record: unknown, rowIndex: number | undefined) => {
                const originalCell =
                  originalOnCell?.(record as any, rowIndex) ?? {}
                return {
                  ...originalCell,
                  style: {
                    ...(originalCell as any).style,
                    padding: '8px 12px',
                  },
                }
              },
            }
          })

          return (
            <>
              <Flex vertical>
                <CommonTable
                  columns={mappedColumns}
                  dataSource={fields}
                  rowClassName={(record) =>
                    record.isHeader ? 'bg-[#E6F7FF] font-bold' : ''
                  }
                  pagination={false}
                  rowKey={'key'}
                />
                <style jsx global>{`
                  .product-combo-quantity-input-right .ant-input-number-input {
                    text-align: right !important;
                  }
                `}</style>
              </Flex>
              <div className="mt-4 text-right">
                <Button
                  type="primary"
                  onClick={() => {
                    add({
                      id: null,
                      code: null,
                      name: '',
                      quantity: 0,
                      unit: null,
                      cost_price: 0,
                      selling_price: 0,
                    })
                  }}
                >
                  {t('products.buttons.addRow')}
                </Button>
              </div>
            </>
          )
        }}
      </Form.List>
    </Card>
  )
}

export default ProductInformation

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable simple-import-sort/imports */

import { useEffect, type MutableRefObject } from 'react'
import { Action } from '@components/common/action'
import CoreInput from '@components/common/core-input'
import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import type { FormInstance } from 'antd'
import { Button, Checkbox, Form, Input, InputNumber, notification } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { CheckboxChangeEvent } from 'antd/lib'

import type { ProductFormType } from '../use-product-form'

interface PackagingUnitPriceProps {
  form: FormInstance<ProductFormType>
  addRef: MutableRefObject<
    ((defaultValue?: object, insertIndex?: number) => void) | undefined
  >
}

const PackagingUnitPrice: React.FC<PackagingUnitPriceProps> = (props) => {
  const { form, addRef } = props
  const t = useTranslate()
  const { getFieldValue, setFieldValue } = form
  const packagings = Form.useWatch('packagings', form) ?? []

  const toNumberOrZero = (value: unknown) => {
    const n = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(n) ? n : 0
  }

  const codeWatch = Form.useWatch('code', form)
  const nameWatch = Form.useWatch('name', form)
  const categoryWatch = Form.useWatch('category', form)
  const unitIdWatch = Form.useWatch('unit_id', form)
  const costPriceWatch = Form.useWatch('cost_price', form)
  const sellingPriceWatch = Form.useWatch('selling_price', form)

  useEffect(() => {
    if (!packagings?.length) return
    if (sellingPriceWatch === undefined || sellingPriceWatch === null) return

    const baseSellingPrice = toNumberOrZero(sellingPriceWatch)
    const currentBase = toNumberOrZero(
      getFieldValue(['packagings', 0, 'selling_price']),
    )

    if (currentBase !== baseSellingPrice) {
      setFieldValue(['packagings', 0, 'selling_price'], baseSellingPrice)
    }

    packagings.forEach((packaging, index) => {
      if (index === 0) return
      if (!packaging?.is_standard_price) return
      const quantity = toNumberOrZero(
        getFieldValue(['packagings', index, 'quantity_in_package']),
      )
      const nextSellingPrice = quantity * baseSellingPrice
      const currentSellingPrice = toNumberOrZero(
        getFieldValue(['packagings', index, 'selling_price']),
      )
      if (currentSellingPrice !== nextSellingPrice) {
        setFieldValue(['packagings', index, 'selling_price'], nextSellingPrice)
      }
    })
  }, [sellingPriceWatch, packagings, getFieldValue, setFieldValue])

  const onStandardPriceChange = (event: CheckboxChangeEvent, index: number) => {
    const isChecked = event.target.checked

    if (isChecked) {
      const quantityInPackage =
        getFieldValue(['packagings', index, 'quantity_in_package']) || 1
      setFieldValue(
        ['packagings', index, 'selling_price'],
        (quantityInPackage as number) * getFieldValue('selling_price'),
      )
    }
  }

  return (
    <div className="px-2">
      <Form.List name={'packagings'}>
        {(fields, { add, remove }) => {
          addRef.current = add

          const centerHeaderCell = () => ({
            style: { textAlign: 'center' as const },
          })
          const rightCell = () => ({
            style: {
              overflow: 'hidden',
              minWidth: 0,
              maxWidth: '100%',
              textAlign: 'right' as const,
            },
          })

          const columns = [
            {
              title: t('products.fields.packagingCode'),
              dataIndex: 'code',
              width: 10,
              align: 'center',
              className: '!content-start',
              render: (_: unknown, __: unknown, index: number) => (
                <div className="mt-1">
                  <CoreInput name={[index, 'code']} readOnly={true} hidden />
                  {getFieldValue(['packagings', index, 'code'])}
                </div>
              ),
            },
            {
              title: t('products.fields.packagingName'),
              dataIndex: 'name',
              width: 15,
              align: 'left',
              className: '!content-start',
              render: (_: unknown, __: unknown, index: number) => (
                <>
                  {index === 0 && (
                    <div className="mt-1">
                      {form.getFieldValue(['packagings', index, 'name'])}
                    </div>
                  )}
                  <Form.Item
                    name={[index, 'name']}
                    hidden={index === 0}
                    required
                    rules={[
                      { required: true, message: '' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value) {
                            return Promise.resolve()
                          }
                          const packagings = getFieldValue('packagings') || []
                          const isDuplicate = packagings.some(
                            (item: { name: string }, i: number) =>
                              i !== index &&
                              item?.name?.trim() === value?.trim(),
                          )
                          if (isDuplicate) {
                            notification.error({
                              message: ``,
                              description: `${value}という荷姿名は複数です。`,
                              key: `name-${value?.trim()}`,
                              placement: 'topRight',
                            })
                            return Promise.reject(
                              new Error(t('validation.duplicate_name')),
                            )
                          }
                          return Promise.resolve()
                        },
                      }),
                    ]}
                    className="ant-form-item-hidden-margin"
                    style={{ marginBottom: '0px !important' }}
                    help=""
                  >
                    <Input />
                  </Form.Item>
                </>
              ),
            },
            {
              title: t('products.fields.barcode'),
              dataIndex: 'barcode',
              width: 15,
              className: '!content-start',
              onHeaderCell: centerHeaderCell,
              onCell: () => ({
                style: {
                  overflow: 'hidden',
                  minWidth: 0,
                  maxWidth: '100%',
                  textAlign: 'center' as const,
                },
              }),
              render: (_: unknown, __: unknown, index: number) => (
                <>
                  {index === 0 && (
                    <div className="mt-1 text-center">
                      {form.getFieldValue(['packagings', index, 'barcode'])}
                    </div>
                  )}
                  <CoreInput
                    name={[index, 'barcode']}
                    styleForm={{ marginBottom: '0px !important' }}
                    hidden={index === 0}
                    style={{ textAlign: 'right' }}
                    rules={[
                      {
                        pattern: /^[0-9]*$/,
                        message: '',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value) {
                            return Promise.resolve()
                          }
                          const packagings = getFieldValue('packagings') || []
                          const isDuplicate = packagings.some(
                            (item: { barcode: string }, i: number) =>
                              i !== index &&
                              item?.barcode?.trim() === value?.trim(),
                          )
                          if (isDuplicate) {
                            notification.error({
                              message: ``,
                              description: `${value}というバーコードは複数です。`,
                              key: `barcode-${value?.trim()}`,
                              placement: 'topRight',
                            })
                            return Promise.reject(new Error(''))
                          }
                          return Promise.resolve()
                        },
                      }),
                    ]}
                  />
                </>
              ),
            },
            {
              title: t('products.fields.quantity'),
              dataIndex: 'quantity_in_package',
              width: 10,
              className: '!content-start',
              onHeaderCell: centerHeaderCell,
              onCell: rightCell,
              render: (_: unknown, __: unknown, index: number) => (
                <>
                  {index === 0 && (
                    <div className="mt-1 text-right">
                      {form.getFieldValue([
                        'packagings',
                        index,
                        'quantity_in_package',
                      ])}
                    </div>
                  )}
                  <div style={{ width: '100%', minWidth: 0 }}>
                    {index !== 0 && (
                      <Form.Item
                        name={[index, 'quantity_in_package']}
                        required
                        rules={[{ required: true, message: '' }]}
                        className="ant-form-item-hidden-margin"
                        style={{
                          marginBottom: '0px !important',
                          width: '100%',
                        }}
                        help=""
                      >
                        <InputNumber
                          min={1}
                          controls={false}
                          className="packaging-unit-price-number-input-right"
                          style={{ width: '100%', minWidth: 0 }}
                          onChange={(value) => {
                            const baseSellingPrice = toNumberOrZero(
                              getFieldValue('selling_price'),
                            )
                            const quantity = toNumberOrZero(value) || 1
                            const standardSellingPrice =
                              quantity * baseSellingPrice

                            setFieldValue(
                              [
                                'packagings',
                                index,
                                'cost_price' as keyof object,
                              ],
                              standardSellingPrice,
                            )

                            if (
                              getFieldValue([
                                'packagings',
                                index,
                                'is_standard_price',
                              ])
                            ) {
                              setFieldValue(
                                ['packagings', index, 'selling_price'],
                                standardSellingPrice,
                              )
                            }
                          }}
                        />
                      </Form.Item>
                    )}
                  </div>
                </>
              ),
            },
            {
              title: t('products.fields.unit'),
              dataIndex: 'unit_id',
              width: 10,
              className: '!content-start',
              onHeaderCell: () => ({
                style: { textAlign: 'left' as const },
              }),
              onCell: () => ({
                style: {
                  overflow: 'hidden',
                  minWidth: 0,
                  maxWidth: '100%',
                  textAlign: 'left' as const,
                },
              }),
              render: (_: unknown, __: unknown, index: number) => (
                <div className="mt-1">
                  <CoreInput name={[index, 'unit_id']} readOnly={true} hidden />
                  {form.getFieldValue('unit')}
                </div>
              ),
            },
            {
              title: t('products.fields.standardPrice'),
              dataIndex: 'cost_price',
              width: 10,
              className: '!content-start',
              onHeaderCell: centerHeaderCell,
              onCell: rightCell,
              render: (value: string, __: unknown, index: number) => (
                <div className="mt-1 text-right">
                  {(
                    toNumberOrZero(getFieldValue('selling_price')) *
                    toNumberOrZero(
                      getFieldValue([
                        'packagings',
                        index,
                        'quantity_in_package',
                      ]),
                    )
                  ).toLocaleString()}
                </div>
              ),
            },
            {
              title: t('products.fields.sellingPrice'),
              dataIndex: 'selling_price',
              width: 10,
              className: '!content-start',
              onHeaderCell: centerHeaderCell,
              onCell: rightCell,
              render: (_: unknown, __: unknown, index: number) => {
                return (
                  <>
                    {index === 0 && (
                      <div className="mt-1 text-right">
                        {toNumberOrZero(
                          form.getFieldValue([
                            'packagings',
                            index,
                            'selling_price',
                          ]),
                        ).toLocaleString()}
                      </div>
                    )}
                    <div style={{ width: '100%', minWidth: 0 }}>
                      {index !== 0 && (
                        <Form.Item
                          className="ant-form-item-hidden-margin"
                          name={[index, 'selling_price']}
                          required
                          rules={[
                            {
                              required: true,
                              message: t('validation.required'),
                            },
                          ]}
                          style={{
                            marginBottom: '0px !important',
                            width: '100%',
                          }}
                        >
                          <InputNumber
                            min={0}
                            controls={false}
                            disabled={packagings?.[index]?.is_standard_price}
                            className="packaging-unit-price-number-input-right"
                            style={{ width: '100%', minWidth: 0 }}
                          />
                        </Form.Item>
                      )}
                    </div>
                  </>
                )
              },
            },
            {
              title: t('products.fields.isStandard'),
              dataIndex: 'is_standard_price',
              width: 5,
              className: '!content-start',
              render: (_: unknown, __: unknown, index: number) =>
                index !== 0 && (
                  <Form.Item
                    name={[index, 'is_standard_price']}
                    valuePropName="checked"
                    noStyle
                    className="ant-form-item-hidden-margin"
                    style={{ marginBottom: '0px !important' }}
                  >
                    <Checkbox
                      className="!mt-1"
                      style={{
                        transform: 'scale(1.3)',
                        marginBottom: 0,
                      }}
                      checked={getFieldValue([
                        'packagings',
                        index,
                        'is_standard_price',
                      ])}
                      onChange={(event: CheckboxChangeEvent) =>
                        onStandardPriceChange(event, index)
                      }
                    />
                  </Form.Item>
                ),
            },
            {
              title: t('products.fields.actions'),
              dataIndex: 'action',
              width: 4,
              className: '!content-start',
              render: (_: unknown, __: unknown, index: number) =>
                index > 0 && (
                  <Action
                    actionList={['remove']}
                    onRemoveAction={() => {
                      remove(index)
                    }}
                  />
                ),
            },
          ] as ColumnsType

          return (
            <>
              <Form.Item shouldUpdate>
                <CommonTable
                  columns={columns}
                  dataSource={fields}
                  pagination={false}
                  scroll={fields.length ? { y: 55 * 5, x: 1500 } : { x: 1000 }}
                  rowClassName={(_, index) =>
                    index === 0 ? 'bg-[#edeff1] pointer-events-none' : ''
                  }
                  locale={{
                    emptyText: (
                      <div className="text-center text-gray-300">
                        データがありません。
                      </div>
                    ),
                  }}
                />
              </Form.Item>
              <style jsx global>{`
                .packaging-unit-price-number-input-right
                  .ant-input-number-input {
                  text-align: right !important;
                }
              `}</style>
              <div className="mt-4 text-right">
                <Button
                  type="primary"
                  disabled={fields.length < 1}
                  onClick={() => {
                    add({
                      code: getFieldValue('code')
                        ? `${getFieldValue('code')}-${fields.length}`
                        : `${fields.length}`,
                      name: '',
                      is_active: true,
                      quantity_in_package: 1,
                      unit_id: getFieldValue('unit_id'),
                      cost_price: getFieldValue(`selling_price`),
                      selling_price: getFieldValue(`selling_price`),
                      is_standard_price: true,
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
    </div>
  )
}

export default PackagingUnitPrice

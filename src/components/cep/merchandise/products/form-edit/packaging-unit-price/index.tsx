import { Action } from '@components/common/action'
import CoreInput from '@components/common/core-input'
import CommonTable from '@components/common/table'
import type { GetListResponse } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import type { Rank } from '@sdk/hey-api'
import type { FormInstance } from 'antd'
import { Button, Checkbox, Form, Input, InputNumber, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { CheckboxChangeEvent } from 'antd/lib'
import type { MutableRefObject } from 'react'

import type { ProductFormType } from '../use-product-form'

interface PackagingUnitPriceProps {
  form: FormInstance<ProductFormType>
  addRef: MutableRefObject<
    ((defaultValue?: object, insertIndex?: number) => void) | undefined
  >

  ranks?: GetListResponse<Rank>
}

const PackagingUnitPrice: React.FC<PackagingUnitPriceProps> = (props) => {
  const { form, addRef, ranks } = props
  const t = useTranslate()
  const { getFieldValue, setFieldValue } = form
  const packagings = Form.useWatch('packagings', form) ?? []

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
                <Form.Item
                  name={[index, 'name']}
                  required
                  rules={[
                    { required: true, message: t('validation.required') },
                  ]}
                  className="ant-form-item-hidden-margin"
                  style={{ marginBottom: '0px !important' }}
                >
                  <Input />
                </Form.Item>
              ),
            },
            {
              title: t('products.fields.barcode'),
              dataIndex: 'barcode',
              width: 15,
              className: '!content-start',
              render: (_: unknown, __: unknown, index: number) => (
                <CoreInput
                  name={[index, 'barcode']}
                  styleForm={{ marginBottom: '0px !important' }}
                />
              ),
            },
            {
              title: t('products.fields.quantity'),
              dataIndex: 'quantity_in_package',
              width: 10,
              className: '!content-start',
              render: (_: unknown, __: unknown, index: number) => (
                <Form.Item
                  name={[index, 'quantity_in_package']}
                  required
                  rules={[
                    { required: true, message: t('validation.required') },
                  ]}
                  className="ant-form-item-hidden-margin"
                  style={{ marginBottom: '0px !important' }}
                >
                  <InputNumber
                    min={1}
                    controls={false}
                    onChange={(value) => {
                      setFieldValue(
                        ['packagings', index, 'cost_price' as keyof object],
                        (value as number) * getFieldValue('selling_price'),
                      )
                      setFieldValue(
                        ['packagings', index, 'selling_price'],
                        (value as number) *
                          getFieldValue(['packagings', index, 'selling_price']),
                      )

                      const rankObject: Record<string, number> = {}

                      ranks?.data?.forEach(({ id, rate }) => {
                        rankObject[`rank_${id}`] = Math.round(
                          ((rate ?? 0) / 100) * getFieldValue('selling_price'),
                        )

                        setFieldValue(
                          ['packagings', index, `rank_${id}` as keyof object],
                          Math.round(
                            ((rate ?? 0) / 100) *
                              (value as number) *
                              getFieldValue('selling_price'),
                          ),
                        )
                      })
                    }}
                  />
                </Form.Item>
              ),
            },
            {
              title: t('products.fields.unit'),
              dataIndex: 'unit_id',
              width: 10,
              className: '!content-start',
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
              render: (value: string, __: unknown, index: number) => (
                <div className="mt-1">
                  {getFieldValue('selling_price') *
                    getFieldValue(['packagings', index, 'quantity_in_package'])}
                </div>
              ),
            },
            {
              title: t('products.fields.sellingPrice'),
              dataIndex: 'selling_price',
              width: 10,
              className: '!content-start',
              render: (_: unknown, __: unknown, index: number) => {
                return (
                  <Form.Item
                    className="ant-form-item-hidden-margin"
                    name={[index, 'selling_price']}
                    required
                    rules={[
                      { required: true, message: t('validation.required') },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      controls={false}
                      disabled={packagings?.[index]?.is_standard_price}
                    />
                  </Form.Item>
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
                  // rowClassName="bg-[#BBBBBB] hover:!bg-[#ccc]"
                  scroll={fields.length ? { y: 55 * 5, x: 1500 } : { x: 1000 }}
                  rowClassName={(_, index) => (!index ? 'hidden' : '')}
                  locale={{
                    emptyText: (
                      <div className="text-center text-gray-300">
                        データがありません。
                      </div>
                    ),
                  }}
                  summary={
                    fields.length == 1
                      ? () => (
                          <Table.Summary.Row className="!bg-white">
                            <Table.Summary.Cell
                              index={0}
                              colSpan={9}
                              align="center"
                              className="!p-[11px] text-gray-300"
                            >
                              データがありません。
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        )
                      : undefined
                  }
                />
              </Form.Item>
              <div className="mt-4 text-right">
                <Button
                  type="primary"
                  disabled={fields.length < 1}
                  onClick={() => {
                    const rankObject: Record<string, number> = {}

                    ranks?.data?.forEach(({ id, rate }) => {
                      rankObject[`rank_${id}`] = Math.round(
                        ((rate ?? 0) / 100) * getFieldValue('selling_price'),
                      )
                    })

                    add({
                      code: `${getFieldValue('code')}-${fields.length}`,
                      name: '',
                      is_active: true,
                      quantity_in_package: 1,
                      unit_id: getFieldValue('unit_id'),
                      cost_price: getFieldValue(`selling_price`),
                      selling_price: getFieldValue(`selling_price`),
                      is_standard_price: true,
                      is_rate_based: true,
                      ...rankObject,
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

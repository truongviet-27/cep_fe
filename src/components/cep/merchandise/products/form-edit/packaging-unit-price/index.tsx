import { Action } from '@components/common/action'
import CoreInput from '@components/common/core-input'
import CommonTable from '@components/common/table'
import type { GetListResponse } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import type { Rank } from '@sdk/hey-api'
import type { FormInstance } from 'antd'
import { Button, Checkbox, Form } from 'antd'
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
  const packagings = Form.useWatch('packagings', form)

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
              width: '10%',
              align: 'center',
              render: (_: unknown, __: unknown, index: number) => (
                <CoreInput
                  name={[index, 'code']}
                  readOnly={true}
                  style={{
                    background: 'transparent',
                    paddingLeft: 0,
                    color: 'inherit',
                    border: 'none',
                    boxShadow: 'none',
                    cursor: 'default',
                  }}
                  styleForm={{
                    marginBottom: '0px',
                  }}
                />
              ),
            },
            {
              title: t('products.fields.packagingName'),
              dataIndex: 'name',
              width: '15%',
              align: 'left',
              render: (_: unknown, __: unknown, index: number) => (
                <CoreInput
                  name={[index, 'name']}
                  readOnly={!index}
                  style={{
                    ...(!index
                      ? {
                          background: 'transparent',
                          paddingLeft: 0,
                          color: 'inherit',
                          border: 'none',
                          boxShadow: 'none',
                          cursor: 'default',
                        }
                      : {}),
                    width: '100%',
                  }}
                  styleForm={{
                    marginBottom: '0px',
                  }}
                />
              ),
            },
            {
              title: t('products.fields.barcode'),
              dataIndex: 'barcode',
              width: '15%',
              render: (_: unknown, __: unknown, index: number) => (
                <CoreInput
                  name={[index, 'barcode']}
                  readOnly={!index}
                  style={{
                    ...(!index
                      ? {
                          background: 'transparent',
                          paddingLeft: 0,
                          color: 'inherit',
                          border: 'none',
                          boxShadow: 'none',
                          cursor: 'default',
                        }
                      : {}),
                    width: '100%',
                  }}
                  styleForm={{
                    marginBottom: '0px',
                  }}
                />
              ),
            },
            {
              title: t('products.fields.quantity'),
              dataIndex: 'quantity_in_package',
              width: '10%',
              render: (_: unknown, __: unknown, index: number) => (
                <CoreInput
                  name={[index, 'quantity_in_package']}
                  readOnly={!index}
                  type="number"
                  style={{
                    ...(!index
                      ? {
                          background: 'transparent',
                          paddingLeft: 0,
                          color: 'inherit',
                          border: 'none',
                          boxShadow: 'none',
                          cursor: 'default',
                        }
                      : {}),
                    width: '100%',
                  }}
                  styleForm={{
                    marginBottom: '0px',
                  }}
                  onChangeValue={(value) => {
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
              ),
            },
            {
              title: t('products.fields.unit'),
              dataIndex: 'unit_id',
              width: '10%',
              render: (_: unknown, __: unknown, index: number) => (
                <>
                  <CoreInput name={[index, 'unit_id']} readOnly={true} hidden />
                  {form.getFieldValue('unit')}
                </>
              ),
            },
            {
              title: t('products.fields.standardPrice'),
              dataIndex: 'cost_price',
              width: '10%',
              className: 'p-[0px !important]',
              render: (value: string, __: unknown, index: number) => {
                return (
                  getFieldValue('selling_price') *
                  getFieldValue(['packagings', index, 'quantity_in_package'])
                )
              },
            },
            {
              title: t('products.fields.sellingPrice'),
              dataIndex: 'selling_price',
              width: '10%',
              render: (_: unknown, __: unknown, index: number) => {
                return (
                  <CoreInput
                    name={[index, 'selling_price']}
                    readOnly={!index}
                    type="number"
                    style={{
                      ...(!index
                        ? {
                            background: 'transparent',
                            paddingLeft: 0,
                            color: 'inherit',
                            border: 'none',
                            boxShadow: 'none',
                            cursor: 'default',
                          }
                        : {}),
                      width: '100%',
                    }}
                    styleForm={{
                      marginBottom: '0px',
                    }}
                    disabled={packagings?.[index]?.is_standard_price}
                  />
                )
              },
            },
            {
              title: t('products.fields.isStandard'),
              dataIndex: 'is_standard_price',
              width: '5%',
              render: (_: unknown, __: unknown, index: number) =>
                index !== 0 && (
                  <Form.Item
                    name={[index, 'is_standard_price']}
                    valuePropName="checked"
                    noStyle
                  >
                    <Checkbox
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
              width: '5%',
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
                  scroll={{ y: 55 * 5 }}
                  rowClassName={(_, index) => (!index ? 'hidden' : '')}
                />
              </Form.Item>
              <div className="mt-4 text-right">
                <Button
                  type="primary"
                  disabled={fields.length < 1}
                  onClick={() => {
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

import { Action } from '@components/common/action'
import CommonTable from '@components/common/table'
import CoreInput from '@components/organism/CoreInput'
import { useTranslate } from '@refinedev/core'
import type { FormInstance } from 'antd'
import { Button, Checkbox, Form, Radio } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { MutableRefObject } from 'react'

import type { ProductFormType } from '../use-product-detail'

interface PackagingUnitPriceProps {
  isView: boolean
  form: FormInstance<ProductFormType>
  addRef: MutableRefObject<
    ((defaultValue?: object, insertIndex?: number) => void) | undefined
  >
}

const PackagingUnitPrice: React.FC<PackagingUnitPriceProps> = (props) => {
  const { isView, form, addRef } = props
  const t = useTranslate()
  const { getFieldValue, setFieldValue } = form

  return (
    <div className="px-2">
      <Form.List name={'packagings'}>
        {(fields, { add, remove }) => {
          addRef.current = add

          const columns = [
            {
              title: t('products.fields.packagingCode'),
              dataIndex: 'code',
              render: (_, __, index) => (
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
              render: (_, __, index) => (
                <CoreInput
                  name={[index, 'name']}
                  readOnly={
                    index === 0 ||
                    getFieldValue(['packagings', index, 'is_active']) ===
                      'inactive'
                  }
                  style={{
                    ...(index === 0 ||
                    getFieldValue(['packagings', index, 'is_active']) ===
                      'inactive'
                      ? {
                          background: 'transparent',
                          paddingLeft: 0,
                          color: 'inherit',
                          border: 'none',
                          boxShadow: 'none',
                          cursor: 'default',
                        }
                      : {}),
                  }}
                  styleForm={{
                    marginBottom: '0px',
                  }}
                />
              ),
            },
            {
              title: t('products.fields.status'),
              dataIndex: 'is_active',
              render: (_, __, index) =>
                index === 0 ? (
                  <div>{t('products.text.active')}</div>
                ) : (
                  <Form.Item
                    name={[index, 'is_active']}
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Radio.Group
                      options={[
                        {
                          value: true,
                          label: t('products.text.active'),
                        },
                        {
                          value: false,
                          label: t('products.text.inactive'),
                        },
                      ]}
                    />
                  </Form.Item>
                ),
            },
            {
              title: t('products.fields.quantity'),
              dataIndex: 'quantity_in_package',
              render: (_, __, index) => (
                <CoreInput
                  name={[index, 'quantity_in_package']}
                  readOnly={
                    index === 0 ||
                    getFieldValue(['packagings', index, 'is_active']) ===
                      'inactive'
                  }
                  type="number"
                  style={{
                    ...(index === 0 ||
                    getFieldValue(['packagings', index, 'is_active']) ===
                      'inactive'
                      ? {
                          background: 'transparent',
                          paddingLeft: 0,
                          color: 'inherit',
                          border: 'none',
                          boxShadow: 'none',
                          cursor: 'default',
                        }
                      : {}),
                  }}
                  styleForm={{
                    marginBottom: '0px',
                  }}
                  onChangeValue={(value) => {
                    setFieldValue(
                      ['packagings', index, 'cost_price'],
                      (value as number) * getFieldValue('selling_price'),
                    )
                    setFieldValue(
                      ['packagings', index, 'selling_price'],
                      (value as number) * getFieldValue('selling_price'),
                    )
                  }}
                />
              ),
            },
            {
              title: t('products.fields.unit'),
              dataIndex: 'unit_id',
              render: (_, __, index) => (
                <>
                  <CoreInput name={[index, 'unit_id']} readOnly={true} hidden />
                  {form.getFieldValue('unit')}
                </>
              ),
            },
            {
              title: t('products.fields.standardPrice'),
              dataIndex: 'cost_price',
              render: (_, __, index) => {
                return (
                  <CoreInput
                    name={[index, 'cost_price']}
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
                )
              },
            },
            {
              title: t('products.fields.sellingPrice'),
              dataIndex: 'selling_price',
              render: (_, __, index) => {
                return (
                  <CoreInput
                    name={[index, 'selling_price']}
                    readOnly={
                      index === 0 ||
                      getFieldValue(['packagings', index, 'is_active']) ===
                        t('products.text.inactive')
                    }
                    type="number"
                    style={{
                      ...(index === 0 ||
                      getFieldValue(['packagings', index, 'is_active']) ===
                        t('products.text.inactive')
                        ? {
                            background: 'transparent',
                            paddingLeft: 0,
                            color: 'inherit',
                            border: 'none',
                            boxShadow: 'none',
                            cursor: 'default',
                          }
                        : {}),
                    }}
                    styleForm={{
                      marginBottom: '0px',
                    }}
                  />
                )
              },
            },
            {
              title: t('products.fields.isStandard'),
              dataIndex: 'is_standard_price',
              render: (_, __, index) =>
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
                      disabled={
                        getFieldValue(['packagings', index, 'is_active']) ===
                        'inactive'
                      }
                    />
                  </Form.Item>
                ),
            },
            {
              title: t('products.fields.actions'),
              dataIndex: 'action',
              render: (_, __, index) =>
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
                  rowClassName={(_, index) =>
                    getFieldValue(['packagings', index, 'is_active']) ===
                    t('products.text.inactive')
                      ? 'bg-[#BBBBBB] hover:!bg-[#ccc]'
                      : ''
                  }
                />
              </Form.Item>
              {!isView && (
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
              )}
            </>
          )
        }}
      </Form.List>
    </div>
  )
}

export default PackagingUnitPrice

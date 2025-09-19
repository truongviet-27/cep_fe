import CommonTable from '@components/common/table'
import { useList, useTranslate } from '@refinedev/core'
import type { Rank } from '@sdk/hey-api'
import { Form, Radio } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { FormInstance } from 'antd/lib'
import { useMemo } from 'react'

import type { ProductFormType } from '../use-product-form'

interface PriceGroupProps {
  form: FormInstance<ProductFormType>
}

const PriceGroup: React.FC<PriceGroupProps> = (props) => {
  const { form } = props
  const { getFieldValue } = form
  const t = useTranslate()

  const { data: ranks } = useList<Rank>({
    resource: 'ranks',
    // queryOptions: {
    //   enabled: !!name_lk_value,
    // },
  })
  const renderRanks = useMemo(() => {
    return (
      ranks?.data.map((rank) => ({
        title: (
          <>
            {rank.name}
            <br />
            {rank.rate}% (円)
          </>
        ),
        dataIndex: `rank_${rank.id}`,
        key: `rank_${rank.id}`,
        render: (_: unknown, __: unknown, index: number) => {
          return (
            <Form.Item
              shouldUpdate
              style={{
                marginBottom: 0,
              }}
            >
              {() =>
                (
                  getFieldValue(['packagings', index, 'selling_price']) *
                  ((rank.rate ?? 0) / 100)
                ).toFixed(2)
              }
            </Form.Item>
          )
        },
      })) ?? []
    )
  }, [ranks])

  return (
    <div className="px-2">
      <Form.List name={'packagings'}>
        {(fields) => {
          const columns = [
            {
              title: t('products.fields.productCode'),
              dataIndex: 'code',
              key: 'code',
              render: (_: unknown, __: unknown, index: number) => {
                return (
                  <Form.Item
                    shouldUpdate
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    {() => getFieldValue(['packagings', index, 'code'])}
                  </Form.Item>
                )
              },
            },
            {
              title: t('products.fields.productName'),
              dataIndex: 'name',
              key: 'name',
              render: (_: unknown, __: unknown, index: number) => {
                return (
                  <Form.Item
                    shouldUpdate
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    {() => getFieldValue(['packagings', index, 'name'])}
                  </Form.Item>
                )
              },
            },
            {
              title: t('products.unitPriceGroup.sellingPrice'),
              dataIndex: 'selling_price',
              key: 'selling_price',
              render: (_: unknown, __: unknown, index: number) => {
                return (
                  <Form.Item
                    shouldUpdate
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    {() =>
                      getFieldValue(['packagings', index, 'selling_price'])
                    }
                  </Form.Item>
                )
              },
            },
            {
              title: t('products.unitPriceGroup.settingMethod'),
              dataIndex: 'is_active',
              key: 'is_active',
              render: (_: unknown, __: unknown, index: number) =>
                index === 0 ? (
                  <div>{t('products.text.active')}</div>
                ) : (
                  <Form.Item name={[index, 'is_active']}>
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
            ...renderRanks,
          ] as ColumnsType
          return (
            <Form.Item shouldUpdate>
              {({ getFieldValue }) => {
                return (
                  <CommonTable
                    columns={columns}
                    dataSource={fields}
                    bordered
                    pagination={false}
                    rowClassName={(_, index) => {
                      return getFieldValue(['packagings', index, 'status']) ===
                        t('products.text.inactive')
                        ? 'bg-[#BBBBBB] hover:!bg-[#ccc]'
                        : ''
                    }}
                  />
                )
              }}
            </Form.Item>
          )
        }}
      </Form.List>
    </div>
  )
}

export default PriceGroup

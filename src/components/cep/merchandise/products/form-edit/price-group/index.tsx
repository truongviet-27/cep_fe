import CommonTable from '@components/common/table'
import type { GetListResponse } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import { type Rank } from '@sdk/hey-api'
import { Form, InputNumber, Radio } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { FormInstance } from 'antd/lib'
import { sortBy } from 'lodash'
import { useMemo } from 'react'

import type { ProductFormType } from '../use-product-form'

interface PriceGroupProps {
  form: FormInstance<ProductFormType>
  ranks?: GetListResponse<Rank>
}

const PriceGroup: React.FC<PriceGroupProps> = (props) => {
  const { form, ranks } = props
  const { getFieldValue } = form
  const t = useTranslate()
  const packagingsWatch = Form.useWatch('packagings', form)
  const costPriceWatch = Form.useWatch('cost_price', form)

  const renderRanks = useMemo(() => {
    return (
      sortBy(ranks?.data ?? [], 'rate').map((rank) => ({
        title: (
          <>
            {rank.name}
            <br />
            {rank.rate}% (円)
          </>
        ),
        dataIndex: `rank_${rank.id}`,
        key: `rank_${rank.id}`,
        align: 'center',
        render: (value: number, __: unknown, index: number) => {
          const caculator = Math.round(
            (packagingsWatch?.[index].selling_price || 0) *
              ((rank.rate ?? 0) / 100),
          )
          const isRateBased = packagingsWatch?.[index].is_rate_based
          const formValue = getFieldValue([
            'packagings',
            index,
            `rank_${rank.id}` as keyof object,
          ])
          const currentRankPrice = isRateBased
            ? caculator
            : (formValue ?? caculator)
          return (
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-row items-center justify-center">
                <Form.Item
                  name={[index, 'rank_' + rank.id]}
                  hidden={isRateBased}
                  className="ant-form-item-hidden-margin"
                  required
                  rules={[
                    { required: true, message: t('validation.required') },
                  ]}
                >
                  <InputNumber
                    defaultValue={caculator}
                    className="text-center"
                    min={0}
                    controls={false}
                  />
                </Form.Item>
                {isRateBased ? caculator : ''}
              </div>
              {currentRankPrice < costPriceWatch ? (
                <span className="text-[8px] text-red-500">
                  原価より低く設定されています
                </span>
              ) : null}
            </div>
          )
        },
      })) ?? []
    )
  }, [ranks, packagingsWatch])

  return (
    <div className="px-2">
      <Form.List name={'packagings'}>
        {(fields) => {
          const columns = [
            {
              title: t('products.fields.packagingCode'),
              dataIndex: 'code',
              key: 'code',
              width: 200,
              render: (_: unknown, __: unknown, index: number) => {
                return (
                  <Form.Item
                    shouldUpdate
                    className="ant-form-item-hidden-margin"
                  >
                    {() => getFieldValue(['packagings', index, 'code'])}
                  </Form.Item>
                )
              },
            },
            {
              title: t('products.fields.packagingName'),
              dataIndex: 'name',
              key: 'name',
              width: 200,
              render: (_: unknown, __: unknown, index: number) => {
                return (
                  <Form.Item
                    shouldUpdate
                    className="ant-form-item-hidden-margin"
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
              width: 200,
              render: (_: unknown, __: unknown, index: number) => {
                return (
                  <Form.Item
                    shouldUpdate
                    className="ant-form-item-hidden-margin"
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
              dataIndex: 'is_rate_based',
              key: 'is_rate_based',
              width: 200,
              render: (_: unknown, __: unknown, index: number) => (
                <Form.Item
                  name={[index, 'is_rate_based']}
                  className="ant-form-item-hidden-margin"
                >
                  <Radio.Group
                    options={[
                      {
                        value: true,
                        label: '掛率',
                      },
                      {
                        value: false,
                        label: '絶対',
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
                    scroll={
                      fields.length ? { y: 55 * 5, x: 1500 } : { x: 1000 }
                    }
                    locale={{
                      emptyText: (
                        <div className="text-center text-gray-300">
                          データがありません。
                        </div>
                      ),
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

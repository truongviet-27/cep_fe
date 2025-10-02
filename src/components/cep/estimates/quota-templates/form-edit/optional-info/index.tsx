import type { ActionType } from '@components/common/action'
import { Action } from '@components/common/action'
import CoreAutoComplete from '@components/common/auto-complete'
import CommonTable from '@components/common/table'
import type {
  QuotaTemplateFormType,
  QuotaTemplateMainProductType,
  QuotaTemplateProductType,
} from '@interfaces/quota-templates'
import { useSelect } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import type {
  ProductListItem,
  QuotaTemplateProductGroupRequest,
  QuotaTemplateProductItemRequest,
} from '@sdk/hey-api'
import { PRIMARY } from '@utility/color'
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { FC } from 'react'

const { Title } = Typography

const OptionalInfo: FC = () => {
  const form = Form.useFormInstance<QuotaTemplateFormType>()
  const optionalProducts = Form.useWatch(
    'optional_product',
    form,
  ) as QuotaTemplateMainProductType[]
  const t = useTranslate()

  const { selectProps: selectPropsProduct, query } = useSelect({
    resource: 'products',
    optionLabel: 'name',
    optionValue: 'id',
    onSearch(value) {
      return [
        {
          field: 'name',
          operator: 'contains',
          value,
        },
      ]
    },
  })

  console.log(query)

  const handleAddProduct = (groupIndex: number) => {
    const values = optionalProducts || []
    const products = (values[groupIndex].products ||
      []) as QuotaTemplateProductType[]

    values[groupIndex].products = [
      ...products,
      {
        product_id: 0,
        name: '',
        code: '自動採番',
        quantity: 0,
        cost_price: 0,
        selling_price: 0,
        profit_margin: 0,
        is_add_total: false,
      },
    ]

    form?.setFieldsValue({ optional_product: values })
  }

  const handleRemoveProduct = (groupIndex: number, productIndex: number) => {
    const values = form.getFieldValue('optional_product') || []
    const products = values[groupIndex].products || []

    values[groupIndex].products = products.filter(
      (_: unknown, idx: number) => idx !== productIndex,
    )

    form?.setFieldsValue({ optional_product: values })
  }

  return (
    <>
      <Title
        level={5}
        style={{ color: PRIMARY }}
        className="!mb-4 border-b-1 border-gray-200 pb-2 text-[14px]"
      >
        {t('quota_templates.form.titleOptionalInfo')}
      </Title>
      <Form.List name={'optional_product'}>
        {(_, { add, remove }) => {
          const mainProduct = (form?.getFieldValue('optional_product') ??
            []) as QuotaTemplateProductGroupRequest[]
          const dataSource = mainProduct.flatMap(
            (item: QuotaTemplateProductGroupRequest, index: number) => [
              {
                index,
                key: `header-${index}`,
                isHeader: true,
                title: item.group_name,
              },
              ...(item.products ?? []).flatMap(
                (item2: QuotaTemplateProductItemRequest, index2: number) => [
                  {
                    index,
                    index2,
                    ...item2,
                  },
                ],
              ),
            ],
          )

          const columns: ColumnsType = [
            {
              title: '商品コード',
              dataIndex: 'code',
              key: 'code',
              align: 'left',
              width: 200,
              render: (_, record) => {
                if (record.isHeader) {
                  return {
                    children: (
                      <Form.Item
                        name={[record.index, 'group_name']}
                        style={{
                          marginBottom: 0,
                        }}
                      >
                        <Input
                          placeholder="商品リスト名入力"
                          style={{
                            width: 400,
                          }}
                        />
                      </Form.Item>
                    ),
                    props: { colSpan: columns.length - 1 },
                  }
                }
                return form.getFieldValue([
                  'optional_product',
                  record.index,
                  'products',
                  record.index2,
                  'code',
                ])
              },
            },
            {
              title: '商品・サービス名',
              dataIndex: 'name',
              key: 'name',
              align: 'left',
              width: 200,
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }

                return (
                  <Form.Item
                    name={[
                      record.index,
                      'products',
                      record.index2,
                      'product_id',
                    ]}
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Select
                      placeholder="商品名・サービス名で検索"
                      allowClear
                      showSearch
                      filterOption={false}
                      style={{
                        width: 200,
                      }}
                      {...selectPropsProduct}
                      onChange={(value) => {
                        const item = query.data?.data.find(
                          (item) => item.id === value,
                        ) as ProductListItem

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
                      }}
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: '単位',
              dataIndex: 'unit',
              key: 'unit',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return form.getFieldValue([
                  'optional_product',
                  record.index,
                  'products',
                  record.index2,
                  'unit',
                ])
              },
            },
            {
              title: '荷姿',
              dataIndex: 'package_id',
              key: 'package_id',
              width: 200,
              align: 'left',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return (
                  <Form.Item
                    name={[
                      'optional_product',
                      record.index,
                      'products',
                      record.index2,
                      'package_id',
                    ]}
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <CoreAutoComplete
                      nameFilter="package_name"
                      filterPath={[
                        'optional_product',
                        record.index,
                        'products',
                        record.index2,
                        'product_id',
                      ]}
                      // index={record.index}
                      // index2={record.index2}
                      // filterPath2={['customer']}
                      resource={`products`}
                      style={{ width: 200 }}
                      // parent="optional_product"
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: '原価',
              dataIndex: 'cost_price',
              key: 'cost_price',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return form.getFieldValue([
                  'optional_product',
                  record.index,
                  'products',
                  record.index2,
                  'cost_price',
                ])
              },
            },
            {
              title: '売単価',
              dataIndex: 'selling_price',
              key: 'selling_price',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return (
                  <Form.Item
                    name={[
                      record.index,
                      'products',
                      record.index2,
                      'selling_price',
                    ]}
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <InputNumber min={0} controls={false} />
                  </Form.Item>
                )
              },
            },
            {
              title: '数量',
              dataIndex: 'quantity',
              key: 'quantity',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return (
                  <Form.Item
                    name={[record.index, 'products', record.index2, 'quantity']}
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <InputNumber min={0} controls={false} />
                  </Form.Item>
                )
              },
            },
            {
              title: '利益率',
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
              title: '売価金額',
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
              title: '行編集',
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
                            product_id: null,
                            package_id: null,
                            name: '',
                            code: '自動採番',
                            quantity: 0,
                            cost_price: 0,
                            selling_price: 0,
                            profit_margin: 0,
                            is_add_total: false,
                          },
                        ],
                      },
                      record.index + 1,
                    )
                  } else {
                    handleAddProduct(record.index)
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
                <Button type="primary">カテゴリから入力</Button>
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
    </>
  )
}

export default OptionalInfo

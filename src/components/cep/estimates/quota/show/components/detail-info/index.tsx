/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action, type ActionType } from '@components/common/action'
import CommonTable from '@components/common/table'
import { PRIMARY } from '@utility/color'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
} from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'

const { Text } = Typography

function DetailInfo() {
  const form = Form.useFormInstance()

  const data = [
    { label: '原価合計', value: '¥23,500' },
    { label: '消費税金額（10%）', value: '¥2,600' },
    { label: '合計利益率', value: '27%' },
    { label: '合計金額（税込）', value: '¥28,600' },
  ]

  const handleAddProduct = (groupIndex: number) => {
    const values = form?.getFieldValue('original_product') || []
    const products = values[groupIndex].products || []

    values[groupIndex].products = [
      ...products,
      {
        id: Date.now(),
        product_id: null,
        package_id: null,
        name: '',
        code: '自動採番',
        cost_price: 0,
        selling_price: 0,
        profit_margin: 0,
        is_add_total: true,
      },
    ]

    form.setFieldsValue({ original_product: values })
  }

  const handleRemoveProduct = (groupIndex: number, productIndex: number) => {
    const values = form.getFieldValue('original_product') || []
    const products = values[groupIndex].products || []

    values[groupIndex].products = products.filter(
      (_: any, idx: number) => idx !== productIndex,
    )

    form.setFieldsValue({ original_product: values })
  }

  return (
    <Card
      title={'詳細情報'}
      headStyle={{
        padding: 0,
        minHeight: 0,
      }}
      bodyStyle={{
        padding: 0,
      }}
      style={{
        border: 'none',
        marginTop: 40,
      }}
    >
      <Form.List name={'original_product'}>
        {(_, { add, remove }) => {
          const dataSource: any[] = (
            form?.getFieldValue('original_product') ?? []
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
              title: '商品コード',
              dataIndex: 'code',
              key: 'code',
              align: 'left',
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
                          value={record.title}
                          style={{
                            width: 400,
                          }}
                        />
                      </Form.Item>
                    ),
                    props: { colSpan: columns.length - 1 },
                  }
                }
                return record.code
              },
            },
            {
              title: '商品・サービス名',
              dataIndex: 'name',
              key: 'name',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }

                return (
                  <Form.Item
                    name={[record.index, 'products', record.index2, 'name']}
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Input
                      placeholder="商品名・サービス名で検索"
                      value={form.getFieldValue([
                        record.index,
                        'products',
                        record.index2,
                        'name',
                      ])}
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
                return record?.unit
              },
            },
            {
              title: '荷姿',
              dataIndex: 'package',
              key: 'package',
              width: 200,
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return (
                  <Form.Item
                    name={[record.index, 'products', record.index2, 'package']}
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Select allowClear showSearch />
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
                return record.cost_price
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
                return record.profit_margin
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
                return 0
              },
            },
            {
              title: '合計計算',
              dataIndex: 'is_add_total',
              key: 'is_add_total',
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
                      'is_add_total',
                    ]}
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Checkbox
                      defaultChecked={form.getFieldValue([
                        'original_product',
                        record.index,
                        'products',
                        record.index2,
                        'is_add_total',
                      ])}
                    />
                  </Form.Item>
                )
              },
            },
            {
              title: '行編集',
              key: 'action',
              render: (_, record) => {
                const isHeader = record.isHeader

                const lengthOriginalProduct =
                  form.getFieldValue('original_product').length > 1
                const lengthProduct =
                  form.getFieldValue([
                    'original_product',
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
                        group_name: 'group_name3',
                        products: [
                          {
                            id: 3,
                            product_id: 1,
                            package_id: 2,
                            name: '',
                            code: '自動採番',
                            cost_price: 123123,
                            selling_price: 123123,
                            profit_margin: 12,
                            is_add_total: true,
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
                summary={() => {
                  return (
                    <Table.Summary.Row
                      style={{
                        background: '#F0F9FF',
                        color: PRIMARY,
                        fontWeight: 700,
                      }}
                    >
                      <Table.Summary.Cell index={0} colSpan={3} align="center">
                        小計
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}></Table.Summary.Cell>
                      <Table.Summary.Cell index={2}></Table.Summary.Cell>
                      <Table.Summary.Cell index={3}></Table.Summary.Cell>
                      <Table.Summary.Cell index={4}></Table.Summary.Cell>
                      <Table.Summary.Cell index={5}></Table.Summary.Cell>
                      <Table.Summary.Cell index={6} align="center">
                        {0}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7}></Table.Summary.Cell>
                      <Table.Summary.Cell index={8}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  )
                }}
              />

              <Card bordered={false}>
                <Row gutter={[16, 16]}>
                  {data.map((item, idx) => (
                    <Col span={12} key={idx}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          border: '1px solid #f0f0f0',
                          borderRadius: 6,
                          background: '#F8F9FA',
                        }}
                      >
                        <Text type="secondary">{item.label}</Text>
                        <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                          {item.value}
                        </Text>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Flex>
          )
        }}
      </Form.List>
    </Card>
  )
}

export default DetailInfo

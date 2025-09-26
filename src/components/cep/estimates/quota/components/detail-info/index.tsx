/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from '@components/common/action'
import FormItem from '@components/common/FormItem'
import CommonTable from '@components/common/table'
import { PRIMARY } from '@utility/color'
import { Button, Card, Checkbox, Flex, Form, Input, InputNumber } from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'

function DetailInfo() {
  const form = Form.useFormInstance()
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
        {(fields, { add, remove }) => {
          const columns: ColumnsType = [
            {
              title: '商品コード',
              dataIndex: 'productCode',
              key: 'productCode',
              align: 'left',
              render: (_, record) => {
                if (record.children) {
                  return {
                    children: (
                      <Form.Item name={'title'}>
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
                return 'AR001'
              },
            },
            {
              title: '商品・サービス名',
              dataIndex: 'productName',
              key: 'productName',
              render: (_, record) => {
                if (record.children) {
                  return { props: { colSpan: 0 } }
                }

                return (
                  <FormItem>
                    <Input placeholder="商品名・サービス名で検索" />
                  </FormItem>
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
                return
              },
            },
            {
              title: '荷姿',
              dataIndex: 'package',
              key: 'package',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return <Input />
              },
            },
            {
              title: '原価',
              dataIndex: 'costPrice',
              key: 'costPrice',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return 123
              },
            },
            {
              title: '売単価',
              dataIndex: 'sellingPrice',
              key: 'sellingPrice',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return <InputNumber min={0} controls={false} />
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
                return <InputNumber min={0} controls={false} />
              },
            },
            {
              title: '利益率',
              dataIndex: 'profitRate',
              key: 'profitRate',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return record
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
                return record
              },
            },
            {
              title: '合計計算',
              dataIndex: 'total',
              key: 'total',
              render: (_, record) => {
                if (record.isHeader) {
                  return { props: { colSpan: 0 } }
                }
                return <Checkbox />
              },
            },
            {
              title: '行編集',
              key: 'action',
              render: (_, record, index) => {
                return (
                  <Action
                    actionList={['append', 'remove']}
                    onAppendAction={() => {
                      if (record.isHeader) {
                        add(
                          {
                            title: '123',
                            children: [{}],
                          },
                          index + 1,
                        )
                      }
                    }}
                    onRemoveAction={() => {
                      if (record.isHeader) {
                        console.log(record.isHeader, index, 'index')
                        remove(index)
                      }
                    }}
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
                dataSource={form?.getFieldValue('original_product')}
                rowClassName={(record) =>
                  record.isHeader ? 'bg-[#E6F7FF] font-bold' : ''
                }
                components={{
                  body: {
                    row: () => (
                      <>
                        <td
                          colSpan={columns.length - 1}
                          style={{
                            backgroundColor: '#F0F9FF',
                            color: PRIMARY,
                            textAlign: 'center',
                            padding: 11,
                          }}
                        >
                          <Form.Item style={{ marginBottom: 0, maxWidth: 300 }}>
                            <Input />
                          </Form.Item>
                        </td>
                        <td
                          style={{
                            backgroundColor: '#F0F9FF',
                            color: PRIMARY,
                            textAlign: 'center',
                            padding: 11,
                          }}
                        >
                          <Action
                            actionList={['append', 'remove']}
                            onAppendAction={() => {}}
                            onRemoveAction={() => {}}
                          />
                        </td>
                      </>
                    ),
                  },
                }}
                pagination={false}
                summary={() => {
                  // let totalQty = 0
                  // let totalAmount = 0
                  // pageData.forEach(({ quantity, sellingAmount }) => {
                  //   totalQty += quantity
                  //   totalAmount += sellingAmount
                  // })

                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={3} align="center">
                        小計
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}></Table.Summary.Cell>
                      <Table.Summary.Cell index={2}></Table.Summary.Cell>
                      <Table.Summary.Cell index={3}></Table.Summary.Cell>
                      <Table.Summary.Cell index={4}></Table.Summary.Cell>
                      <Table.Summary.Cell index={5}></Table.Summary.Cell>
                      <Table.Summary.Cell index={6}>{0}</Table.Summary.Cell>
                      <Table.Summary.Cell index={7}></Table.Summary.Cell>
                      <Table.Summary.Cell index={8}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  )
                }}
              />
            </Flex>
          )
        }}
      </Form.List>
    </Card>
  )
}

export default DetailInfo

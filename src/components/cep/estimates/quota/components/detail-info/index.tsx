import { Action } from '@components/common/action'
import CommonTable from '@components/common/table'
import { Card, Checkbox, Form, Input, InputNumber, Select } from 'antd'
import { type ColumnsType } from 'antd/es/table'

function DetailInfo() {
  return (
    <Card
      title={'詳細情報'}
      headStyle={{
        padding: 0,
        minHeight: 'none',
      }}
      bodyStyle={{
        padding: 0,
      }}
      style={{
        border: 'none',
        marginTop: 40,
      }}
    >
      <Form.List name={'detail_info'}>
        {(fields) => {
          const columns: ColumnsType = [
            {
              title: '商品コード',
              dataIndex: 'productCode',
              key: 'productCode',
              render: () => <Input placeholder="商品リスト名入力" />,
            },
            {
              title: '商品・サービス名',
              dataIndex: 'productName',
              key: 'productName',
              render: () => <Input placeholder="商品名・サービス名で検索" />,
            },
            {
              title: '単位',
              dataIndex: 'unit',
              key: 'unit',
              render: () => (
                <Select
                  style={{ width: 80 }}
                  options={[
                    { label: '-', value: '-' },
                    { label: '個', value: '個' },
                    { label: '箱', value: '箱' },
                  ]}
                />
              ),
            },
            {
              title: '荷姿',
              dataIndex: 'package',
              key: 'package',
              render: () => <Input />,
            },
            {
              title: '原価',
              dataIndex: 'costPrice',
              key: 'costPrice',
              render: () => <InputNumber min={0} />,
            },
            {
              title: '売単価',
              dataIndex: 'sellingPrice',
              key: 'sellingPrice',
              render: () => <InputNumber min={0} />,
            },
            {
              title: '数量',
              dataIndex: 'quantity',
              key: 'quantity',
              render: () => <InputNumber min={0} />,
            },
            {
              title: '利益率',
              dataIndex: 'profitRate',
              key: 'profitRate',
              render: () => <span>未計算</span>, // chưa tính
            },
            {
              title: '売価金額',
              dataIndex: 'sellingAmount',
              key: 'sellingAmount',
              render: () => <span>未計算</span>, // chưa tính
            },
            {
              title: '合計計算',
              dataIndex: 'total',
              key: 'total',
              render: () => <Checkbox />,
            },
            {
              title: '行編集',
              key: 'action',
              render: () => (
                <Action
                  actionList={['append', 'remove']}
                  onAppendAction={() => {}}
                  onRemoveAction={() => {}}
                />
              ),
            },
          ]

          return (
            <CommonTable
              columns={columns}
              dataSource={fields}
              style={{
                marginTop: 20,
              }}
              pagination={false}
            />
          )
        }}
      </Form.List>
    </Card>
  )
}

export default DetailInfo

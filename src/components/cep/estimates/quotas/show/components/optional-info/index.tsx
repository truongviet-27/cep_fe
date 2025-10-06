/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonTable from '@components/common/table'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Card, Flex, Form } from 'antd'
import { type ColumnsType } from 'antd/es/table'

function OptionalInfo({ data }: { data: any }) {
  const dataSource: any[] = (data ?? []).flatMap((item: any) => [
    {
      isHeader: true,
      title: item.group_name,
    },
    ...(item.products ?? []).flatMap((item2: any) => [
      {
        ...item2,
      },
    ]),
  ])
  const columns: ColumnsType = [
    {
      title: 'オプション情報',
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
                {record.title}
              </Form.Item>
            ),
            props: { colSpan: columns.length },
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
            style={{
              marginBottom: 0,
            }}
          >
            {record.name}
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
        return (
          <Form.Item
            style={{
              marginBottom: 0,
            }}
          >
            {record?.unit_name}
          </Form.Item>
        )
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
            style={{
              marginBottom: 0,
            }}
          >
            {record?.package_name}
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
        return (
          <Form.Item
            style={{
              marginBottom: 0,
            }}
          >
            {record?.cost_price}
          </Form.Item>
        )
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
            style={{
              marginBottom: 0,
            }}
          >
            {record?.selling_price}
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
            style={{
              marginBottom: 0,
            }}
          >
            {record?.quantity}
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
        return (
          <Form.Item
            style={{
              marginBottom: 0,
            }}
          >
            {record?.profit_margin}%
          </Form.Item>
        )
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
        return (
          <Form.Item
            style={{
              marginBottom: 0,
            }}
          >
            {(record?.selling_price || 0) * (record?.quantity || 1)}
          </Form.Item>
        )
      },
    },
  ]
  return (
    <Card
      title={boldText('オプション情報', PRIMARY, 16)}
      headStyle={{
        padding: 0,
        minHeight: 0,
      }}
      bodyStyle={{
        padding: 0,
      }}
      style={{
        border: 'none',
      }}
    >
      <Flex
        vertical
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <CommonTable
          columns={columns}
          dataSource={dataSource}
          rowClassName={(record) =>
            record.isHeader ? 'bg-[#E6F7FF] font-bold' : ''
          }
          pagination={false}
        />
      </Flex>
    </Card>
  )
}

export default OptionalInfo

/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonTable from '@components/common/table'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Card, Checkbox, Col, Flex, Form, Row, Typography } from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'

const { Text } = Typography

function DetailInfo({ basicInfo, data }: { basicInfo: any; data: any }) {
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
            {record?.profit_margin}
          </Form.Item>
        )
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
            style={{
              marginBottom: 0,
            }}
          >
            <Checkbox
              style={{
                transform: 'scale(1.3)',
                marginBottom: 0,
              }}
              checked={record.is_add_total}
            />
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
      title={boldText('詳細情報', PRIMARY, 16)}
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
                <Table.Summary.Cell index={6}></Table.Summary.Cell>
                <Table.Summary.Cell align="center" index={7}>
                  {0}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )
          }}
        />

        <Row gutter={[16, 16]} style={{ marginTop: 20, marginBottom: 40 }}>
          <Col span={12}>
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
              <Text
                style={{
                  fontWeight: 700,
                }}
              >
                原価合計
              </Text>
              <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                {basicInfo?.total_cost}
              </Text>
            </div>
          </Col>
          <Col span={12}>
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
              <Text
                style={{
                  fontWeight: 700,
                }}
              >
                消費税金額（{basicInfo?.tax_rate}%）
              </Text>
              <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                {basicInfo?.consumption_tax_amount}
              </Text>
            </div>
          </Col>
          <Col span={12}>
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
              <Text
                style={{
                  fontWeight: 700,
                }}
              >
                合計利益率
              </Text>
              <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                {basicInfo?.total_profit_margin}%
              </Text>
            </div>
          </Col>
          <Col span={12}>
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
              <Text
                style={{
                  fontWeight: 700,
                }}
              >
                合計金額（税込）
              </Text>
              <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                {basicInfo?.total_price_tax_included}
              </Text>
            </div>
          </Col>
        </Row>
      </Flex>
    </Card>
  )
}

export default DetailInfo

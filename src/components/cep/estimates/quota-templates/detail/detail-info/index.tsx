import CommonTable from '@components/common/table'
import type {
  QuotaTemplateMainProductType,
  QuotaTemplateProductType,
} from '@interfaces/quota-templates'
import { useTranslate } from '@refinedev/core'
import type {
  QuotaTemplateProductGroupRequest,
  QuotaTemplateProductItemRequest,
} from '@sdk/hey-api'
import { PRIMARY } from '@utility/color'
import { Col, Flex, Form, InputNumber, Row, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import type { FC } from 'react'
import { useState } from 'react'

const { Title, Text } = Typography

const DetailInfo: FC = () => {
  const taxRateWatch = 1
  const mainProducts = [] as QuotaTemplateMainProductType[]

  const [costTotal] = useState(0)
  const [profitRate] = useState(0)
  const [taxTotal] = useState(0)
  const [sellTotalWithTax] = useState(0)
  const t = useTranslate()

  const dataSource = mainProducts.flatMap(
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
            children: <></>,
            props: { colSpan: columns.length - 1 },
          }
        }

        return <></>
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

        return <></>
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
        return <></>
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
        return <></>
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
        return <></>
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
        return <></>
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
        return <></>
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

        return <></>
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

        return <></>
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
        return <></>
      },
    },
  ]

  return (
    <>
      <Title
        level={5}
        style={{ color: PRIMARY }}
        className="!mb-2 border-b-1 border-gray-200 pb-2 text-[14px]"
      >
        {t('quota_templates.form.titleDetailInfo')}
      </Title>
      <Flex vertical>
        <CommonTable
          columns={columns}
          dataSource={dataSource}
          rowClassName={(record) =>
            record.isHeader ? 'bg-[#E6F7FF] font-bold' : ''
          }
          pagination={false}
          summary={() => {
            const total = (mainProducts ?? []).reduce(
              (accGroup: number, group: QuotaTemplateMainProductType) => {
                const groupTotal = (group.products ?? []).reduce(
                  (accProd: number, prod: QuotaTemplateProductType) => {
                    if (prod.is_add_total) {
                      return (
                        accProd +
                        (prod.selling_price || 0) * (prod.quantity || 0)
                      )
                    }
                    return accProd
                  },
                  0,
                )
                return accGroup + groupTotal
              },
              0,
            )
            return (
              <Table.Summary.Row
                style={{
                  background: '#F0F9FF',
                  color: PRIMARY,
                  fontWeight: 700,
                }}
              >
                <Table.Summary.Cell index={0} colSpan={9} align="center">
                  小計
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="center">
                  {total || 0}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )
          }}
        />
      </Flex>

      <Row gutter={[16, 16]} className="p-8">
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
              {costTotal || 0}
            </Text>
            <Form.Item name="total_cost" hidden>
              <InputNumber />
            </Form.Item>
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
              消費税金額（{taxRateWatch}%）
            </Text>
            <Text style={{ color: '#1890ff', fontWeight: 500 }}>
              {taxTotal || 0}
            </Text>
            <Form.Item name="consumption_tax_amount" hidden>
              <InputNumber />
            </Form.Item>
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
              {profitRate.toFixed(2) || 0}%
            </Text>
            <Form.Item name="total_profit_margin" hidden>
              <InputNumber />
            </Form.Item>
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
              {sellTotalWithTax || 0}
            </Text>
            <Form.Item name="total_price_tax_included" hidden>
              <InputNumber />
            </Form.Item>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default DetailInfo

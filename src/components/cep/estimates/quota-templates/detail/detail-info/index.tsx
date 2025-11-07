/* eslint-disable @typescript-eslint/no-explicit-any */

import CommonTable from '@components/common/table'
import type { QuoteTemplateDetailType } from '@interfaces/quota-templates'
import { useTranslate } from '@refinedev/core'
import type {
  QuotaTemplateProductGroupResponse,
  QuotaTemplateProductResponse,
} from '@sdk/hey-api'
import { PRIMARY } from '@utility/color'
import { Card, Checkbox, Col, Flex, Row, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import type { FC } from 'react'
import { useMemo } from 'react'

const { Title, Text } = Typography

interface Props {
  detail: QuoteTemplateDetailType
}

const DetailInfo: FC<Props> = (props) => {
  const { detail } = props
  const t = useTranslate()

  const dataSource = (detail?.main_product ?? []).flatMap(
    (item: QuotaTemplateProductGroupResponse, index: number) => [
      {
        index,
        key: `header-${index}`,
        isHeader: true,
        title: item.group_name,
      },
      ...(item.products ?? []).flatMap(
        (item2: QuotaTemplateProductResponse, index2: number) => [
          {
            index,
            index2,
            ...item2,
          },
        ],
      ),
    ],
  )

  const calculateGroupedTotal = (data: Record<string, any>) => {
    const totalByTaxRate = data.reduce(
      (acc: Record<string, any>, item: Record<string, any>) => {
        if (item.isHeader || !item.is_add_total) {
          return acc
        }
        const sellingPrice = parseFloat(item.selling_price || 0)
        const quantity = parseFloat(item.quantity || 0)
        const taxRate = parseFloat(item.tax_rate || 0)
        const calculatedValue = (sellingPrice * quantity * taxRate) / 100
        const key = String(taxRate)
        acc[key] = (acc[key] || 0) + calculatedValue

        return acc
      },
      {},
    )

    return Object.entries(totalByTaxRate).map(([taxRate, total]) => ({
      taxRate: parseFloat(taxRate),
      total: (total as number).toFixed(2),
    }))
  }

  const groupedTotals = useMemo(() => {
    return calculateGroupedTotal(dataSource)
  }, [dataSource])

  const columns: ColumnsType = [
    {
      title: '商品コード',
      dataIndex: 'code',
      key: 'code',
      align: 'left',
      width: 200,
      render: (value, record) => {
        if (record.isHeader) {
          return {
            children: record.title,
            props: { colSpan: columns.length },
          }
        }

        return value
      },
    },
    {
      title: '商品・サービス名',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      width: 200,
      render: (value, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }

        return value
      },
    },
    {
      title: '単位',
      dataIndex: 'unit_name',
      key: 'unit_name',
      render: (unit_name, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return unit_name
      },
    },
    {
      title: '荷姿',
      dataIndex: 'package_name',
      key: 'package_name',
      width: 200,
      align: 'left',
      render: (package_name, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return package_name
      },
    },
    {
      title: '原価',
      dataIndex: 'cost_price',
      key: 'cost_price',
      render: (value, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return value?.toLocaleString()
      },
    },
    {
      title: '売単価',
      dataIndex: 'selling_price',
      key: 'selling_price',
      render: (selling_price, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return selling_price?.toLocaleString()
      },
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return quantity
      },
    },
    {
      title: '利益率',
      dataIndex: 'profit_margin',
      key: 'profit_margin',
      render: (profit_margin, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }

        return `${profit_margin}%`
      },
    },
    {
      title: t('quotas.show.table.tax_rate'),
      dataIndex: 'tax_rate',
      key: 'tax_rate',
      render: (_, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return `${record?.tax_rate ?? 0}%`
      },
    },
    {
      title: '合計計算',
      dataIndex: 'is_add_total',
      key: 'is_add_total',
      render: (value, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return (
          <Checkbox
            checked={value}
            style={{
              transform: 'scale(1.3)',
              marginBottom: 0,
            }}
          />
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

        return (record.quantity * record.selling_price).toLocaleString()
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
            return (
              <Table.Summary.Row
                style={{
                  background: '#F0F9FF',
                  color: PRIMARY,
                  fontWeight: 700,
                }}
              >
                <Table.Summary.Cell index={0} colSpan={10} align="center">
                  小計
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="center">
                  {(detail?.consumption_tax === 'exclusive'
                    ? +detail?.total_price_tax_included -
                      +detail?.consumption_tax_amount
                    : +detail?.total_price_tax_included
                  ).toLocaleString()}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )
          }}
        />
      </Flex>

      <Card bordered={false}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
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
                    ¥{(detail?.total_price || 0).toLocaleString()}
                  </Text>
                </div>
              </Col>
              <Col span={24}>
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
                    消費税金額
                  </Text>
                  <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                    ¥{(detail.consumption_tax_amount || 0).toLocaleString()}
                  </Text>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row gutter={[16, 16]}>
              {groupedTotals.map((item, index) => (
                <Col span={24} key={index}>
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
                      {`${t('quotas.action.detail_info.summary.tax_amount')} (${item.taxRate}%)`}
                    </Text>
                    <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                      ¥{item.total}
                    </Text>
                  </div>
                </Col>
              ))}
              <Col span={24}>
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
                    ¥{(detail?.total_price_tax_included || 0).toLocaleString()}
                  </Text>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </>
  )
}

export default DetailInfo

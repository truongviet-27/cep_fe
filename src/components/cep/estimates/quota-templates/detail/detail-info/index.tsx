/* eslint-disable @typescript-eslint/no-explicit-any */

import { DownOutlined, UpOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import type { QuoteTemplateDetailType } from '@interfaces/quota-templates'
import { useTranslate } from '@refinedev/core'
import type { RoundingMethodEnumType } from '@sdk/hey-api'
import { calculateTax } from '@shared/tax/tax.utils'
import { PRIMARY } from '@utility/color'
import { Card, Checkbox, Col, Flex, Row, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import type { FC } from 'react'
import { useMemo, useState } from 'react'

const { Title, Text } = Typography

interface Props {
  detail: QuoteTemplateDetailType
  taxRoundingMethod: RoundingMethodEnumType
}

const DetailInfo: FC<Props> = (props) => {
  const [expandedKeys, setExpandedKeys] = useState<any[]>([])

  const toggleExpand = (id: any) => {
    setExpandedKeys((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id],
    )
  }
  const { detail, taxRoundingMethod } = props
  const t = useTranslate()

  const dataSource: any[] = (detail?.main_product ?? [])
    .filter((item: any) => {
      if (item.kind === 'group') {
        return !!item.name && item.name.trim() !== ''
      }
      return true
    })
    .sort((a: any, b: any) => {
      const orderA = a.display_order ?? 0
      const orderB = b.display_order ?? 0
      return orderA - orderB
    })
    .map((item: any) => {
      if (item.kind === 'group') {
        return {
          isHeader: true,
          title: item.name,
          ...item,
        }
      }
      return { ...item }
    })

  const calculateGroupedTotal = (data: Record<string, any>) => {
    const totalByTaxRate = data.reduce(
      (acc: Record<string, any>, item: Record<string, any>) => {
        if (item.isHeader || !item.is_add_total) {
          return acc
        }
        const sellingPrice = parseFloat(item.selling_price || 0)
        const quantity = parseFloat(item.quantity || 0)
        const taxRate = parseFloat(item.tax_rate || 0)
        const subTotal = sellingPrice * quantity
        const sellingAmount = sellingPrice * quantity
        const key = String(taxRate)
        if (!acc[key]) {
          acc[key] = { sellingTotal: 0, taxRate, subTotal: 0 }
        }
        acc[key].sellingTotal += sellingAmount
        acc[key].subTotal += subTotal

        return acc
      },
      {},
    )

    return Object.entries(totalByTaxRate).map(
      ([taxRateKey, group]: [string, any]) => {
        const rawTax = (group.sellingTotal * group.taxRate) / 100
        const roundedTax = calculateTax(rawTax, taxRoundingMethod)
        return {
          taxRate: parseFloat(taxRateKey),
          total: roundedTax.toString(),
          subTotal: group.subTotal,
        }
      },
    )
  }

  const groupedTotals = useMemo(() => {
    return calculateGroupedTotal(dataSource)
  }, [dataSource, taxRoundingMethod])

  const totalSubTotalAllTaxRates = useMemo(() => {
    return groupedTotals.reduce((sum, item) => {
      return sum + item.subTotal
    }, 0)
  }, [groupedTotals])

  const baseColumns: ColumnsType = [
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
      render: (_, record) => {
        if (record.isHeader) return { props: { colSpan: 0 } }

        const isExpanded = expandedKeys.includes(record.id)
        const hasAssort =
          record.assort_products && record.assort_products.length > 0

        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                cursor: hasAssort ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onClick={() => hasAssort && toggleExpand(record.id)}
            >
              <span>{record.name}</span>
              {hasAssort &&
                (isExpanded ? (
                  <UpOutlined style={{ fontSize: '10px' }} />
                ) : (
                  <DownOutlined style={{ fontSize: '10px' }} />
                ))}
            </div>
            {hasAssort && isExpanded && (
              <div
                style={{
                  marginTop: '8px',
                  color: '#666',
                  fontSize: '12px',
                  textAlign: 'left',
                }}
              >
                {record.assort_products.map((item: any, index: number) => (
                  <div key={index} style={{ marginBottom: '4px' }}>
                    {item.product?.name} × {item.quantity}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
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

        return `${Number(profit_margin).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
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

  const numericColumnKeys = new Set([
    'cost_price',
    'selling_price',
    'quantity',
    'profit_margin',
    'tax_rate',
    'sellingAmount',
  ])

  const columns: ColumnsType = baseColumns.map((column) => ({
    ...column,
    onHeaderCell: (col: any) => {
      const originalHeaderCell = column.onHeaderCell?.(col) ?? ({} as any)
      return {
        ...originalHeaderCell,
        style: {
          ...(originalHeaderCell as any).style,
          textAlign: 'center',
        },
      }
    },
    align: numericColumnKeys.has(String(column.key)) ? 'right' : 'left',
  }))

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
                <Table.Summary.Cell index={0} colSpan={10} align="left">
                  小計
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  {(totalSubTotalAllTaxRates || 0).toLocaleString()}
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
                    ¥{Number(detail?.total_price || 0).toLocaleString()}
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
                    {Number(detail.total_profit_margin || 0).toLocaleString(
                      undefined,
                      { maximumFractionDigits: 2 },
                    )}
                    %
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
                      ¥{Number(item.total).toLocaleString()}
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
                    ¥
                    {Number(
                      detail?.total_price_tax_included || 0,
                    ).toLocaleString()}
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

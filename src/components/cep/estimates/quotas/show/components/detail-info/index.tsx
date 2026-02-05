/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import type { RoundingMethodEnumType } from '@sdk/hey-api'
import { calculateTax } from '@shared/tax/tax.utils'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Card, Checkbox, Col, Flex, Row, Typography } from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import { useMemo, useState } from 'react'

const { Text } = Typography

function DetailInfo({
  basicInfo,
  taxRoundingMethod,
  data,
}: {
  basicInfo: any
  data: any
  taxRoundingMethod: RoundingMethodEnumType
}) {
  const [expandedKeys, setExpandedKeys] = useState<any[]>([])

  const toggleExpand = (id: any) => {
    setExpandedKeys((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id],
    )
  }

  const t = useTranslate()
  const dataSource: any[] = (data ?? []).flatMap((item: any) => [
    ...(item.group_name ? [{ isHeader: true, title: item.group_name }] : []),
    ...(item.products ?? []).flatMap((item2: any) => [
      {
        ...item2,
      },
    ]),
  ])
  const columns: ColumnsType = [
    {
      title: t('quotas.show.table.product_code'),
      dataIndex: 'code',
      key: 'code',
      align: 'left',
      render: (_, record) => {
        if (record.isHeader) {
          return {
            children: record.title,
            props: { colSpan: columns.length },
          }
        }
        return record.code
      },
    },
    {
      title: t('quotas.show.table.product_service_name'),
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
                    {item.name} × {item.quantity}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      },
    },
    {
      title: t('quotas.show.table.unit'),
      dataIndex: 'unit',
      key: 'unit',
      render: (_, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return record?.unit_name
      },
    },
    {
      title: t('quotas.show.table.package'),
      dataIndex: 'package',
      key: 'package',
      width: 200,
      render: (_, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return record?.package_name ?? '-'
      },
    },
    {
      title: t('quotas.show.table.cost_price'),
      dataIndex: 'cost_price',
      key: 'cost_price',
      render: (_, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        if (record.cost_price === undefined || record.cost_price === null)
          return '-'

        return Number(record.cost_price).toLocaleString()
      },
    },
    {
      title: t('quotas.show.table.selling_price'),
      dataIndex: 'selling_price',
      key: 'selling_price',
      render: (_, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return (+record?.selling_price)?.toLocaleString()
      },
    },
    {
      title: t('quotas.show.table.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return record?.quantity
      },
    },
    {
      title: t('quotas.show.table.profit_margin'),
      dataIndex: 'profit_margin',
      key: 'profit_margin',
      render: (_, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return `${Number(record?.profit_margin).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
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
        return record?.tax_rate ? `${record?.tax_rate}%` : '0%'
      },
    },
    {
      title: t('quotas.show.table.total_calculation'),
      dataIndex: 'is_add_total',
      key: 'is_add_total',
      render: (_, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return (
          <Checkbox
            style={{
              transform: 'scale(1.3)',
              marginBottom: 0,
            }}
            checked={record.is_add_total}
          />
        )
      },
    },
    {
      title: t('quotas.show.table.selling_amount'),
      dataIndex: 'sellingAmount',
      key: 'sellingAmount',
      render: (_, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return (
          (record?.selling_price || 0) * (record?.quantity || 1)
        )?.toLocaleString()
      },
    },
  ]

  const calculateGroupedTotal = (data: any) => {
    const totalByTaxRate = data.reduce((acc: any, item: any) => {
      if (item.isHeader || !item.is_add_total) {
        return acc
      }

      const sellingPrice = parseFloat(item.selling_price || 0)
      const quantity = parseFloat(item.quantity || 0)
      const taxRate = parseFloat(item.tax_rate || 0)
      const sellingAmount = sellingPrice * quantity
      const key = String(taxRate)

      // Group selling amounts by tax rate
      if (!acc[key]) {
        acc[key] = { sellingTotal: 0, taxRate }
      }
      acc[key].sellingTotal += sellingAmount

      return acc
    }, {})
    return Object.entries(totalByTaxRate).map(
      ([taxRateKey, group]: [string, any]) => {
        const rawTax = (group.sellingTotal * group.taxRate) / 100
        const roundedTax = calculateTax(rawTax, taxRoundingMethod)
        return {
          taxRate: parseFloat(taxRateKey),
          total: roundedTax.toString(),
        }
      },
    )
  }

  // 🌟 SỬ DỤNG useMemo: Biến này chỉ được tính toán lại khi dataSource thay đổi
  const groupedTotals = useMemo(() => {
    if (basicInfo?.tax_rate_group?.length) {
      return basicInfo?.tax_rate_group
    }
    return calculateGroupedTotal(dataSource)
  }, [dataSource, taxRoundingMethod]) // Dependency array: chỉ chạy lại khi dataSource thay đổi

  return (
    <Card
      title={boldText(t('quotas.show.detail_info'), PRIMARY, 16)}
      styles={{
        header: {
          padding: 0,
          minHeight: 0,
        },
        body: { padding: 0 },
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
                  {t('quotas.action.detail_info.summary.subtotal')}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                <Table.Summary.Cell index={3}></Table.Summary.Cell>
                <Table.Summary.Cell index={4}></Table.Summary.Cell>
                <Table.Summary.Cell index={5}></Table.Summary.Cell>
                <Table.Summary.Cell index={6}></Table.Summary.Cell>
                <Table.Summary.Cell index={7}></Table.Summary.Cell>
                <Table.Summary.Cell index={8} align="center">
                  {Number(
                    basicInfo?.consumption_tax === 'exclusive'
                      ? +basicInfo?.total_price_tax_included -
                          +basicInfo?.consumption_tax_amount
                      : +basicInfo?.total_price_tax_included,
                  ).toLocaleString()}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )
          }}
        />

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
                      {t('quotas.action.detail_info.summary.cost_total')}
                    </Text>
                    <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                      ¥{(+basicInfo?.total_cost)?.toLocaleString()}
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
                      {t(
                        'quotas.action.detail_info.summary.total_profit_margin',
                      )}
                    </Text>
                    <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                      {(+basicInfo?.total_profit_margin)?.toLocaleString()}%
                    </Text>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row gutter={[16, 16]}>
                {groupedTotals.map((item: any, index: any) => (
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
                        {t('quotas.action.detail_info.summary.tax_amount')}（
                        {item?.taxRate}%）
                      </Text>
                      <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                        ¥{(+item.total)?.toLocaleString()}
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
                      {t('quotas.action.detail_info.summary.total_amount')}（
                      {t('quotas.action.detail_info.summary.tax_inclusive')}）
                    </Text>
                    <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                      ¥
                      {(+basicInfo?.total_price_tax_included)?.toLocaleString()}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Flex>
    </Card>
  )
}

export default DetailInfo

/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Card, Flex } from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { useState } from 'react'

function OptionalInfo({ data }: { data: any }) {
  const [expandedKeys, setExpandedKeys] = useState<any[]>([])

  const toggleExpand = (id: any) => {
    setExpandedKeys((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id],
    )
  }

  const t = useTranslate()
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
      title: t('quotas.action.optional_info.title'),
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
          record.assortProducts && record.assortProducts.length > 0

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
                {record.assortProducts.map((item: any, index: number) => (
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
      title: t('quotas.action.optional_info.table.unit'),
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
      title: t('quotas.action.optional_info.table.package'),
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
      title: t('quotas.action.optional_info.table.cost_price'),
      dataIndex: 'cost_price',
      key: 'cost_price',
      render: (_, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return (+record?.cost_price)?.toLocaleString()
      },
    },
    {
      title: t('quotas.action.optional_info.table.selling_price'),
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
      title: t('quotas.action.optional_info.table.quantity'),
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
      title: t('quotas.action.optional_info.table.profit_margin'),
      dataIndex: 'profit_margin',
      key: 'profit_margin',
      render: (_, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return `${record?.profit_margin}%`
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
      title: t('quotas.action.optional_info.table.selling_amount'),
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
  return (
    <Card
      title={boldText(t('quotas.action.optional_info.title'), PRIMARY, 16)}
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
        {data?.[0]?.products[0]?.product_id ? (
          <CommonTable
            columns={columns}
            dataSource={dataSource}
            rowClassName={(record) =>
              record.isHeader ? 'bg-[#E6F7FF] font-bold' : ''
            }
            pagination={false}
          />
        ) : (
          <div className="mt-4"></div>
        )}
      </Flex>
    </Card>
  )
}

export default OptionalInfo

/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import type { QuotaTemplateProductGroupResponse } from '@sdk/hey-api'
import { PRIMARY } from '@utility/color'
import { Flex, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { type FC, useState } from 'react'

const { Title } = Typography

interface Props {
  optionalProducts?: Array<QuotaTemplateProductGroupResponse>
}

const OptionalInfo: FC<Props> = (props) => {
  const [expandedKeys, setExpandedKeys] = useState<any[]>([])

  const toggleExpand = (id: any) => {
    setExpandedKeys((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id],
    )
  }

  const { optionalProducts } = props
  const t = useTranslate()

  const dataSource: any[] = (optionalProducts ?? [])
    .filter((item: any) => {
      if (item.kind === 'group') {
        return !!item.name && item.name.trim() !== ''
      }
      return true
    })
    .sort((a: any, b: any) => {
      return (a.display_order ?? 0) - (b.display_order ?? 0)
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
      render: (value, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return value
      },
    },
    {
      title: '荷姿',
      dataIndex: 'package_name',
      key: 'package_name',
      width: 200,
      align: 'left',
      render: (value, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return value
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
      render: (value, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return value.toLocaleString()
      },
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return value
      },
    },
    {
      title: '利益率',
      dataIndex: 'profit_margin',
      key: 'profit_margin',
      render: (value, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }

        return `${value}%`
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
        return `${record?.tax_rate}%`
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
        {t('quota_templates.form.titleOptionalInfo')}
      </Title>
      <Flex vertical>
        {optionalProducts?.length != 0 ? (
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
    </>
  )
}

export default OptionalInfo

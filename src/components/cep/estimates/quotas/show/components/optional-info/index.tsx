/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Card, Flex } from 'antd'
import { type ColumnsType } from 'antd/es/table'

function OptionalInfo({ data }: { data: any }) {
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
      title: t('quotas.action.optional_info.table.product_service_name'),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }

        return record.name
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
        return record?.cost_price
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
        return record?.selling_price
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
      title: t('quotas.action.optional_info.table.selling_amount'),
      dataIndex: 'sellingAmount',
      key: 'sellingAmount',
      render: (_, record) => {
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }
        return (record?.selling_price || 0) * (record?.quantity || 1)
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

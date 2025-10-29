/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Card, Checkbox, Col, Flex, Row, Typography } from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'

const { Text } = Typography

function DetailInfo({ basicInfo, data }: { basicInfo: any; data: any }) {
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
        if (record.isHeader) {
          return { props: { colSpan: 0 } }
        }

        return record.name
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
        return record?.cost_price
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
        return record?.selling_price
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
        return `${record?.tax_rate}%`
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
        return (record?.selling_price || 0) * (record?.quantity || 1)
      },
    },
  ]
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
                  {basicInfo?.consumption_tax === 'exclusive'
                    ? +basicInfo?.total_price_tax_included -
                      +basicInfo?.consumption_tax_amount
                    : +basicInfo?.total_price_tax_included}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )
          }}
        />

        <Card bordered={false}>
          <Row gutter={[16, 16]}>
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
                  {t('quotas.action.detail_info.summary.cost_total')}
                </Text>
                <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                  ¥{basicInfo?.total_cost}
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
                  {t('quotas.action.detail_info.summary.tax_amount')}
                </Text>
                <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                  ¥{basicInfo?.consumption_tax_amount}
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
                  {t('quotas.action.detail_info.summary.total_profit_margin')}
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
                  {t('quotas.action.detail_info.summary.total_amount')}（
                  {t('quotas.action.detail_info.summary.tax_inclusive')}）
                </Text>
                <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                  ¥{basicInfo?.total_price_tax_included}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      </Flex>
    </Card>
  )
}

export default DetailInfo

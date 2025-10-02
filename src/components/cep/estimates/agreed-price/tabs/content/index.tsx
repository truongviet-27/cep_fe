import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import StatusDashboard from '@components/cep/estimates/agreed-price/components/status-dashboard'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import { useSelect, useTable } from '@refinedev/antd'
import { useGo, useTranslate } from '@refinedev/core'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
} from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { type TableRowSelection } from 'antd/es/table/interface'
import dayjs from 'dayjs'
import Link from 'next/link'
import React, { useCallback, useMemo, useState } from 'react'

const { RangePicker } = DatePicker

function TabsAgreedPriceContent({ index }: { index: number }) {
  const t = useTranslate()
  const go = useGo()

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [status, setStatus] = useState<string | null>(null)

  const { selectProps: departmentSelectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
  })

  const { selectProps: rankSelectProps } = useSelect({
    resource: 'ranks',
    optionLabel: 'name',
    optionValue: 'id',
  })

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<Record<string, unknown>> = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  // Mock data cho demo
  const mockData = [
    {
      id: '1',
      status: 'valid',
      estimateNumber: 'QT-250527-001',
      businessPartner: '株式会社コマースロボティクス',
      creator: '田中丹治路',
      productCount: 3,
      departmentAmount: 'SAAS事業部',
      amount: '28,600',
      estimateDate: '2025/05/31',
      applicationEnd: '2025/11/30',
      referenceCount: 12,
      update: '-',
    },
    {
      id: '2',
      status: 'valid',
      estimateNumber: 'QT-250527-002',
      businessPartner: '株式会社東京商事',
      creator: '田中丹治路',
      productCount: 5,
      departmentAmount: '技術部',
      amount: '1,200,000',
      estimateDate: '2025/05/31',
      applicationEnd: '2025/12/31',
      referenceCount: 5,
      update: '-',
    },
    {
      id: '3',
      status: 'expired',
      estimateNumber: 'QT-250527-003',
      businessPartner: 'サンプル工業株式会社',
      creator: '田中丹治路',
      productCount: 8,
      departmentAmount: 'SAAS事業部',
      amount: '1,900,000',
      estimateDate: '2025/05/31',
      applicationEnd: '2025/08/31',
      referenceCount: 0,
      update: '-',
    },
    {
      id: '4',
      status: 'nearing_expiration',
      estimateNumber: 'QT-250527-004',
      businessPartner: '株式会社イノベーション',
      creator: '田中丹治路',
      productCount: 12,
      departmentAmount: '技術部',
      amount: '2,000,000',
      estimateDate: '2025/05/31',
      applicationEnd: '2025/09/30',
      referenceCount: 7,
      update: '-',
    },
    {
      id: '5',
      status: 'valid',
      estimateNumber: 'QT-250827-035',
      businessPartner: '株式会社データシステム',
      creator: '田中丹治路',
      productCount: 2,
      departmentAmount: 'IT部',
      amount: '5,800,000',
      estimateDate: '2025/09/05',
      applicationEnd: '2025/12/31',
      referenceCount: 4,
      update: '2',
    },
  ]

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'valid':
        return <Tag color="blue">{t('agreed_price.status.valid')}</Tag>
      case 'expired':
        return <Tag color="red">{t('agreed_price.status.expired')}</Tag>
      case 'nearing_expiration':
        return (
          <Tag color="orange">
            {t('agreed_price.status.nearing_expiration')}
          </Tag>
        )
      default:
        return <Tag>{status}</Tag>
    }
  }

  const columns: ColumnsType<Record<string, unknown>> = useMemo(
    () => [
      {
        title: t('agreed_price.table.status'),
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status: string) => getStatusTag(status),
      },
      {
        title: t('agreed_price.table.estimate_number'),
        dataIndex: 'estimateNumber',
        key: 'estimateNumber',
        width: 150,
        render: (text: string) => (
          <Link
            href={`/quotas/show/${text}`}
            className="text-blue-600 hover:text-blue-800"
          >
            {text}
          </Link>
        ),
      },
      {
        title: t('agreed_price.table.business_partner'),
        dataIndex: 'businessPartner',
        key: 'businessPartner',
        width: 200,
      },
      {
        title: t('agreed_price.table.creator'),
        dataIndex: 'creator',
        key: 'creator',
        width: 120,
      },
      {
        title: t('agreed_price.table.product_count'),
        dataIndex: 'productCount',
        key: 'productCount',
        width: 100,
        align: 'center',
      },
      {
        title: t('agreed_price.table.department_amount'),
        dataIndex: 'departmentAmount',
        key: 'departmentAmount',
        width: 150,
        render: (department: string, record: Record<string, unknown>) => (
          <div>
            <div>{department}</div>
            <div className="text-sm text-gray-600">
              {record.amount as string}
            </div>
          </div>
        ),
      },
      {
        title: t('agreed_price.table.estimate_date_application_end'),
        dataIndex: 'applicationEnd',
        key: 'applicationEnd',
        width: 200,
        render: (endDate: string, record: Record<string, unknown>) => (
          <div>
            <div>{record.estimateDate as string}</div>
            <div
              className={`text-sm ${
                (record.status as string) === 'expired'
                  ? 'text-red-500'
                  : (record.status as string) === 'nearing_expiration'
                    ? 'text-orange-500'
                    : 'text-gray-600'
              }`}
            >
              {endDate}
            </div>
          </div>
        ),
      },
      {
        title: t('agreed_price.table.reference_count'),
        dataIndex: 'referenceCount',
        key: 'referenceCount',
        width: 120,
        align: 'center',
      },
      {
        title: t('agreed_price.table.update'),
        dataIndex: 'update',
        key: 'update',
        width: 100,
        align: 'center',
      },
      {
        title: t('agreed_price.table.operation'),
        key: 'operation',
        width: 150,
        render: (_, record: Record<string, unknown>) => (
          <Space>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() =>
                go({ to: `/quotas/show/${record.estimateNumber as string}` })
              }
            />
            <Button type="text" danger icon={<DeleteOutlined />} />
            <Button type="primary" size="small" icon={<EditOutlined />}>
              {t('agreed_price.action.update')}
            </Button>
          </Space>
        ),
      },
    ],
    [t, go],
  )

  const onChangeStatus = useCallback(
    (status: string | null) => {
      setStatus(status)
    },
    [status],
  )

  // Customer tab data and columns
  const customerMockData = [
    {
      id: '1',
      businessPartnerCode: 'CUST001',
      businessPartnerName: '株式会社サンプル商事',
      responsibleDepartment: '購買部',
      unitPriceRank: 'A',
      productCount: 10,
    },
    {
      id: '2',
      businessPartnerCode: 'CUST003',
      businessPartnerName: '株式会社デモ企業',
      responsibleDepartment: '購買部',
      unitPriceRank: 'Premium',
      productCount: 5,
    },
    {
      id: '3',
      businessPartnerCode: 'CUST002',
      businessPartnerName: 'テスト株式会社',
      responsibleDepartment: '購買部',
      unitPriceRank: 'B',
      productCount: 3,
    },
  ]

  const customerColumns: ColumnsType<Record<string, unknown>> = useMemo(
    () => [
      {
        title: t('agreed_price.customer_tab.table.business_partner_code'),
        dataIndex: 'businessPartnerCode',
        key: 'businessPartnerCode',
        width: 150,
        render: (text: string) => (
          <Link
            href={`/customers/show/${text}`}
            className="text-blue-600 hover:text-blue-800"
          >
            {text}
          </Link>
        ),
      },
      {
        title: t('agreed_price.customer_tab.table.business_partner_name'),
        dataIndex: 'businessPartnerName',
        key: 'businessPartnerName',
        width: 200,
      },
      {
        title: t('agreed_price.customer_tab.table.responsible_department'),
        dataIndex: 'responsibleDepartment',
        key: 'responsibleDepartment',
        width: 150,
      },
      {
        title: t('agreed_price.customer_tab.table.unit_price_rank'),
        dataIndex: 'unitPriceRank',
        key: 'unitPriceRank',
        width: 120,
        align: 'center',
      },
      {
        title: t('agreed_price.customer_tab.table.product_count'),
        dataIndex: 'productCount',
        key: 'productCount',
        width: 100,
        align: 'center',
      },
      {
        title: t('agreed_price.customer_tab.table.operation'),
        key: 'operation',
        width: 100,
        render: (_, record: Record<string, unknown>) => (
          <Space>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() =>
                go({
                  to: `/customers/show/${record.businessPartnerCode as string}`,
                })
              }
            />
          </Space>
        ),
      },
    ],
    [t, go],
  )

  const handleCustomerSearch = (values: Record<string, unknown>) => {
    setFilters([
      {
        field: 'business_partner_code_name',
        operator: 'contains',
        value: values.business_partner_code_name,
      },
      {
        field: 'responsible_department',
        operator: 'eq',
        value: values.responsible_department,
      },
      {
        field: 'unit_price_rank_code',
        operator: 'eq',
        value: values.unit_price_rank_code,
      },
    ])
  }

  const handleCustomerClear = () => {
    searchFormProps.form?.resetFields()
    setFilters([], 'replace')
  }

  // Summary cards data
  const statusData = [
    { title: t('agreed_price.summary.all'), value: 180, key: 'all' },
    { title: t('agreed_price.summary.valid'), value: 145, key: 'valid' },
    {
      title: t('agreed_price.summary.nearing_expiration'),
      value: 23,
      key: 'nearing_expiration',
    },
    { title: t('agreed_price.summary.expired'), value: 20, key: 'expired' },
  ]

  const { searchFormProps, setFilters } = useTable({
    syncWithLocation: true,
    onSearch(values: Record<string, unknown>) {
      return [
        {
          field: 'status',
          operator: 'eq',
          value: status,
        },
        {
          field: 'estimate_number',
          operator: 'eq',
          value: values.estimate_number,
        },
        {
          field: 'business_partner',
          operator: 'eq',
          value: values.business_partner,
        },
        {
          field: 'creator',
          operator: 'eq',
          value: values.creator,
        },
        {
          field: 'department',
          operator: 'eq',
          value: (values.department as { label: string })?.label,
        },
        {
          field: 'tag_name',
          operator: 'eq',
          value: values.tag_name,
        },
        {
          field: 'application_completion_start',
          operator: 'eq',
          value: dayjs(
            (values.application_completion as unknown[])?.[0] as string,
          ).format('YYYY-MM-DD'),
        },
        {
          field: 'application_completion_end',
          operator: 'eq',
          value: dayjs(
            (values.application_completion as unknown[])?.[1] as string,
          ).format('YYYY-MM-DD'),
        },
      ]
    },
  })

  if (index === 1) {
    // Decided Estimate List tab
    return (
      <Form {...searchFormProps}>
        <Form.Item name={'status'} hidden />
        <StatusDashboard
          statusData={statusData}
          status={status}
          onChangeStatus={onChangeStatus}
        />

        <div className="my-4">
          <Row gutter={[24, 0]}>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={
                  <span className="font-bold">
                    {t('agreed_price.search.estimate_number')}
                  </span>
                }
                layout="vertical"
                name={'estimate_number'}
              >
                <Input placeholder={t('agreed_price.search.partial_match')} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={
                  <span className="font-bold">
                    {t('agreed_price.search.business_partner')}
                  </span>
                }
                layout="vertical"
                name={'business_partner'}
              >
                <Input placeholder={t('agreed_price.search.partial_match')} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={
                  <span className="font-bold">
                    {t('agreed_price.search.creator')}
                  </span>
                }
                layout="vertical"
                name={'creator'}
              >
                <Input placeholder={t('agreed_price.search.partial_match')} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={4} xxl={3}>
              <Form.Item
                label={
                  <span className="font-bold">
                    {t('agreed_price.search.department')}
                  </span>
                }
                layout="vertical"
                name={'department'}
              >
                <Select
                  allowClear
                  showSearch
                  {...departmentSelectProps}
                  labelInValue
                  placeholder={t('agreed_price.search.please_select')}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={
                  <span className="font-bold">
                    {t('agreed_price.search.tag_name')}
                  </span>
                }
                layout="vertical"
                name={'tag_name'}
              >
                <Input placeholder={t('agreed_price.search.partial_match')} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={12} md={6}>
              <Form.Item
                label={
                  <span className="font-bold">
                    {t('agreed_price.search.application_completion')}
                  </span>
                }
                layout="vertical"
                name={'application_completion'}
              >
                <RangePicker
                  allowClear
                  className="w-full"
                  placeholder={['YYYY/MM/DD', 'YYYY/MM/DD']}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <div className="mt-7 mb-6 flex gap-2">
                <Button htmlType="submit" type="primary">
                  {t('agreed_price.action.search')}
                </Button>
                <Button
                  htmlType="reset"
                  type="default"
                  onClick={() => {
                    setFilters([], 'replace')
                    setStatus(null)
                  }}
                >
                  {t('agreed_price.action.clear')}
                </Button>
              </div>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <div className="mt-7 flex justify-end gap-2">
                <Button type="primary">
                  {t('agreed_price.action.add_from_estimate_list')}
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        <CommonTable
          rowKey={'id'}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={mockData}
          pagination={{
            current: 1,
            pageSize: 10,
            total: 18,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]}/${total}件`,
          }}
        />
      </Form>
    )
  }

  // Agreed Price by Customer tab
  if (index === 2) {
    return (
      <List title="" i18nHeading="">
        <Form
          colon={false}
          {...searchFormProps}
          layout="vertical"
          onFinish={handleCustomerSearch}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={4}>
              <Form.Item
                label={
                  <span className="font-bold">
                    {t(
                      'agreed_price.customer_tab.search.business_partner_code_name',
                    )}
                  </span>
                }
                name="business_partner_code_name"
              >
                <Input placeholder={t('agreed_price.search.partial_match')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item
                label={
                  <span className="font-bold">
                    {t(
                      'agreed_price.customer_tab.search.responsible_department',
                    )}
                  </span>
                }
                name="responsible_department"
              >
                <Select
                  {...departmentSelectProps}
                  placeholder={t('agreed_price.search.please_select')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item
                label={
                  <span className="font-bold">
                    {t('agreed_price.customer_tab.search.unit_price_rank_code')}
                  </span>
                }
                name="unit_price_rank_code"
              >
                <Select
                  {...rankSelectProps}
                  placeholder={t('agreed_price.search.please_select')}
                  showSearch={false}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item label={<></>}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    {t('agreed_price.action.search')}
                  </Button>
                  <Button onClick={handleCustomerClear}>
                    {t('agreed_price.action.clear')}
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <CommonTable
          className={'mt-6'}
          rowKey="id"
          columns={customerColumns}
          dataSource={customerMockData}
          pagination={{
            current: 1,
            pageSize: 10,
            total: 18,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}件`,
          }}
        />
      </List>
    )
  }

  // Default fallback
  return (
    <div className="space-y-6">
      <div className="py-8 text-center text-gray-500">
        {t('agreed_price.tab.agreed_price_by_customer')} -{' '}
        {t('common.coming_soon')}
      </div>
    </div>
  )
}

export default TabsAgreedPriceContent

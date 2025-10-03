import StatusDashboard from '@components/cep/estimates/agreed-price/components/status-dashboard'
import CommonTable from '@components/common/table'
import { useSelect, useTable } from '@refinedev/antd'
import { useApiUrl, useCustom, useGo, useTranslate } from '@refinedev/core'
import type {
  QuotaAgreedPrice,
  QuotaAgreedPricesPaginatedResponse,
} from '@sdk/hey-api/types.gen'
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import React, { useCallback, useMemo, useState } from 'react'

const { RangePicker } = DatePicker

const AgreedPriceQuotaTab = () => {
  const t = useTranslate()
  const go = useGo()
  const apiUrl = useApiUrl()

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [status, setStatus] = useState<string | null>(null)

  const { selectProps: departmentSelectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
  })

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<QuotaAgreedPrice> = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const {
    data: quotaAgreedPricesData,
    isLoading,
    error,
  } = useCustom<QuotaAgreedPricesPaginatedResponse>({
    url: `${apiUrl}/quota/agreed-prices`,
    method: 'get',
  })

  const quotaAgreedPrices: QuotaAgreedPrice[] =
    (quotaAgreedPricesData as QuotaAgreedPricesPaginatedResponse)?.data
      ?.items || []

  const getStatusTag = (status: string) => {
    const statusMap = {
      valid: { color: 'green', text: t('agreed_price.status.valid') },
      expired: { color: 'red', text: t('agreed_price.status.expired') },
      nearing_expiration: {
        color: 'orange',
        text: t('agreed_price.status.nearing_expiration'),
      },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap]
    return <span style={{ color: statusInfo.color }}>{statusInfo.text}</span>
  }

  const columns: ColumnsType<QuotaAgreedPrice> = useMemo(
    () => [
      {
        title: t('agreed_price.table.status'),
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => getStatusTag(status),
      },
      {
        title: t('agreed_price.table.estimate_number'),
        dataIndex: 'quota_code',
        key: 'quota_code',
        render: (quotaCode: string) => (
          <Button
            type="link"
            onClick={() => go({ to: `/estimates/${quotaCode}` })}
          >
            {quotaCode}
          </Button>
        ),
      },
      {
        title: t('agreed_price.table.business_partner'),
        dataIndex: 'customer_name',
        key: 'customer_name',
      },
      {
        title: t('agreed_price.table.creator'),
        dataIndex: 'created_by_name',
        key: 'created_by_name',
      },
      {
        title: t('agreed_price.table.product_count'),
        dataIndex: 'number_products',
        key: 'number_products',
        align: 'right',
      },
      {
        title: t('agreed_price.table.department_amount'),
        dataIndex: 'total_price',
        key: 'total_price',
        align: 'right',
        render: (totalPrice: number) => totalPrice?.toLocaleString() || '0',
      },
      {
        title: t('agreed_price.table.estimate_date_application_end'),
        key: 'estimateDateApplicationEnd',
        render: (_, record) => (
          <div>
            <div>{record.created_at}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.expiration_date}
            </div>
          </div>
        ),
      },
      {
        title: t('agreed_price.table.reference_count'),
        dataIndex: 'number_updating',
        key: 'number_updating',
        align: 'right',
      },
      {
        title: t('agreed_price.table.operation'),
        key: 'operation',
        render: (_, record) => (
          <Button
            type="link"
            onClick={() => go({ to: `/agreed-prices/${record.id}/edit` })}
          >
            {t('agreed_price.action.update')}
          </Button>
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

  const statusData = useMemo(() => {
    const total = quotaAgreedPrices.length
    const valid = quotaAgreedPrices.filter(
      (item: QuotaAgreedPrice) => item.status === 'valid',
    ).length
    const nearingExpiration = quotaAgreedPrices.filter(
      (item: QuotaAgreedPrice) => item.status === 'nearing_expiration',
    ).length
    const expired = quotaAgreedPrices.filter(
      (item: QuotaAgreedPrice) => item.status === 'expired',
    ).length

    return [
      {
        title: t('agreed_price.summary.all'),
        value: total,
        key: null,
      },
      {
        title: t('agreed_price.summary.valid'),
        value: valid,
        color: '#52c41a',
        key: 'valid',
      },
      {
        title: t('agreed_price.summary.nearing_expiration'),
        value: nearingExpiration,
        color: '#faad14',
        key: 'nearing_expiration',
      },
      {
        title: t('agreed_price.summary.expired'),
        value: expired,
        color: '#ff4d4f',
        key: 'expired',
      },
    ]
  }, [quotaAgreedPrices, t])

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
          operator: 'contains',
          value: values.estimate_number,
        },
        {
          field: 'business_partner',
          operator: 'contains',
          value: values.business_partner,
        },
        {
          field: 'creator',
          operator: 'contains',
          value: values.creator,
        },
        {
          field: 'department',
          operator: 'eq',
          value: (values.department as { value: string })?.value,
        },
        {
          field: 'tag_name',
          operator: 'contains',
          value: values.tag_name,
        },
        {
          field: 'application_completion',
          operator: 'between',
          value: values.application_completion,
        },
      ]
    },
  })

  return (
    <Form {...searchFormProps}>
      <Form.Item name={'status'} hidden />
      <StatusDashboard
        statusData={statusData}
        status={status}
        onChangeStatus={onChangeStatus}
      />

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">
            {t('common.error_loading_data')}: {error.message}
          </p>
        </div>
      )}

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
        dataSource={quotaAgreedPrices}
        loading={isLoading}
        pagination={{
          current: 1,
          pageSize: 10,
          total: quotaAgreedPrices.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]}/${total}件`,
        }}
      />
    </Form>
  )
}

export default AgreedPriceQuotaTab

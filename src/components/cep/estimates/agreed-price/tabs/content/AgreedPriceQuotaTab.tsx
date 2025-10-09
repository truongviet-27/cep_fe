/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable simple-import-sort/imports */
import StatusDashboard from '@components/cep/estimates/agreed-price/components/status-dashboard'
import { AgreedPriceStatus } from '@components/cep/estimates/agreed-price/enum'
import { getAgreedPriceStatusStyle } from '@components/cep/estimates/agreed-price/utils'
import CommonTable from '@components/common/table'
import { DeleteButton, ShowButton, useSelect, useTable } from '@refinedev/antd'
import {
  type HttpError,
  useApiUrl,
  useCustom,
  useCustomMutation,
  useGo,
  useTranslate,
} from '@refinedev/core'
import type { QuotaAgreedPrice } from '@sdk/hey-api/types.gen'
import type { TableProps } from 'antd'
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import type { Dayjs } from 'dayjs'
import React, { useCallback, useMemo, useState } from 'react'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

const AgreedPriceQuotaTab = () => {
  const t = useTranslate()
  const go = useGo()
  const apiUrl = useApiUrl()

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [status, setStatus] = useState<string | null>(AgreedPriceStatus.Active)

  const { selectProps: departmentSelectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: {
      mode: 'server',
      pageSize: 100,
    },
    onSearch(value) {
      return [
        {
          field: 'q',
          operator: 'eq',
          value,
        },
      ]
    },
  })

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<QuotaAgreedPrice> = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const getStatusTag = (status?: string) => {
    const statusEnum = status as AgreedPriceStatus
    const result = getAgreedPriceStatusStyle(statusEnum, t)
    return (
      <Tag
        color={result.background}
        style={{ color: result.color, marginRight: 0 }}
      >
        {result.text}
      </Tag>
    )
  }

  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [updateForm] = Form.useForm()
  const [selected, setSelected] = useState<QuotaAgreedPrice | null>(null)
  const { mutate: mutateUpdate, isPending: updating } = useCustomMutation()

  const openUpdate = (record: QuotaAgreedPrice) => {
    setSelected(record)
    const start = record.expiration_date
      ? dayjs(record.expiration_date).add(1, 'day')
      : null
    updateForm.setFieldsValue({ start_date: start, end_date: null })
    setIsUpdateOpen(true)
  }

  const handleUpdateSubmit = () => {
    updateForm.validateFields().then((values) => {
      if (!selected?.id) return
      const expiration = (values.end_date as Dayjs).format('YYYY/MM/DD')
      mutateUpdate(
        {
          method: 'put',
          url: `${apiUrl}/quota/agreed-prices/${selected.id}/expiration-date`,
          values: { expiration_date: expiration },
          successNotification: () => ({
            message: t('notifications.success'),
            description: t('notifications.editSuccess'),
            type: 'success',
          }),
        },
        {
          onSuccess: () => {
            setIsUpdateOpen(false)
            setSelected(null)
            tableQuery?.refetch?.()
          },
        },
      )
    })
  }

  const columns: ColumnsType<QuotaAgreedPrice> = useMemo(
    () => [
      {
        title: t('agreed_prices.table.status'),
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => getStatusTag(status),
      },
      {
        title: t('agreed_prices.table.estimate_number'),
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
        key: 'customer_name',
        render: (_: unknown, record: QuotaAgreedPrice) =>
          record.customer?.name ?? '-',
      },
      {
        title: t('agreed_prices.table.creator'),
        key: 'created_by_name',
        render: (_: unknown, record: QuotaAgreedPrice) =>
          record.creator?.name ?? '-',
      },
      {
        title: t('agreed_prices.table.product_count'),
        dataIndex: 'number_products',
        key: 'number_products',
        align: 'right',
      },
      {
        title: t('agreed_prices.table.department_amount'),
        dataIndex: 'total_price',
        key: 'total_price',
        align: 'right',
        render: (totalPrice: number, record: QuotaAgreedPrice) => (
          <div>
            {record.creator?.department_name && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                {record.creator?.department_name}
              </div>
            )}
            <div>{totalPrice?.toLocaleString() || '0'}</div>
          </div>
        ),
      },
      {
        title: t('agreed_prices.table.estimate_date_application_end'),
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
        title: t('agreed_prices.table.reference_count'),
        dataIndex: 'number_updating',
        key: 'number_updating',
        align: 'right',
      },
      {
        title: t('agreed_prices.table.operation'),
        key: 'operation',
        render: (_, record) => (
          <Space>
            <ShowButton
              hideText
              size="small"
              recordItemId={(record as any).quota_id as number}
              resource="agreed-prices"
            />
            <DeleteButton
              hideText
              size="small"
              recordItemId={record.id as number}
              resource="quota/agreed-prices"
              onSuccess={() => tableQuery?.refetch?.()}
            />
            <Button
              size="small"
              type="default"
              onClick={() => openUpdate(record)}
            >
              {t('agreed_prices.action.update')}
            </Button>
          </Space>
        ),
      },
    ],
    [t, go],
  )

  const { data: count } = useCustom({
    method: 'get',
    url: `${apiUrl}/quota/agreed-prices/count`,
  })

  const { tableProps, searchFormProps, setFilters, tableQuery } = useTable<
    QuotaAgreedPrice,
    HttpError,
    any
  >({
    resource: 'quota/agreed-prices',
    syncWithLocation: true,
    filters: {
      initial: [
        {
          field: 'status',
          operator: 'eq',
          value: status,
        },
      ],
    },
    onSearch(values) {
      const v = values as Record<string, unknown>

      const range = v.application_completion as
        | [Dayjs | null, Dayjs | null]
        | undefined
      const [start, end] = range ?? []

      return [
        {
          field: 'status',
          operator: 'eq',
          value: status,
        },
        {
          field: 'quota_code',
          operator: 'eq',
          value: v.quota_code,
        },
        {
          field: 'customer_name',
          operator: 'eq',
          value: v.customer_name,
        },
        {
          field: 'creator_name',
          operator: 'eq',
          value: v.creator_name,
        },
        {
          field: 'department_id',
          operator: 'eq',
          value: v.department_id
            ? (v.department_id as { id?: number }).id
            : undefined,
        },
        {
          field: 'expiration_date_gte',
          operator: 'gte',
          value: start ? start.format('YYYY-MM-DD') : undefined,
        },
        {
          field: 'expiration_date_lte',
          operator: 'lte',
          value: end ? end.format('YYYY-MM-DD') : undefined,
        },
      ]
    },
  })

  const statusDashboard = useMemo(() => {
    const c = count?.data
    const get = (key: 'active' | 'about_to_expire' | 'expired') =>
      c?.status_counts?.find((s: any) => s.status === key)?.count ?? 0

    return [
      {
        title: getAgreedPriceStatusStyle(AgreedPriceStatus.Active, t).text,
        value: get('active'),
        color: getAgreedPriceStatusStyle(AgreedPriceStatus.Active, t).color,
        key: 'active',
      },
      {
        title: getAgreedPriceStatusStyle(AgreedPriceStatus.NearingExpiration, t)
          .text,
        value: get('about_to_expire'),
        color: getAgreedPriceStatusStyle(AgreedPriceStatus.NearingExpiration, t)
          .color,
        key: 'about_to_expire',
      },
      {
        title: getAgreedPriceStatusStyle(AgreedPriceStatus.Expired, t).text,
        value: get('expired'),
        color: getAgreedPriceStatusStyle(AgreedPriceStatus.Expired, t).color,
        key: 'expired',
      },
      {
        title: t('agreed_prices.summary.all'),
        value: c?.total ?? 0,
        key: null as string | null,
      },
    ]
  }, [count, t])

  const onChangeStatus = useCallback(
    (nextStatus: string | null) => {
      setStatus(nextStatus)
      setFilters([
        {
          field: 'status',
          operator: 'eq',
          value: nextStatus,
        },
      ])
    },
    [setFilters],
  )

  return (
    <Form {...searchFormProps}>
      <Form.Item name={'status'} hidden />
      <StatusDashboard
        statusData={statusDashboard}
        status={status}
        onChangeStatus={onChangeStatus}
      />

      {tableQuery?.error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">
            {t('common.error_loading_data')}
            {': '}
            {(tableQuery?.error as HttpError | undefined)?.message ??
              'Unknown error'}
          </p>
        </div>
      )}

      <div className="my-4">
        <Row gutter={[24, 0]}>
          <Col xs={12} md={6} lg={3} xxl={3}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t('agreed_prices.search.estimate_number')}
                </span>
              }
              layout="vertical"
              name={'quota_code'}
            >
              <Input placeholder={t('agreed_prices.search.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6} lg={3} xxl={3}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t('agreed_prices.search.business_partner')}
                </span>
              }
              layout="vertical"
              name={'customer_name'}
            >
              <Input placeholder={t('agreed_prices.search.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6} lg={3} xxl={3}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t('agreed_prices.search.creator')}
                </span>
              }
              layout="vertical"
              name={'creator_name'}
            >
              <Input placeholder={t('agreed_prices.search.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6} lg={4} xxl={3}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t('agreed_prices.search.department')}
                </span>
              }
              layout="vertical"
              name={'department_id'}
            >
              <Select
                allowClear
                showSearch
                {...departmentSelectProps}
                labelInValue={true}
                placeholder={t('agreed_prices.search.please_select')}
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={6} lg={3} xxl={3}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t('agreed_prices.search.tag_name')}
                </span>
              }
              layout="vertical"
              name={'tag_name'}
            >
              <Input placeholder={t('agreed_prices.search.partial_match')} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col xs={12} md={6}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t('agreed_prices.search.application_completion')}
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
                {t('agreed_prices.action.search')}
              </Button>
              <Button
                htmlType="reset"
                type="default"
                onClick={() => {
                  setFilters([], 'replace')
                  setStatus(AgreedPriceStatus.Active)
                }}
              >
                {t('agreed_prices.action.clear')}
              </Button>
            </div>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <div className="mt-7 flex justify-end gap-2">
              <Button type="primary" onClick={() => go({ to: '/quotas' })}>
                {t('agreed_prices.action.add_from_estimate_list')}
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {(() => {
        const refinedTableProps =
          tableProps as unknown as TableProps<QuotaAgreedPrice>
        return (
          <CommonTable<QuotaAgreedPrice>
            {...refinedTableProps}
            rowKey={'id'}
            rowSelection={rowSelection}
            columns={columns}
          />
        )
      })()}

      <Modal
        title={t('agreed_prices.modal.update_title')}
        open={isUpdateOpen}
        onCancel={() => setIsUpdateOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={updateForm}
          labelCol={{ xs: 24, sm: 8 }}
          wrapperCol={{ xs: 24 }}
          labelAlign="left"
          colon={false}
          style={{ marginTop: 8 }}
        >
          <Row>
            <Col xs={24}>
              <Form.Item label={t('agreed_prices.modal.estimate_no')}>
                <Space>
                  <Button
                    type="link"
                    onClick={() =>
                      selected?.quota_code &&
                      go({ to: `/estimates/${selected.quota_code}` })
                    }
                  >
                    {selected?.quota_code}
                  </Button>
                  <Tag>{getStatusTag(selected?.status)}</Tag>
                </Space>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Form.Item label={t('agreed_prices.modal.title')}>
                {selected?.customer?.name ?? '-'}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Form.Item label={t('agreed_prices.modal.customer')}>
                {selected?.customer?.name ?? '-'}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Form.Item
                label={t('agreed_prices.modal.applicable_start')}
                name="start_date"
              >
                <Space>
                  <DatePicker
                    style={{ width: '80%' }}
                    placeholder={'YYYY/MM/DD'}
                    disabled
                  />
                  <Typography.Text type="warning">
                    {t('agreed_prices.modal.note_next_day')}
                  </Typography.Text>
                </Space>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Form.Item
                label={t('agreed_prices.modal.applicable_end')}
                name="end_date"
                rules={[
                  {
                    required: true,
                    message: t('validation.required'),
                  },
                ]}
              >
                <DatePicker
                  style={{ width: '80%' }}
                  placeholder={'YYYY/MM/DD'}
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col xs={24}>
              <Form.Item label={t('agreed_prices.modal.registry')}>
                {selected?.creator?.name ?? '---'}
                <span style={{ marginLeft: 12, color: '#999' }}>
                  {selected?.created_at
                    ? dayjs(selected.created_at).format('YYYY/MM/DD HH:mm')
                    : ''}
                </span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Form.Item label={t('agreed_prices.modal.updater')}>
                ---{' '}
              </Form.Item>
            </Col>
          </Row>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 24,
            }}
          >
            <Space>
              <Button onClick={() => setIsUpdateOpen(false)}>
                {t('buttons.cancel')}
              </Button>
              <Button
                type="primary"
                loading={updating}
                onClick={handleUpdateSubmit}
              >
                {t('agreed_prices.action.update')}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </Form>
  )
}

export default AgreedPriceQuotaTab

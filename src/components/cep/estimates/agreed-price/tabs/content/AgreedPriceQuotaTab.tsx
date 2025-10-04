/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable simple-import-sort/imports */
import StatusDashboard from '@components/cep/estimates/agreed-price/components/status-dashboard'
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

  type DisplayStatus = 'active' | 'expired' | 'nearing_expiration'

  const getStatusTag = (status?: string) => {
    const statusMap: Record<DisplayStatus, { color: string; text: string }> = {
      active: { color: 'green', text: t('agreed_prices.status.active') },
      expired: { color: 'red', text: t('agreed_prices.status.expired') },
      nearing_expiration: {
        color: 'orange',
        text: t('agreed_prices.status.nearing_expiration'),
      },
    }
    const statusInfo = statusMap[(status as DisplayStatus) ?? 'active']
    const color = statusInfo?.color ?? '#999'
    const text = statusInfo?.text ?? (status || '-')
    return <span style={{ color }}>{text}</span>
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
        title: t('agreed_prices.table.business_partner'),
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
        render: (totalPrice: number) => totalPrice?.toLocaleString() || '0',
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
              recordItemId={record.id as number}
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
    Record<string, unknown>
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
      const depInput = v.department as
        | Array<{ value: string | number; label: string }>
        | { value?: string | number; label?: string }
        | undefined
      const deptIds: number[] = Array.isArray(depInput)
        ? depInput
            .map((d) =>
              typeof d.value === 'number' ? d.value : Number(d.value),
            )
            .filter((n) => !Number.isNaN(n))
        : depInput && depInput.value !== undefined
          ? [
              typeof depInput.value === 'number'
                ? depInput.value
                : Number(depInput.value),
            ].filter((n) => !Number.isNaN(n))
          : []

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
          value: v.estimate_number,
        },
        {
          field: 'customer_name',
          operator: 'eq',
          value: v.business_partner,
        },
        {
          field: 'creator_name',
          operator: 'eq',
          value: v.creator,
        },
        {
          field: 'department_id_in[]',
          operator: 'in',
          value: deptIds.length > 0 ? deptIds : undefined,
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
        title: t('agreed_prices.summary.all'),
        value: c?.total ?? 0,
        key: null as string | null,
      },
      {
        title: t('agreed_prices.summary.active'),
        value: get('active'),
        color: '#52c41a',
        key: 'active',
      },
      {
        title: t('agreed_prices.summary.nearing_expiration'),
        value: get('about_to_expire'),
        color: '#faad14',
        key: 'about_to_expire',
      },
      {
        title: t('agreed_prices.summary.expired'),
        value: get('expired'),
        color: '#ff4d4f',
        key: 'expired',
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
              name={'estimate_number'}
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
              name={'business_partner'}
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
              name={'creator'}
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
              name={'department'}
            >
              <Select
                allowClear
                showSearch
                {...departmentSelectProps}
                labelInValue
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
                  setStatus(null)
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
              <Button type="primary">
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

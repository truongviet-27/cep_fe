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
import { type QuotaAgreedPrice } from '@sdk/hey-api/types.gen'
import { useUserStore } from '@stores/useUserStore'
import type { TableProps } from 'antd'
import {
  Button,
  Checkbox,
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
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import React, { useCallback, useMemo, useState } from 'react'

const { RangePicker } = DatePicker

const AgreedPriceQuotaTab = () => {
  const t = useTranslate()
  const go = useGo()
  const apiUrl = useApiUrl()

  // Function to format number with comma separators, hide .00 if it's .00
  const formatNumberWithCommas = (num: number | undefined | null): string => {
    if (num === undefined || num === null) return '0'

    // Format with commas first
    const formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    // Remove .00 if it exists at the end
    return formatted.replace(/\.00$/, '')
  }

  const [status, setStatus] = useState<string | null>(null)

  const { permission } = useUserStore((state) => state)

  const { selectProps: departmentSelectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: {
      mode: 'server',
      pageSize: 100,
    },
  })

  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [updateForm] = Form.useForm()
  const [selected, setSelected] = useState<QuotaAgreedPrice | null>(null)
  const [isUnlimitedModal, setIsUnlimitedModal] = useState(false)
  const { mutate: mutateUpdate, isPending: updating } = useCustomMutation()

  const openUpdate = (record: QuotaAgreedPrice) => {
    setSelected(record)
    const start = (record as any).valid_from
      ? dayjs((record as any).valid_from).add(0, 'day')
      : dayjs().add(1, 'day')
    const end = (record as any).valid_to
      ? dayjs((record as any).valid_to).add(0, 'day')
      : dayjs().add(1, 'day')
    const isUnlimited = (record as any).is_unlimited ?? false
    updateForm.setFieldsValue({ start_date: start, end_date: end })
    setIsUnlimitedModal(isUnlimited)
    setIsUpdateOpen(true)
  }

  const startDate = Form.useWatch('start_date', updateForm)
  const endDate = Form.useWatch('end_date', updateForm)

  const handleUpdateSubmit = () => {
    updateForm.validateFields().then((values) => {
      if (!selected?.id) return

      const valuesToSend: any = {
        is_unlimited: isUnlimitedModal,
      }

      if (isUnlimitedModal) {
        valuesToSend.valid_from = values.start_date
          ? (values.start_date as Dayjs).format('YYYY/MM/DD')
          : null
        valuesToSend.valid_to = values.end_date
          ? (values.end_date as Dayjs).format('YYYY/MM/DD')
          : null
      } else {
        valuesToSend.valid_from = (values.start_date as Dayjs).format(
          'YYYY/MM/DD',
        )
        valuesToSend.valid_to = (values.end_date as Dayjs).format('YYYY/MM/DD')
      }

      mutateUpdate(
        {
          method: 'put',
          url: `${apiUrl}/quota/agreed-prices/${selected.id}/expiration-date`,
          values: valuesToSend,
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
            setIsUnlimitedModal(false)
            refetchCount?.()
            tableQuery?.refetch?.()
          },
        },
      )
    })
  }

  const calculatedStatusFromExpiredDate = (expriedDate: string) => {
    let calculatedStatus = ''
    const today = dayjs().startOf('day')
    const validTo = dayjs(expriedDate).startOf('day')
    const diffInDays = validTo.diff(today, 'day')
    if (diffInDays < 0) {
      calculatedStatus = 'expired'
    } else if (diffInDays < 15) {
      calculatedStatus = 'about_to_expire'
    } else {
      calculatedStatus = 'active'
    }
    return calculatedStatus
  }

  const mapStatusFromApi = (status?: string): AgreedPriceStatus => {
    if (!status) return AgreedPriceStatus.Active

    // Map Japanese status values to enum
    if (status === '有効') {
      return AgreedPriceStatus.Active
    }
    if (status === '無効' || status === '期限切れ') {
      return AgreedPriceStatus.Expired
    }
    if (status === '期限間近') {
      return AgreedPriceStatus.NearingExpiration
    }

    // If status is already in enum format, use it directly
    if (
      status === 'active' ||
      status === 'expired' ||
      status === 'about_to_expire'
    ) {
      return status as AgreedPriceStatus
    }

    // Default to active
    return AgreedPriceStatus.Active
  }

  const columns: ColumnsType<QuotaAgreedPrice> = useMemo(
    () => [
      {
        title: t('agreed_prices.table.status'),
        dataIndex: 'status',
        key: 'status',
        width: '7%',
        onCell: () => ({
          style: { padding: '2px 2px', minWidth: 0, overflow: 'hidden' },
        }),
        render: (_: any, record: QuotaAgreedPrice) => {
          const mappedStatus = mapStatusFromApi(record.status)
          return (
            <div
              style={{
                minWidth: 0,
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <Tag
                color={getAgreedPriceStatusStyle(mappedStatus, t).background}
                style={{
                  color: getAgreedPriceStatusStyle(mappedStatus, t).color,
                  marginRight: 0,
                  maxWidth: '100%',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: 1.3,
                }}
              >
                {getAgreedPriceStatusStyle(mappedStatus, t).text}
              </Tag>
            </div>
          )
        },
      },
      {
        title: t('agreed_prices.table.estimate_number'),
        dataIndex: 'quota_code',
        key: 'quota_code',
        width: '8%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (quotaCode: string, record: QuotaAgreedPrice) => (
          <Button
            type="link"
            onClick={() =>
              go({ to: `/agreed-prices/quota/${record.quota_id}` })
            }
            style={{
              textDecoration: 'underline',
              padding: 0,
              display: 'block',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {quotaCode}
          </Button>
        ),
      },
      {
        title: t('agreed_prices.table.category'),
        dataIndex: 'category',
        key: 'category',
        width: '6%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (category: string) => {
          if (category === 'merchandise') {
            return t('agreed_prices.category.merchandise')
          }
          if (category === 'service') {
            return t('agreed_prices.category.service')
          }
          return '-'
        },
      },
      {
        title: t('agreed_prices.table.customer'),
        key: 'customer_name',
        width: '12%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (_: unknown, record: QuotaAgreedPrice) => (
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {record.customer?.name ?? '-'}
          </div>
        ),
      },
      {
        title: t('agreed_prices.table.creator'),
        key: 'created_by_name',
        width: '10%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (_: unknown, record: QuotaAgreedPrice) => (
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {record.creator?.name ?? '-'}
          </div>
        ),
      },
      {
        title: t('agreed_prices.table.product_count'),
        dataIndex: 'number_products',
        key: 'number_products',
        width: '6%',
        align: 'right',
      },
      {
        title: (
          <div>
            <div>{t('agreed_prices.table.department')}</div>
            <div style={{ fontSize: '14px', color: '#1890FF' }}>
              {t('agreed_prices.table.amount')}
            </div>
          </div>
        ),
        dataIndex: 'total_price',
        key: 'total_price',
        width: '14%',
        align: 'right',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            maxWidth: 180,
            minWidth: 180,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            verticalAlign: 'center',
          },
        }),
        render: (totalPrice: number, record: QuotaAgreedPrice) => (
          <div
            style={{
              minWidth: 0,
              width: '100%',
              overflow: 'hidden',
            }}
          >
            {(record.creator as any)?.department_name && (
              <div
                style={{
                  fontSize: '16px',
                  color: '#666',
                  display: 'block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}
              >
                {(record.creator as any)?.department_name}
              </div>
            )}
            <div
              title={formatNumberWithCommas(totalPrice)}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {formatNumberWithCommas(totalPrice)}
            </div>
          </div>
        ),
      },
      {
        title: (
          <div>
            <div>見積期限</div>
          </div>
        ),
        key: 'estimateDateApplicationEnd',
        width: '10%',
        render: (_, record: any) => {
          let calculatedStatus = ''
          const validToDate = record.valid_to
          if (validToDate) {
            calculatedStatus = calculatedStatusFromExpiredDate(validToDate)
          }
          const style = getAgreedPriceStatusStyle(
            calculatedStatus as AgreedPriceStatus,
            t,
          )
          return (
            <div>
              {!record?.is_unlimited ? (
                <>
                  <div>
                    {(record as any).valid_from
                      ? dayjs((record as any).valid_from).format('YYYY/MM/DD')
                      : '---'}
                  </div>
                  <div style={{ color: style.color }}>
                    {(record as any).valid_to
                      ? dayjs((record as any).valid_to).format('YYYY/MM/DD')
                      : '---'}
                  </div>
                </>
              ) : (
                <span style={{ color: '#1FDB51' }}>無制限</span>
              )}
            </div>
          )
        },
      },
      {
        title: '更新',
        dataIndex: 'number_updating',
        key: 'number_updating',
        width: '5%',
        align: 'center',
      },
      {
        title: t('agreed_prices.table.operation'),
        key: 'operation',
        width: '22%',
        render: (_: unknown, record: QuotaAgreedPrice) => (
          <Space wrap size={4}>
            <ShowButton
              size="small"
              recordItemId={(record as any).quota_id as number}
              resource="agreed-prices"
              style={{
                color: '#2784FF',
                borderColor: '#2784FF',
                backgroundColor: '#fff',
              }}
              icon={false}
            />
            <Button
              size="small"
              onClick={() => openUpdate(record)}
              style={{
                color: '#fff',
                backgroundColor: '#1FDB51',
                borderColor: '#1FDB51',
              }}
            >
              {t('agreed_prices.action.update')}
            </Button>
            <Button
              size="small"
              onClick={() => {
                // TODO: Implement duplicate functionality
              }}
              style={{
                color: '#fff',
                backgroundColor: '#0161D3',
                borderColor: '#0161D3',
              }}
            >
              {t('agreed_prices.action.duplicate_quota')}
            </Button>
            <DeleteButton
              size="small"
              recordItemId={record.id as number}
              resource="quota/agreed-prices"
              meta={{ idsBody: true, method: 'delete' }}
              onSuccess={() => tableQuery?.refetch?.()}
              disabled={
                !permission?.is_module_admin &&
                permission?.user?.id !== record.creator?.id
              }
              style={{
                color: '#fff',
                backgroundColor: '#E74C3C',
                borderColor: '#E74C3C',
              }}
              icon={false}
            />
          </Space>
        ),
      },
    ],
    [t, go],
  )

  const { data: count, refetch: refetchCount } = useCustom({
    method: 'get',
    url: `${apiUrl}/quota/agreed-prices/count`,
  })

  const { tableProps, searchFormProps, setFilters, tableQuery, setCurrent } =
    useTable<QuotaAgreedPrice, HttpError, any>({
      pagination: { pageSize: 20 },
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
            field: 'category',
            operator: 'eq',
            value: v.category,
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
              ? (v.department_id as { value?: number }).value
              : undefined,
          },
          {
            field: 'tag_name',
            operator: 'eq',
            value: v.tag_name,
          },
          {
            field: 'expiration_date',
            operator: 'gte',
            value: start ? start.format('YYYY-MM-DD') : undefined,
          },
          {
            field: 'expiration_date',
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
    ]
  }, [count, t])

  const onChangeStatus = useCallback(
    (nextStatus: string | null) => {
      setCurrent(1)
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
  const { form } = searchFormProps

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
                  {t('agreed_prices.search.customer')}
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
                  {t('agreed_prices.search.category')}
                </span>
              }
              layout="vertical"
              name={'category'}
            >
              <Select
                allowClear
                placeholder={t('agreed_prices.search.please_select')}
                options={[
                  {
                    label: t('agreed_prices.category.merchandise'),
                    value: 'merchandise',
                  },
                  {
                    label: t('agreed_prices.category.service'),
                    value: 'service',
                  },
                ]}
              />
            </Form.Item>
          </Col>
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
                {...departmentSelectProps}
                allowClear
                showSearch
                onSearch={() => {}}
                filterOption={(input, option) =>
                  ((option?.label ?? '') as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
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
              <Button htmlType="submit" type="primary" autoInsertSpace={false}>
                {t('agreed_prices.action.search')}
              </Button>
              <Button
                htmlType="button"
                type="default"
                onClick={() => {
                  form?.resetFields()
                  setFilters(
                    [
                      {
                        field: 'status',
                        operator: 'eq',
                        value: status,
                      },
                    ],
                    'replace',
                  )
                }}
              >
                {t('agreed_prices.action.clear')}
              </Button>
            </div>
          </Col>
        </Row>
        {/* <Row gutter={[24, 24]}>
          <Col xs={24}>
            <div className="mt-7 flex justify-end gap-2">
              <Button
                type="primary"
                onClick={() =>
                  go({
                    to: '/quotas',
                    query: {
                      sorters: [
                        {
                          field: 'status',
                          order: 'asc',
                        },
                      ],
                      filters: [
                        {
                          field: 'status',
                          operator: 'eq',
                          value: 'completed',
                        },
                      ],
                    },
                  })
                }
              >
                {t('agreed_prices.action.add_from_estimate_list')}
              </Button>
            </div>
          </Col>
        </Row> */}
      </div>

      {(() => {
        const refinedTableProps =
          tableProps as unknown as TableProps<QuotaAgreedPrice>
        return (
          <CommonTable<QuotaAgreedPrice>
            {...refinedTableProps}
            rowKey="id"
            columns={columns}
            scroll={undefined}
          />
        )
      })()}

      <Modal
        title={
          <div
            style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}
          >
            {t('agreed_prices.modal.update_title') || '継続見積更新'}
          </div>
        }
        open={isUpdateOpen}
        onCancel={() => {
          setIsUpdateOpen(false)
          setIsUnlimitedModal(false)
        }}
        footer={null}
        destroyOnClose
        style={{ top: 20 }}
        width={600}
      >
        <Form
          form={updateForm}
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          labelAlign="left"
          colon={false}
          style={{ marginTop: 16 }}
        >
          <Form.Item label="見積番号" style={{ marginBottom: 16 }}>
            <Space>
              <span style={{ padding: 0, color: '#1890ff' }}>
                {selected?.quota_code || 'ES-250527-003'}
              </span>
              {selected?.valid_to && (
                <span
                  style={{
                    background:
                      calculatedStatusFromExpiredDate(selected.valid_to) ===
                      'expired'
                        ? '#ff4d4f'
                        : calculatedStatusFromExpiredDate(selected.valid_to) ===
                            'about_to_expire'
                          ? '#fa8c16'
                          : '#1890ff',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                >
                  {calculatedStatusFromExpiredDate(selected.valid_to) ===
                  'expired'
                    ? t('agreed_prices.summary.expired')
                    : calculatedStatusFromExpiredDate(selected.valid_to) ===
                        'about_to_expire'
                      ? t('agreed_prices.summary.nearing_expiration')
                      : t('agreed_prices.summary.active')}
                </span>
              )}
            </Space>
          </Form.Item>

          <Form.Item label="タイトル" style={{ marginBottom: 16 }}>
            <span>システムカスタマイズ</span>
          </Form.Item>

          <Form.Item label="取引先" style={{ marginBottom: 16 }}>
            <span>
              {selected?.customer?.name || '株式会社コマースロボティクス'}
            </span>
          </Form.Item>

          <Form.Item label="適用開始日" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Form.Item
                name="start_date"
                rules={[
                  {
                    required: !isUnlimitedModal,
                    message: t('validation.date.start_date.required'),
                  },
                ]}
                noStyle
              >
                <DatePicker
                  style={{ width: '65%' }}
                  placeholder="YYYY/MM/DD"
                  format="YYYY/MM/DD"
                  inputReadOnly
                  disabled={isUnlimitedModal}
                  disabledDate={(current) =>
                    current && current < dayjs().startOf('day')
                  }
                />
              </Form.Item>

              <span
                style={{
                  color: '#fa8c16',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                }}
              >
                自動で終了日の翌日
              </span>
            </div>
          </Form.Item>

          <Form.Item
            label="適用終了日"
            name="end_date"
            rules={[
              {
                required: !isUnlimitedModal,
                message: t('validation.date.end_date.required'),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (isUnlimitedModal) {
                    return Promise.resolve()
                  }
                  const start = getFieldValue('start_date')
                  if (!value || !start) {
                    return Promise.resolve()
                  }
                  if (dayjs(value).isBefore(dayjs(start), 'day')) {
                    return Promise.reject(
                      new Error(
                        t('validation.date.end_date.before_start_date'),
                      ),
                    )
                  }
                  return Promise.resolve()
                },
              }),
            ]}
            style={{ marginBottom: 16 }}
          >
            <DatePicker
              style={{ width: '65%' }}
              placeholder="YYYY/MM/DD"
              format="YYYY/MM/DD"
              inputReadOnly
              disabled={isUnlimitedModal}
              disabledDate={(current) => {
                if (!current) return false
                const today = dayjs().startOf('day')
                const start = startDate
                  ? dayjs(startDate).startOf('day')
                  : today
                return current < today || current < start
              }}
              defaultPickerValue={endDate || startDate}
            />
          </Form.Item>

          <Form.Item label=" " style={{ marginBottom: 16 }}>
            <Checkbox
              checked={isUnlimitedModal}
              onChange={(e) => {
                setIsUnlimitedModal(e.target.checked)
              }}
            >
              無制限
            </Checkbox>
          </Form.Item>

          <Divider style={{ margin: '24px 0' }} />

          <Form.Item label="登録者:" style={{ marginBottom: 16 }}>
            <span>
              {selected?.creator?.name || '伊藤太郎'}{' '}
              {selected?.created_at
                ? dayjs(selected.created_at).format('YYYY/MM/DD HH:mm')
                : '2025/08/04 12:30'}
            </span>
          </Form.Item>

          <Form.Item label="更新者:" style={{ marginBottom: 16 }}>
            <span>
              {selected?.creator?.name || '伊藤太郎'}{' '}
              {selected?.updated_at
                ? dayjs(selected.updated_at).format('YYYY/MM/DD HH:mm')
                : '2025/08/04 12:30'}
            </span>
          </Form.Item>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 24,
              gap: 8,
            }}
          >
            <Button onClick={() => setIsUpdateOpen(false)}>キャンセル</Button>
            <Button
              type="primary"
              loading={updating}
              onClick={handleUpdateSubmit}
            >
              更新
            </Button>
          </div>
        </Form>
      </Modal>
    </Form>
  )
}

export default AgreedPriceQuotaTab

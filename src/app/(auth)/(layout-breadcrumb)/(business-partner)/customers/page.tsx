/* eslint-disable */
'use client'

import {
  DownOutlined,
  ExclamationCircleOutlined,
  RightOutlined,
} from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { axiosInstance } from '@providers/data-provider/rest-data-provider/utils'
import {
  CreateButton,
  DeleteButton,
  EditButton,
  useModalForm,
  useTable,
} from '@refinedev/antd'
import {
  type BaseRecord,
  useApiUrl,
  useCustom,
  useCustomMutation,
  useGo,
  useNotification,
  useTranslate,
  useUpdate,
} from '@refinedev/core'
import {
  ParameterResourceEnum,
  PermissionEnum,
  Rank,
  SimpleCustomer,
} from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { CSV_LINK, PRIMARY } from '@utility/color'
import { FORMAT_DATE_CROSS } from '@utility/instances'
import {
  antiSocialCheckOptions,
  countryOptions,
  creditCheckOptions,
  searchDateTypeOptions,
} from '@utility/options'
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  TableColumnsType,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'
import AutoHeading from '@components/common/auto-heading'
import { SelectPagination } from '@components/common/select-pagination'
import { RankModalEdit } from '@app/(auth)/(layout-breadcrumb)/(merchandise)/ranks/edit/modal'
import StatusDashboard from './components/status-dashboard'
import { CustomerStatusStyle } from './components/utils/customer-status-style'
import { notification } from 'antd'
const { RangePicker } = DatePicker
const { Title, Text } = Typography

interface ICustomer {
  id: string
  code: string
  name: string
  country: string
  department: string
  unit_price_rank_code: string
  credit_rank: string
  anti_social_check_date: string
  registration_date: string
  suspension_date: string | null
}

export default function CustomerListPage() {
  const statusKeys = ['new', 'prospecting', 'contracted', 'lost', 'suspended']
  const [status, setStatus] = useState<string | null>(null)
  const t = useTranslate()
  const go = useGo()
  const router = useRouter()
  const apiUrl = useApiUrl()
  const [isShow, setIsShow] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [checkDeleteResult, setCheckDeleteResult] = useState<any>(null)
  const { mutateAsync: updateStatusMutation } = useCustomMutation()
  const { mutate: bulkDeleteMutate, isPending: isBulkDeleting } =
    useCustomMutation()
  const { mutate: checkDeleteMutate, isPending: isCheckingDelete } =
    useCustomMutation()

  const { mutate, isLoading } = useUpdate()
  const { parameterSettings, hasFullAccessModule } = useUserStore(
    (state) => state,
  )

  const notification = useNotification()

  const isFullAccess = hasFullAccessModule(PermissionEnum.CUSTOMER_EDIT)
  const allowRankResource = parameterSettings?.get?.(
    ParameterResourceEnum.RANKS,
  )

  const modalFormProps = useModalForm<Rank>({
    action: 'edit',
    resource: 'ranks',
    autoResetFormWhenClose: true,
    warnWhenUnsavedChanges: false,
    autoResetForm: true,
  })

  const { data: count, refetch: refetchCount } = useCustom({
    method: 'get',
    url: `${apiUrl}/customers/count`,
  })
  const {
    show: editModalShow,
    close: editModalClose,
    open: editModalOpen,
  } = modalFormProps

  const {
    tableProps,
    setFilters,
    searchFormProps,
    setCurrent,
    tableQueryResult,
  } = useTable<ICustomer>({
    syncWithLocation: true,
    pagination: { pageSize: 20 },
    filters: {
      initial: [
        {
          field: 'status',
          operator: 'eq',
          value: status,
        },
      ],
    },
    onSearch: (values: any) => [
      {
        field: 'q',
        operator: 'null',
        value: values?.q,
      },
      {
        field: 'country',
        operator: 'null',
        value: values?.country,
      },
      {
        field: 'department_in_charge_id',
        operator: 'null',
        value: values?.department_in_charge_id,
      },
      {
        field: 'price_rank_id',
        operator: 'null',
        value: values?.price_rank_id,
      },
      {
        field: 'credit_rank',
        operator: 'null',
        value: values?.credit_rank,
      },
      {
        field: 'anti_social_rank',
        operator: 'null',
        value: values?.anti_social_rank,
      },
      {
        field: 'search_date_type',
        operator: 'null',
        value: values?.search_date_type,
      },
      {
        field: 'date_start',
        operator: 'null',
        value: values.date_range?.[0]
          ? dayjs(values.date_range[0]).format(FORMAT_DATE_CROSS)
          : undefined,
      },
      {
        field: 'date_end',
        operator: 'null',
        value: values.date_range?.[1]
          ? dayjs(values.date_range[1]).format(FORMAT_DATE_CROSS)
          : undefined,
      },
    ],
  })

  const handleSearch = (values: any) => {
    setCurrent(1)
    setFilters([
      {
        field: 'q',
        operator: 'null',
        value: values?.q,
      },
      {
        field: 'country',
        operator: 'null',
        value: values?.country,
      },
      {
        field: 'department_in_charge_id',
        operator: 'null',
        value: values?.department_in_charge_id,
      },
      {
        field: 'price_rank_id',
        operator: 'null',
        value: values?.price_rank_id,
      },
      {
        field: 'credit_rank',
        operator: 'null',
        value: values?.credit_rank,
      },
      {
        field: 'anti_social_rank',
        operator: 'null',
        value: values?.anti_social_rank,
      },
      {
        field: 'search_date_type',
        operator: 'null',
        value: values?.search_date_type,
      },
      {
        field: 'date_start',
        operator: 'null',
        value: values.date_range?.[0]
          ? dayjs(values.date_range[0]).format(FORMAT_DATE_CROSS)
          : undefined,
      },
      {
        field: 'date_end',
        operator: 'null',
        value: values.date_range?.[1]
          ? dayjs(values.date_range[1]).format(FORMAT_DATE_CROSS)
          : undefined,
      },
    ])
  }

  const getRowClassName = (record: BaseRecord) => {
    return record.deleted_at ? '!bg-gray-300' : ''
  }

  const columns: TableColumnsType<SimpleCustomer> = useMemo(() => {
    const baseColumns: TableColumnsType<SimpleCustomer> = [
      {
        title: t('customers.tables.header.code'),
        dataIndex: 'customer_code',
        key: 'customer_code',
        width: '8%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (text, record) => (
          <Link
            href={
              record.deleted_at
                ? `/customers/show/${record.id}?disable=true`
                : `/customers/show/${record.id}`
            }
            key={record.id}
            style={{
              textDecoration: 'underline',
              whiteSpace: 'nowrap',
              display: 'block',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {text}
          </Link>
        ),
      },
      {
        title: t('customers.fields.name'),
        dataIndex: 'name',
        key: 'name',
        align: 'left',
        width: '14%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (val: string) => (
          <Text
            ellipsis={{ tooltip: val ?? '' }}
            style={{ display: 'block', width: '100%' }}
          >
            {val}
          </Text>
        ),
      },
      {
        title: t('customers.fields.status'),
        dataIndex: 'status',
        key: 'status',
        width: '12%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }),
        render: (status, record) => (
          <div
            style={{
              minWidth: 0,
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          >
            <Select
              value={status}
              style={{ width: '100%', maxWidth: '100%' }}
              disabled={!isFullAccess || updatingId === record.id}
              loading={updatingId === record.id}
              onChange={async (value) => {
                setUpdatingId(record.id ?? null)
                try {
                  await updateStatusMutation({
                    url: `${apiUrl}/customers/${record.id}/status`,
                    method: 'patch',
                    values: { status: value },
                  })
                  await refetchCount()
                  await tableQueryResult.refetch()
                  notification.open?.({
                    type: 'success',
                    message: '',
                    description: t(
                      'customers.message.status_updated_successfully',
                    ),
                  })
                } catch (error) {
                } finally {
                  setUpdatingId(null)
                }
              }}
              options={statusKeys.map((key) => {
                const style = CustomerStatusStyle(key, t)
                return {
                  value: key,
                  label: (
                    <Tag
                      color={style.background}
                      style={{
                        color: style.color,
                        width: '70px',
                        textAlign: 'center',
                        fontSize: '14px',
                      }}
                    >
                      {style.text}
                    </Tag>
                  ),
                }
              })}
            />
          </div>
        ),
      },
      {
        title: t('customers.fields.country'),
        dataIndex: 'country',
        key: 'country',
        align: 'left',
        width: '6%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (country) =>
          country ? (
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {country}
            </div>
          ) : null,
      },
      {
        title: t('customers.fields.department'),
        dataIndex: 'department_in_charge',
        key: 'person_in_charge_department',
        align: 'left',
        width: '12%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (department) => {
          if (!department) return null
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                minWidth: 0,
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <div
                title={department.name}
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {department.name}
              </div>
              {department.deleted_at && (
                <Tooltip title={t('departments.is_deleted')} color="red">
                  <ExclamationCircleOutlined
                    style={{ color: 'red', flexShrink: 0 }}
                  />
                </Tooltip>
              )}
            </div>
          )
        },
      },
      {
        title: t('customers.fields.unit_price_rank_code'),
        dataIndex: 'rank',
        key: 'rank',
        width: '5%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (rank) =>
          rank?.code ? (
            <Link
              href={`/ranks`}
              className="!underline"
              onClick={(event) => {
                event.preventDefault()
                editModalShow(rank.id)
              }}
            >
              {rank?.code}
            </Link>
          ) : (
            <>-</>
          ),
      },
      {
        title: (
          <div>
            <AutoHeading
              i18n={'customers.fields.credit_rank'}
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            />
            <AutoHeading
              i18n={'customers.fields.anti_social_check_date'}
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            />
          </div>
        ),
        dataIndex: 'credit_rank',
        key: 'credit_rank',
        width: '8%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (_, record) => (
          <Space
            direction="vertical"
            size={0}
            style={{
              minWidth: 0,
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Text strong>{record?.credit_rank}</Text>
            <Text strong>{record?.anti_social_rank}</Text>
          </Space>
        ),
      },
      {
        title: (
          <div>
            <AutoHeading
              i18n={'code_issue_settings.fields.updated_at'}
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            />
            <AutoHeading
              i18n={'code_issue_settings.fields.updated_at'}
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            />
          </div>
        ),
        dataIndex: 'anti_social_rank_update_at',
        key: 'anti_social_rank_update_at',
        width: '8%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (_, record) => {
          const creditDate =
            record?.credit_rank_update_at &&
            dayjs(record?.credit_rank_update_at).format(FORMAT_DATE_CROSS)
          const antiDate =
            record?.anti_social_rank_update_at &&
            dayjs(record.anti_social_rank_update_at).format(FORMAT_DATE_CROSS)
          return (
            <Space
              direction="vertical"
              size={0}
              style={{
                minWidth: 0,
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <div
                title={creditDate ?? undefined}
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <Text>{creditDate ?? '-'}</Text>
              </div>
              <div
                title={antiDate ?? undefined}
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <Text>{antiDate ?? '-'}</Text>
              </div>
            </Space>
          )
        },
      },
      {
        title: t('customers.fields.total_revenue'),
        dataIndex: 'total_revenue',
        key: 'total_revenue',
        width: '6%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (_, record) => (
          <div
            className="text-[14px] font-semibold"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {Number((record as any)?.total_revenue).toLocaleString()}
          </div>
        ),
      },
      {
        title: t('customers.fields.registration_date'),
        dataIndex: 'created_at',
        key: 'created_at',
        width: '8%',
        render: (text) =>
          text && <div>{dayjs(text).format(FORMAT_DATE_CROSS)}</div>,
      },
      {
        title: t('customers.fields.suspension_date'),
        dataIndex: 'deleted_at',
        key: 'deleted_at',
        width: '8%',
        render: (text) =>
          text && <div>{dayjs(text).format(FORMAT_DATE_CROSS)}</div>,
      },
      {
        title: t('customers.fields.actions'),
        key: 'actions',
        align: 'center',
        dataIndex: 'actions',
        width: '7%',
        render: (_, record) => (
          <Space wrap size={4}>
            {!record.deleted_at && (
              <EditButton
                icon={null}
                recordItemId={record.id}
                size={'small'}
                autoInsertSpace={false}
                disabled={!isFullAccess}
                style={{
                  color: '#FFFFFF',
                  background: '#1FDB51',
                  borderColor: '#1FDB51',
                }}
              >
                {t('buttons.edit')}
              </EditButton>
            )}
            {!record.deleted_at && (record as any).status === 'suspended' && (
              <DeleteButton
                icon={null}
                recordItemId={record.id}
                resource="customers"
                size={'small'}
                autoInsertSpace={false}
                disabled={!isFullAccess}
                style={{
                  color: '#FFFFFF',
                  background: '#E74C3C',
                }}
              >
                {t('buttons.delete')}
              </DeleteButton>
            )}
          </Space>
        ),
      },
    ]

    const numberColumnKeys = ['total_revenue']
    const centerColumnKeys = ['status', 'actions']

    return baseColumns.map((column) => {
      const dataIndex =
        'dataIndex' in column && column.dataIndex !== undefined
          ? column.dataIndex
          : ''
      const key = String(column.key ?? dataIndex)
      const originalOnCell =
        'onCell' in column && typeof column.onCell === 'function'
          ? column.onCell
          : undefined

      return {
        ...column,
        align: centerColumnKeys.includes(key)
          ? 'center'
          : numberColumnKeys.includes(key)
            ? 'right'
            : 'left',
        onHeaderCell: (col: unknown) => {
          const originalHeaderCell =
            'onHeaderCell' in column &&
            typeof column.onHeaderCell === 'function'
              ? (column.onHeaderCell(col as any) ?? {})
              : {}
          return {
            ...originalHeaderCell,
            style: {
              ...(originalHeaderCell as any).style,
              textAlign: 'center',
            },
          }
        },
        onCell: (record: unknown, rowIndex: number | undefined) => {
          const originalCell = originalOnCell?.(record as any, rowIndex) ?? {}
          return {
            ...originalCell,
            style: {
              ...(originalCell as any).style,
              padding: '8px 12px',
            },
          }
        },
      }
    })
  }, [
    t,
    go,
    isFullAccess,
    isLoading,
    mutate,
    editModalShow,
    refetchCount,
    tableQueryResult,
    updatingId,
  ])

  const handleClear = () => {
    searchFormProps.form?.resetFields()
    setFilters([], 'replace')
  }

  const breadcrumbItems = [
    {
      title: boldText(t('business_partner.business_partner')),
    },
    {
      title: boldText(t('customers.list.list'), PRIMARY),
    },
  ]

  const statusDashboard = useMemo(() => {
    const c = count?.data

    const stats = statusKeys.map((key) => {
      const style = CustomerStatusStyle(key, t)
      const countItem = c?.status_counts?.find((s: any) => s.status === key)

      return {
        title: style.text,
        value: countItem?.count ?? 0,
        color: style.color,
        background: style.background,
        key: key,
      }
    })

    return [
      {
        title: t('agreed_prices.summary.all'),
        value: c?.total ?? 0,
        key: null as string | null,
      },
      ...stats,
    ]
  }, [count, t])

  const onChangeStatus = useCallback(
    (nextStatus: string | null) => {
      setCurrent(1)
      setStatus(nextStatus)
      setSelectedRowKeys([])
      setSelectedRows([])
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

  const onSelectChange = useCallback(
    (newSelectedRowKeys: React.Key[], newSelectedRows: any[]) => {
      setSelectedRowKeys(newSelectedRowKeys)
      setSelectedRows(newSelectedRows)
    },
    [],
  )

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: any) => ({
      disabled: record.status !== 'suspended',
    }),
  }

  const handleCheckDelete = useCallback(() => {
    checkDeleteMutate(
      {
        values: { ids: selectedRows.map((item: any) => item.id) },
        method: 'post',
        url: `${apiUrl}/customers/check-delete`,
      },
      {
        onSuccess: (response: any) => {
          setCheckDeleteResult(response?.data)
          setIsDeleteModalOpen(true)
        },
      },
    )
  }, [checkDeleteMutate, selectedRows, apiUrl])

  const handleBulkDelete = useCallback(() => {
    const deletableIds = [
      ...(checkDeleteResult?.deletable ?? []),
      ...(checkDeleteResult?.deletable_with_warnings ?? []),
    ].map((item: any) => item.id)

    if (deletableIds.length === 0) return

    bulkDeleteMutate(
      {
        values: { ids: deletableIds },
        method: 'delete',
        url: `${apiUrl}/customers`,
        successNotification: () => ({
          message: t('notifications.success'),
          description: t('notifications.success'),
          type: 'success' as const,
        }),
      },
      {
        onSuccess: () => {
          setSelectedRowKeys([])
          setSelectedRows([])
          setIsDeleteModalOpen(false)
          setCheckDeleteResult(null)
          tableQueryResult.refetch()
          refetchCount()
        },
      },
    )
  }, [
    bulkDeleteMutate,
    checkDeleteResult,
    apiUrl,
    t,
    tableQueryResult,
    refetchCount,
  ])

  const handleExportCsv = async () => {
    const values = (searchFormProps.form?.getFieldsValue?.() ?? {}) as {
      q?: string
      country?: string
      department_in_charge_id?: string | number
      price_rank_id?: string | number
      credit_rank?: string
      anti_social_rank?: string
      search_date_type?: string
      date_range?: [string, string]
    }
    const dateRange = Array.isArray(values.date_range) ? values.date_range : []

    setIsExportingCsv(true)
    try {
      notification.open?.({
        type: 'progress',
        message: '',
        description:
          'システムエラーの発生を抑制するため、最新の1,000件のレコードのみダウンロードを実施いたします。',
      })

      const response = await axiosInstance.get(
        `${apiUrl}/customers/export-csv`,
        {
          params: {
            q: values.q || undefined,
            country: values.country || undefined,
            department_in_charge_id:
              values.department_in_charge_id || undefined,
            price_rank_id: values.price_rank_id || undefined,
            credit_rank: values.credit_rank || undefined,
            anti_social_rank: values.anti_social_rank || undefined,
            search_date_type: values.search_date_type || undefined,
            date_start: dateRange[0]
              ? dayjs(dateRange[0]).format(FORMAT_DATE_CROSS)
              : undefined,
            date_end: dateRange[1]
              ? dayjs(dateRange[1]).format(FORMAT_DATE_CROSS)
              : undefined,
          },
          responseType: 'blob',
        },
      )

      const contentType = String(response.headers?.['content-type'] ?? '')
      const isCsvResponse =
        contentType.includes('text/csv') ||
        contentType.includes('application/octet-stream')

      let taskId: string | number | undefined
      if (isCsvResponse) {
        const blob = new Blob([response.data], {
          type: 'text/csv; charset=UTF-8',
        })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `customers_export_${Date.now()}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        const text = await response.data.text()
        const payload = text ? JSON.parse(text) : undefined
        taskId =
          payload?.id ??
          payload?.task_id ??
          payload?.data?.id ??
          payload?.data?.task_id
      }

      const params = new URLSearchParams()
      params.set('pageSize', '10')
      params.set('current', '1')
      if (taskId) {
        params.set('id', String(taskId))
      }
      router.replace(`/import-history?${params.toString()}`)
    } finally {
      setIsExportingCsv(false)
    }
  }

  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={'customers.list.list'}
    >
      <Form.Item name={'status'} hidden />
      <StatusDashboard
        statusData={statusDashboard}
        status={status}
        onChangeStatus={onChangeStatus}
      />

      <Form
        colon={false}
        {...searchFormProps}
        layout="vertical"
        onFinish={handleSearch}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.filters.code_name'))}
              name="q"
            >
              <Input placeholder={t('placeholders.partial_match')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.country'))}
              name="country"
            >
              <Select
                allowClear
                placeholder={t('placeholders.select')}
                options={countryOptions}
                showSearch
                filterOption={true}
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <SelectPagination
              selectProps={{
                resource: 'departments',
              }}
              formItemProps={{
                label: boldText(t('customers.fields.department')),
                name: 'department_in_charge_id',
              }}
              selectComponentProps={{
                placeholder: t('placeholders.select'),
                style: { maxWidth: 560, minWidth: '150px' },
              }}
            />
          </Col>
          {allowRankResource && (
            <Col xs={24} md={4}>
              <SelectPagination
                formItemProps={{
                  label: boldText(t('ranks.fields.code')),
                  name: 'price_rank_id',
                }}
                selectProps={{
                  resource: 'ranks',
                  queryOptions: {
                    enabled: allowRankResource,
                  },
                }}
                selectComponentProps={{
                  placeholder: t('placeholders.select'),
                  style: { maxWidth: 560, minWidth: '150px' },
                }}
                optionLabel={'code'}
              />
            </Col>
          )}
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.credit_rank'))}
              name="credit_rank"
            >
              <Select
                allowClear
                placeholder={t('placeholders.select')}
                options={creditCheckOptions}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.fields.anti_social_rank'))}
              name="anti_social_rank"
            >
              <Select
                allowClear
                placeholder={t('placeholders.select')}
                options={antiSocialCheckOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={4}>
            <Form.Item
              label={boldText(t('customers.filters.date_range'))}
              name="search_date_type"
              initialValue={searchDateTypeOptions[0]?.value}
            >
              <Select
                allowClear
                placeholder={t('customers.fields.registration_date')}
                options={searchDateTypeOptions}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label={<></>} name="date_range">
              <RangePicker
                className="w-full"
                placeholder={[FORMAT_DATE_CROSS, FORMAT_DATE_CROSS]}
                format={FORMAT_DATE_CROSS}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item label={<></>}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={handleSearch}
                  autoInsertSpace={false}
                >
                  {t('buttons.search')}
                </Button>
                <Button onClick={handleClear}>{t('buttons.clear')}</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Modal
        open={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false)
          setCheckDeleteResult(null)
        }}
        onOk={handleBulkDelete}
        okText={'OK'}
        cancelText={t('buttons.cancel')}
        confirmLoading={isBulkDeleting}
        okButtonProps={{
          style:
            checkDeleteResult?.not_deletable?.length > 0
              ? { display: 'none' }
              : {},
        }}
        styles={{
          body: {
            maxHeight: '30vh',
            overflowY: 'auto',
          },
        }}
      >
        {checkDeleteResult?.not_deletable?.length > 0 ? (
          <p>
            <span style={{ whiteSpace: 'pre-line' }}>
              {t('customers.message.delete_not_deletable')}
            </span>
            <br />
            {checkDeleteResult.not_deletable.map((c: any) => c.name).join('、')}
          </p>
        ) : checkDeleteResult?.deletable_with_warnings?.length > 0 ? (
          <p>
            {t('customers.message.delete_with_warnings')}
            <br />
            {checkDeleteResult.deletable_with_warnings
              .map((c: any) => c.name)
              .join('、')}
          </p>
        ) : (
          <p>{t('customers.message.delete_confirm')}</p>
        )}
      </Modal>

      <Row justify="space-between" align="top" className="mb-4">
        <Col>
          <Dropdown
            menu={{
              items:
                selectedRowKeys.length > 0
                  ? [
                      {
                        key: 'delete',
                        label: t('buttons.delete'),
                      },
                    ]
                  : [],
              onClick: (info) => {
                if (info.key === 'delete') {
                  handleCheckDelete()
                }
              },
            }}
            disabled={!isFullAccess}
          >
            <Button
              size="middle"
              disabled={!isFullAccess}
              loading={isCheckingDelete}
            >
              <Space style={{ fontSize: 14 }}>
                {t('products.list.actions.bulkProcessing')}
                <DownOutlined style={{ fontSize: 13 }} />
              </Space>
            </Button>
          </Dropdown>
        </Col>
        <Col>
          <Space direction="vertical">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleExportCsv}
                color="primary"
                variant="outlined"
                loading={isExportingCsv}
                disabled={!isFullAccess}
              >
                {t('products.list.actions.csvExportButton')}
              </Button>
              <CreateButton
                icon={null}
                disabled={!isFullAccess}
                autoInsertSpace={false}
              >
                {t('buttons.create_new')}
              </CreateButton>
            </div>
            <div className="flex items-end justify-end gap-2">
              <Link
                href={isFullAccess ? '/customers/csv' : '#'}
                className={isFullAccess ? '!underline' : '!text-gray-400'}
                style={{ color: CSV_LINK }}
              >
                {t('projects.csv_upload.title')}
              </Link>
            </div>
          </Space>
        </Col>
      </Row>

      <Modal
        open={editModalOpen}
        onCancel={() => {
          setIsShow(true)
          editModalClose()
        }}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        width={'70vh'}
      >
        <RankModalEdit
          modalFormProps={modalFormProps}
          setIsShow={setIsShow}
          isShow={isShow}
        />
      </Modal>

      <CommonTable
        onRow={(record) => ({
          className: getRowClassName(record),
        })}
        {...tableProps}
        rowKey="id"
        rowSelection={isFullAccess ? rowSelection : undefined}
        columns={columns as any}
        scroll={undefined}
      />
    </List>
  )
}

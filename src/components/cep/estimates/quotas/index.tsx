/* eslint-disable @typescript-eslint/no-explicit-any */
// done
import { CommentOutlined, DownOutlined, RightOutlined } from '@ant-design/icons'
import CreateFromTemplate from '@components/cep/estimates/quotas/action/components/popups/create-from-template'
import StatusDashboard from '@components/cep/estimates/quotas/action/components/status-dashboard'
import {
  QuotaStatus,
  STATUS_DISABLED_WHEN_OFF_APPROVE_ROUTE,
  TRANSACTION_TYPES,
} from '@components/cep/estimates/quotas/enum'
import {
  getActionPermissions,
  getExpiryDate,
  getQuotaStatusStyle,
  STATUS_DATE_RULES,
} from '@components/cep/estimates/quotas/utils'
import { CoreAutocompleteAPI } from '@components/common/autocomplete-api'
import CoreInput from '@components/common/core-input'
import ProductCategoryDropdown from '@components/common/product-category-dropdown'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import useCurrency from '@hook/use-currency'
import { axiosInstance } from '@providers/data-provider/rest-data-provider/utils'
import {
  CloneButton,
  DeleteButton,
  EditButton,
  ShowButton,
  useSelect,
  useTable,
} from '@refinedev/antd'
import {
  type CrudFilter,
  type CrudFilters,
  type OpenNotificationParams,
  useApiUrl,
  useCustom,
  useCustomMutation,
  useGo,
  useTranslate,
} from '@refinedev/core'
import { ParameterResourceEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { BLACK, PRIMARY, WHITE } from '@utility/color'
import { FORMAT_DATE_CROSS } from '@utility/instances'
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Empty,
  Form,
  Input,
  notification,
  Popconfirm,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
} from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { type TableRowSelection } from 'antd/es/table/interface'
import { type ItemType } from 'antd/lib/menu/interface'
import dayjs from 'dayjs'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type MenuInfo } from 'rc-menu/lib/interface'
import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

const { RangePicker } = DatePicker

function QuotaList() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const urlPage = Number(searchParams.get('current')) || 1
  const urlPageSize = Number(searchParams.get('pageSize')) || 20
  const t = useTranslate()
  const { convertCurrency } = useCurrency()
  const apiUrl = useApiUrl()
  const [useApproveRoute, setUseApproveRoute] = useState<boolean>(false)
  const parameterSettings = useUserStore((state) => state.parameterSettings)
  useEffect(() => {
    setUseApproveRoute(
      !!parameterSettings?.get?.(ParameterResourceEnum.APPROVE_ROUTES),
    )
  }, [parameterSettings])
  const { permission } = useUserStore.getState()

  const go = useGo()

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [options, setOptions] = useState<ItemType[]>([])
  const [selectedRows, setSelectedRows] = useState<any>()
  const rightOptions: ItemType[] = [
    { key: 1, label: t('quotas.actions.new_create') },
    { key: 2, label: t('quotas.actions.create_from_template') },
  ]
  const [isCreateFromTemplate, setIsCreateFromTemplate] = useState(false)
  const [isOpenManyDelete, setIsOpenManyDelete] = useState(false)
  const [isExportingCsv, setIsExportingCsv] = useState(false)

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: any,
  ) => {
    setSelectedRows(selectedRows)

    const status = handleOptions(selectedRows)

    const hasValidApprovers = (item: any): boolean =>
      item.is_manage_approve_routes === true &&
      Array.isArray(item?.approvers) &&
      item.approvers.length > 0

    // tat ca cac record duoc select, deu co nguoi duyet
    const allHaveApprovers = selectedRows.every(hasValidApprovers)

    // tat ca cac record duoc select, deu khong co nguoi duyet
    const noneHaveApprovers = selectedRows.every(
      (item: any) => item.is_manage_approve_routes === false,
    )

    const hasMixedApprovers = !allHaveApprovers && !noneHaveApprovers

    const options = statusButton(status, allHaveApprovers, hasMixedApprovers)

    setOptions(options)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const handleChangeStatus = useCallback(
    (resource: string, values: any, method?: any) => {
      mutate({
        values,
        method: method ? method : 'put',
        url: `${apiUrl}/quotas/${resource}`,
        successNotification: (data) => {
          return notificationFunction(data?.data.message)
        },
      })
    },
    [t],
  )

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => {
      const isPermissionDisabled = getActionPermissions(
        record.status,
        record?.is_author,
        record?.display,
        permission?.is_module_admin,
      )
      const isAgreedPriceDisabled =
        record.status === QuotaStatus.Completed &&
        record.has_agreed_price === true
      const isRowDisabled =
        !useApproveRoute &&
        STATUS_DISABLED_WHEN_OFF_APPROVE_ROUTE.indexOf(record.status) > -1
      return {
        disabled:
          isPermissionDisabled || isAgreedPriceDisabled || isRowDisabled,
      }
    },
  }

  const columns: ColumnsType<any> = useMemo(() => {
    const baseColumns: ColumnsType<any> = [
      {
        title: (
          <div className="flex flex-col">
            <span>{t('quotas.table.status_comment_1')}</span>
            <span>{t('quotas.table.status_comment_2')}</span>
          </div>
        ),
        dataIndex: 'status',
        key: 'status',
        width: '7%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            minWidth: 0,
            overflow: 'hidden',
          },
        }),
        render: (value, record) => {
          const result = getQuotaStatusStyle(value, t)

          return (
            <div
              className="flex flex-col items-center justify-center gap-1"
              style={{
                minWidth: 0,
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <Tag
                color={result.background}
                style={{
                  color: result.color,
                  marginRight: 0,
                  maxWidth: '100%',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: 1.3,
                }}
              >
                {result.text}
              </Tag>
              {record.latest_approval_comment?.comment && (
                <Tooltip
                  title={`${record.latest_approval_comment?.approver_name} (${dayjs(record.latest_approval_comment?.update_at).format('YYYY/MM/DD')}) : ${record.latest_approval_comment?.comment}`}
                >
                  <CommentOutlined
                    style={{
                      fontSize: 16,
                      cursor: 'pointer',
                    }}
                  />
                </Tooltip>
              )}
            </div>
          )
        },
      },
      {
        title: t('quotas.table.estimate_number'),
        dataIndex: 'code',
        key: 'code',
        width: '16%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            verticalAlign: 'center',
          },
        }),
        render: (value, record) => (
          <Button
            type="link"
            style={{
              display: 'block',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'left',
              padding: 0,
              height: 'auto',
            }}
            className="underline"
            title={value}
            onClick={() => {
              go({
                to: `/quotas/show/${record.id}`,
              })
            }}
          >
            {value}
          </Button>
        ),
      },
      {
        title: (
          <div className="flex flex-col">
            <span>{t('quotas.table.title_customer_1')}</span>
            <span>{t('quotas.table.title_customer_2')}</span>
          </div>
        ),
        dataIndex: 'title',
        key: 'title',
        width: '20%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            verticalAlign: 'center',
          },
        }),
        render: (_, record) => (
          <div>
            <div
              title={record.title}
              style={{
                display: 'block',
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'left',
              }}
            >
              {record.title}
            </div>
            <div
              title={record.customer_name}
              style={{
                display: 'block',
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'left',
              }}
            >
              {record.customer_name}
            </div>
          </div>
        ),
      },
      {
        title: (
          <div className="flex flex-col">
            <span>{t('quotas.table.transaction_type')}</span>
          </div>
        ),
        dataIndex: 'transaction_type',
        key: 'transaction_type',
        width: '7%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            verticalAlign: 'center',
          },
        }),
        render: (_, record) => (
          <div
            title={
              record.transaction_type
                ? t(`quotas.transaction_type.${record.transaction_type}`)
                : undefined
            }
            style={{
              display: 'block',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'left',
            }}
          >
            {record.transaction_type &&
              t(`quotas.transaction_type.${record.transaction_type}`)}
          </div>
        ),
      },
      {
        title: (
          <div className="flex flex-col">
            <span>{t('quotas.table.creator_approver_1')}</span>
            <span>{t('quotas.table.creator_approver_2')}</span>
          </div>
        ),
        dataIndex: 'creator',
        key: 'creator',
        width: '14%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            verticalAlign: 'center',
          },
        }),
        render: (_, record) => {
          return (
            <div>
              <div
                title={record?.author?.name}
                style={{
                  display: 'block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: 'left',
                }}
              >
                {record?.author?.name}
              </div>
              <div className="flex flex-col flex-wrap items-start justify-start gap-[2px]">
                {record.approvers?.map((item: any, index: number) => {
                  const numSteps = item?.number_step ?? 1
                  const isApproved = item.status === 'approved'
                  const numberIcon = String.fromCharCode(9311 + numSteps)
                  return (
                    <span
                      title={item.name}
                      style={{
                        display: 'block',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textAlign: 'left',
                      }}
                      key={index}
                      className={`${isApproved ? 'text-gray-400' : 'text-inherit'}`}
                    >
                      {numberIcon} {item.name}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        },
      },
      {
        title: (
          <div className="flex flex-col">
            <span>{t('quotas.table.department_amount_1')}</span>
            <span>{t('quotas.table.department_amount_2')}</span>
          </div>
        ),
        dataIndex: 'department',
        key: 'department',
        width: '8%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            verticalAlign: 'center',
          },
        }),
        render: (_, record) => (
          <div
            className="flex flex-col gap-2"
            style={{ minWidth: 0, width: '100%', overflow: 'hidden' }}
          >
            <div
              title={record.department_in_charge}
              style={{
                display: 'block',
                width: '100%',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'left',
              }}
            >
              {record.department_in_charge}
            </div>
            <div
              title={Number(record?.total_price || 0).toLocaleString()}
              style={{
                display: 'block',
                width: '100%',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'left',
              }}
            >
              {Number(record?.total_price || 0).toLocaleString()}
            </div>
          </div>
        ),
      },
      {
        title: (
          <div className="flex flex-col">
            <span>{t('quotas.table.created_expiry_1')}</span>
            <span>{t('quotas.table.created_expiry_2')}</span>
          </div>
        ),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '8%',
        render: (_, record) => (
          <div style={{ textAlign: 'left' }}>
            <div>{dayjs(record.created_at).format('YYYY/MM/DD')}</div>
            <div>
              {record.expiration_date &&
                dayjs(
                  getExpiryDate(record.expiration_date, record.created_at),
                ).format('YYYY/MM/DD')}
            </div>
          </div>
        ),
      },
      {
        title: (
          <div className="flex flex-col">
            <span>{t('quotas.table.sent_order_cancel_1')}</span>
            <span>{t('quotas.table.sent_order_cancel_2')}</span>
          </div>
        ),
        dataIndex: 'sentAt',
        key: 'sentAt',
        width: '8%',
        render: (_, record) => {
          if (
            record.sent_to_customer_date ||
            record.customer_accepted_date ||
            record.customer_cancelled_date
          ) {
            return (
              <div style={{ textAlign: 'left' }}>
                <div>
                  {dayjs(record.sent_to_customer_date).format('YYYY/MM/DD') ||
                    '-'}
                </div>
                <div>
                  {dayjs(record.customer_accepted_date).isValid()
                    ? dayjs(record.customer_accepted_date).format('YYYY/MM/DD')
                    : dayjs(record.customer_cancelled_date).isValid()
                      ? dayjs(record.customer_cancelled_date).format(
                          'YYYY/MM/DD',
                        )
                      : ''}
                </div>
              </div>
            )
          }
        },
      },
      {
        title: t('quotas.table.actions'),
        key: 'action',
        width: '14%',
        align: 'center',
        onCell: () => ({
          style: { padding: '4px 8px', overflow: 'hidden', minWidth: 0 },
        }),
        render: (_, record) => (
          <div
            style={{
              width: '100%',
              minWidth: 0,
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'left',
            }}
          >
            <Space wrap size={4}>
              <ShowButton
                autoInsertSpace={false}
                size="small"
                icon={null}
                recordItemId={record.id}
                style={{
                  color: '#2784FF',
                  borderColor: '#2784FF',
                }}
              >
                {t('quotas.goDetailLabel')}
              </ShowButton>
              {(record.status === QuotaStatus.Completed ||
                record.status === QuotaStatus.Cancelled) &&
                (permission?.is_module_admin || record.display) &&
                !record?.has_agreed_price && (
                  <Button
                    type="default"
                    style={{ background: '#D77703', color: WHITE }}
                    size="small"
                    onClick={() =>
                      handleChangeStatus('back-to-sent-customer', {
                        quota_ids: [record.id],
                      })
                    }
                  >
                    {t('quotas.show.actions.move_to_send')}
                  </Button>
                )}
              {(record.status === QuotaStatus.Creating ||
                record.status === QuotaStatus.Rejected) &&
                (permission?.is_module_admin || record.is_author) && (
                  <EditButton
                    autoInsertSpace={false}
                    size="small"
                    icon={null}
                    recordItemId={record.id}
                    style={{
                      color: '#FFFFFF',
                      background: '#1FDB51',
                    }}
                  >
                    {t('quotas.goEditLabel')}
                  </EditButton>
                )}

              <CloneButton
                autoInsertSpace={false}
                size="small"
                icon={null}
                recordItemId={record.id}
                style={{
                  color: '#FFFFFF',
                  background: '#0161D3',
                }}
              >
                {t('quotas.goDetailCLoneLabel')}
              </CloneButton>

              {record.status === QuotaStatus.SentToCustomer && (
                <Button
                  type="default"
                  size="small"
                  style={{
                    color: '#FFFFFF',
                    background: '#C5AF08',
                  }}
                  onClick={() => {
                    go({
                      to: `quotas/clone/${record.id}?actionType=VERSION`,
                    })
                  }}
                >
                  {t('quotas.actions.re_estimate')}
                </Button>
              )}

              {(record.status === QuotaStatus.Creating ||
                record.status === QuotaStatus.Rejected) &&
                (record.is_author || permission?.is_module_admin) && (
                  <DeleteButton
                    autoInsertSpace={false}
                    successNotification={() => {
                      return notificationFunction()
                    }}
                    size="small"
                    icon={null}
                    recordItemId={record.id}
                    style={{
                      color: '#FFFFFF',
                      background: '#E74C3C',
                    }}
                  >
                    {t('quotas.actions.delete')}
                  </DeleteButton>
                )}

              {(record.is_author || permission?.is_module_admin) &&
                record.status === QuotaStatus.SentToCustomer && (
                  <Button
                    type="default"
                    size="small"
                    style={{
                      color: '#FFFFFF',
                      background: '#8207BA',
                    }}
                    onClick={() =>
                      handleChangeStatus(
                        'resend-email-to-customer',
                        {
                          quota_ids: [record.id],
                        },
                        'post',
                      )
                    }
                  >
                    {t('quotas.actions.resend_email_to_customer')}
                  </Button>
                )}

              <Link href={record?.pdf_path} target="_blank" style={{ flex: 1 }}>
                <Button
                  size="small"
                  type="default"
                  style={{
                    color: '#2784FF',
                    borderColor: '#2784FF',
                  }}
                >
                  {t('quotas.downloadLabel')}
                </Button>
              </Link>

              {record.status === QuotaStatus.Cancelled &&
                (record.is_author || permission?.is_module_admin) && (
                  <DeleteButton
                    autoInsertSpace={false}
                    successNotification={() => {
                      return notificationFunction()
                    }}
                    size="small"
                    icon={null}
                    recordItemId={record.id}
                    style={{
                      color: '#FFFFFF',
                      background: '#E74C3C',
                    }}
                  >
                    {t('quotas.actions.delete')}
                  </DeleteButton>
                )}
            </Space>
          </div>
        ),
      },
    ]
    const numericColumnKeys = new Set<string>()
    const centerColumnKeys = new Set(['action'])

    return baseColumns.map((column) => ({
      ...column,
      onHeaderCell: (col: any) => {
        const originalHeaderCell = column.onHeaderCell?.(col) || {}
        return {
          ...originalHeaderCell,
          style: {
            ...(originalHeaderCell as any).style,
            textAlign: 'center',
          },
        }
      },
      onCell: (record: any, rowIndex: any) => {
        const originalOnCell = column.onCell?.(record, rowIndex) || {}
        return {
          ...originalOnCell,
          style: {
            ...(originalOnCell as any).style,
            padding: '8px 10px',
          },
        }
      },
      align: centerColumnKeys.has(String(column.key))
        ? 'center'
        : numericColumnKeys.has(String(column.key))
          ? 'right'
          : 'left',
    }))
  }, [t])

  const [status, setStatus] = useState<string | null>(null)
  const currentRule = status ? STATUS_DATE_RULES[status] : undefined
  const {
    tableProps,
    searchFormProps,
    setFilters,
    setCurrent,
    tableQuery: { refetch },
    filters,
  } = useTable({
    syncWithLocation: false,
    pagination: {
      current: urlPage,
      pageSize: urlPageSize,
    },
    filters: {
      initial: [
        {
          field: 'status',
          operator: 'eq',
          value: status,
        },
      ],
    },
    onSearch(values: any) {
      const filters: CrudFilters = [
        {
          field: 'status',
          operator: 'eq',
          value: status,
        },
        {
          field: 'code',
          operator: 'eq',
          value: values.code,
        },
        {
          field: 'title',
          operator: 'eq',
          value: values.title,
        },
        {
          field: 'customer_id',
          operator: 'eq',
          value: values.customer_name?.value,
        },
        {
          field: 'creator_id',
          operator: 'eq',
          value: values.creator_name?.value,
        },
        {
          field: 'tag_id',
          operator: 'eq',
          value:
            typeof values.tag_id === 'object' &&
            values.tag_id != null &&
            'value' in values.tag_id
              ? (values.tag_id as { value: number }).value
              : values.tag_id,
        },
        {
          field: 'approver_id',
          operator: 'eq',
          value: values.approver_name?.value,
        },
        {
          field: 'department_in_charge_id',
          operator: 'eq',
          value: values.department_in_charge?.value,
        },
        {
          field: 'search_date_type',
          operator: 'eq',
          value: values.search_date_type,
        },
        {
          field: 'start_date',
          operator: 'eq',
          value: !!values?.date
            ? dayjs((values?.date ?? [])[0]).format('YYYY-MM-DD')
            : null,
        },
        {
          field: 'end_date',
          operator: 'eq',
          value: !!values?.date
            ? dayjs((values?.date ?? [])[1]).format('YYYY-MM-DD')
            : null,
        },
        {
          field: 'category_id',
          operator: 'eq',
          value: values.category_id,
        },
        {
          field: 'transaction_type',
          operator: 'eq',
          value: values.transaction_type?.trim(),
        },
        {
          field: 'product_name',
          operator: 'eq',
          value: values.product_name,
        },
      ]
      return filters
    },
  })

  const form = searchFormProps.form

  useEffect(() => {
    if (!form) return
    const currentStatus =
      filters?.find((filter: any) => filter?.field === 'status')?.value || null

    setStatus(currentStatus)
    const rule = STATUS_DATE_RULES[currentStatus]
    form.setFieldsValue({
      search_date_type: rule?.dateType ?? 'created_at',
      date: rule?.getRange ? rule.getRange() : null,
    })
  }, [form])

  useEffect(() => {
    const pagination = tableProps.pagination
    if (!pagination || typeof pagination !== 'object') return
    const current = pagination.current ?? 1
    const pageSize = pagination.pageSize ?? 20

    const urlCurrent = Number(searchParams.get('current')) || 1
    const urlPageSize = Number(searchParams.get('pageSize')) || 20
    if (current === urlCurrent && pageSize === urlPageSize) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('current', String(current))
    params.set('pageSize', String(pageSize))

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [tableProps.pagination, pathname, router])

  const onChangeStatus = useCallback(
    (status: string | null) => {
      setStatus(status)
      const rule = status ? STATUS_DATE_RULES[status] : undefined
      const range = rule?.getRange ? rule.getRange() : null
      form?.setFieldsValue({
        search_date_type: rule?.dateType ?? 'created_at',
        date: range,
      })

      setFilters((prev) => {
        const filtered = prev?.filter((item: CrudFilter) => {
          if (!('field' in item)) return true
          return (
            item.field !== 'start_date' &&
            item.field !== 'end_date' &&
            item.field !== 'search_date_type' &&
            item.field !== 'status'
          )
        })

        const newFilters: CrudFilters = [
          ...filtered,
          {
            field: 'status',
            operator: 'eq',
            value: status,
          },
        ]

        if (range) {
          newFilters.push(
            {
              field: 'search_date_type',
              operator: 'eq',
              value: rule?.dateType ?? 'created_at',
            },
            {
              field: 'start_date',
              operator: 'eq',
              value: dayjs(range[0]).format('YYYY-MM-DD'),
            },
            {
              field: 'end_date',
              operator: 'eq',
              value: dayjs(range[1]).format('YYYY-MM-DD'),
            },
          )
        }

        return newFilters
      })

      setCurrent(1)
    },
    [form, status, setFilters, setCurrent],
  )

  const handleOptions = (data: any[]) => {
    let filter = ''
    for (const item of data) {
      if (filter.length === 0) {
        filter = item?.status
      } else if (item?.status === filter) {
        continue
      } else {
        filter = ''
        break
      }
    }

    return filter as QuotaStatus
  }

  const {
    data,
    refetch: refetchStats,
    isFetching,
  } = useCustom({
    method: 'get',
    url: `${apiUrl}/quotas/stats`,
  })

  const statusData = [
    { title: t('quotas.status.all'), value: 0, key: null },
    { title: t('quotas.status.creating'), value: 0, key: QuotaStatus.Creating },
    {
      title: t('quotas.status.waiting_approval'),
      value: 0,
      color: '#faad14',
      key: QuotaStatus.WaitingApproval,
    }, // vàng
    {
      title: t('quotas.status.rejected'),
      value: 0,
      color: '#fa541c',
      key: QuotaStatus.Rejected,
    }, // cam
    {
      title: t('quotas.status.approved'),
      value: 0,
      color: '#1890ff',
      key: QuotaStatus.Approved,
    }, // xanh
    {
      title: t('quotas.status.sent_to_customer'),
      value: 0,
      color: '#1677ff',
      key: QuotaStatus.SentToCustomer,
    }, // xanh đậm
    {
      title: t('quotas.status.completed'),
      value: 0,
      color: '#52c41a',
      key: QuotaStatus.Completed,
    }, // xanh lá
    {
      title: t('quotas.status.cancelled'),
      value: 0,
      color: '#ff4d4f',
      key: QuotaStatus.Cancelled,
    }, // đỏ
  ]

  const statusDashboard = useMemo(() => {
    return statusData.map((item) => ({
      ...item,
      total_amount: convertCurrency(
        data?.data['total_amount_' + item.key],
        true,
        false,
      ),
      value: !item.key ? data?.data?.total : data?.data[item.key],
    }))
  }, [data, t])

  const statusButton = useCallback(
    (
      status: QuotaStatus,
      hasApprovalRoutes: boolean,
      hasMixedApprovers: boolean,
    ): { key: number; label: string | ReactNode }[] => {
      if (status === QuotaStatus.Creating) {
        const actions = [{ key: 1, label: t('quotas.actions.delete') }]

        if (!hasMixedApprovers) {
          if (hasApprovalRoutes) {
            actions.push({
              key: 2,
              label: t('quotas.actions.request_approval'),
            })
          } else {
            actions.push({
              key: 4,
              label: t('quotas.actions.send'),
            })
          }
        }

        return actions
      } else if (status === QuotaStatus.WaitingApproval) {
        return [
          ...(hasApprovalRoutes && !hasMixedApprovers
            ? [
                { key: 3, label: t('quotas.actions.approve') },
                { key: 9, label: t('quotas.actions.move_to_reject') },
              ]
            : []),
        ]
      } else if (status === QuotaStatus.Approved) {
        return [{ key: 4, label: t('quotas.actions.send') }]
      } else if (status === QuotaStatus.SentToCustomer) {
        return [
          { key: 8, label: t('quotas.actions.resend_email_to_customer') },
          { key: 5, label: t('quotas.actions.move_to_order') },
          { key: 6, label: t('quotas.actions.move_to_cancel') },
        ]
      } else if (status === QuotaStatus.Completed) {
        return [{ key: 7, label: t('quotas.actions.move_to_send') }]
      } else if (status === QuotaStatus.Cancelled) {
        return [
          { key: 1, label: t('quotas.actions.delete') },
          ...[{ key: 7, label: t('quotas.actions.move_to_send') }],
        ]
      } else if (status === QuotaStatus.Rejected) {
        return [{ key: 1, label: t('quotas.actions.delete') }]
      }
      return []
    },
    [t, isOpenManyDelete],
  )

  const notificationFunction = useCallback(
    (message?: string): OpenNotificationParams | false | undefined => {
      refetch()
      refetchStats()
      setSelectedRowKeys([])
      setOptions([])
      setIsOpenManyDelete(false)
      return {
        message: t('notifications.success'),
        description: message ?? t('notifications.success'),
        type: 'success',
      }
    },
    [t, refetch, refetchStats],
  )

  const { mutate, isPending } = useCustomMutation()

  const handleClick = (info: MenuInfo) => {
    if (Number(info.key) === 1) {
      setIsOpenManyDelete(true)
    } else if (Number(info.key) === 2) {
      mutate({
        values: {
          quota_ids: selectedRows?.map((item: any) => item?.id),
        },
        method: 'put',
        url: `${apiUrl}/quotas/send-to-approver`,
        successNotification: (data) => {
          return notificationFunction(data?.data.message)
        },
      })
    } else if (Number(info.key) === 3) {
      mutate({
        values: selectedRows.map((item: any) => ({
          quota_id: item?.id,
          status: 'approved',
          comment: '',
        })),
        method: 'put',
        url: `${apiUrl}/quotas/approval-steps`,
        successNotification: (data) => {
          const idToCodeMap = new Map(
            selectedRows.map((item: any) => [item.id, item.code]),
          )
          const successCodes =
            data?.data?.results
              ?.map((id: number) => idToCodeMap.get(id))
              .filter(Boolean) ?? []

          const errorCodes =
            data?.data?.errors
              ?.map((id: number) => idToCodeMap.get(id))
              .filter(Boolean) ?? []

          const formatCodes = (codes: string[], limit = 10) => {
            if (codes.length <= limit) return codes.join(', ')
            return `${codes.length}`
          }

          if (errorCodes.length) {
            notification.open({
              message: t('notifications.notProceedRecords', {
                recordAsString: formatCodes(errorCodes),
              }),
              type: 'error',
            })
          }

          if (successCodes.length) {
            return notificationFunction(
              t('notifications.proceedRecords', {
                recordAsString: formatCodes(successCodes),
              }),
            )
          }
          refetch()
          refetchStats()
          setSelectedRowKeys([])
          setOptions([])
          setIsOpenManyDelete(false)
          return false
        },
        errorNotification: (data) => {
          notification.open({
            message: data?.message,
            type: 'error',
          })
          return false
        },
      })
    } else if (Number(info.key) === 4) {
      mutate({
        values: {
          quota_ids: selectedRows?.map((item: any) => item?.id),
          status: 'sent_to_customer',
        },
        method: 'put',
        url: `${apiUrl}/quotas/send-to-customer`,
        successNotification: (data) => {
          return notificationFunction(data?.data.message)
        },
      })
    } else if (Number(info.key) === 5) {
      mutate({
        values: {
          quota_ids: selectedRows?.map((item: any) => item?.id),
        },
        method: 'put',
        url: `${apiUrl}/quotas/mark-completed`,
        successNotification: (data) => {
          return notificationFunction(data?.data.message)
        },
      })
    } else if (Number(info.key) === 6) {
      mutate({
        values: {
          quota_ids: selectedRows?.map((item: any) => item?.id),
        },
        method: 'put',
        url: `${apiUrl}/quotas/cancel-quota`,
        successNotification: (data) => {
          return notificationFunction(data?.data.message)
        },
      })
    } else if (Number(info.key) === 7) {
      mutate({
        values: {
          quota_ids: selectedRows?.map((item: any) => item?.id),
        },
        method: 'put',
        url: `${apiUrl}/quotas/back-to-sent-customer`,
        successNotification: (data) => {
          return notificationFunction(data?.data.message)
        },
      })
    } else if (Number(info.key) === 8) {
      mutate({
        values: {
          quota_ids: selectedRows?.map((item: any) => item?.id),
        },
        method: 'post',
        url: `${apiUrl}/quotas/resend-email-to-customer`,
        successNotification: (data) => {
          return notificationFunction(data?.data.message)
        },
      })
    } else if (Number(info.key) === 9) {
      mutate({
        values: selectedRows.map((item: any) => ({
          quota_id: item?.id,
          status: 'rejected',
          comment: '一括差戻',
        })),
        method: 'put',
        url: `${apiUrl}/quotas/approval-steps`,
        successNotification: (data) => {
          return notificationFunction(data?.data.message)
        },
      })
    }
  }
  const { selectProps: tagSelectProps } = useSelect({
    resource: 'tags',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: {
      mode: 'server',
      pageSize: 100,
    },
  })

  const handleExportCsv = async () => {
    const values = (searchFormProps.form?.getFieldsValue?.() ?? {}) as {
      code?: string
      title?: string
      customer_name?: { value?: string | number }
      creator_name?: { value?: string | number }
      tag_id?: { value?: string | number } | string | number
      approver_name?: { value?: string | number }
      department_in_charge?: { value?: string | number }
      search_date_type?: string
      date?: [string, string]
      category_id?: string | number
      transaction_type?: string
      product_name?: string
    }

    setIsExportingCsv(true)
    try {
      notification.info({
        message:
          'システムエラーの発生を抑制するため、最新の1,000件のレコードのみダウンロードを実施いたします。',
      })

      const response = await axiosInstance.get(`${apiUrl}/quotas/export-csv`, {
        params: {
          status: status ?? undefined,
          code: values.code || undefined,
          title: values.title || undefined,
          customer_id: values.customer_name?.value || undefined,
          creator_id: values.creator_name?.value || undefined,
          tag_id:
            typeof values.tag_id === 'object' &&
            values.tag_id != null &&
            'value' in values.tag_id
              ? values.tag_id.value
              : values.tag_id || undefined,
          approver_id: values.approver_name?.value || undefined,
          department_in_charge_id:
            values.department_in_charge?.value || undefined,
          search_date_type: values.search_date_type || undefined,
          start_date: values.date?.[0]
            ? dayjs(values.date[0]).format('YYYY-MM-DD')
            : undefined,
          end_date: values.date?.[1]
            ? dayjs(values.date[1]).format('YYYY-MM-DD')
            : undefined,
          category_id: values.category_id || undefined,
          transaction_type: values.transaction_type?.trim() || undefined,
          product_name: values.product_name || undefined,
        },
        responseType: 'blob',
      })

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
        link.download = `quotas_export_${Date.now()}.csv`
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
        <Breadcrumbs
          items={[
            {
              title: boldText(t('estimates.estimates')),
            },
            {
              title: boldText(t('quotas.list'), PRIMARY),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      loading={isPending}
    >
      <Form {...searchFormProps}>
        <Form.Item name={'status'} hidden />
        <StatusDashboard
          useApproveRoute={useApproveRoute}
          statusData={statusDashboard}
          status={status}
          onChangeStatus={onChangeStatus}
          isLoading={isFetching}
        />
        <div className="my-4">
          <Row gutter={[24, 0]}>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={
                  <span className="font-bold">
                    {t('quotas.filters.estimate_number')}
                  </span>
                }
                layout="vertical"
                name={'code'}
              >
                <Input placeholder={t('quotas.filters.partial_match')} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <CoreAutocompleteAPI
                name="customer_name"
                pageSize={10}
                optionLabel={'name'}
                resource="customers"
                label={<span>{boldText(t('quotas.filters.customer'))}</span>}
                placeholder={t('placeholders.select')}
                onChangeClear={(callback) => {
                  if (callback) callback('')
                }}
              />
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={
                  <span className="font-bold">{t('quotas.filters.title')}</span>
                }
                layout="vertical"
                name={'title'}
              >
                <Input placeholder={t('quotas.filters.partial_match')} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <CoreAutocompleteAPI
                name="creator_name"
                pageSize={10}
                meta={{ field: 'creator' }}
                resource="employees"
                label={<span>{boldText(t('quotas.filters.creator'))}</span>}
                placeholder={t('placeholders.select')}
                onChangeClear={(callback) => {
                  if (callback) callback('')
                }}
              />
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <CoreAutocompleteAPI
                name="approver_name"
                pageSize={10}
                meta={{ field: 'approver' }}
                resource="employees"
                label={<span>{boldText(t('quotas.filters.approver'))}</span>}
                placeholder={t('placeholders.select')}
                onChangeClear={(callback) => {
                  if (callback) callback('')
                }}
              />
            </Col>
            <Col xs={12} md={6} lg={4} xxl={3}>
              <CoreAutocompleteAPI
                name="department_in_charge"
                resource="departments"
                label={
                  <span className="font-bold">
                    {t('quotas.filters.department')}
                  </span>
                }
                placeholder={t('placeholders.select')}
                onChangeClear={(callback) => {
                  if (callback) callback('')
                }}
              />
            </Col>
            <Col xs={12} md={6} lg={4} xxl={3}>
              <Form.Item
                label={
                  <span className="font-bold">
                    {t('quotas.filters.tag_name')}
                  </span>
                }
                layout="vertical"
                name={'tag_id'}
              >
                <Select
                  {...tagSelectProps}
                  allowClear
                  showSearch
                  onSearch={() => {}}
                  filterOption={(input, option) =>
                    ((option?.label ?? '') as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  labelInValue={true}
                  placeholder={t('placeholders.select')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={
                  <span className="font-bold">{t('quotas.filters.date')}</span>
                }
                layout="vertical"
                name={'search_date_type'}
              >
                <Select
                  disabled={!!currentRule?.getRange}
                  options={[
                    {
                      value: 'created_at',
                      label: t('quotas.date_types.created_at'),
                    },
                    {
                      value: 'sent_to_customer_date',
                      label: t('quotas.date_types.sent_to_customer_date'),
                    },
                    {
                      value: 'expired_date',
                      label: t('quotas.date_types.expired_date'),
                    },
                    {
                      value: 'customer_accepted_date',
                      label: t('quotas.date_types.customer_accepted_date'),
                    },
                    {
                      value: 'customer_cancelled_date',
                      label: t('quotas.date_types.customer_cancelled_date'),
                    },
                  ]}
                  placeholder={t('quotas.date_types.created_at')}
                />
              </Form.Item>
            </Col>

            <Col xs={12} md={6}>
              <Form.Item
                label={<span hidden className="font-bold"></span>}
                layout="vertical"
                name={'date'}
              >
                <RangePicker
                  allowClear
                  className="w-full"
                  placeholder={[FORMAT_DATE_CROSS, FORMAT_DATE_CROSS]}
                  format={FORMAT_DATE_CROSS}
                  disabled={
                    !Form.useWatch('search_date_type', searchFormProps.form)
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={
                  <span>{boldText(t('quotas.filters.transaction_type'))}</span>
                }
                layout="vertical"
                name={'transaction_type'}
              >
                <Select
                  allowClear={true}
                  placeholder={t('placeholders.select')}
                  options={[
                    ...TRANSACTION_TYPES.map((type) => ({
                      ...type,
                      label: t(type.labelKey),
                    })),
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <CoreInput
                name="product_name"
                label={
                  <span className="font-bold">
                    {t('quotas.filters.productName')}
                  </span>
                }
                placeholder={t('quotas.filters.partial_match')}
              />
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={
                  <span className="font-bold">
                    {t('quotas.filters.categoryLabel')}
                  </span>
                }
                layout="vertical"
                name="category_id"
              >
                <ProductCategoryDropdown
                  placeholder={t('placeholders.select')}
                  onSelect={(_, __, ___, categoryId) => {
                    searchFormProps.form?.setFieldValue(
                      'category_id',
                      categoryId,
                    )
                  }}
                  suffixIcon={<DownOutlined />}
                />
              </Form.Item>
            </Col>

            <Col xs={12} md={6}>
              <div className="mt-7 mb-6 flex gap-2">
                <Button
                  htmlType="submit"
                  type="primary"
                  autoInsertSpace={false}
                >
                  {t('buttons.search')}
                </Button>
                <Button
                  type="default"
                  onClick={() => {
                    setFilters([], 'replace')
                    form?.resetFields()
                    onChangeStatus(status)
                  }}
                >
                  {t('buttons.clear')}
                </Button>
              </div>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={8} md={6} lg={4}>
              {/* <Form.Item
                label={<span className="font-bold">{t('quotas.filters.tag_name')}</span>}
                layout="vertical"
              >
                <Select placeholder={t('quotas.actions.bulk_processing')} options={options ?? []} />
              </Form.Item> */}
              <Dropdown
                menu={{
                  items:
                    options.length > 0
                      ? options
                      : [
                          {
                            key: 0,
                            label: (
                              <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={false}
                                style={{
                                  height: 1,
                                  alignItems: 'center',
                                  display: 'flex',
                                  justifyContent: 'center',
                                }}
                              />
                            ),
                          },
                        ],
                  onClick: handleClick,
                }}
                // disabled={!options || options.length === 0}
              >
                <Popconfirm
                  title={t('quotas.actions.delete')}
                  open={isOpenManyDelete}
                  placement="topRight"
                  okButtonProps={{
                    loading: isPending,
                    style: {
                      border: '1px solid red',
                      borderRadius: '4px',
                      color: 'red',
                      backgroundColor: 'white',
                    },
                  }}
                  onConfirm={() => {
                    mutate({
                      values: {
                        ids: selectedRows?.map((item: any) => item?.id),
                      },
                      method: 'delete',
                      url: `${apiUrl}/quotas`,
                      successNotification: (data) => {
                        const idToCodeMap = new Map(
                          selectedRows.map((item: any) => [item.id, item.code]),
                        )
                        const successCodes =
                          data?.data?.results
                            ?.map((id: number) => idToCodeMap.get(id))
                            .filter(Boolean) ?? []

                        const errorCodes =
                          data?.data?.errors
                            ?.map((id: number) => idToCodeMap.get(id))
                            .filter(Boolean) ?? []

                        const formatCodes = (codes: string[], limit = 10) => {
                          if (codes.length <= limit) return codes.join(', ')
                          return `${codes.length}`
                        }

                        if (errorCodes.length) {
                          notification.open({
                            message: t('notifications.notProceedRecords', {
                              recordAsString: formatCodes(errorCodes),
                            }),
                            type: 'error',
                          })
                        }

                        if (successCodes.length) {
                          return notificationFunction(
                            t('notifications.proceedRecords', {
                              recordAsString: formatCodes(successCodes),
                            }),
                          )
                        }
                        refetch()
                        refetchStats()
                        setSelectedRowKeys([])
                        setOptions([])
                        setIsOpenManyDelete(false)
                        return false
                      },
                      errorNotification: (data) => {
                        notification.open({
                          message: data?.message,
                          type: 'error',
                        })
                        return false
                      },
                    })
                  }}
                  onCancel={() => setIsOpenManyDelete(false)}
                  cancelText={t('buttons.cancel')}
                  okText={t('buttons.delete')}
                >
                  <Button
                    size="middle"
                    style={{
                      width: '100%',
                    }}
                    className="group"
                  >
                    <Space
                      style={{
                        width: '100%',
                        justifyContent: 'space-between',
                        fontSize: 14,
                        color: BLACK,
                      }}
                    >
                      {t('quotas.actions.bulk_processing')}
                      <DownOutlined
                        style={{
                          fontSize: 13,
                        }}
                      />
                    </Space>
                  </Button>
                </Popconfirm>
              </Dropdown>
            </Col>

            <Col xs={16} md={18} lg={20}>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={handleExportCsv}
                  color="primary"
                  variant="outlined"
                  loading={isExportingCsv}
                >
                  全件CSV出力
                </Button>
                <Dropdown
                  menu={{
                    items: rightOptions,
                    onClick: ({ key }) => {
                      if (key == '1') {
                        go({ to: 'quotas/create' })
                      } else if (key == '2') {
                        setIsCreateFromTemplate(true)
                      }
                    },
                  }}
                >
                  <Button type="primary">
                    <Space>
                      {t('quotas.create_quota')}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </div>

        <CommonTable
          rowKey="id"
          rowSelection={rowSelection}
          onRow={(record) => {
            const isRowDisabled =
              !useApproveRoute &&
              STATUS_DISABLED_WHEN_OFF_APPROVE_ROUTE.indexOf(record.status) > -1
            return {
              style: isRowDisabled
                ? {
                    pointerEvents: 'none',
                    opacity: 0.5,
                    cursor: 'not-allowed',
                  }
                : {},
            }
          }}
          columns={columns}
          {...tableProps}
          scroll={undefined}
          components={{
            header: {
              cell: ({ children, style, ...rest }: any) => {
                return (
                  <th
                    style={{
                      ...style,
                      border: 'none',
                      padding: '4px 2px',
                      color: PRIMARY,
                      textAlign: 'center',
                      backgroundColor: '#F0F9FF',
                    }}
                    {...rest}
                  >
                    {children}
                  </th>
                )
              },
            },
          }}
        />
      </Form>
      {isCreateFromTemplate && (
        <CreateFromTemplate
          open={isCreateFromTemplate}
          t={t}
          onClose={() => setIsCreateFromTemplate(false)}
        />
      )}
    </List>
  )
}

export default QuotaList

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  RightOutlined,
} from '@ant-design/icons'
import StatusDashboard from '@components/cep/estimates/quotas/action/components/status-dashboard'
import { QuotaStatus } from '@components/cep/estimates/quotas/enum'
import ModalAgreePrice from '@components/cep/estimates/quotas/modal'
import {
  getActionPermissions,
  getExpiryDate,
  getQuotaStatusStyle,
} from '@components/cep/estimates/quotas/utils'
import { CoreAutocompleteAPI } from '@components/common/autocomplete-api'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import {
  CloneButton,
  DeleteButton,
  EditButton,
  ShowButton,
  useModal,
  useTable,
} from '@refinedev/antd'
import {
  type OpenNotificationParams,
  useApiUrl,
  useCustom,
  useCustomMutation,
  useGo,
  useTranslate,
} from '@refinedev/core'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { FORMAT_DATE } from '@utility/instances'
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Empty,
  Form,
  Input,
  Modal,
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
import { type MenuInfo } from 'rc-menu/lib/interface'
import React, { type ReactNode, useCallback, useMemo, useState } from 'react'

const { RangePicker } = DatePicker

function QuotaList() {
  const t = useTranslate()

  const apiUrl = useApiUrl()

  const { permission } = useUserStore.getState()

  const department = Form.useWatch(
    'department_in_charge',
    Form.useFormInstance(),
  )

  const go = useGo()

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [options, setOptions] = useState<ItemType[]>([])
  const [selectedRows, setSelectedRows] = useState<any>()

  const [isOpenManyDelete, setIsOpenManyDelete] = useState(false)

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: any,
  ) => {
    setSelectedRows(selectedRows)

    const status = handleOptions(selectedRows)
    const options = statusButton(status, selectedRows?.[0]?.has_approval_route)
    setOptions(options)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: getActionPermissions(
        record.status,
        record?.is_author,
        record?.display,
        permission?.is_module_admin,
      ),
    }),
  }

  const { modalProps, close, show } = useModal()

  const columns: ColumnsType<any> = useMemo(() => {
    return [
      {
        title: (
          <div className="flex flex-col">
            <span>{t('quotas.table.status_comment_1')}</span>
            <span>{t('quotas.table.status_comment_2')}</span>
          </div>
        ),
        dataIndex: 'status',
        key: 'status',
        render: (value, record) => {
          const result = getQuotaStatusStyle(value, t)

          return (
            <div className="flex flex-col items-center justify-center gap-1">
              <Tag
                color={result.background}
                style={{ color: result.color, marginRight: 0 }}
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
        render: (value, record) => (
          <Button
            type="link"
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
        onCell: () => ({
          style: {
            maxWidth: 150,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),

        render: (_, record) => (
          <div className="flex flex-col gap-1">
            <div className="overflow-hidden" title={record.title}>
              {record.title}
            </div>
            <span>{record.customer_name}</span>
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
        render: (_, record) => (
          <div>
            <div>{record?.author}</div>
            <div className="flex flex-col flex-wrap items-center justify-center gap-[2px]">
              {record.approvers?.map((item: string) => item).join(', ')}
            </div>
          </div>
        ),
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
        render: (_, record) => (
          <div className="flex flex-col gap-2">
            <div>{record.department_in_charge}</div>
            <div>{record?.total_price}</div>
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
        render: (_, record) => (
          <div>
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
        render: (_, record) => {
          if (
            record.sent_to_customer_date ||
            record.customer_accepted_date ||
            record.customer_cancelled_date
          ) {
            return (
              <div>
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
        render: (_, record) => (
          <Space>
            <ShowButton
              hideText
              size="small"
              icon={<EyeOutlined />}
              recordItemId={record.id}
            />
            {(record.status === QuotaStatus.Creating ||
              record.status === QuotaStatus.Rejected) &&
              (permission?.is_module_admin || record.is_author) && (
                <EditButton
                  hideText
                  size="small"
                  icon={<EditOutlined />}
                  recordItemId={record.id}
                />
              )}

            <CloneButton
              hideText
              size="small"
              icon={<CopyOutlined />}
              recordItemId={record.id}
            />

            {/* {record.status === QuotaStatus.Completed && (
              <Button
                type="default"
                size="small"
                onClick={() => {
                  show()
                  setDataAgreedPrice(record)
                }}
              >
                {t('quotas.actions.decide_move')}
              </Button>
            )} */}

            <Link href={record?.pdf_path} target="_blank">
              <Button size="small" icon={<DownloadOutlined />} />
            </Link>

            {(record.status === QuotaStatus.Creating ||
              record.status === QuotaStatus.Rejected ||
              record.status === QuotaStatus.Cancelled) &&
              (record.is_author || permission?.is_module_admin) && (
                <DeleteButton
                  hideText
                  size="small"
                  icon={<DeleteOutlined />}
                  recordItemId={record.id}
                />
              )}

            {record.status === QuotaStatus.SentToCustomer && (
              <Button
                type="default"
                size="small"
                onClick={() => {
                  go({
                    to: `quotas/clone/${record.id}?actionType=VERSION`,
                  })
                }}
              >
                {t('quotas.actions.re_estimate')}
              </Button>
            )}

            {record.status === QuotaStatus.Completed &&
              (permission?.is_module_admin || record.is_author) &&
              !record?.has_agreed_price && (
                <Button
                  type="default"
                  size="small"
                  onClick={() => {
                    show()
                    setDataAgreedPrice(record)
                  }}
                >
                  {t('quotas.actions.decide_move')}
                </Button>
              )}
          </Space>
        ),
      },
    ]
  }, [t])

  const [status, setStatus] = useState<string | null>(QuotaStatus.Creating)

  const {
    tableProps,
    searchFormProps,
    setFilters,
    setCurrent,
    tableQuery: { refetch },
  } = useTable({
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
    onSearch(values: any) {
      return [
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
          field: 'customer_name',
          operator: 'eq',
          value: values.customer_name,
        },
        {
          field: 'creator_name',
          operator: 'eq',
          value: values.creator_name,
        },
        {
          field: 'tag_name',
          operator: 'eq',
          value: values.tag_name,
        },
        {
          field: 'approver_name',
          operator: 'eq',
          value: values.approver_name,
        },
        {
          field: 'department_in_charge',
          operator: 'eq',
          value: values.department_in_charge?.label,
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
      ]
    },
  })

  const onChangeStatus = useCallback(
    (status: string | null) => {
      setStatus(status)
      setFilters([
        {
          field: 'status',
          operator: 'eq',
          value: status,
        },
      ])
      setCurrent(1)
    },
    [status, setFilters, setCurrent],
  )

  // const { selectProps } = useSelect({
  //   resource: 'departments',
  //   optionLabel: 'name',
  //   optionValue: 'id',
  //   pagination: {
  //     mode: 'server',
  //     pageSize: 100,
  //   },
  //   onSearch(value) {
  //     return [
  //       {
  //         field: 'q',
  //         operator: 'eq',
  //         value,
  //       },
  //     ]
  //   },
  // })

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

  const { data, refetch: refetchStats } = useCustom({
    method: 'get',
    url: `${apiUrl}/quotas/stats`,
  })

  const statusData = [
    { title: t('quotas.status.creating'), value: 0, key: QuotaStatus.Creating },
    {
      title: t('quotas.status.waiting_approval'),
      value: 0,
      color: '#faad14',
      key: QuotaStatus.WaitingApproval,
    }, // vàng
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
      title: t('quotas.status.rejected'),
      value: 0,
      color: '#fa541c',
      key: QuotaStatus.Rejected,
    }, // cam
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
    { title: t('quotas.status.all'), value: 0, key: null },
  ]

  const statusDashboard = useMemo(() => {
    return statusData.map((item) => ({
      ...item,
      value: !item.key ? data?.data?.total : data?.data[item.key],
    }))
  }, [data])

  const statusButton = useCallback(
    (
      status: QuotaStatus,
      hasApprovalRoutes: boolean,
    ): { key: number; label: string | ReactNode }[] => {
      if (status === QuotaStatus.Creating || status === QuotaStatus.Rejected) {
        return [
          {
            key: 1,
            label: t('quotas.actions.delete'),
          },
          ...(hasApprovalRoutes
            ? [
                {
                  key: 2,
                  label: t('quotas.actions.request_approval'),
                },
              ]
            : []),
        ]
      } else if (status === QuotaStatus.WaitingApproval) {
        return [
          ...(hasApprovalRoutes
            ? [{ key: 3, label: t('quotas.actions.approve') }]
            : []),
        ]
      } else if (status === QuotaStatus.Approved) {
        return [{ key: 4, label: t('quotas.actions.send') }]
      } else if (status === QuotaStatus.SentToCustomer) {
        return [
          { key: 5, label: t('quotas.actions.move_to_order') },
          { key: 6, label: t('quotas.actions.move_to_cancel') },
        ]
      } else if (status === QuotaStatus.Completed) {
        return [{ key: 7, label: t('quotas.actions.move_to_send') }]
      } else if (status === QuotaStatus.Cancelled) {
        return [
          { key: 1, label: t('quotas.actions.delete') },
          ...(hasApprovalRoutes
            ? [{ key: 7, label: t('quotas.actions.move_to_send') }]
            : []),
        ]
      }
      return []
    },
    [t, isOpenManyDelete],
  )

  const notificationFunction = useCallback(
    (message: string): OpenNotificationParams | false | undefined => {
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
    [t],
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
          return notificationFunction(data?.data.message)
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
    }
  }

  const [dataAgreedPrice, setDataAgreedPrice] = useState()

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
    >
      <Form {...searchFormProps}>
        <Form.Item name={'status'} hidden />
        <StatusDashboard
          statusData={statusDashboard}
          status={status}
          onChangeStatus={onChangeStatus}
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
              <Form.Item
                label={
                  <span className="font-bold">
                    {t('quotas.filters.customer')}
                  </span>
                }
                layout="vertical"
                name={'customer_name'}
              >
                <Input placeholder={t('quotas.filters.partial_match')} />
              </Form.Item>
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
              <Form.Item
                label={
                  <span className="font-bold">
                    {t('quotas.filters.creator')}
                  </span>
                }
                layout="vertical"
                name={'creator_name'}
              >
                <Input placeholder={t('quotas.filters.partial_match')} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={
                  <span className="font-bold">
                    {t('quotas.filters.approver')}
                  </span>
                }
                layout="vertical"
                name={'approver_name'}
              >
                <Input placeholder={t('quotas.filters.partial_match')} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={4} xxl={3}>
              {/* <Form.Item
                label={
                  <span className="font-bold">
                    {t('quotas.filters.department')}
                  </span>
                }
                layout="vertical"
                name={'department_in_charge'}
              > */}
              {/* <Select
                  {...selectProps}
                  allowClear
                  showSearch
                  labelInValue
                  onSearch={() => {}}
                  placeholder={t('placeholders.select')}
                  filterOption={(input, option) =>
                    ((option?.label ?? '') as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                /> */}
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
                  if (callback) callback(department)
                }}
              />
              {/* </Form.Item> */}
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={
                  <span className="font-bold">
                    {t('quotas.filters.tag_name')}
                  </span>
                }
                layout="vertical"
                name={'tag_name'}
              >
                <Input placeholder={t('quotas.filters.partial_match')} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={12} md={6} lg={4}>
              <Form.Item
                label={
                  <span className="font-bold">{t('quotas.filters.date')}</span>
                }
                layout="vertical"
                name={'search_date_type'}
              >
                <Select
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
                  placeholder={[FORMAT_DATE, FORMAT_DATE]}
                  disabled={
                    !Form.useWatch('search_date_type', searchFormProps.form)
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={12} md={6}>
              <div className="mt-7 mb-6 flex gap-2">
                <Button htmlType="submit" type="primary">
                  {t('buttons.search')}
                </Button>
                <Button
                  htmlType="reset"
                  type="default"
                  onClick={() => {
                    setFilters([], 'replace')
                    onChangeStatus(QuotaStatus.Creating)
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
                      successNotification: (data) =>
                        notificationFunction(data?.data.message),
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
                  >
                    <Space
                      style={{
                        width: '100%',
                        justifyContent: 'space-between',
                        fontSize: 14,
                        color: '#ccc',
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
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    go({
                      to: 'quota-templates',
                    })
                  }}
                >
                  {t('quotas.actions.template_list')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    go({
                      to: 'quotas/create',
                    })
                  }}
                >
                  {t('quotas.actions.new_create')}
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        <CommonTable
          rowKey={'id'}
          rowSelection={rowSelection}
          columns={columns}
          {...tableProps}
        />
      </Form>
      <Modal
        {...modalProps}
        footer={false}
        title={boldText(
          t('quotas.modal.move_to_decided_estimate'),
          PRIMARY,
          16,
        )}
      >
        <ModalAgreePrice data={dataAgreedPrice} close={close} />
      </Modal>
    </List>
  )
}

export default QuotaList

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
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import {
  CloneButton,
  DeleteButton,
  EditButton,
  ShowButton,
  useModal,
  useSelect,
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
import React, { useCallback, useMemo, useState } from 'react'

const { RangePicker } = DatePicker

function QuotaList() {
  const t = useTranslate()

  const apiUrl = useApiUrl()

  const go = useGo()

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [options, setOptions] = useState<ItemType[]>()
  const [selectedRows, setSelectedRows] = useState<any>()

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
      ),
    }),
  }

  const { modalProps, close, show } = useModal()

  const columns: ColumnsType<any> = useMemo(() => {
    return [
      {
        title: '状態 / コメント',
        dataIndex: 'status',
        key: 'status',
        render: (value, record) => {
          const result = getQuotaStatusStyle(value)

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
        title: '見積番号',
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
        title: 'タイトル / 取引先',
        dataIndex: 'title',
        key: 'title',
        render: (_, record) => (
          <div className="flex flex-col gap-[2px]">
            <div>{record.title}</div>
            <div>{record.customer_name}</div>
          </div>
        ),
      },
      {
        title: '作成者 / 承認者',
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
        title: '部門 / 金額 (円)',
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
        title: '作成日 / 有効期限',
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
        title: '送信日 / 受注・失注日',
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
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <Space>
            <ShowButton
              hideText
              size="small"
              icon={<EyeOutlined />}
              recordItemId={record.id}
            />
            {record.status === QuotaStatus.Creating && record.is_author && (
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

            <Link href={record?.pdf_path} target="_blank">
              <Button size="small" icon={<DownloadOutlined />} />
            </Link>

            {(record.status === QuotaStatus.Creating ||
              record.status === QuotaStatus.Rejected ||
              record.status === QuotaStatus.Cancelled) && (
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
                再見積
              </Button>
            )}

            {record.status === QuotaStatus.Completed &&
              record.is_author &&
              !record?.has_agreed_price && (
                <Button
                  type="default"
                  size="small"
                  onClick={() => {
                    show()
                    setDataAgreedPrice(record)
                  }}
                >
                  決定移動
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
          value: dayjs((values?.date ?? [])[0]).format('YYYY-MM-DD'),
        },
        {
          field: 'end_date',
          operator: 'eq',
          value: dayjs((values?.date ?? [])[1]).format('YYYY-MM-DD'),
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
    },
    [status],
  )

  const { selectProps } = useSelect({
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

  const { data } = useCustom({
    method: 'get',
    url: `${apiUrl}/quotas/stats`,
  })

  const statusData = [
    { title: '作成中', value: 0, key: QuotaStatus.Creating },
    {
      title: '承認待',
      value: 0,
      color: '#faad14',
      key: QuotaStatus.WaitingApproval,
    }, // vàng
    { title: '承認済', value: 0, color: '#1890ff', key: QuotaStatus.Approved }, // xanh
    {
      title: '送信済',
      value: 0,
      color: '#1677ff',
      key: QuotaStatus.SentToCustomer,
    }, // xanh đậm
    { title: '差戻', value: 0, color: '#fa541c', key: QuotaStatus.Rejected }, // cam
    { title: '受注', value: 0, color: '#52c41a', key: QuotaStatus.Completed }, // xanh lá
    { title: '失注', value: 0, color: '#ff4d4f', key: QuotaStatus.Cancelled }, // đỏ
    { title: 'すべて', value: 0, key: null },
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
    ): { key: number; label: string }[] => {
      if (status === QuotaStatus.Creating || status === QuotaStatus.Rejected) {
        return [
          { key: 1, label: '削除' },
          ...(hasApprovalRoutes
            ? [{ key: 2, label: '承認依頼（作成者）' }]
            : []),
        ]
      } else if (status === QuotaStatus.WaitingApproval) {
        return [
          ...(hasApprovalRoutes ? [{ key: 3, label: '承認（承認者）' }] : []),
        ]
      } else if (status === QuotaStatus.Approved) {
        return [{ key: 4, label: '送信（作成者）' }]
      } else if (status === QuotaStatus.SentToCustomer) {
        return [
          { key: 5, label: '受注へ移動' },
          { key: 6, label: '失注へ移動' },
        ]
      } else if (status === QuotaStatus.Completed) {
        return [{ key: 7, label: '送信へ移動' }]
      } else if (status === QuotaStatus.Cancelled) {
        return [
          { key: 1, label: '削除' },
          ...(hasApprovalRoutes ? [{ key: 7, label: '送信へ移動' }] : []),
        ]
      }
      return []
    },
    [t],
  )

  const notificationFunction = useCallback(
    (message: string): OpenNotificationParams | false | undefined => {
      refetch()
      setSelectedRowKeys([])
      setOptions([])
      return {
        message: t('notifications.success'),
        description: message ?? t('notifications.success'),
        type: 'success',
      }
    },
    [t],
  )

  const { mutate } = useCustomMutation()

  const handleClick = (info: MenuInfo) => {
    if (Number(info.key) === 1) {
      mutate({
        values: {
          ids: selectedRows?.map((item: any) => item?.id),
        },
        method: 'delete',
        url: `${apiUrl}/quotas`,
        successNotification: (data) => {
          return notificationFunction(data?.data.message)
        },
      })
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
        url: `${apiUrl}/quotas/back-to-send-customer`,
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
      i18nHeading={'quotas.list'}
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
                label={<span className="font-bold">見積番号</span>}
                layout="vertical"
                name={'code'}
              >
                <Input placeholder="部分一致" />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={<span className="font-bold">取引先</span>}
                layout="vertical"
                name={'customer_name'}
              >
                <Input placeholder="部分一致" />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={<span className="font-bold">タイトル</span>}
                layout="vertical"
                name={'title'}
              >
                <Input placeholder="部分一致" />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={<span className="font-bold">作成者</span>}
                layout="vertical"
                name={'creator_name'}
              >
                <Input placeholder="部分一致" />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={<span className="font-bold">承認者</span>}
                layout="vertical"
                name={'approver_name'}
              >
                <Input placeholder="部分一致" />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={4} xxl={3}>
              <Form.Item
                label={<span className="font-bold">部門（支社/部/課）</span>}
                layout="vertical"
                name={'department_in_charge'}
              >
                <Select
                  {...selectProps}
                  allowClear
                  showSearch
                  labelInValue
                  placeholder={'選択してください'}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={<span className="font-bold">タグ名</span>}
                layout="vertical"
                name={'tag_name'}
              >
                <Input placeholder="部分一致" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={12} md={6} lg={4}>
              <Form.Item
                label={<span className="font-bold">日付</span>}
                layout="vertical"
                name={'search_date_type'}
              >
                <Select
                  options={[
                    {
                      value: 'created_at',
                      label: '作成日',
                    },
                    {
                      value: 'sent_to_customer_date',
                      label: '送信日',
                    },
                    {
                      value: 'expired_date',
                      label: '有効期限',
                    },
                    {
                      value: 'customer_accepted_date',
                      label: '受注日 ',
                    },
                    {
                      value: 'customer_cancelled_date',
                      label: '失注日',
                    },
                  ]}
                  placeholder={'作成日'}
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
                    setStatus(QuotaStatus.Creating)
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
                label={<span className="font-bold">タグ名</span>}
                layout="vertical"
              >
                <Select placeholder={'一括処理'} options={options ?? []} />
              </Form.Item> */}
              <Dropdown
                menu={{
                  items: options ?? [
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
                    一括処理
                    <DownOutlined
                      style={{
                        fontSize: 13,
                      }}
                    />
                  </Space>
                </Button>
              </Dropdown>
            </Col>

            <Col xs={16} md={18} lg={20}>
              <div className="flex justify-end gap-2">
                <Button type="default">見積テンプレート一覧</Button>
                <Button
                  type="primary"
                  onClick={() => {
                    go({
                      to: 'quotas/create',
                    })
                  }}
                >
                  新規作成
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
        title={boldText('決定見積へ移動', PRIMARY, 16)}
      >
        <ModalAgreePrice data={dataAgreedPrice} close={close} />
      </Modal>
    </List>
  )
}

export default QuotaList

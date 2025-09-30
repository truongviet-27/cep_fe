/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  RightOutlined,
} from '@ant-design/icons'
import StatusDashboard from '@components/cep/estimates/quotas/action/components/status-dashboard'
import { QuotaStatus } from '@components/cep/estimates/quotas/enum'
import { DownloadButton } from '@components/common/button/download'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import {
  CloneButton,
  DeleteButton,
  EditButton,
  ShowButton,
  useSelect,
  useTable,
} from '@refinedev/antd'
import { useGo, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
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
  Tooltip,
  Typography,
} from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { type TableRowSelection } from 'antd/es/table/interface'
import dayjs from 'dayjs'
import Link from 'next/link'
import React, { useCallback, useMemo, useState } from 'react'

const { Title } = Typography

const { RangePicker } = DatePicker

function QuotaList() {
  const t = useTranslate()

  const go = useGo()

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [options, setOptions] = useState<any>()

  const statusButton = useCallback(
    (status: string) => {
      if (status === QuotaStatus.Creating || status === QuotaStatus.Rejected) {
        return [
          {
            value: '',
            label: '削除',
          },
          {
            value: '',
            label: '承認依頼（作成者）',
          },
        ]
      } else if (status === QuotaStatus.WaitingApproval) {
        return [
          {
            value: '',
            label: '承認（承認者）',
          },
        ]
      } else if (status === QuotaStatus.Approved) {
        return [
          {
            value: '',
            label: '送信（作成者）',
          },
        ]
      } else if (status === QuotaStatus.SentToCustomer) {
        return [
          {
            value: '',
            label: '受注へ移動',
          },
          {
            value: '',
            label: '注へ移動',
          },
        ]
      } else if (status === QuotaStatus.Completed) {
        return [
          {
            value: '',
            label: '送信へ移動',
          },
        ]
      } else if (status === QuotaStatus.Cancelled) {
        return [
          {
            value: '',
            label: '削除',
          },
          {
            value: '',
            label: '送信へ移動',
          },
        ]
      } else {
        return []
      }
    },
    [t],
  )

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: any,
  ) => {
    const status = handleOptions(selectedRows)

    console.log(newSelectedRowKeys, selectedRows, 'selectProps')

    console.log(status, 'statusxxxxxx')
    const options = statusButton(status)
    setOptions(options)

    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const columns: ColumnsType<any> = useMemo(() => {
    return [
      {
        title: '状態 / コメント',
        dataIndex: 'status',
        key: 'status',
        render: (value, record) => {
          let background = ''
          let color = ''
          let text = ''
          switch (value as QuotaStatus) {
            case QuotaStatus.Creating:
              background = '#E2E2E2'
              color = '#666666'
              text = '下書き'
              break

            case QuotaStatus.WaitingApproval:
              background = '#FFFFC7'
              color = '#D2A904'
              text = '承認待'
              break

            case QuotaStatus.Approved:
              background = '#DAEDFF'
              color = '#0066CC'
              text = '承認済'
              break

            case QuotaStatus.Rejected:
              background = '#FFDFBF'
              color = '#FF8400'
              text = '差戻'
              break

            case QuotaStatus.SentToCustomer:
              background = '#DAEDFF'
              color = '#0066CC'
              text = '送信済'
              break

            case QuotaStatus.Completed:
              background = '#DFFFEB'
              color = '#22874D'
              text = '受注'
              break

            case QuotaStatus.Cancelled:
              background = '#FFDFDF'
              color = '#FF0000'
              text = '失注'
              break

            default:
              background = '#FFFFFF'
              color = '#000000'
              text = ''
              break
          }

          return (
            <div className="flex flex-col items-center justify-center gap-1">
              <Tag color={background} style={{ color, marginRight: 0 }}>
                {text}
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
          <Link href={`/quotas/show/${record.id}`}>{value}</Link>
        ),
      },
      {
        title: 'タイトル / 取引先',
        dataIndex: 'title',
        key: 'title',
        render: (_, record) => (
          <div className="flex flex-col gap-[2px]">
            <div>{record.title}</div>
            <div style={{ color: '#888' }}>{record.customer_name}</div>
          </div>
        ),
      },
      {
        title: '作成者 / 承認者',
        dataIndex: 'creator',
        key: 'creator',
        render: (_, record) => (
          <div>
            <div>{record.author?.name}</div>
            <div className="flex flex-wrap gap-[2px]" style={{ color: '#888' }}>
              {record.approvers?.map((item: string) => item)}
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
            <div>{record.department}</div>
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
            <div>{dayjs(record.created_at).format('YYYY/MM/DD')}</div>

            {/* <div>{record.expiration_date}</div> */}
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
                  {dayjs(record.customer_accepted_date).format('YYYY/MM/DD') ||
                    dayjs(record.customer_cancelled_date).format('YYYY/MM/DD')}
                </div>
              </div>
            )
          } else {
            return (
              <div>
                <div>{dayjs().format('YYYY/MM/DD')}</div>
                <div>{dayjs().format('YYYY/MM/DD')}</div>
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
            {record.status === QuotaStatus.Creating && (
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

            {(record.status === QuotaStatus.Rejected ||
              record.status === QuotaStatus.Cancelled) && (
              <DeleteButton
                hideText
                size="small"
                icon={<DeleteOutlined />}
                recordItemId={record.id}
              />
            )}
            <DownloadButton hideText size="small" recordItemId={record.id} />

            {record.status === QuotaStatus.Completed && (
              <Button type="default">決定移動</Button>
            )}
          </Space>
        ),
      },
    ]
  }, [t])

  const [status, setStatus] = useState<string | null>(null)

  const { tableProps, searchFormProps, setFilters } = useTable({
    syncWithLocation: true,
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
          field: 'creator_department_name',
          operator: 'eq',
          value: values.creator_department_name?.label,
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

  const statusData = [
    { title: 'すべて', value: 9222, key: null },
    { title: '作成中', value: 4, key: QuotaStatus.Creating },
    {
      title: '承認待',
      value: 3,
      color: '#faad14',
      key: QuotaStatus.WaitingApproval,
    }, // vàng
    { title: '承認済', value: 11, color: '#1890ff', key: QuotaStatus.Approved }, // xanh
    {
      title: '送信済',
      value: 9100,
      color: '#1677ff',
      key: QuotaStatus.SentToCustomer,
    }, // xanh đậm
    { title: '差戻', value: 96, color: '#fa541c', key: QuotaStatus.Rejected }, // cam
    { title: '受注', value: 4, color: '#52c41a', key: QuotaStatus.Completed }, // xanh lá
    { title: '失注', value: 4, color: '#ff4d4f', key: QuotaStatus.Cancelled }, // đỏ
  ]

  const onChangeStatus = useCallback(
    (status: string | null) => {
      setStatus(status)
    },
    [status],
  )

  const { selectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
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

    return filter
  }

  return (
    <List
      title={
        <Breadcrumbs
          items={[
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('quotas.quotas')}
                </Title>
              ),
            },
            {
              title: <Title level={5}>{t('quotas.list')}</Title>,
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
          statusData={statusData}
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
                name={'creator_department_name'}
              >
                <Select
                  allowClear
                  showSearch
                  {...selectProps}
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
                label={<span className="font-bold">タグ名</span>}
                layout="vertical"
                name={'search_date_type'}
              >
                <Select
                  allowClear
                  showSearch
                  options={[
                    {
                      value: 'created_at',
                      label: '作成日',
                    },
                    {
                      value: '',
                      label: '送信日',
                    },
                    {
                      value: 'expiration_date',
                      label: '有効期限',
                    },
                    {
                      value: '',
                      label: '受注日 ',
                    },
                    {
                      value: '',
                      label: '失注日',
                    },
                  ]}
                  placeholder={'作成日'}
                />
              </Form.Item>
            </Col>

            <Col xs={12} md={6}>
              <Form.Item
                label={<span className="font-bold">タグ名</span>}
                layout="vertical"
                name={'date'}
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
                  {t('buttons.search')}
                </Button>
                <Button
                  htmlType="reset"
                  type="default"
                  onClick={() => {
                    setFilters([], 'replace')
                    setStatus(null)
                  }}
                >
                  {t('buttons.clear')}
                </Button>
              </div>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={8} md={6} lg={4}>
              <Form.Item
                label={<span className="font-bold">タグ名</span>}
                layout="vertical"
              >
                <Select
                  allowClear
                  showSearch
                  placeholder={'一括処理'}
                  options={options ?? []}
                />
              </Form.Item>
            </Col>

            <Col xs={16} md={18} lg={20}>
              <div className="mt-7 flex justify-end gap-2">
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
    </List>
  )
}

export default QuotaList

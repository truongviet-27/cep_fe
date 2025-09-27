/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MessageOutlined,
  RightOutlined,
} from '@ant-design/icons'
import StatusDashboard from '@components/cep/estimates/quotas/action/components/status-dashboard'
import CommonTable from '@components/common/table'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import {
  CloneButton,
  DeleteButton,
  EditButton,
  ShowButton,
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
  Typography,
} from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { type TableRowSelection } from 'antd/es/table/interface'
import React, { useMemo, useState } from 'react'

const { Title } = Typography

const { RangePicker } = DatePicker

function QuotaList() {
  const t = useTranslate()

  const go = useGo()

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: any,
  ) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys, selectedRows)
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
          let color = ''
          let text = ''
          switch (value) {
            case 'draft':
              color = 'default'
              text = '下書き'
              break
            case 'pending':
              color = 'orange'
              text = '承認待'
              break
            case 'rejected':
              color = 'red'
              text = '否認'
              break
            case 'approved':
              color = 'green'
              text = '承認済'
              break
            case 'sent':
              color = 'blue'
              text = '送信済'
              break
          }

          return (
            <Space direction="vertical" align="center" content="center">
              <Tag color={color}>{text}</Tag>
              {record.comment && <MessageOutlined />}
            </Space>
          )
        },
      },
      {
        title: '見積番号',
        dataIndex: 'number',
        key: 'number',
        render: (value) => <a>{value}</a>,
      },
      {
        title: 'タイトル / 取引先',
        dataIndex: 'title',
        key: 'title',
        render: (_, record) => (
          <div>
            <div>{record.title}</div>
            <div style={{ color: '#888' }}>{record.customer}</div>
          </div>
        ),
      },
      {
        title: '作成者 / 承認者',
        dataIndex: 'creator',
        key: 'creator',
        render: (_, record) => (
          <div>
            <div>{record.creator}</div>
            <div style={{ color: '#888' }}>{record.approver}</div>
          </div>
        ),
      },
      {
        title: '部門 / 金額 (円)',
        dataIndex: 'department',
        key: 'department',
        render: (_, record) => (
          <div>
            <div>{record.department}</div>
            <div>{record.amount.toLocaleString()}</div>
          </div>
        ),
      },
      {
        title: '作成日 / 有効期限',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (_, record) => (
          <div>
            <div>{record.createdAt}</div>
            <div>{record.expiredAt}</div>
          </div>
        ),
      },
      {
        title: '送信日 / 受注・失注日',
        dataIndex: 'sentAt',
        key: 'sentAt',
        render: (_, record) => (
          <div>
            <div>{record.sentAt || '-'}</div>
            <div>{record.resultDate || '-'}</div>
          </div>
        ),
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
            <EditButton
              hideText
              size="small"
              icon={<EditOutlined />}
              recordItemId={record.id}
            />

            <CloneButton
              hideText
              size="small"
              icon={<CopyOutlined />}
              recordItemId={record.id}
            />

            <DeleteButton
              hideText
              size="small"
              icon={<DeleteOutlined />}
              recordItemId={record.id}
            />
          </Space>
        ),
      },
    ]
  }, [t])

  const dataSource: any[] = [
    {
      id: 1,
      status: 'draft',
      comment: 'Chưa hoàn thiện',
      number: 'ES-250527-001',
      title: 'システムカスタマイズ',
      customer: '株式会社フューチャーデバイス',
      creator: '伊藤健太',
      approver: '田中洋一',
      department: 'SaaS事業部',
      amount: 200000,
      createdAt: '2025/05/31',
      expiredAt: '2025/08/31',
      sentAt: undefined,
      resultDate: undefined,
    },
    {
      id: 2,
      status: 'pending',
      number: 'ES-250527-002',
      title: 'システムカスタマイズ',
      customer: '株式会社フューチャーデバイス',
      creator: '伊藤健太',
      approver: '田中洋一',
      department: 'SaaS事業部',
      amount: 200000,
      createdAt: '2025/05/31',
      expiredAt: '2025/08/31',
      sentAt: undefined,
      resultDate: undefined,
    },
    {
      id: 3,
      status: 'rejected',
      number: 'ES-250527-003',
      title: 'システムカスタマイズ',
      customer: '株式会社フューチャーデバイス',
      creator: '伊藤健太',
      approver: '田中洋一',
      department: 'SaaS事業部',
      amount: 200000,
      createdAt: '2025/05/31',
      expiredAt: '2025/08/31',
      sentAt: '2025/06/01',
      resultDate: '2025/06/01',
    },
    {
      id: 4,
      status: 'approved',
      number: 'ES-250527-004',
      title: 'システムカスタマイズ',
      customer: '株式会社フューチャーデバイス',
      creator: '伊藤健太',
      approver: '田中洋一',
      department: 'SaaS事業部',
      amount: 200000,
      createdAt: '2025/05/31',
      expiredAt: '2025/08/31',
      sentAt: '2025/06/01',
      resultDate: '2025/06/30',
    },
    {
      id: 5,
      status: 'sent',
      number: 'ES-250527-005',
      title: 'システムカスタマイズ',
      customer: '株式会社フューチャーデバイス',
      creator: '伊藤健太',
      approver: '田中洋一',
      department: 'SaaS事業部',
      amount: 200000,
      createdAt: '2025/05/31',
      expiredAt: '2025/08/31',
      sentAt: '2025/06/01',
      resultDate: undefined,
    },
  ]

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
      <Form>
        <StatusDashboard />
        <div className="my-4">
          <Row gutter={[24, 0]}>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={<span className="font-bold">見積番号</span>}
                layout="vertical"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={<span className="font-bold">取引先</span>}
                layout="vertical"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={<span className="font-bold">タイトル</span>}
                layout="vertical"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={<span className="font-bold">作成者</span>}
                layout="vertical"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={<span className="font-bold">承認者</span>}
                layout="vertical"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={4} xxl={3}>
              <Form.Item
                label={<span className="font-bold">部門（支社/部/課）</span>}
                layout="vertical"
              >
                <Select allowClear showSearch />
              </Form.Item>
            </Col>
            <Col xs={12} md={6} lg={3} xxl={3}>
              <Form.Item
                label={<span className="font-bold">タグ名</span>}
                layout="vertical"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={12} md={6} lg={4}>
              <Form.Item
                label={<span className="font-bold">タグ名</span>}
                layout="vertical"
              >
                <Select allowClear showSearch />
              </Form.Item>
            </Col>

            <Col xs={12} md={6}>
              <Form.Item
                label={<span className="font-bold">タグ名</span>}
                layout="vertical"
              >
                <RangePicker allowClear className="w-full" />
              </Form.Item>
            </Col>

            <Col xs={12} md={6}>
              <div className="mt-7 mb-6 flex gap-2">
                <Button type="primary">{t('buttons.search')}</Button>
                <Button type="default">{t('buttons.clear')}</Button>
              </div>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={8} md={6} lg={4}>
              <Form.Item
                label={<span className="font-bold">タグ名</span>}
                layout="vertical"
              >
                <Select allowClear showSearch />
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
          dataSource={dataSource}
        />
      </Form>
    </List>
  )
}

export default QuotaList

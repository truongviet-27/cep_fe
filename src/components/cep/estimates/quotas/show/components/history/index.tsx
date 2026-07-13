/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable simple-import-sort/imports */
import { DownOutlined, FilePdfFilled } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY, WHITE } from '@utility/color'
import { FORMAT_DATE_CROSS } from '@utility/instances'
import { Button, Card, Collapse, Tag, Typography } from 'antd'
import { type ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import '../../../style/style-history.css'
import { getQuotaStatusStyle } from '@components/cep/estimates/quotas/utils'
import { type QuotaStatus } from '@components/cep/estimates/quotas/enum'

const { Title } = Typography

function History({ data }: { data: any }) {
  const t = useTranslate()
  const columnsApprove = useMemo(() => {
    return [
      {
        title: t('quotas.show.table.step'),
        dataIndex: 'step_order',
        key: 'step_order',
      },
      {
        title: t('quotas.show.table.process_date'),
        dataIndex: 'created_at',
        key: 'created_at',
        render(value) {
          return dayjs(value).format(FORMAT_DATE_CROSS)
        },
      },
      {
        title: t('quotas.show.table.operation'),
        dataIndex: 'status',
        key: 'status',
        render: (value: QuotaStatus) => {
          const result = getQuotaStatusStyle(value, t)

          return (
            <div className="flex flex-col items-center justify-center gap-1">
              <Tag
                color={result.background}
                style={{ color: result.color, marginRight: 0 }}
              >
                {result.text}
              </Tag>
            </div>
          )
        },
      },
      {
        title: t('quotas.show.table.comment'),
        dataIndex: 'comment',
        key: 'comment',
      },
      {
        title: t('quotas.show.table.approver'),
        dataIndex: 'approver_name',
        key: 'approver_name',
      },
    ] as ColumnsType
  }, [t])

  const columnsCreation = useMemo(() => {
    return [
      {
        title: t('quotas.show.table.created_date'),
        dataIndex: 'created_at',
        key: 'created_at',
        render(value) {
          return dayjs(value).format(FORMAT_DATE_CROSS)
        },
      },
      {
        title: t('quotas.show.table.sent_date'),
        dataIndex: 'sent_to_customer_date',
        key: 'sent_to_customer_date',
        render(value) {
          return value ? dayjs(value).format(FORMAT_DATE_CROSS) : ''
        },
      },
      {
        title: t('quotas.show.table.estimate_number'),
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: t('quotas.show.table.creator'),
        dataIndex: 'author',
        key: 'author',
        render(value) {
          return value?.name
        },
      },
      {
        title: t('quotas.show.table.pdf'),
        dataIndex: 'pdf_path',
        key: 'pdf_path',
        render: (value: string, record) => (
          <Button
            type="link"
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            icon={
              <FilePdfFilled
                style={{
                  color: 'black',
                }}
              />
            }
            iconPosition="start"
            style={{
              textDecoration: 'underline',
            }}
          >
            {record?.code}
          </Button>
        ),
      },
    ] as ColumnsType
  }, [t])

  return (
    <Collapse
      bordered={false}
      expandIconPosition="end"
      expandIcon={({ isActive }) => (
        <DownOutlined rotate={isActive ? 180 : 0} />
      )}
      defaultActiveKey={[1]}
      style={{
        background: WHITE,
        padding: 'none',
        marginTop: 10,
        paddingBottom: 20,
      }}
      className="custom-collapse"
      items={[
        {
          key: 1,
          label: <span>{boldText(t('quotas.show.history'), PRIMARY, 16)}</span>,
          children: (
            <Card style={{ marginTop: 10, background: '#F8F9FA' }}>
              <div className="mb-4">
                <Title level={5}>{t('quotas.show.approval_history')}</Title>
                <CommonTable
                  columns={columnsApprove}
                  dataSource={data?.approval_history}
                  pagination={false}
                />
              </div>
              <div>
                <Title level={5}>{t('quotas.show.creation_history')}</Title>
                <CommonTable
                  columns={columnsCreation}
                  dataSource={data?.clone_history}
                  pagination={false}
                />
              </div>
            </Card>
          ),
        },
      ]}
    ></Collapse>
  )
}

export default History

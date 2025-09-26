import CommonTable from '@components/common/table'
import { useTranslate } from '@refinedev/core'
import { Button, Card, Flex, Typography } from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { useMemo } from 'react'

const { Title } = Typography

function History() {
  const t = useTranslate()
  const columnsApprove = useMemo(() => {
    return [
      {
        title: 'ステップ',
        dataIndex: 'step',
        key: 'step',
      },
      {
        title: '処理日',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: '操作', // Thao tác
        dataIndex: 'action',
        key: 'action',
        render: (text: string) => {
          if (text === '承認') {
            return <span style={{ color: 'green' }}>{text}</span>
          }
          if (text === '差戻し') {
            return <span style={{ color: 'red' }}>{text}</span>
          }
          return text
        },
      },
      {
        title: 'コメント',
        dataIndex: 'comment',
        key: 'comment',
      },
      {
        title: '承認者',
        dataIndex: 'approver',
        key: 'approver',
      },
    ] as ColumnsType
  }, [t])

  const columnsCreation = useMemo(() => {
    return [
      {
        title: '作成日',
        dataIndex: 'createdDate',
        key: 'createdDate',
      },
      {
        title: '送信日',
        dataIndex: 'sentDate',
        key: 'sentDate',
      },
      {
        title: '見積番号',
        dataIndex: 'estimateNo',
        key: 'estimateNo',
      },
      {
        title: '作成者',
        dataIndex: 'creator',
        key: 'creator',
      },
      {
        title: 'PDF',
        dataIndex: 'pdf',
        key: 'pdf',
        render: (text: string) => (
          <Button
            type="link"
            href={text}
            target="_blank"
            rel="noopener noreferrer"
          >
            PDF
          </Button>
        ),
      },
    ] as ColumnsType
  }, [t])

  return (
    <Card
      title={'履歴'}
      headStyle={{
        padding: 0,
        minHeight: 0,
      }}
      bodyStyle={{
        padding: 0,
      }}
      style={{
        border: 'none',
        marginTop: 40,
      }}
    >
      <Flex vertical style={{ padding: 20 }}>
        <div className="mb-4">
          <Title level={5}>承認履歴</Title>
          <CommonTable columns={columnsApprove} />
        </div>
        <div>
          <Title level={5}>作成履歴</Title>
          <CommonTable columns={columnsCreation} />
        </div>
      </Flex>
    </Card>
  )
}

export default History

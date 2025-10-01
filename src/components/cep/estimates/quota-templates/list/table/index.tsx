import { ReconciliationOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import {
  CreateButton,
  DeleteButton,
  EditButton,
  ShowButton,
} from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import { Button, Flex, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableProps } from 'antd/lib'
import Link from 'next/link'
import type { FC } from 'react'

interface Props {
  tableProps: TableProps<BaseRecord>
}

const QuotaTemplateTable: FC<Props> = ({ tableProps }) => {
  const t = useTranslate()

  const columns: ColumnsType<BaseRecord> = [
    {
      key: 'name',
      dataIndex: 'name',
      title: t('quota_templates.list.templateName'),
      render: (item, record) => (
        <Link
          href={`/quota-templates/show/${record.id}`}
          className="!underline"
        >
          {item}
        </Link>
      ),
    },
    {
      key: 'creator',
      dataIndex: 'creator',
      title: t('quota_templates.list.creator'),
    },
    {
      key: 'creationDate',
      dataIndex: 'creationDate',
      title: (
        <>
          {t('quota_templates.list.creationDate')}
          <br />
          {t('quota_templates.list.updateDate')}
        </>
      ),
    },
    {
      key: 'numberOfItems',
      dataIndex: 'numberOfItems',
      title: t('quota_templates.list.numberOfItems'),
    },
    {
      key: 'bassPrice',
      dataIndex: 'bassPrice',
      title: t('quota_templates.list.bassPrice'),
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: t('quota_templates.list.description'),
    },
    {
      key: 'operation',
      dataIndex: 'operation',
      title: t('quota_templates.list.operation'),
      render: (_, record) => (
        <Space>
          <ShowButton
            hideText
            size="small"
            recordItemId={record.id}
            resource="quota-templates"
          />
          <EditButton
            hideText
            size="small"
            recordItemId={record.id}
            resource="quota-templates"
          />
          <Button size="small" icon={<ReconciliationOutlined />} />
          <DeleteButton
            hideText
            size="small"
            recordItemId={record.id}
            resource="quota-templates"
          />
        </Space>
      ),
    },
  ]

  return (
    <>
      <Flex justify="end">
        <CreateButton icon={null} resource="quota-templates">
          {t('quota_templates.button.create')}
        </CreateButton>
      </Flex>
      <br />
      <CommonTable
        {...tableProps}
        columns={columns}
        dataSource={[
          {
            id: 1,
            name: '標準見積テンプレート',
            creator: '伊藤太郎',
            creationDate: '2025/05/31',
            updateDate: '2025/05/31',
            numberOfItems: '1',
            bassPrice: '1,111,111',
            description: '工程別の標準開発項目',
          },
        ]}
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
        }}
        loading={false}
      />
    </>
  )
}

export default QuotaTemplateTable

import { ReconciliationOutlined } from '@ant-design/icons'
import CommonTable from '@components/common/table'
import type { QuotaTemplateListItemType } from '@interfaces/quota-templates'
import {
  CreateButton,
  DeleteButton,
  EditButton,
  ShowButton,
} from '@refinedev/antd'
import { useGo, useTranslate } from '@refinedev/core'
import { Button, Flex, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableProps } from 'antd/lib'
import dayjs from 'dayjs'
import Link from 'next/link'
import type { FC } from 'react'

interface Props {
  tableProps: TableProps<QuotaTemplateListItemType>
}

const QuotaTemplateTable: FC<Props> = ({ tableProps }) => {
  const t = useTranslate()
  const go = useGo()

  const columns: ColumnsType<QuotaTemplateListItemType> = [
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
      key: 'author',
      dataIndex: 'author',
      title: t('quota_templates.list.creator'),
      render: (_, record) => <span>{record.author?.name ?? '-'}</span>,
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
      render(_, record) {
        return (
          <div>
            <span>
              {record.created_at
                ? dayjs(record.created_at).format('YYYY/MM/DD')
                : '-'}
            </span>
            <br />
            <span>
              {record.updated_at
                ? dayjs(record.updated_at).format('YYYY/MM/DD')
                : '-'}
            </span>
          </div>
        )
      },
    },
    {
      key: 'number_product',
      dataIndex: 'number_product',
      title: t('quota_templates.list.numberOfItems'),
    },
    {
      key: 'total_price',
      dataIndex: 'total_price',
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
      width: 200,
      render: (_, record) => (
        <Space size={8}>
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
          <Button
            size="small"
            icon={<ReconciliationOutlined />}
            onClick={() => {
              go({
                to: '/quotas/create?templateId=' + record.id,
              })
            }}
          />
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
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
        }}
      />
    </>
  )
}

export default QuotaTemplateTable

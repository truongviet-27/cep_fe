import CommonTable from '@components/common/table'
import type { QuotaTemplateListItemType } from '@interfaces/quota-templates'
import {
  CreateButton,
  DeleteButton,
  EditButton,
  ShowButton,
} from '@refinedev/antd'
import { useGo, useTranslate } from '@refinedev/core'
import { useUserStore } from '@stores/useUserStore'
import { Button, Flex, Space, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableProps } from 'antd/lib'
import dayjs from 'dayjs'
import Link from 'next/link'
import type { FC } from 'react'

const { Text } = Typography

interface Props {
  tableProps: TableProps<QuotaTemplateListItemType>
}

const QuotaTemplateTable: FC<Props> = ({ tableProps }) => {
  const t = useTranslate()
  const go = useGo()
  const permission = useUserStore((state) => state.permission)

  const columns: ColumnsType<QuotaTemplateListItemType> = [
    {
      key: 'name',
      dataIndex: 'name',
      title: t('quota_templates.list.templateName'),
      width: '20%',
      onCell: () => ({
        style: {
          padding: '2px 2px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      }),
      render: (item, record) => (
        <Link
          href={`/quota-templates/show/${record.id}`}
          className="!underline"
          style={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item}
        </Link>
      ),
    },
    {
      key: 'author',
      dataIndex: 'author',
      title: t('quota_templates.list.creator'),
      width: '24%',
      onCell: () => ({
        style: {
          padding: '2px 2px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      }),
      render: (_, record) => (
        <span
          style={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {record.author?.name ?? '-'}
        </span>
      ),
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
      width: '10%',
      onCell: () => ({
        style: { padding: '2px 2px', overflow: 'hidden', minWidth: 0 },
      }),
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
      width: '5%',
      onCell: () => ({
        style: { padding: '2px 2px', overflow: 'hidden', minWidth: 0 },
      }),
    },
    {
      key: 'total_price',
      dataIndex: 'total_price',
      title: t('quota_templates.list.bassPrice'),
      width: '10%',
      onCell: () => ({
        style: { padding: '2px 2px', overflow: 'hidden', minWidth: 0 },
      }),
      render: (value) => Math.trunc(value).toLocaleString(),
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: t('quota_templates.list.description'),
      width: '21%',
      onCell: () => ({
        style: {
          padding: '2px 2px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      }),
      render: (value) => (
        <Text
          style={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          ellipsis={{ tooltip: value }}
        >
          {value}
        </Text>
      ),
    },
    {
      key: 'operation',
      dataIndex: 'operation',
      title: t('quota_templates.list.operation'),
      width: '12%',
      onCell: () => ({
        style: { padding: '2px 2px', overflow: 'hidden', minWidth: 0 },
      }),
      render: (_, record) => (
        <Space wrap size={4}>
          <ShowButton
            autoInsertSpace={false}
            size="small"
            icon={null}
            recordItemId={record.id}
            resource="quota-templates"
            style={{
              color: '#2784FF',
              borderColor: '#2784FF',
            }}
          >
            {t('buttons.show')}
          </ShowButton>
          {(permission?.is_module_admin ||
            permission?.user?.id === record.author?.id) && (
            <EditButton
              autoInsertSpace={false}
              size="small"
              icon={null}
              recordItemId={record.id}
              resource="quota-templates"
              style={{
                color: '#FFFFFF',
                background: '#1FDB51',
              }}
            >
              {t('buttons.edit')}
            </EditButton>
          )}
          <Button
            type="default"
            size="small"
            icon={null}
            style={{
              color: '#FFFFFF',
              background: '#0161D3',
            }}
            onClick={() => {
              go({ to: '/quotas/create?templateId=' + record.id })
            }}
          >
            {t('quota_templates.list.createFromTemplate')}
          </Button>
          {(permission?.is_module_admin ||
            permission?.user?.id === record.author?.id) && (
            <DeleteButton
              autoInsertSpace={false}
              size="small"
              icon={null}
              recordItemId={record.id}
              resource="quota-templates"
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

  return (
    <>
      <Flex justify="end">
        <CreateButton
          icon={null}
          resource="quota-templates"
          type="primary"
          autoInsertSpace={false}
        >
          {t('quota_templates.button.create')}
        </CreateButton>
      </Flex>
      <br />
      <CommonTable
        {...tableProps}
        columns={columns}
        scroll={undefined}
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
        }}
      />
    </>
  )
}

export default QuotaTemplateTable

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
import { useUserStore } from '@stores/useUserStore'
import { PRIMARY } from '@utility/color'
import { Button, Flex, Space, Tooltip, Typography } from 'antd'
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
            hideText
            size="small"
            recordItemId={record.id}
            resource="quota-templates"
          />
          {(permission?.is_module_admin ||
            permission?.user?.id === record.author?.id) && (
            <EditButton
              hideText
              size="small"
              recordItemId={record.id}
              resource="quota-templates"
            />
          )}
          <Tooltip
            title={t('quota_templates.list.createFromTemplate')}
            color={PRIMARY}
          >
            <Button
              size="small"
              icon={<ReconciliationOutlined />}
              style={{ color: PRIMARY, borderColor: PRIMARY }}
              onClick={() => {
                go({
                  to: '/quotas/create?templateId=' + record.id,
                })
              }}
            />
          </Tooltip>
          {(permission?.is_module_admin ||
            permission?.user?.id === record.author?.id) && (
            <DeleteButton
              hideText
              size="small"
              recordItemId={record.id}
              resource="quota-templates"
            />
          )}
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

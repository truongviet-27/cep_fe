/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DeleteButton,
  EditButton,
  ShowButton,
  useForm,
  useSelect,
} from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { Link, useTable, useTranslate } from '@refinedev/core'
import { GREY, PRIMARY } from '@utility/color'
import { Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo } from 'react'

function useApprove() {
  const t = useTranslate()
  const methods = useForm()

  const {} = useTable({})

  const { selectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: {
      mode: 'off',
    },
  })

  const columns = useMemo(() => {
    return [
      {
        key: 'code',
        dataIndex: 'code',
        title: 'ルートコード',
        render: (value, record) => {
          return <Link to={`/approve/show/${record.id}`}>{value}</Link>
        },
      },
      {
        key: 'name',
        dataIndex: 'name',
        title: 'ルート名',
      },
      {
        key: 'department',
        dataIndex: 'department',
        title: '部門（支社/部/課）',
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: 'ステータス',
        render: (value) => {
          if (value === 'active')
            return <Tag color={PRIMARY}>{t('products.text.active')}</Tag>
          return <Tag color={GREY}>{t('products.text.inactive')}</Tag>
        },
      },
      {
        key: 'steps',
        dataIndex: 'steps',
        title: '承認ステップ数',
      },
      {
        key: 'creator',
        dataIndex: 'creator',
        title: '作成者',
      },
      {
        key: 'updatedAt',
        dataIndex: 'updatedAt',
        title: '最終更新日',
      },
      {
        key: 'action',
        dataIndex: 'action',
        title: '操作',
        render: (_: any, record: BaseRecord) => {
          return (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )
        },
      },
    ] as ColumnsType
  }, [t])

  const dataSource = [
    {
      id: '1',
      code: 'APR001',
      name: '共通ルート',
      department: '技術部, 販売部, ABC会社, …',
      status: 'active',
      steps: 2,
      creator: '山田',
      updatedAt: '2024/12/15',
    },
    {
      id: '2',
      code: 'APR002',
      name: '管理部承認ルート',
      department: 'マーケティング部',
      status: 'active',
      steps: 1,
      creator: '山田',
      updatedAt: '2024/12/15',
    },
    {
      id: '3',
      code: 'APR003',
      name: '会計部承認ルート',
      department: '会計部',
      status: 'inactive',
      steps: 2,
      creator: '山田',
      updatedAt: '2024/12/15',
    },
    {
      id: '4',
      code: 'APR004',
      name: '購買部承認ルート',
      department: '購買部',
      status: 'inactive',
      steps: 1,
      creator: '山田',
      updatedAt: '2024/12/15',
    },
  ]

  return [{ methods, columns, dataSource, selectProps }, { t }] as const
}

export default useApprove

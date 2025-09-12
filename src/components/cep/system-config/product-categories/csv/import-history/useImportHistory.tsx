import { useForm } from '@refinedev/antd'
import { useList, useTranslate } from '@refinedev/core'
import type { ColumnsType } from 'antd/es/table'
import type { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'

type Form = {
  search: string
  category: string
  subCategory: string
  code: string
  dateFrom: Dayjs
  dateTo: string
  updatedFrom: string
  updatedTo: string
}
function useImportHistory() {
  const t = useTranslate()
  const methods = useForm<Form>({
    defaultFormValues: {
      search: '',
      category: '',
      subCategory: '',
      code: '',
      dateFrom: '',
      dateTo: '',
      updatedFrom: '',
      updatedTo: '',
    },
  })

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const onChangePageSize = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }
  const {
    form: { getFieldsValue, getFieldValue, resetFields },
  } = methods

  const { data } = useList({
    resource: '',
    pagination: {
      current: page,
      pageSize,
    },
  })

  const columns = useMemo(() => {
    return [
      {
        key: 'taskCode',
        dataIndex: 'taskCode',
        title: 'タスクコード',
      },
      {
        key: 'status',
        title: 'ステータス',
        dataIndex: 'status',
      },
      {
        key: 'type',
        dataIndex: 'type',
        title: '類別',
      },
      {
        key: 'createdAt',
        dataIndex: 'createdAt',
        title: '登録日時',
      },
      {
        key: 'completedAt',
        dataIndex: 'completedAt',
        title: '完了日時',
      },
      {
        key: 'result',
        dataIndex: 'result',
        title: '結果',
      },
      {
        key: 'errorFile',
        dataIndex: 'errorFile',
        title: 'エラーファイル',
      },
    ] as ColumnsType
  }, [t])

  const dataSource = data?.data ?? [
    {
      taskCode: 'TASK001',
      status: 'Hoàn thành',
      type: 'Import',
      createdAt: '2025-09-01 10:00',
      completedAt: '2025-09-01 10:05',
      result: 'Thành công',
      errorFile: '-',
    },
    {
      taskCode: 'TASK002',
      status: 'Đang xử lý',
      type: 'Export',
      createdAt: '2025-09-02 14:20',
      completedAt: '',
      result: '',
      errorFile: '-',
    },
    {
      taskCode: 'TASK002',
      status: 'Đang xử lý',
      type: 'Export',
      createdAt: '2025-09-02 14:20',
      completedAt: '',
      result: '',
      errorFile: '-',
    },
    {
      taskCode: 'TASK002',
      status: 'Đang xử lý',
      type: 'Export',
      createdAt: '2025-09-02 14:20',
      completedAt: '',
      result: '',
      errorFile: '-',
    },
    {
      taskCode: 'TASK002',
      status: 'Đang xử lý',
      type: 'Export',
      createdAt: '2025-09-02 14:20',
      completedAt: '',
      result: '',
      errorFile: '-',
    },
    {
      taskCode: 'TASK002',
      status: 'Đang xử lý',
      type: 'Export',
      createdAt: '2025-09-02 14:20',
      completedAt: '',
      result: '',
      errorFile: '-',
    },
    {
      taskCode: 'TASK002',
      status: 'Đang xử lý',
      type: 'Export',
      createdAt: '2025-09-02 14:20',
      completedAt: '',
      result: '',
      errorFile: '-',
    },
    {
      taskCode: 'TASK002',
      status: 'Đang xử lý',
      type: 'Export',
      createdAt: '2025-09-02 14:20',
      completedAt: '',
      result: '',
      errorFile: '-',
    },
    {
      taskCode: 'TASK002',
      status: 'Đang xử lý',
      type: 'Export',
      createdAt: '2025-09-02 14:20',
      completedAt: '',
      result: '',
      errorFile: '-',
    },
    {
      taskCode: 'TASK002',
      status: 'Đang xử lý',
      type: 'Export',
      createdAt: '2025-09-02 14:20',
      completedAt: '',
      result: '',
      errorFile: '-',
    },
    {
      taskCode: 'TASK002',
      status: 'Đang xử lý',
      type: 'Export',
      createdAt: '2025-09-02 14:20',
      completedAt: '',
      result: '',
      errorFile: '-',
    },
  ]

  const onSubmit = () => {
    console.log(
      {
        ...getFieldsValue(),
        dateFrom: getFieldValue('dateFrom')?.format('YYYY-MM-DDTHH:mm:ssZ'),
      },
      'xxxxxxxxxxxxxxxx',
    )
  }

  const onReset = () => {
    resetFields()
    setPage(1)
  }
  return [
    {
      methods,
      columns,
      dataSource,
      isLoading: false,
      page,
      pageSize,
      total: data?.total,
    },
    { t, onSubmit, onChangePageSize, onReset },
  ] as const
}

export default useImportHistory

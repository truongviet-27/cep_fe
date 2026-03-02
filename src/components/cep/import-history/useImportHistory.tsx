/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTable } from '@refinedev/antd'
import type { CrudFilters } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import { GREEN, GREY_TAG, PRIMARY, RED, WARNING } from '@utility/color'
import { Button, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo } from 'react'

const { Text } = Typography

function useImportHistory() {
  const t = useTranslate()
  const { tableProps, searchFormProps, setFilters } = useTable({
    pagination: { pageSize: 20 },
    syncWithLocation: true,
    resource: 'csv-imports/history',
    onSearch: (data: any) => {
      const filters = [] as CrudFilters

      filters.push({
        field: 'common_name',
        operator: 'eq',
        value: data.common_name,
      })

      filters.push({
        field: 'status',
        operator: 'eq',
        value: data.status,
      })

      filters.push({
        field: 'id',
        operator: 'eq',
        value: data.id,
      })

      filters.push({
        field: 'created_by',
        operator: 'eq',
        value: data.created_by,
      })

      const [start, end] = data.date || []
      filters.push({
        field: 'start_date',
        operator: 'eq',
        value: start ? dayjs(start).format('YYYY-MM-DD') : undefined,
      })
      filters.push({
        field: 'end_date',
        operator: 'eq',
        value: end ? dayjs(end).format('YYYY-MM-DD') : undefined,
      })

      return filters
    },
  })

  const statusMap = useMemo(() => {
    return {
      PENDING: {
        color: GREY_TAG,
        text: t('import_history.text.status.PROCESSING'),
      },
      PROCESSING: {
        color: GREY_TAG,
        text: t('import_history.text.status.PROCESSING'),
      },
      COMPLETED: {
        color: GREEN,
        text: t('import_history.text.status.COMPLETED'),
      },
      ERROR: { color: WARNING, text: t('import_history.text.status.ERROR') },
      FAILED: { color: RED, text: t('import_history.text.status.FAILED') },
    } as Record<string, { color: string; text: string }>
  }, [t])

  const commonNameMap = useMemo(() => {
    return {
      PRODUCTS: {
        text: t('import_history.text.category.PRODUCTS'),
      },
      CATEGORY_PRODUCTS: {
        text: t('import_history.text.category.CATEGORY_PRODUCTS'),
      },
      CUSTOMERS: {
        text: t('import_history.text.category.CUSTOMERS'),
      },
      DEPARTMENTS: {
        text: t('import_history.text.category.DEPARTMENTS'),
      },
      OTHER: { text: t('import_history.text.category.OTHER') },
    } as Record<string, { text: string }>
  }, [t])

  const columns = useMemo(() => {
    return [
      {
        key: 'id',
        dataIndex: 'id',
        title: t('import_history.table.headers.taskCode'),
        width: '8%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (val: string) => (
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {val ?? '-'}
          </div>
        ),
      },
      {
        key: 'status',
        title: t('import_history.table.headers.status'),
        dataIndex: 'status',
        width: '8%',
        onCell: () => ({
          style: { padding: '2px 2px', overflow: 'hidden', minWidth: 0 },
        }),
        render(value: string) {
          const status = statusMap[value]
          return <Tag color={status.color}>{status.text}</Tag>
        },
      },
      {
        key: 'common_name',
        dataIndex: 'common_name',
        title: t('import_history.table.headers.type'),
        width: '11%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render(value: string) {
          const commonName = commonNameMap[value]
          return (
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {commonName?.text ?? value}
            </div>
          )
        },
      },
      {
        key: 'created_by',
        dataIndex: 'created_by',
        title: t('import_history.table.headers.creator'),
        width: '27%',
        onCell: () => ({
          style: {
            padding: '2px 2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }),
        render: (val: string) => (
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {val ?? '-'}
          </div>
        ),
      },
      {
        key: 'completedAt',
        dataIndex: 'completedAt',
        width: '11%',
        title: (
          <div className="flex flex-col">
            <Text
              style={{
                color: PRIMARY,
              }}
            >
              {t('import_history.table.headers.startDate')}
            </Text>
            <Text
              style={{
                color: PRIMARY,
              }}
            >
              {t('import_history.table.headers.endDate')}
            </Text>
          </div>
        ),
        onCell: () => ({
          style: { padding: '2px 2px', overflow: 'hidden', minWidth: 0 },
        }),
        render: (_: any, record: any) => (
          <div className="flex flex-col">
            <Text>
              {record?.start_time_import
                ? dayjs(record?.start_time_import).format('YYYY/MM/DD HH:mm')
                : ''}
            </Text>
            <Text>
              {record?.end_time_import
                ? dayjs(record?.end_time_import).format('YYYY/MM/DD HH:mm')
                : ''}
            </Text>
          </div>
        ),
      },
      {
        key: 'result',
        dataIndex: 'result',
        title: t('import_history.table.headers.result'),
        width: '14%',
        children: [
          {
            title: (
              <span style={{ color: 'green' }}>
                {t('import_history.table.headers.create')}
              </span>
            ),
            dataIndex: 'data_inserted',
            key: 'data_inserted',
            width: '7%',
            onCell: () => ({
              style: { padding: '2px 2px', overflow: 'hidden', minWidth: 0 },
            }),
          },
          {
            title: (
              <span style={{ color: 'red' }}>
                {t('import_history.table.headers.error')}
              </span>
            ),
            dataIndex: 'data_failed',
            key: 'data_failed',
            width: '7%',
            onCell: () => ({
              style: { padding: '2px 2px', overflow: 'hidden', minWidth: 0 },
            }),
          },
        ],
      },
      {
        key: 'dataCount',
        dataIndex: 'dataCount',
        title: t('import_history.table.headers.dataCount'),
        width: '7%',
        onCell: () => ({
          style: { padding: '2px 2px', overflow: 'hidden', minWidth: 0 },
        }),
        render(_, record) {
          return (
            <Text>
              {record?.data_inserted +
                record?.data_updated +
                record?.data_failed}
            </Text>
          )
        },
      },
      {
        key: 'url_file_failed',
        dataIndex: 'url_file_failed',
        title: t('import_history.table.headers.errorResult'),
        width: '14%',
        onCell: () => ({
          style: { padding: '2px 2px', overflow: 'hidden', minWidth: 0 },
        }),
        render(value, record) {
          if (record.status == 'PENDING') {
            return null
          }

          return record.status === 'COMPLETED' ? null : !value ||
            record.status === 'FAILED' ? (
            <Text
              style={{
                color: RED,
              }}
            >
              {t('import_history.text.error')}
            </Text>
          ) : (
            <Button
              color="primary"
              variant="outlined"
              onClick={() => {
                window.open(value, '_blank')
              }}
            >
              ダウンロード
            </Button>
          )
        },
      },
    ] as ColumnsType
  }, [t])

  const onSubmit = () => {}

  const onReset = () => {
    searchFormProps.form?.resetFields()
    setFilters([], 'replace')
  }
  return [
    {
      columns,
      tableProps,
      searchFormProps,
    },
    { t, onSubmit, onReset, setFilters },
  ] as const
}

export default useImportHistory

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTable } from '@refinedev/antd'
import type { CrudFilters } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import { GREEN, GREY_TAG, PRIMARY, RED } from '@utility/color'
import { Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo } from 'react'

const { Text } = Typography

function useImportHistory() {
  const t = useTranslate()

  const { tableProps, searchFormProps, setFilters } = useTable({
    syncWithLocation: true,
    resource: 'csv-imports/history',
    onSearch: (data: any) => {
      setFilters([], 'replace')
      const filters = [] as CrudFilters
      if (data.common_name) {
        filters.push({
          field: 'common_name',
          operator: 'eq',
          value: data.common_name,
        })
      }

      if (data.status) {
        filters.push({
          field: 'status',
          operator: 'eq',
          value: data.status,
        })
      }

      if (data.id) {
        filters.push({
          field: 'id',
          operator: 'eq',
          value: data.id,
        })
      }

      if (data.created_by) {
        filters.push({
          field: 'created_by',
          operator: 'eq',
          value: data.created_by,
        })
      }
      if (data.date) {
        const [start, end] = data.date
        filters.push({
          field: 'start_date',
          operator: 'eq',
          value: dayjs(start).format('YYYY-MM-DD'),
        })
        filters.push({
          field: 'end_date',
          operator: 'eq',
          value: dayjs(end).format('YYYY-MM-DD'),
        })
      }

      return filters
    },
  })

  const statusMap = useMemo(() => {
    return {
      PENDING: {
        color: GREY_TAG,
        text: t('import_history.text.status.PENDING'),
      },
      PROCESSING: {
        color: GREEN,
        text: t('import_history.text.status.PROCESSING'),
      },
      COMPLETED: {
        color: GREEN,
        text: t('import_history.text.status.COMPLETED'),
      },
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
      },
      {
        key: 'status',
        title: t('import_history.table.headers.status'),
        dataIndex: 'status',
        render(value: string) {
          const status = statusMap[value]
          return <Tag color={status.color}>{status.text}</Tag>
        },
      },
      {
        key: 'common_name',
        dataIndex: 'common_name',
        title: t('import_history.table.headers.type'),
        render(value: string) {
          const commonName = commonNameMap[value]
          return <Text>{commonName.text}</Text>
        },
      },
      {
        key: 'created_by',
        dataIndex: 'created_by',
        title: t('import_history.table.headers.creator'),
      },
      {
        key: 'completedAt',
        dataIndex: 'completedAt',
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
        render: (_: any, record: any) => (
          <div className="flex flex-col">
            <Text>
              {record?.start_time_import &&
                dayjs(record?.start_time_import).format('YYYY/MM/DD HH:MM:ss')}
            </Text>
            <Text>
              {record?.end_time_import &&
                dayjs(record?.end_time_import).format('YYYY/MM/DD HH:MM:ss')}
            </Text>
          </div>
        ),
      },
      {
        key: 'result',
        dataIndex: 'result',
        title: t('import_history.table.headers.result'),
        children: [
          {
            title: (
              <span style={{ color: 'green' }}>
                {t('import_history.table.headers.create')}
              </span>
            ),
            dataIndex: 'data_inserted',
            key: 'data_inserted',
          },
          {
            title: (
              <span style={{ color: 'orange' }}>
                {t('import_history.table.headers.update')}
              </span>
            ),
            dataIndex: 'data_updated',
            key: 'data_updated',
          },
          {
            title: (
              <span style={{ color: 'red' }}>
                {t('import_history.table.headers.error')}
              </span>
            ),
            dataIndex: 'data_failed',
            key: 'data_failed',
          },
        ],
      },
      {
        key: 'dataCount',
        dataIndex: 'dataCount',
        title: t('import_history.table.headers.dataCount'),
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
        key: 'errorFile',
        dataIndex: 'errorFile',
        title: t('import_history.table.headers.errorResult'),
        render(value) {
          return (
            value ?? (
              <Text
                style={{
                  color: RED,
                }}
              >
                {t('import_history.text.error')}
              </Text>
            )
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

import { EditableCell } from '@components/common/table/editable-cell'
import { PRIMARY } from '@utility/color'
import type { TableProps } from 'antd'
import { Table } from 'antd'
import { has } from 'lodash'
import React from 'react'

export type CustomTableProps<T> = TableProps<T>

function CommonTable<T extends object>(
  tableProps: Readonly<CustomTableProps<T>>,
): React.ReactElement {
  const { components, ...restTableProps } = tableProps

  const isPaging = has(restTableProps.pagination, 'total')

  return (
    <Table<T>
      {...restTableProps}
      components={{
        ...components,
        header: {
          cell: (
            props: React.JSX.IntrinsicAttributes &
              React.ClassAttributes<HTMLTableHeaderCellElement> &
              React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
          ) => (
            <th
              {...props}
              style={{
                backgroundColor: '#F0F9FF',
                color: PRIMARY,
                textAlign: 'center',
                padding: 11,
                ...props.style,
              }}
            />
          ),
          ...components?.header,
        },
        body: {
          cell: EditableCell,
          ...components?.body,
        },
      }}
      bordered
      pagination={
        isPaging
          ? {
              defaultPageSize: 20,
              pageSizeOptions: ['20', '50', '100'],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} / ${total}件`,
              showSizeChanger: true,
              ...restTableProps.pagination,
            }
          : restTableProps.pagination
      }
      scroll={restTableProps.scroll ?? { x: 'max-content' }}
    />
  )
}

export default CommonTable

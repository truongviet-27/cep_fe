import { EditableCell } from '@components/common/table/editable-cell'
import { PRIMARY } from '@utility/color'
import type { TableProps } from 'antd'
import { Table } from 'antd'
import { has } from 'lodash'
import React from 'react'

export type CustomTableProps<T> = TableProps<T>

const customTableComponent = (
  props: React.HTMLAttributes<HTMLTableElement>,
) => (
  <table
    {...props}
    style={{
      ...props.style,
      tableLayout: 'fixed',
      width: '100%',
      maxWidth: '100%',
    }}
  />
)

const customHeaderCell = (
  props: React.JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLTableHeaderCellElement> &
    React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
) => (
  <th
    {...props}
    style={{
      border: 'none',
      padding: '4px 2px',
      backgroundColor: '#F0F9FF',
      color: PRIMARY,
      textAlign: 'center',
      overflow: 'hidden',
      minWidth: 0,
      ...props.style,
    }}
  />
)

function CommonTable<T extends object>(
  tableProps: Readonly<CustomTableProps<T>>,
): React.ReactElement {
  const { components, ...restTableProps } = tableProps

  const isPaging = has(restTableProps.pagination, 'total')

  const mergedComponents = {
    ...components,
    table: customTableComponent,
    header: {
      cell: customHeaderCell,
      ...components?.header,
    },
    body: {
      cell: EditableCell,
      ...components?.body,
    },
  }

  return (
    <Table<T>
      {...restTableProps}
      components={mergedComponents}
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
      scroll={restTableProps.scroll}
    />
  )
}

export default CommonTable

import { EditableCell } from '@components/common/table/editable-cell'
import { PRIMARY } from '@utility/color'
import type { TableProps } from 'antd'
import { Table } from 'antd'
import { has } from 'lodash'
import React from 'react'

type CustomTableProps<T> = TableProps<T>

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
          ...components?.header,
          cell: (
            props: React.JSX.IntrinsicAttributes &
              React.ClassAttributes<HTMLTableHeaderCellElement> &
              React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
          ) => (
            <th
              {...props}
              style={{
                ...props.style,
                backgroundColor: '#F0F9FF',
                color: PRIMARY,
                textAlign: 'center',
                padding: 11,
              }}
            />
          ),
        },
        body: {
          ...components?.body,
          cell: EditableCell,
        },
      }}
      bordered
      pagination={
        isPaging
          ? {
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} / ${total}件`,
              showSizeChanger: true,
              ...restTableProps.pagination,
            }
          : restTableProps.pagination
      }
      scroll={{ x: 'max-content' }}
    />
  )
}

export default CommonTable

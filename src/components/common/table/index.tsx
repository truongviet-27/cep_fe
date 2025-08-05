import type { TableProps } from 'antd'
import { Table } from 'antd'
import React from 'react'

function CommonTable<T extends object>(
  tableProps: TableProps<T>,
): React.ReactElement {
  const { components, ...restTableProps } = tableProps

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
              style={{ ...props.style, backgroundColor: '#e6f7ff' }}
            />
          ),
        },
      }}
    />
  )
}

export default CommonTable

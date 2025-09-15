import { PRIMARY } from '@utility/color'
import type { TableProps } from 'antd'
import { Table } from 'antd'
import React from 'react'

function CommonTable<T extends object>(
  tableProps: Readonly<TableProps<T>>,
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
              style={{
                ...props.style,
                backgroundColor: '#e6f7ff',
                color: PRIMARY,
              }}
            />
          ),
        },
      }}
      pagination={{
        ...restTableProps.pagination,
        showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}件`,
      }}
      scroll={{ x: 'max-content' }}
    />
  )
}

export default CommonTable

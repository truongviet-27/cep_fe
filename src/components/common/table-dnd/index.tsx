'use client'

import { HolderOutlined } from '@ant-design/icons'
import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { PRIMARY } from '@utility/color'
import type { TableColumnsType, TableProps } from 'antd'
import { Button, Table } from 'antd'
import React, { useContext, useMemo } from 'react'

export type SortableListeners = ReturnType<typeof useSortable>['listeners']

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void
  listeners?: SortableListeners
}
const RowContext = React.createContext<RowContextProps>({})

export const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext)
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: 'move' }}
      ref={setActivatorNodeRef}
      {...(listeners ?? {})}
    />
  )
}

interface DndRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}
const DndRow: React.FC<DndRowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props['data-row-key'] })

  const style: React.CSSProperties = {
    ...props.style,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 1 } : {}),
  }

  return (
    <RowContext.Provider value={{ setActivatorNodeRef, listeners }}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  )
}

export type KeyGetter<T> = (row: T) => string

export interface TableDndProps<T extends object> {
  dataSource: T[]
  columns: TableColumnsType<T>
  getRowId: KeyGetter<T>
  onDragEnd?: (activeId: string, overId: string | null) => void
  dragHandleColumn?: { width?: number; align?: 'left' | 'center' | 'right' }
  tableProps?: Omit<
    TableProps<T>,
    'dataSource' | 'columns' | 'rowKey' | 'components'
  >
}

function toItems<T extends object>(
  rows: T[],
  getRowId: KeyGetter<T>,
): string[] {
  return rows.map((r) => getRowId(r))
}
export default function TableDnd<T extends object>(
  props: Readonly<TableDndProps<T>>,
) {
  const {
    dataSource,
    columns,
    getRowId,
    onDragEnd,
    dragHandleColumn,
    tableProps,
  } = props

  const items = useMemo(
    () => toItems(dataSource, getRowId),
    [dataSource, getRowId],
  )

  const injectedColumns: TableColumnsType<T> = useMemo(() => {
    const handleCol = {
      key: '__drag__',
      width: dragHandleColumn?.width ?? 56,
      align: dragHandleColumn?.align ?? 'center',
      render: () => <DragHandle />,
    }
    return [handleCol, ...columns]
  }, [columns, dragHandleColumn])

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return
    const activeId = String(active.id)
    const overId = String(over.id)
    if (activeId === overId) return
    onDragEnd?.(activeId, overId)
  }

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <Table<T>
          components={{
            body: { row: DndRow },
            header: {
              cell: (
                props: React.JSX.IntrinsicAttributes &
                  React.ClassAttributes<HTMLTableHeaderCellElement> &
                  React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
              ) => (
                <th
                  {...props}
                  style={{
                    backgroundColor: '#e6f7ff',
                    color: PRIMARY,
                  }}
                />
              ),
            },
          }}
          rowKey={(record) => getRowId(record)}
          columns={injectedColumns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: 'max-content' }}
          {...tableProps}
        />
      </SortableContext>
    </DndContext>
  )
}

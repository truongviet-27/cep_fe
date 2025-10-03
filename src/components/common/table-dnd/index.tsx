/* eslint-disable */
'use client'

import { HolderOutlined } from '@ant-design/icons'
import type { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'
import { DndContext, DragOverlay, MeasuringStrategy } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { TableColumnsType, TableProps } from 'antd'
import { Button } from 'antd'
import React, { useContext, useMemo } from 'react'
import CommonTable from '@components/common/table'
import { CSS } from '@dnd-kit/utilities'

type SortableListeners = ReturnType<typeof useSortable>['listeners']

const RowCtx = React.createContext<{
  setActivatorNodeRef?: (el: HTMLElement | null) => void
  listeners?: SortableListeners
}>({})

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowCtx)
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
  } = useSortable({
    id: props['data-row-key'],
    animateLayoutChanges: () => false,
  })

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    willChange: 'transform',
  }

  return (
    <RowCtx.Provider value={{ setActivatorNodeRef, listeners }}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowCtx.Provider>
  )
}

export interface TableDndProps<T extends object> {
  dataSource: T[]
  columns: TableColumnsType<T>
  getRowId: (row: T) => string
  onDragEnd?: (activeId: string, overId: string | null) => void
  tableProps?: TableProps<any>
}

export default function TableDnd<T extends object>({
  dataSource,
  columns,
  getRowId,
  onDragEnd,
  tableProps,
}: Readonly<TableDndProps<T>>) {
  const items = useMemo<UniqueIdentifier[]>(
    () => dataSource.map(getRowId),
    [dataSource, getRowId],
  )

  const injectedColumns: TableColumnsType<T> = useMemo(() => {
    const handleCol = {
      key: '__drag__',
      width: 56,
      align: 'center' as const,
      render: () => <DragHandle />,
    }
    return [handleCol, ...columns]
  }, [columns])

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const a = String(active?.id ?? '')
    const o = over ? String(over.id) : null
    if (!o || a === o) return
    onDragEnd?.(a, o)
  }

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <CommonTable<T>
          {...tableProps}
          components={{
            body: {
              row: DndRow,
            },
          }}
          rowKey={getRowId}
          columns={injectedColumns}
          dataSource={dataSource}
          tableLayout="fixed"
          scroll={{ x: 'max-content' }}
        />
      </SortableContext>

      <DragOverlay dropAnimation={null} />
    </DndContext>
  )
}

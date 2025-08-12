'use client'

import {
  DeleteOutlined,
  EditOutlined,
  MenuOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import type { ITree } from '@interfaces/tree'
import { updateNode } from '@utility/tree-infinity'
import { Button, Collapse, Space, Tooltip, Typography } from 'antd'
import clsx from 'clsx'
import dynamic from 'next/dynamic'

const ReactSortable = dynamic(
  () => import('react-sortablejs').then((m) => m.ReactSortable),
  { ssr: false },
)

type Props = {
  list: ITree[]
  setList: (next: ITree[]) => void
  openSet: Set<string>
  setOpenSet: (updater: (s: Set<string>) => Set<string>) => void
  isRoot?: boolean
  edit: (id: string) => void
  remove: (id: string) => void
  addChild: (id: string) => void
}

const { Text } = Typography

/* ---------- Row title (trái) ---------- */
function RowTitle({ item }: { item: ITree }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="drag-handle cursor-grab text-slate-300 hover:text-slate-400">
        <MenuOutlined />
      </span>
      <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
        公開
      </span>
      <Text className="truncate font-medium">{item.name}</Text>
      <Text type="secondary" className="shrink-0 text-xs">
        ID:{item.id}
      </Text>
    </div>
  )
}

/* ---------- Row actions (phải) ---------- */
function RowActions({
  onEdit,
  onDelete,
  onAddChild,
  rightTag,
}: {
  onEdit: () => void
  onDelete: () => void
  onAddChild: () => void
  rightTag?: React.ReactNode
}) {
  return (
    <Space
      size="small"
      className="no-drag" // tránh drag khi click
      onClick={(e) => e.stopPropagation()} // tránh toggle collapse
    >
      <Tooltip title="編集">
        <Button
          size="small"
          type="text"
          icon={<EditOutlined />}
          onClick={onEdit}
        />
      </Tooltip>
      <Tooltip title="削除">
        <Button
          size="small"
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={onDelete}
        />
      </Tooltip>
      <Button
        size="small"
        type="text"
        icon={<PlusOutlined />}
        onClick={onAddChild}
      >
        サブカテゴリを追加
      </Button>
      {rightTag}
    </Space>
  )
}

/* ---------- TreeSortable (đệ quy) ---------- */
export default function TreeSortable({
  list,
  setList,
  openSet,
  setOpenSet,
  isRoot = false,
  edit,
  remove,
  addChild,
}: Props) {
  return (
    <ReactSortable
      list={list}
      setList={setList}
      handle=".drag-handle"
      filter=".no-drag"
      preventOnFilter={false}
      animation={200}
      easing="cubic-bezier(.2,0,0,1)"
      ghostClass="opacity-50"
      fallbackOnBody
      swapThreshold={0.65}
    >
      {list.map((it) => {
        const hasChildren = !!it.children?.length
        const isOpen = hasChildren && openSet.has(it.id)

        // header trái/phải dùng cho cả branch & leaf
        const label = <RowTitle item={it} />
        const extra = (
          <RowActions
            onEdit={() => edit(it.id)}
            onDelete={() => remove(it.id)}
            onAddChild={() => addChild(it.id)}
            rightTag={
              !isRoot && (
                <Text type="secondary" className="text-xs">
                  子
                </Text>
              )
            }
          />
        )

        return (
          <div
            key={it.id}
            className={clsx(
              'mb-2 rounded-lg border',
              hasChildren
                ? 'border-indigo-100 bg-white shadow-[0_1px_0_#EEF2FF]'
                : 'border-slate-100 bg-[#fbfcff]',
            )}
          >
            {hasChildren ? (
              <Collapse
                bordered={false}
                className="rounded-lg"
                items={[
                  {
                    key: it.id,
                    label,
                    extra, // action đứng riêng → click không ảnh hưởng collapse
                    children: (
                      <div className="ml-8">
                        <TreeSortable
                          list={it.children!}
                          setList={(next) =>
                            setList(
                              updateNode(list, it.id, (c) => {
                                c.children = next
                              }),
                            )
                          }
                          openSet={openSet}
                          setOpenSet={setOpenSet}
                          edit={edit}
                          remove={remove}
                          addChild={addChild}
                        />
                      </div>
                    ),
                    showArrow: true,
                  },
                ]}
                activeKey={isOpen ? [it.id] : []}
                onChange={(keys) =>
                  setOpenSet((prev) => {
                    const s = new Set(prev)
                    const open = (keys as string[]).includes(it.id)
                    if (open) {
                      s.add(it.id)
                    } else {
                      s.delete(it.id)
                    }
                    return s
                  })
                }
                expandIconPosition="end"
                collapsible="icon"
              />
            ) : (
              <div className="flex items-center justify-between px-3 py-2">
                {label}
                {extra}
              </div>
            )}
          </div>
        )
      })}
    </ReactSortable>
  )
}

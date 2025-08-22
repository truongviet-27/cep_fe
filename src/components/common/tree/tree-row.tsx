import { DownOutlined } from '@ant-design/icons'
import { CommonButton } from '@components/common/common-button'
import type { ITree } from '@interfaces/tree'
import { TextField } from '@refinedev/antd'
import { useDelete, useResource } from '@refinedev/core'
import { Space, Tag, Typography } from 'antd'
import React from 'react'

const { Text } = Typography

type Props = {
  cat: ITree
  hasChildren: boolean
  onToggle: (id: string) => void
  onAddChild: (id: string) => void
  onEdit: (id: string) => void
  // onDelete: (id: string) => void
  tag: string
  canAddChild?: boolean
}

const TreeRow: React.FC<Props> = ({
  cat,
  hasChildren,
  onToggle,
  onEdit,
  canAddChild,
  tag,
}) => {
  const border = 'border-zinc-200'
  const hover = 'hover:bg-zinc-50'

  const { mutate } = useDelete()
  const { resource } = useResource()

  const handleDelete = (id: string) =>
    mutate({
      resource: resource?.name ?? 'default',
      id,
    })

  return (
    <div className="mb-2">
      <div
        className={`relative rounded-xl border ${border} bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] ${hover} transition-colors`}
      >
        <div className="flex items-center gap-3 px-3 py-2">
          <Space size={8} className="min-w-0 flex-1">
            <Tag
              color="blue-inverse"
              className="m-0 rounded-md px-2 py-0.5 text-[14px] font-medium"
            >
              {tag}
            </Tag>

            <TextField className="truncate font-medium" value={cat.name} />

            <Text className="truncate font-medium">{cat.name}</Text>
            {cat.code && (
              <Text type="secondary" className="truncate">
                ID:{cat.code}
              </Text>
            )}
          </Space>

          <Space size={12} className="text-zinc-400">
            <CommonButton type={'edit'} onClick={() => onEdit(cat.id)} />

            <CommonButton
              type={'delete'}
              onClick={() => handleDelete(cat.id)}
            />

            <CommonButton
              type={'add'}
              onClick={() => handleDelete(cat.id)}
              style={{
                visibility: canAddChild ? 'initial' : 'hidden',
              }}
            />

            <button
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${
                hasChildren ? '' : 'pointer-events-none opacity-0'
              }`}
              onClick={() => onToggle(cat.id)}
              aria-label="toggle"
              type="button"
            >
              <DownOutlined
                className={`transition-transform ${
                  cat.open ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default TreeRow

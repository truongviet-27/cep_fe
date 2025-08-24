import { DownOutlined } from '@ant-design/icons'
import { CommonButton } from '@components/common/common-button'
import type { ITree } from '@interfaces/tree'
import { DeleteButton } from '@refinedev/antd'
import { Button, Input, Space, Tag, Typography } from 'antd'
import React from 'react'

const { Text } = Typography

type Props = {
  cat: ITree
  hasChildren: boolean
  onToggle: (id: string) => void
  onAddChild: (id: string) => void
  onStartEdit: (id: string) => void
  onChangeName: (id: string, name: string) => void
  onSave: (id: string) => void
  onCancel: (id: string) => void
  editingName?: string
  saving?: boolean

  tag: string
  canAddChild?: boolean
}

const TreeRow: React.FC<Props> = ({
  cat,
  hasChildren,
  onToggle,
  onStartEdit,
  onChangeName,
  onSave,
  onCancel,
  canAddChild,
  tag,
  onAddChild,
  editingName,
  saving,
}) => {
  const border = 'border-zinc-200'
  const hover = 'hover:bg-zinc-50'

  const isEditing = typeof editingName === 'string' && cat.id !== undefined

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

            {isEditing ? (
              <Input
                size="middle"
                value={editingName}
                onChange={(e) => onChangeName(cat.id, e.target.value)}
                onPressEnter={() => onSave(cat.id)}
                className="min-w-[420px]"
              />
            ) : (
              <Text className="truncate font-medium">{cat.name}</Text>
            )}

            {cat.code && !isEditing && (
              <Text type="secondary" className="truncate">
                ID:{cat.code}
              </Text>
            )}
          </Space>

          <Space size={12} className="text-zinc-400">
            {isEditing ? (
              <>
                <Button
                  type="primary"
                  size="small"
                  loading={!!saving}
                  onClick={() => onSave(cat.id)}
                >
                  保存
                </Button>
                <Button size="small" onClick={() => onCancel(cat.id)}>
                  キャンセル
                </Button>
              </>
            ) : (
              <Button
                type="link"
                size="small"
                onClick={() => onStartEdit(cat.id)}
              >
                編集
              </Button>
            )}

            <CommonButton
              type={'add'}
              onClick={() => onAddChild(cat.id)}
              style={{ visibility: canAddChild ? 'initial' : 'hidden' }}
            />

            <DeleteButton icon={null} recordItemId={cat.id} />

            <button
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${
                hasChildren ? '' : 'pointer-events-none opacity-0'
              }`}
              onClick={() => onToggle(cat.id)}
              aria-label="toggle"
              type="button"
            >
              <DownOutlined
                className={`transition-transform ${cat.open ? 'rotate-0' : '-rotate-90'}`}
              />
            </button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default TreeRow

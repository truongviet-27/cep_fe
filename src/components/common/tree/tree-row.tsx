import { DownOutlined } from '@ant-design/icons'
import { CommonButton } from '@components/common/common-button'
import type { ITree } from '@interfaces/tree'
import { DeleteButton, EditButton } from '@refinedev/antd'
import { Button, Input, Space, Tag, Typography } from 'antd'
import React from 'react'

const { Text } = Typography

type Id = string | number

export type TreeRowProps = {
  cat: ITree
  hasChildren: boolean
  onToggle: (id: Id) => void
  onAddChild: (id: Id) => void
  onStartEdit: (id: Id) => void
  onChangeName: (id: Id, name: string) => void
  onSave: (id: Id) => void
  onCancel: (id: Id) => void
  onDelete: () => void
  editingName?: string
  saving?: boolean
  canAddChild?: boolean
  /** Nhãn cấp độ hiển thị: 大 / 中 / 小 */
  tag: '大' | '中' | '小'
  /** Giới hạn độ sâu toàn cây (dùng cho aria/data attr, không đổi UI) */
  depth?: number
  /** Cấp hiện tại của row (dùng cho aria/data attr, không đổi UI) */
  level?: number
}

const TreeRow: React.FC<TreeRowProps> = ({
  cat,
  hasChildren,
  onToggle,
  onAddChild,
  onStartEdit,
  onChangeName,
  onSave,
  onCancel,
  onDelete,
  editingName,
  saving,
  canAddChild,
  tag,
  depth,
  level,
}) => {
  const isEditing = typeof editingName === 'string' && cat.id !== undefined

  return (
    <div
      data-tree-key={String(cat.id)}
      aria-level={level}
      data-depth={depth}
      className="flex items-center gap-3 rounded-md bg-white px-3 py-2 shadow-sm hover:shadow-md"
    >
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
              size="middle"
              loading={Boolean(saving)}
              onClick={() => onSave(cat.id)}
            >
              保存
            </Button>
            <Button size="middle" onClick={() => onCancel(cat.id)}>
              キャンセル
            </Button>
          </>
        ) : (
          <EditButton
            icon={null}
            size="middle"
            onClick={() => onStartEdit(cat.id)}
          >
            編集
          </EditButton>
        )}

        <CommonButton
          type="add"
          onClick={() => onAddChild(cat.id)}
          style={{ visibility: canAddChild ? 'initial' : 'hidden' }}
        />

        {typeof cat.id === 'number' ? (
          <DeleteButton icon={null} recordItemId={cat.id} />
        ) : (
          <CommonButton onClick={onDelete} type="delete" />
        )}

        <button
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${
            hasChildren ? '' : 'pointer-events-none opacity-0'
          }`}
          onClick={() => onToggle(cat.id)}
          aria-label="toggle"
          type="button"
        >
          <DownOutlined
            className={`transition-transform duration-200 ${cat.open ? 'rotate-0' : '-rotate-90'}`}
          />
        </button>
      </Space>
    </div>
  )
}

export default TreeRow

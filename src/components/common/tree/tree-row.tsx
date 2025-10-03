import {
  CloseOutlined,
  DownOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { CommonButton } from '@components/common/common-button'
import type { ITree } from '@interfaces/tree'
import { CreateButton, DeleteButton, EditButton } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import { Button, Input, Space, Tag, Typography } from 'antd'
import React, { useEffect, useState } from 'react'

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
  tag: string
  isNew?: boolean
  editingName?: string
  saving?: boolean
  canAddChild?: boolean
  depth?: number
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
  isNew,
}) => {
  const isEditing = typeof editingName === 'string' && cat.id !== undefined

  const t = useTranslate()

  const [localName, setLocalName] = useState(editingName || '')

  useEffect(() => {
    setLocalName(editingName || '')
  }, [editingName])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setLocalName(newName)
    onChangeName(cat.id, newName)
  }

  return (
    <div
      className="flex items-center gap-3 rounded-md bg-white px-3 py-2"
      onClick={(e) => {
        e.stopPropagation()
        onToggle(cat.id)
      }}
    >
      <Space size={8} className="min-w-0 flex-1">
        <Tag
          color="blue-inverse"
          className="m-0 rounded-md px-2 py-0.5 text-[14px] font-medium"
        >
          {tag}
        </Tag>

        {isEditing ? (
          // THAY ĐỔI 3: Input giờ sẽ dùng state đệm
          <Input
            size="middle"
            value={localName}
            onChange={handleChange}
            onPressEnter={() => onSave(cat.id)}
            allowClear
            className="min-w-[320px]"
            autoFocus
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

      <Space size={12}>
        {isEditing ? (
          <>
            <Button
              type="default"
              size="middle"
              loading={Boolean(saving)}
              onClick={() => onSave(cat.id)}
              icon={<SaveOutlined />}
            />
            <Button
              size="middle"
              onClick={() => (isNew ? onDelete() : onCancel(cat.id))}
              icon={<CloseOutlined />}
            />
          </>
        ) : (
          <EditButton
            hideText
            size="middle"
            onClick={() => onStartEdit(cat.id)}
          />
        )}
        <CreateButton
          hideText
          size="middle"
          onClick={() => onAddChild(cat.id)}
          icon={<PlusOutlined />}
          style={{ visibility: canAddChild ? 'initial' : 'hidden' }}
          type={'default'}
        />
        {/* <CommonButton
          hideText
          type="add"
          disabled={isNew}
          onClick={() => onAddChild(cat.id)}
          style={{ visibility: canAddChild ? 'initial' : 'hidden' }}
        /> */}

        {typeof cat.id === 'number' ? (
          <DeleteButton
            hideText
            recordItemId={cat.id}
            confirmTitle={
              hasChildren ? t('buttons.confirm_delete_parent') : undefined
            }
          />
        ) : (
          <CommonButton hideText onClick={onDelete} type="delete" />
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
            className={`transition-transform duration-200 ${
              cat.open ? 'rotate-0' : '-rotate-90'
            }`}
          />
        </button>
      </Space>
    </div>
  )
}

export default TreeRow

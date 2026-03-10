import { DownOutlined } from '@ant-design/icons'
import type { CatNode } from '@interfaces/tree'
import { CreateButton, DeleteButton, EditButton } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import type { PermissionEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import type { FormInstance } from 'antd'
import { Button, Form, Input, Space, Tag, Tooltip, Typography } from 'antd'
import React from 'react'

const { Text } = Typography

type Id = string | number

export type TreeRowProps = {
  cat: CatNode
  hasChildren: boolean
  childrenCount?: number
  onToggle: (id: Id) => void
  onAddChild: (id: Id) => void
  onStartEdit: (id: Id) => void
  onSave: (id: Id) => void
  onCancel: (id: Id) => void
  onDelete: () => void
  tag: string
  formFields: FormInstance
  isNew?: boolean
  editingName?: string
  saving?: boolean
  canAddChild?: boolean
  depth?: number
  level?: number
  hasChildEditing?: boolean
  permissionEnum?: PermissionEnum
}

const TreeRow: React.FC<TreeRowProps> = ({
  cat,
  hasChildren,
  childrenCount,
  onToggle,
  onAddChild,
  onStartEdit,
  onSave,
  onCancel,
  onDelete,
  editingName,
  saving,
  canAddChild,
  tag,
  isNew,
  formFields,
  hasChildEditing = false,
  permissionEnum,
}) => {
  const isEditing = typeof editingName === 'string' && cat.id !== undefined

  const t = useTranslate()
  const { hasFullAccessModule } = useUserStore.getState()
  const isFullAccess = permissionEnum
    ? hasFullAccessModule(permissionEnum)
    : true

  const localName = Form.useWatch(cat.id, formFields)

  return (
    <div className="flex items-center gap-3 rounded-md bg-white px-3 py-2">
      <Space
        size={8}
        className="min-w-0 flex-1"
        onClick={(event) => {
          event.stopPropagation()
          onToggle(cat.id)
        }}
      >
        <Tag
          color="blue-inverse"
          className="m-0 rounded-md px-2 py-0.5 text-[14px] font-medium"
        >
          {tag}
        </Tag>

        {isEditing ? (
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()} // Thêm cái này để chắc chắn chặn cả hành vi focus/drag
          >
            <Form
              form={formFields}
              initialValues={{
                [cat.id]: null,
              }}
            >
              <Form.Item
                className={'!h-3'}
                name={cat.id}
                validateTrigger="onBlur"
                rules={[{ required: true, message: '' }]}
              >
                <Input
                  size="middle"
                  onPressEnter={() => onSave(cat.id)}
                  allowClear
                  className="min-w-[320px]"
                  autoFocus
                />
              </Form.Item>
            </Form>
          </div>
        ) : (
          <Tooltip title={cat.name} mouseEnterDelay={0.5}>
            <Text className="block max-w-[300px] truncate font-medium">
              {cat.name}
              {Number(childrenCount) > 0 && (
                <span className="ml-2">({childrenCount})</span>
              )}
            </Text>
          </Tooltip>
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
              size="small"
              loading={saving}
              onClick={() => onSave(cat.id)}
              icon={null}
              disabled={!localName}
              style={{
                color: '#FFFFFF',
                background: '#1FDB51',
              }}
            >
              {t('buttons.save')}
            </Button>
            <Button
              size="small"
              onClick={() => (isNew ? onDelete() : onCancel(cat.id))}
              icon={null}
            >
              {t('buttons.cancel')}
            </Button>
          </>
        ) : (
          <EditButton
            autoInsertSpace={false}
            size="small"
            icon={null}
            resource="product-categories"
            onClick={() => onStartEdit(cat.id)}
            disabled={hasChildEditing || !isFullAccess}
            style={{
              color: '#FFFFFF',
              background: '#1FDB51',
            }}
          >
            {t('buttons.edit')}
          </EditButton>
        )}
        <CreateButton
          autoInsertSpace={false}
          size="small"
          onClick={() => onAddChild(cat.id)}
          icon={null}
          style={{
            visibility: canAddChild ? 'initial' : 'hidden',
            color: '#2784FF',
            borderColor: '#2784FF',
          }}
          type="default"
          disabled={isNew || isEditing || !isFullAccess}
        >
          {t('buttons.create_new')}
        </CreateButton>

        {!cat?._isNew ? (
          <DeleteButton
            autoInsertSpace={false}
            size="small"
            icon={null}
            resource="product-categories"
            recordItemId={cat.id}
            confirmTitle={
              hasChildren ? t('buttons.confirm_delete_parent') : undefined
            }
            invalidates={[]}
            onSuccess={onDelete}
            disabled={hasChildEditing || !isFullAccess}
            style={{
              color: '#FFFFFF',
              background: '#E74C3C',
            }}
          >
            {t('buttons.delete')}
          </DeleteButton>
        ) : (
          <Button
            size="small"
            icon={null}
            onClick={onDelete}
            style={{
              color: '#FFFFFF',
              background: '#E74C3C',
            }}
          >
            {t('buttons.delete')}
          </Button>
        )}

        <button
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${
            hasChildren ? '' : 'pointer-events-none opacity-0'
          }`}
          onClick={(e) => {
            e.stopPropagation()
            onToggle(cat.id)
          }}
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

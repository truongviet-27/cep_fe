'use client'

import {
  DeleteOutlined,
  EditOutlined,
  MenuOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import type { ITree } from '@interfaces/tree'
import { Button, Space, Tooltip, Typography } from 'antd'

const { Text } = Typography

type Props = {
  item: ITree
  onEdit: () => void
  onRemove: () => void
  onAddChild: () => void
  rightExtra?: React.ReactNode
}

export default function TreeHeader({
  item,
  onEdit,
  onRemove,
  onAddChild,
  rightExtra,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="drag-handle cursor-grab text-[#b4b9d9] hover:text-[#8f96c8]">
          <MenuOutlined />
        </span>
        <span className="rounded bg-[#eaf2ff] px-2 py-0.5 text-xs font-semibold text-[#4c7dff]">
          公開
        </span>
        <Text className="truncate font-medium">{item.name}</Text>
        <Text type="secondary" className="shrink-0 text-xs">
          ID:{item.id}
        </Text>
      </div>

      <Space size="small" className="shrink-0">
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
            danger
            type="text"
            icon={<DeleteOutlined />}
            onClick={onRemove}
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
        {rightExtra}
      </Space>
    </div>
  )
}

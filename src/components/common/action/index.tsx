import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  HistoryOutlined,
  ImportOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Button } from 'antd'

export type ActionType =
  | 'delete'
  | 'view'
  | 'edit'
  | 'append'
  | 'remove'
  | 'copy'
  | 'export'
  | 'import'
  | 'history'

type Props = {
  actionList: ActionType[]
  onDeleteAction?: () => void
  onEditAction?: () => void
  onViewAction?: () => void
  onAppendAction?: () => void
  onRemoveAction?: () => void
  onCopyAction?: () => void
  onExportAction?: () => void
  onImportAction?: () => void
}

export const Action = ({
  actionList,
  onDeleteAction,
  onEditAction,
  onViewAction,
  onAppendAction,
  onRemoveAction,
  onCopyAction,
  onExportAction,
  onImportAction,
}: Props) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {actionList.includes('view') && (
        <Button
          className="cursor-pointer"
          color="blue"
          variant="outlined"
          onClick={onViewAction}
          icon={
            <EyeOutlined
              style={{
                fontSize: 12,
              }}
            />
          }
        />
      )}

      {actionList.includes('edit') && (
        <Button
          className="cursor-pointer"
          color="blue"
          variant="outlined"
          onClick={onEditAction}
          icon={
            <EditOutlined
              style={{
                fontSize: 12,
              }}
            />
          }
        />
      )}

      {actionList.includes('delete') && (
        <Button
          onClick={onDeleteAction}
          icon={<DeleteOutlined />}
          style={{
            color: '#721c24',
            border: '1px solid #721c24',
          }}
          className="cursor-pointer hover:!opacity-70"
        />
      )}

      {actionList.includes('append') && (
        <Button
          className="cursor-pointer"
          color="blue"
          variant="outlined"
          onClick={onAppendAction}
          icon={
            <PlusOutlined
              style={{
                fontSize: 12,
              }}
            />
          }
        />
      )}

      {actionList.includes('remove') && (
        <Button
          className="cursor-pointer"
          color="red"
          variant="outlined"
          onClick={onRemoveAction}
          icon={
            <DeleteOutlined
              style={{
                fontSize: 12,
              }}
            />
          }
        />
      )}

      {actionList.includes('copy') && (
        <Button
          className="cursor-pointer"
          color="red"
          variant="outlined"
          onClick={onCopyAction}
          icon={<CopyOutlined />}
        />
      )}

      {actionList.includes('export') && (
        <Button
          className="cursor-pointer"
          color="red"
          variant="outlined"
          onClick={onExportAction}
          icon={<ExportOutlined />}
        />
      )}

      {actionList.includes('import') && (
        <Button
          className="cursor-pointer"
          color="red"
          variant="outlined"
          onClick={onImportAction}
          icon={<ImportOutlined />}
        />
      )}

      {actionList.includes('history') && (
        <Button
          className="cursor-pointer"
          color="red"
          variant="outlined"
          onClick={onExportAction}
          icon={<HistoryOutlined />}
        />
      )}
    </div>
  )
}

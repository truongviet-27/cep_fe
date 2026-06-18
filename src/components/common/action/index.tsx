import {
  CopyOutlined,
  ExportOutlined,
  HistoryOutlined,
  ImportOutlined,
} from '@ant-design/icons'
import {
  CloneButton,
  DeleteButton,
  EditButton,
  ShowButton,
} from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import { Button, Popover } from 'antd'
import React, { useState } from 'react'

export type ActionType =
  | 'delete'
  | 'view'
  | 'edit'
  | 'append'
  | 'onAppendFromMasterOrCreateNewAction'
  | 'remove'
  | 'copy'
  | 'export'
  | 'import'
  | 'history'

export type CreateProductType = 'create_new' | 'create_from_master'

type Props = {
  actionList: ActionType[]
  onDeleteAction?: () => void
  onEditAction?: () => void
  onViewAction?: () => void
  onAppendAction?: () => void
  onAppendFromMasterOrCreateNewAction?: (type: CreateProductType) => void
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
  onAppendFromMasterOrCreateNewAction,
  onRemoveAction,
  onCopyAction,
  onExportAction,
  onImportAction,
}: Props) => {
  const [open, setOpen] = useState(false)
  const t = useTranslate()
  const content = (
    <div style={{ width: 200 }}>
      <div
        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
        onClick={() => {
          setOpen(false)
          onAppendFromMasterOrCreateNewAction?.('create_from_master')
        }}
      >
        {t('products.createFromMaster')}
      </div>

      <div
        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
        onClick={() => {
          setOpen(false)
          onAppendFromMasterOrCreateNewAction?.('create_new')
        }}
      >
        {t('products.createNew')}
      </div>
    </div>
  )

  return (
    <div className="flex items-center justify-center gap-4">
      {actionList.includes('view') && (
        <ShowButton
          className="cursor-pointer"
          size="small"
          autoInsertSpace={false}
          onClick={onViewAction}
          style={{
            color: '#2784FF',
            borderColor: '#2784FF',
          }}
          icon={false}
        >
          {t('buttons.show')}
        </ShowButton>
      )}

      {actionList.includes('edit') && (
        <EditButton
          onClick={onEditAction}
          className="cursor-pointer"
          size="small"
          icon={null}
          autoInsertSpace={false}
          style={{
            color: '#FFFFFF',
            background: '#1FDB51',
            borderColor: '#1FDB51',
          }}
        >
          {t('buttons.edit')}
        </EditButton>
      )}

      {actionList.includes('delete') && (
        <DeleteButton
          className="cursor-pointer"
          size="small"
          onClick={onDeleteAction}
          autoInsertSpace={false}
          style={{
            color: '#FFFFFF',
            background: '#E74C3C',
          }}
          icon={false}
        >
          {t('buttons.delete')}
        </DeleteButton>
      )}

      {actionList.includes('onAppendFromMasterOrCreateNewAction') && (
        <Popover
          trigger="click"
          open={open}
          onOpenChange={setOpen}
          content={content}
          placement="bottomLeft"
        >
          <CloneButton
            className="cursor-pointer"
            size="small"
            type="primary"
            icon={false}
          >
            {t('buttons.add')}
          </CloneButton>
        </Popover>
      )}

      {actionList.includes('append') && (
        <CloneButton
          className="cursor-pointer"
          size="small"
          type="primary"
          autoInsertSpace={false}
          onClick={onAppendAction}
          icon={false}
        >
          {t('buttons.add')}
        </CloneButton>
      )}

      {actionList.includes('remove') && (
        <DeleteButton
          className="cursor-pointer"
          size="small"
          onClick={onRemoveAction}
          autoInsertSpace={false}
          style={{
            color: '#FFFFFF',
            background: '#E74C3C',
            borderColor: '#E74C3C',
          }}
          icon={false}
        >
          {t('buttons.delete')}
        </DeleteButton>
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

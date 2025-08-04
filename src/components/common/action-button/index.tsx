'use client'

import type { ActionButtonsProps } from '@interfaces/config'
import { Button } from 'antd'

export default function ActionButtons({
  onCancel,
  onSave,
  cancelText,
  saveText,
  loading = false,
}: Readonly<ActionButtonsProps>) {
  return (
    <div className="flex justify-end space-x-6">
      <Button
        size="large"
        className="pr-10"
        onClick={onCancel}
        disabled={loading}
      >
        {cancelText}
      </Button>
      &nbsp;&nbsp;
      <Button
        type="primary"
        size="large"
        className="px-8"
        onClick={onSave}
        loading={loading}
      >
        {saveText}
      </Button>
    </div>
  )
}

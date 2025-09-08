'use client'

import type { SaveButtonProps } from '@refinedev/antd'
import { Button } from 'antd'

type ActionButtonProps = {
  onCancel: () => void
  saveButtonProps: SaveButtonProps
  cancelText: string
  saveText: string
  loading?: boolean
}

export default function ActionButtons({
  onCancel,
  saveButtonProps,
  cancelText,
  saveText,
  loading = false,
}: Readonly<ActionButtonProps>) {
  return (
    <div className="flex justify-end space-x-6">
      <Button
        size="middle"
        className="pr-10"
        onClick={onCancel}
        disabled={loading}
      >
        {cancelText}
      </Button>
      &nbsp;&nbsp;
      <Button
        {...saveButtonProps}
        type="primary"
        size="middle"
        className="px-8"
      >
        {saveText}
      </Button>
    </div>
  )
}

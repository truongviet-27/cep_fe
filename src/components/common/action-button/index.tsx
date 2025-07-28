'use client'

import { Button } from 'antd'
import { ActionButtonsProps } from '@type/config'

export default function ActionButtons({
  onCancel,
  onSave,
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
        キャンセル
      </Button>
      &nbsp;&nbsp;
      <Button
        type="primary"
        size="large"
        className="px-8"
        onClick={onSave}
        loading={loading}
      >
        設定を保存
      </Button>
    </div>
  )
}

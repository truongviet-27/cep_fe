import { useCreate, useTranslate } from '@refinedev/core'
import { Form } from 'antd'
import type { RcFile } from 'antd/es/upload'
import type {
  BeforeUploadFileType,
  UploadRequestError,
  UploadRequestFile,
} from 'rc-upload/lib/interface'
import { useMemo } from 'react'

function useStep1() {
  const t = useTranslate()
  const form = Form.useFormInstance()
  const {} = form

  const { mutate, isPending } = useCreate({
    resource: 'csv-imports/validate',
  })

  const handleUpload = (
    file: Exclude<BeforeUploadFileType, File | boolean> | RcFile,
    onError?: (event: UploadRequestError | ProgressEvent) => void,
    onSuccess?: (fileOrXhr?: UploadRequestFile | XMLHttpRequest) => void,
  ) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'product-categories')
    mutate(
      {
        resource: 'csv-imports/validate',
        values: formData,
        meta: {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      },
      {
        onSuccess: () => {
          onSuccess?.('ok')
        },
      },
    )
  }

  const dataSource = useMemo(() => {
    return [
      t('product_categories.csv.step_1.noteItems.line1'),
      t('product_categories.csv.step_1.noteItems.line2'),
      t('product_categories.csv.step_1.noteItems.line3'),
      t('product_categories.csv.step_1.noteItems.line4'),
      t('product_categories.csv.step_1.noteItems.line5'),
    ]
  }, [t])

  return [
    { form, dataSource, isPending },
    { t, mutate, handleUpload },
  ] as const
}

export default useStep1

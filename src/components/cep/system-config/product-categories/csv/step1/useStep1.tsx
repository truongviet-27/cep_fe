import { useCreate, useTranslate } from '@refinedev/core'
import { Form } from 'antd'
import type { RcFile } from 'antd/es/upload'

function useStep1() {
  const t = useTranslate()
  const form = Form.useFormInstance()
  const {} = form

  const { mutate } = useCreate({
    resource: 'csv-imports/validate',
  })

  const handleUpload = (file: RcFile) => {
    console.log(file, 'filefile')
    mutate({
      values: {
        file: file,
        type: 'products-categories',
      },
    })
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'product-categories')
    mutate({
      resource: 'csv-imports/validate',
      values: formData,
      meta: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    })
  }

  // const handleUpload = (file: File) => {
  //   Papa.parse(file, {
  //     header: true,
  //     skipEmptyLines: true,
  //     complete: (results) => {
  //       setFieldValue('data', results.data)

  //       message.success('CSV読み込み成功！')
  //     },
  //   })

  //   return false
  // }

  const dataSource = [
    t('product_categories.csv.step_1.noteItems.line1'),
    t('product_categories.csv.step_1.noteItems.line2'),
    t('product_categories.csv.step_1.noteItems.line3'),
    t('product_categories.csv.step_1.noteItems.line4'),
    t('product_categories.csv.step_1.noteItems.line5'),
  ]

  return [
    { form, dataSource },
    { t, mutate, handleUpload },
  ] as const
}

export default useStep1

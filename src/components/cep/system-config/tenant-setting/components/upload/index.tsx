/* eslint-disable simple-import-sort/imports */
/* eslint-disable import/newline-after-import */
import UploadImage from '@/assets/svg/upload.svg'
import { useApiUrl, useCustomMutation } from '@refinedev/core'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { Form, Image, Typography, Upload } from 'antd'
import type { RcFile } from 'antd/es/upload'
import axios from 'axios'
import ImageNext from 'next/image'
import { useEffect, useState } from 'react'
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const { Text } = Typography

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

function UploadSetting({
  name,
  fileListProp,
  initialUrl,
}: {
  name: string
  fileListProp: UploadFile[] | null
  initialUrl: string
}) {
  const form = Form.useFormInstance()

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const { mutate } = useCustomMutation()
  const apiUrl = useApiUrl()

  const handleChange = ({
    file,
    fileList,
  }: {
    file: UploadFile
    fileList: UploadFile[]
  }) => {
    if (fileList.length > 0) {
      mutate(
        {
          method: 'post',
          url: `${apiUrl}/OTHER/presigned-url`,
          values: {
            file_name: file?.name,
            content_type: file?.type,
            prefix: 'imports',
            expiration_minutes: 60,
          },
        },
        {
          onSuccess: (data) => {
            axios
              .put(data.data.presigned_url, file, {
                headers: {
                  'Content-Type': data.data.content_type,
                },
              })
              .then(() => {
                form.setFieldValue(name, file)
                form.setFieldValue(`${name}_file_key`, data.data.file_key)
                form.setFieldValue(`${name}_name`, file?.name)

                setFileList(fileList)
              })
              .catch((error) => {
                console.log(error)
              })
          },
        },
      )
    } else {
      form.setFieldValue(name, null)
      form.setFieldValue(`${name}_file_key`, null)
      setFileList([])
    }
  }

  useEffect(() => {
    if (fileListProp && fileListProp.length > 0) {
      setFileList(fileListProp)
    } else if (initialUrl && fileList.length === 0) {
      // Chỉ set initialUrl nếu chưa có file nào được upload
      setFileList([
        {
          uid: '-1',
          name: form.getFieldValue(`${name}_name`) || 'image.png',
          status: 'done',
          url: initialUrl,
        },
      ])
    }
  }, [fileListProp, initialUrl]) // Thêm initialUrl vào dependency

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  return (
    <div className="flex items-center">
      <Upload
        onPreview={handlePreview}
        accept=".png,.jpg,.jpeg"
        listType="picture-card"
        maxCount={1}
        beforeUpload={() => false}
        fileList={fileList}
        onChange={handleChange}
        style={{
          height: 50,
        }}
        onRemove={() => {
          form.setFieldValue(`${name}_name`, null)
        }}
        multiple={false}
      >
        <ImageNext src={UploadImage} alt="upload" className="h-8 w-8" />
      </Upload>
      <Text
        title={form.getFieldValue(`${name}_name`) || ''}
        className="mt-1 ml-3 max-w-[100px] truncate text-center text-xs"
      >
        {form.getFieldValue(`${name}_name`) || ''}
      </Text>

      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
          alt="Preview image"
        />
      )}
    </div>
  )
}

export default UploadSetting

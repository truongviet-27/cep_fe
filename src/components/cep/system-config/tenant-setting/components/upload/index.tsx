/* eslint-disable simple-import-sort/imports */
/* eslint-disable import/newline-after-import */
import UploadImage from '@/assets/svg/upload.svg'
import { useApiUrl, useCustomMutation } from '@refinedev/core'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { Form, Image, Upload } from 'antd'
import type { RcFile } from 'antd/es/upload'
import axios from 'axios'
import ImageNext from 'next/image'
import { useState } from 'react'
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

function UploadSetting({ name }: { name: string }) {
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
                form.setFieldValue(name, {
                  file_key: data.data.file_key,
                  file: file,
                })
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
      setFileList([])
    }
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    console.log(file, 'filefile')

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  console.log(previewImage, 'previewImage')
  return (
    <div>
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
        multiple={false}
      >
        {fileList.length < 1 && (
          <ImageNext src={UploadImage} alt="upload" className="h-8 w-8" />
        )}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </div>
  )
}

export default UploadSetting

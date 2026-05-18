/* eslint-disable simple-import-sort/imports */
/* eslint-disable import/newline-after-import */
/* eslint-disable @typescript-eslint/no-explicit-any */
import UploadImage from '@/assets/svg/upload.svg'
import { useApiUrl, useCustomMutation, useTranslate } from '@refinedev/core'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { Form, Image, message, Typography, Upload } from 'antd'
import type { RcFile } from 'antd/es/upload'
import axios from 'axios'
import ImageNext from 'next/image'
import { useEffect, useState } from 'react'
import ImageCropModal from './image-crop-modal'
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const { Text } = Typography

const MAX_FILE_SIZE = 5 * 1024 * 1024

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
  aspect = 1, // Default is square (1:1)
}: {
  name: string
  fileListProp: UploadFile[] | null
  initialUrl: string | null
  aspect?: number
}) {
  const form = Form.useFormInstance()

  const t = useTranslate()

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [imageToCrop, setImageToCrop] = useState<string>('')
  const [currentFileName, setCurrentFileName] = useState<string>('')
  const [currentFileType, setCurrentFileType] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [cropAspect] = useState(aspect) // Store aspect ratio

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const { mutate } = useCustomMutation()
  const apiUrl = useApiUrl()

  const beforeUpload = (file: FileType) => {
    const isLt5M = file.size < MAX_FILE_SIZE
    if (!isLt5M) {
      message.error(t('images.notifications.size_limit'))
      return Upload.LIST_IGNORE
    }
    return true
  }

  const customRequest = ({ file, onSuccess }: any) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setImageToCrop(imageUrl)
      setCurrentFileName((file as File).name)
      setCurrentFileType((file as File).type)
      setCropModalOpen(true)
    }
    reader.onerror = (error) => {
      console.error('FileReader error:', error)
      message.error(t('images.notifications.upload_failed'))
    }
    reader.readAsDataURL(file as File)

    setTimeout(() => {
      onSuccess?.('ok')
    }, 0)
  }

  const handleChange = ({
    file,
    fileList: newFileList,
  }: {
    file: UploadFile
    fileList: UploadFile[]
  }) => {
    if (file.status === 'removed' || newFileList.length === 0) {
      form.setFieldValue(name, null)
      form.setFieldValue(`${name}_file_key`, null)
      form.setFieldValue(`${name}_name`, null)
      setFileList([])
    }
  }

  const handleCropConfirm = async (croppedImageBlob: Blob) => {
    try {
      setIsUploading(true)

      // Create File from Blob
      const croppedFile = new File([croppedImageBlob], currentFileName, {
        type: currentFileType,
        lastModified: Date.now(),
      })

      // Upload cropped image
      mutate(
        {
          method: 'post',
          url: `${apiUrl}/OTHER/presigned-url`,
          values: {
            file_name: currentFileName,
            content_type: currentFileType,
            prefix: 'imports',
            expiration_minutes: 60,
          },
        },
        {
          onSuccess: (data) => {
            axios
              .put(data.data.presigned_url, croppedFile, {
                headers: {
                  'Content-Type': data.data.content_type,
                },
              })
              .then(() => {
                form.setFieldValue(name, null)
                form.setFieldValue(name, croppedFile)
                form.setFieldValue(`${name}_file_key`, data.data.file_key)
                form.setFieldValue(`${name}_name`, currentFileName)

                // Update file list with cropped image
                setFileList([
                  {
                    uid: '-1',
                    name: currentFileName,
                    status: 'done',
                    url: URL.createObjectURL(croppedFile),
                  },
                ])

                setCropModalOpen(false)
                setIsUploading(false)
                message.success(t('images.notifications.upload_success'))
              })
              .catch((error) => {
                console.log(error)
                setIsUploading(false)
                message.error(t('images.notifications.upload_failed'))
              })
          },
          onError: () => {
            setIsUploading(false)
            message.error(t('images.notifications.upload_failed'))
          },
        },
      )
    } catch (error) {
      console.error('Upload error:', error)
      setIsUploading(false)
      message.error(t('images.notifications.upload_failed'))
    }
  }

  const handleCropCancel = () => {
    setCropModalOpen(false)
    setImageToCrop('')
  }

  useEffect(() => {
    const currentFieldValue = form.getFieldValue(name)

    if (currentFieldValue instanceof File) {
      return
    }

    if (fileListProp && fileListProp.length > 0) {
      setFileList(fileListProp)
    } else if (initialUrl && typeof initialUrl === 'string') {
      setFileList([
        {
          uid: '-1',
          name: form.getFieldValue(`${name}_name`) || 'image.png',
          status: 'done',
          url: initialUrl,
        },
      ])
    } else {
      setFileList([])
    }
  }, [fileListProp, initialUrl, form, name])

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  return (
    <div className="flex flex-nowrap items-center">
      <Upload
        onPreview={handlePreview}
        accept=".png,.jpg,.jpeg"
        listType="picture-card"
        maxCount={1}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        fileList={fileList}
        onChange={handleChange}
        style={{
          height: 50,
        }}
        className="flex-shrink-0 [&_.ant-upload-list]:flex-nowrap"
        onRemove={() => {
          form.setFieldValue(`${name}_name`, null)
          form.setFieldValue(name, null)
          form.setFieldValue(`${name}_file_key`, null)
          setFileList([])
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

      {imageToCrop && (
        <ImageCropModal
          visible={cropModalOpen}
          imageUrl={imageToCrop}
          fileType={currentFileType}
          isUploading={isUploading}
          aspect={cropAspect}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  )
}

export default UploadSetting

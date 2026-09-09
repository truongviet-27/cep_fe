/* eslint-disable */
import { UploadOutlined } from '@ant-design/icons'
import { dataProvider } from '@providers/data-provider'
import { useApiUrl, useTranslate } from '@refinedev/core'
import type { UploadFile, UploadProps } from 'antd'
import { Button, notification, Upload } from 'antd'
import React from 'react'

interface CustomUploadProps {
  fileList: UploadFile[]
  setFileList: (fileList: UploadFile[]) => void
  commonName?:
    | 'PRODUCTS'
    | 'CATEGORY_PRODUCTS'
    | 'CUSTOMERS'
    | 'DEPARTMENTS'
    | 'OTHER'
}

export const InputUploadFile: React.FC<CustomUploadProps> = ({
  fileList,
  setFileList,
  commonName = 'CUSTOMERS',
}) => {
  const apiUrl = useApiUrl()
  const t = useTranslate()

  // Handle file list change
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const processedList = newFileList.map((file) => {
      if (file.status === 'done' && file.response) {
        return {
          ...file,
          url: file.response.file_key,
        }
      }
      return file
    })
    setFileList(processedList)
  }

  // Custom upload logic using presigned URL
  const customRequest: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError, onProgress } = options
    const f = file as File

    try {
      // Step 1: Get presigned URL from your API
      const { data: presignedData } = await dataProvider.custom({
        url: `${apiUrl}/${commonName}/presigned-url`,
        method: 'post',
        payload: {
          file_name: f.name,
          content_type: f.type,
        },
      })

      const { presigned_url, file_key, file_name } = presignedData

      // Step 2: Upload file to presigned URL
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', presigned_url, true)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = (event.loaded / event.total) * 100
          onProgress({ percent })
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          if (onSuccess) {
            onSuccess({ file_key, url: presigned_url, name: file_name }, xhr)
            notification.success({
              message: '',
              description: t('notifications.uploadSuccess'),
            })
          }
        } else {
          if (onError) {
            onError(new Error('Upload failed.'))
            notification.error({
              message: '',
              description: t('notifications.uploadFail'),
            })
          }
        }
      }

      xhr.onerror = () => {
        if (onError) {
          onError(new Error('Upload failed due to a network error.'))
          notification.error({
            message: '',
            description: t('notifications.uploadFail'),
          })
        }
      }

      xhr.send(f)
    } catch (error: any) {
      if (onError) {
        onError(error)
        notification.error({
          message: '',
          description: error.message || t('notifications.uploadFail'),
        })
      }
    }
  }

  return (
    <Upload
      onChange={handleChange}
      fileList={fileList}
      customRequest={customRequest}
      multiple
    >
      <Button
        icon={<UploadOutlined />}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row-reverse',
        }}
      >
        <span style={{ flexGrow: 1, textAlign: 'left' }}>
          {t('placeholders.please_choose_files')}
        </span>
      </Button>
    </Upload>
  )
}

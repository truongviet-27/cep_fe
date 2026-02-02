/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  DeleteOutlined,
  LinkOutlined,
  PlusOutlined,
  UploadOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons'
import { useApiUrl, useCustomMutation } from '@refinedev/core'
import {
  Button,
  Form,
  Input,
  Modal,
  Tabs,
  Typography,
  Upload,
  message,
  Tooltip,
} from 'antd'
import type { UploadFile } from 'antd/lib/upload/interface'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const { Dragger } = Upload
const { Text } = Typography

function UploadImage({
  name,
  initialUrl,
}: {
  name: string
  initialUrl?: string
}) {
  const form = Form.useFormInstance()
  const apiUrl = useApiUrl()
  const { mutate } = useCustomMutation()

  const fileValue = Form.useWatch(name, form)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('1')
  const [urlInput, setUrlInput] = useState('')
  const [localFileList, setLocalFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)
  const [displayPreview, setDisplayPreview] = useState<string | null>(
    initialUrl ?? null,
  )

  const MAX_FILE_SIZE = 5 * 1024 * 1024
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
  const ALLOWED_EXTENSIONS_TEXT = 'JPG, PNG, WEBP'

  useEffect(() => {
    if (fileValue instanceof File) {
      const objectUrl = URL.createObjectURL(fileValue)
      setDisplayPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }
    if (typeof fileValue === 'string') {
      setDisplayPreview(fileValue)
    }
  }, [fileValue])

  const uploadToS3 = (file: File | any) => {
    setLoading(true)
    mutate(
      {
        method: 'post',
        url: `${apiUrl}/OTHER/presigned-url`,
        values: {
          file_name: file?.name || 'web-image.jpg',
          content_type: file?.type || 'image/jpeg',
          prefix: 'imports',
          expiration_minutes: 60,
        },
      },
      {
        onSuccess: (data) => {
          axios
            .put(data.data.presigned_url, file, {
              headers: { 'Content-Type': data.data.content_type },
            })
            .then(() => {
              form.setFieldValue(name, file)
              form.setFieldValue(`${name}_file_key`, data.data.file_key)
              form.setFieldValue(`${name}_name`, file?.name || 'web-image.jpg')
              message.success('画像のアップロードに成功しました')
              setIsModalOpen(false)
              setLoading(false)
              setLocalFileList([])
            })
            .catch((error) => {
              console.error(error)
              setLoading(false)
            })
        },
        onError: () => setLoading(false),
      },
    )
  }

  const handleUrlUpload = async () => {
    if (!urlInput) return message.warning('画像のリンクを入力してください')
    try {
      setLoading(true)
      const response = await fetch(urlInput)
      const blob = await response.blob()
      if (blob.size > MAX_FILE_SIZE) {
        message.error(
          '画像サイズが5MBを超えています。別の画像を選択してください。',
        )
        setLoading(false)
        return
      }
      const file = new File([blob], 'image-from-url.jpg', { type: blob.type })
      uploadToS3(file)
    } catch (error) {
      console.error(error)
      message.error(
        'この画像リンクには著作権があります。著作権のないリンクを使用するか、画像アップロード機能をご利用ください。',
      )
      setLoading(false)
    }
  }

  // const handleConfirm = () => {
  //   if (activeTab === '1') {
  //     if (localFileList.length > 0 && localFileList[0].originFileObj) {
  //       if ( localFileList[0].originFileObj.size > MAX_FILE_SIZE) {
  //         return message.error('ファイルサイズは5MB以下にしてください。');
  //       }
  //       uploadToS3(localFileList[0].originFileObj)
  //     } else {
  //       message.warning('ファイルを選択してください')
  //     }
  //   } else {
  //     handleUrlUpload()
  //   }
  // }

  const handleConfirm = () => {
    if (activeTab === '1') {
      const fileObj = localFileList[0]?.originFileObj
      if (fileObj) {
        const isJpgOrPng = ALLOWED_TYPES.includes(fileObj.type)
        const isLt5M = fileObj.size < MAX_FILE_SIZE
        if (!isJpgOrPng) {
          return message.error(
            `${ALLOWED_EXTENSIONS_TEXT}形式のファイルのみアップロード可能です。`,
          )
        }
        if (!isLt5M) {
          return message.error('画像サイズは5MB以下にしてください。')
        }
        uploadToS3(fileObj)
      } else {
        message.warning('ファイルを選択してください')
      }
    } else {
      handleUrlUpload()
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDisplayPreview(null)
    form.setFieldValue(name, null)
    form.setFieldValue(`${name}_file_key`, null)
    form.setFieldValue(`${name}_name`, null)
    setLocalFileList([])
    setUrlInput('')
  }

  return (
    <div className="flex items-center">
      <div
        className="group relative h-50 w-50 cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-blue-400 hover:bg-blue-50"
        onClick={() => setIsModalOpen(true)}
      >
        {displayPreview ? (
          <>
            <Image
              src={displayPreview}
              alt="preview"
              width={200}
              height={200}
              className="h-50 w-50 object-cover transition-transform duration-300 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex gap-4">
                <Tooltip title="画像を変更">
                  <UploadOutlined
                    className="cursor-pointer text-2xl text-white transition-colors hover:text-blue-400"
                    style={{ color: 'white', fontSize: '20px' }}
                  />
                </Tooltip>
                <Tooltip title="削除">
                  <DeleteOutlined
                    onClick={handleRemove}
                    className="cursor-pointer text-2xl text-white transition-colors hover:text-red-500"
                    style={{ color: 'white', fontSize: '20px' }}
                  />
                </Tooltip>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <CloudUploadOutlined className="text-2xl text-gray-400" />
            <span className="text-[11px] font-medium text-gray-500">
              画像をアップロード
            </span>
          </div>
        )}
      </div>

      <Modal
        title={
          <div className="border-b pb-3 text-lg font-semibold text-gray-800">
            画像を更新
          </div>
        }
        open={isModalOpen}
        onCancel={() => !loading && setIsModalOpen(false)}
        onOk={handleConfirm}
        confirmLoading={loading}
        destroyOnClose
        width={520}
        centered
        okText="完了"
        cancelText="キャンセル"
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          className="mt-2"
          items={[
            {
              key: '1',
              label: (
                <span className="flex items-center gap-2">
                  <UploadOutlined /> コンピュータから
                </span>
              ),
              children: (
                <div className="py-6">
                  {localFileList.length === 0 ? (
                    <Dragger
                      maxCount={1}
                      beforeUpload={() => false}
                      fileList={localFileList}
                      onChange={({ fileList }) => setLocalFileList(fileList)}
                      className="group bg-gray-50 p-8 transition-colors hover:border-blue-400"
                    >
                      <p className="flex justify-center text-4xl text-blue-500 transition-transform group-hover:scale-110">
                        <PlusOutlined />
                      </p>
                      <p className="mt-4 text-base font-medium text-gray-700">
                        ここにファイルをドラッグ＆ドロップ
                      </p>
                      <p className="text-sm text-gray-400">
                        対応形式: JPG, PNG, WEBP
                      </p>
                      <p className="text-sm text-gray-400">最大容量：5MB</p>
                    </Dragger>
                  ) : (
                    <div className="flex flex-col items-center rounded-xl border border-dashed border-blue-200 bg-blue-50 py-8">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <UploadOutlined className="text-xl" />
                      </div>
                      <Text strong className="mb-4 text-blue-600">
                        {localFileList[0].name}
                      </Text>
                      <Button
                        size="small"
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => setLocalFileList([])}
                      >
                        別のファイルを選択
                      </Button>
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: '2',
              label: (
                <span className="flex items-center gap-2">
                  <LinkOutlined /> ウェブリンク
                </span>
              ),
              children: (
                <div className="space-y-6 px-2 py-6">
                  <div className="space-y-2">
                    <Text className="text-sm font-medium text-gray-600">
                      画像のURL
                    </Text>
                    <Input
                      placeholder="URLを貼り付け (https://...)"
                      prefix={<LinkOutlined className="text-gray-400" />}
                      size="large"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      allowClear
                      className="rounded-lg"
                    />
                  </div>

                  <div className="rounded-lg bg-amber-50 p-3">
                    <p className="text-[12px] leading-relaxed text-amber-700 italic">
                      💡 <b>注意:</b>{' '}
                      リンク切れを防ぐため、この画像はシステムにダウンロードされ保存されます。
                    </p>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Modal>
    </div>
  )
}

export default UploadImage

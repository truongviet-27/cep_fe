/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CloseCircleFilled,
  DeleteOutlined,
  LinkOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useApiUrl, useCustomMutation } from '@refinedev/core'
import {
  Button,
  Form,
  Input,
  Modal,
  Spin,
  Tabs,
  Typography,
  Upload,
  message,
} from 'antd'
import type { UploadFile } from 'antd/lib/upload/interface'
import axios from 'axios'
import { useState, useEffect } from 'react'

const { Dragger } = Upload

function UploadImage({ name }: { name: string }) {
  const form = Form.useFormInstance()
  const apiUrl = useApiUrl()
  const { mutate } = useCustomMutation()

  // Theo dõi giá trị của field name và name_name để giao diện tự cập nhật khi upload xong
  const fileValue = Form.useWatch(name, form)
  const fileName = Form.useWatch(`${name}_name`, form)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('1')
  const [urlInput, setUrlInput] = useState('')
  const [localFileList, setLocalFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)
  const [displayPreview, setDisplayPreview] = useState<string | null>(null)

  // Tạo đường dẫn preview cho ảnh
  useEffect(() => {
    if (!fileValue) {
      setDisplayPreview(null)
      return
    }
    // Nếu là File object (vừa upload/chọn từ máy)
    if (fileValue instanceof File) {
      const objectUrl = URL.createObjectURL(fileValue)
      setDisplayPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }
    // Nếu là string (URL từ BE trả về)
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
              // Cập nhật Form - useWatch sẽ lo việc re-render giao diện
              form.setFieldValue(name, file)
              form.setFieldValue(`${name}_file_key`, data.data.file_key)
              form.setFieldValue(`${name}_name`, file?.name || 'web-image.jpg')

              message.success('Tải ảnh thành công')
              setIsModalOpen(false)
              setLoading(false)
              setLocalFileList([]) // Reset list trong modal
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
    if (!urlInput) return message.warning('Vui lòng dán link ảnh')
    try {
      setLoading(true)
      const response = await fetch(urlInput)
      const blob = await response.blob()
      const file = new File([blob], 'image-from-url.jpg', { type: blob.type })
      uploadToS3(file)
    } catch (error) {
      console.error(error)
      message.error('Không thể lấy ảnh từ link (Lỗi CORS hoặc link hỏng)')
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    if (activeTab === '1') {
      if (localFileList.length > 0 && localFileList[0].originFileObj) {
        uploadToS3(localFileList[0].originFileObj)
      } else {
        message.warning('Vui lòng chọn file')
      }
    } else {
      handleUrlUpload()
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    form.setFieldValue(name, null)
    form.setFieldValue(`${name}_file_key`, null)
    form.setFieldValue(`${name}_name`, null)
    setLocalFileList([])
    setUrlInput('')
  }

  return (
    <div className="flex items-center">
      {/* Ô vuông hiển thị ảnh sau khi upload */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="hover:border-primary relative flex h-[85px] w-[85px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#d9d9d9] bg-[#fafafa]"
      >
        {displayPreview ? (
          <>
            <img
              src={displayPreview}
              alt="preview"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Nút xóa nằm đè lên ảnh */}
            <CloseCircleFilled
              onClick={handleRemove}
              className="absolute -top-1 -right-1 z-10 rounded-full bg-white text-lg text-red-500"
            />
            {/* Hiển thị tên file mờ phía dưới */}
            <div className="absolute bottom-0 w-full bg-black/40 px-1 py-0.5">
              <Typography.Text className="block truncate text-center text-[8px] text-white">
                {fileName}
              </Typography.Text>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <PlusOutlined className="text-xl text-gray-400" />
            <span className="mt-1 text-[10px] text-gray-400">Chọn ảnh</span>
          </div>
        )}
      </div>

      <Modal
        title="Tải ảnh lên"
        open={isModalOpen}
        onCancel={() => !loading && setIsModalOpen(false)}
        onOk={handleConfirm}
        confirmLoading={loading}
        destroyOnClose
        width={500}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <Tabs.TabPane
            tab={
              <span>
                <UploadOutlined />
                Từ máy tính
              </span>
            }
            key="1"
          >
            <div className="py-4">
              {localFileList.length === 0 ? (
                <Dragger
                  maxCount={1}
                  beforeUpload={() => false}
                  fileList={localFileList}
                  onChange={({ fileList }) => setLocalFileList(fileList)}
                >
                  <p className="ant-upload-drag-icon">
                    <PlusOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Kéo thả hoặc nhấp để chọn file
                  </p>
                </Dragger>
              ) : (
                <div className="rounded-lg border border-dashed border-[#d9d9d9] bg-[#fafafa] py-6 text-center">
                  <p className="mb-4">
                    Đã chọn:{' '}
                    <b className="text-primary">{localFileList[0].name}</b>
                  </p>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => setLocalFileList([])}
                  >
                    Chọn lại
                  </Button>
                </div>
              )}
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <LinkOutlined />
                Link Web
              </span>
            }
            key="2"
          >
            <div className="py-10">
              <Spin spinning={loading} tip="Đang xử lý tải ảnh...">
                <Input
                  placeholder="Dán link ảnh tại đây (https://...)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  allowClear
                />
                <p className="mt-2 text-[11px] text-gray-400">
                  Lưu ý: Hệ thống sẽ tự động tải ảnh từ link này và upload lên
                  server của bạn.
                </p>
              </Spin>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  )
}

export default UploadImage

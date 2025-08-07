'use client'

import {
  DownloadOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { useGo } from '@refinedev/core'
import type { UploadProps } from 'antd'
import {
  Alert,
  Button,
  Card,
  Divider,
  Space,
  Steps,
  Typography,
  Upload,
} from 'antd'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

import { CommonList } from '@/components/common/list'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { PRIMARY } from '@/utility/color'

const { Title, Text, Link, Paragraph } = Typography
const { Dragger } = Upload

const Page: React.FC = () => {
  const t = useTranslations('projects.csvUpload')
  const t_buttons = useTranslations('buttons')
  const go = useGo()
  const [currentStep, setCurrentStep] = useState(0)

  const t_breadcrumb = useTranslations('breadcrumb')

  // Cấu hình cho component Upload
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    // action: 'URL_API_để_upload_file_của_em', // Thay bằng API endpoint thật
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        // message.success(`${info.file.name} file uploaded successfully.`)
        setCurrentStep(1) // Tự động chuyển sang bước tiếp theo khi upload thành công
      } else if (status === 'error') {
        // message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t_breadcrumb('projects')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('title')}</Title>,
    },
  ]

  const steps = [
    {
      title: t('steps.selectFile'),
    },
    {
      title: t('steps.confirmData'),
    },
    {
      title: t('steps.validation'),
    },
    {
      title: t('steps.complete'),
    },
  ]

  return (
    <CommonList
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
    >
      <Title level={4}>{t('title')}</Title>
      <Steps
        responsive
        labelPlacement="vertical"
        current={currentStep}
        items={steps}
        style={{ marginBottom: 32 }}
      />

      {currentStep === 0 && (
        <>
          <Alert
            message={<Text strong>{t('template.title')}</Text>}
            description={
              <Paragraph type="secondary">
                {t('template.description')}
                <br />
                <Link href="/path/to/template.csv" download>
                  <DownloadOutlined /> {t('template.downloadLink')}
                </Link>
              </Paragraph>
            }
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Dragger {...uploadProps} height={200}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{t('upload.dragAndDropText')}</p>
            <p className="ant-upload-hint">{t('upload.selectFileText')}</p>
          </Dragger>

          <Card
            title={
              <Space>
                <InfoCircleOutlined />
                {t('notes.title')}
              </Space>
            }
            style={{ marginTop: 24 }}
            size="small"
          >
            <ul>
              <li>
                <Text type="secondary">{t('notes.point1')}</Text>
              </li>
              <li>
                <Text type="secondary">{t('notes.point2')}</Text>
              </li>
              <li>
                <Text type="secondary">{t('notes.point3')}</Text>
              </li>
              <li>
                <Text type="secondary">{t('notes.point4')}</Text>
              </li>
              <li>
                <Text type="secondary">{t('notes.point5')}</Text>
              </li>
            </ul>
          </Card>
        </>
      )}

      {/* {currentStep === 1 && <DataConfirmationComponent />} */}
      {/* {currentStep === 2 && <ValidationComponent />} */}
      {/* {currentStep === 3 && <CompletionComponent />} */}

      <Divider />

      <div style={{ textAlign: 'right' }}>
        <Space>
          <Button onClick={() => go({ to: '/projects' })}>
            {t_buttons('back')}
          </Button>
          <Button
            type="primary"
            // Nút này có thể bị vô hiệu hóa cho đến khi có file được chọn
            // Hoặc chức năng của nó sẽ là chuyển sang bước tiếp theo
            onClick={() => console.log('Register clicked')}
          >
            {t_buttons('create')}
          </Button>
        </Space>
      </div>
    </CommonList>
  )
}

export default Page

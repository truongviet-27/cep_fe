'use client'

import {
  DownloadOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  RightOutlined,
} from '@ant-design/icons'
import Step1 from '@components/common/csv-view-editor/step1'
import { Show } from '@components/crud/show'
import { useGo } from '@refinedev/core'
import { ENC_IN } from '@utility/instances'
import type { UploadFile, UploadProps } from 'antd'
import { Alert, Button, Card, Space, Steps, Typography, Upload } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

import Breadcrumbs from '@/components/layout/breadcrumbs'
import { PRIMARY } from '@/utility/color'

const { Title, Text, Link, Paragraph } = Typography
const { Dragger } = Upload

const CsvViewEditor: React.FC = () => {
  const t = useTranslations('projects.csv_upload')
  const t_buttons = useTranslations('buttons')
  const go = useGo()
  const [currentStep, setCurrentStep] = useState(0)

  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null)
  const [fileName, setFileName] = useState<string>('')

  const t_prj = useTranslations('projects')

  const uploadProps: UploadProps = {
    accept: '.csv,.txt',
    multiple: false,
    fileList,
    beforeUpload: async (file) => {
      setFileName(file.name.replace(/\.(csv|txt)$/i, '') + '.csv')
      const buf = await file.arrayBuffer()
      setFileBuffer(buf)
      setFileList([file as UploadFile])
      setCurrentStep(1)
      return false
    },
    onRemove: () => {
      setFileList([])
      setFileBuffer(null)
      setFileName('')
      setCurrentStep(0)
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
    showUploadList: { showRemoveIcon: true },
  }

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t_prj('projects')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('title')}</Title>,
    },
  ]

  const steps = [
    { title: t('steps.selectFile'), onClick: () => setCurrentStep(0) },
    { title: t('steps.confirmData') },
    { title: t('steps.validation') },
    { title: t('steps.complete') },
  ]

  return (
    <Show
      isLoading={false}
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      footerButtons={
        <Space>
          <Button onClick={() => go({ to: '/projects' })}>
            {t_buttons('back')}
          </Button>
          {currentStep > 0 && currentStep < 3 && (
            <Button onClick={() => setCurrentStep((val) => val - 1)}>
              {t_buttons('back')}
            </Button>
          )}
          <Button
            type="primary"
            onClick={() => console.log('Register clicked')}
          >
            {t_buttons('create')}
          </Button>
        </Space>
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
            style={{ marginBottom: 16 }}
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

      {currentStep === 1 && fileBuffer && (
        <Step1
          source={{
            buffer: fileBuffer,
            encoding: ENC_IN,
            fileName,
          }}
        />
      )}

      {/* {currentStep === 2 && <ValidationComponent />} */}
      {/* {currentStep === 3 && <CompletionComponent />} */}
    </Show>
  )
}

export default CsvViewEditor

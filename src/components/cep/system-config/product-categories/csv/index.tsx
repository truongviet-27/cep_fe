import {
  DownloadOutlined,
  FileAddOutlined,
  RightOutlined,
} from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import { useForm } from '@refinedev/antd'
import {
  Link,
  useApiUrl,
  useCustomMutation,
  useTranslate,
} from '@refinedev/core'
import { cn } from '@utility/cn'
import { BLACK, GREY, PRIMARY } from '@utility/color'
import { Breadcrumb, Button, Card, Form, List, Space, Typography } from 'antd'
import Dragger from 'antd/es/upload/Dragger'
import Title from 'antd/lib/typography/Title'
import axios from 'axios'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

import LoadingImport from '@/assets/svg/loading.svg'

const { Text, Paragraph } = Typography

function CSVContainer({
  name,
}: {
  name: 'PRODUCTS' | 'CATEGORY_PRODUCTS' | 'CUSTOMERS' | 'DEPARTMENTS'
}) {
  const t = useTranslate()
  const methods = useForm()
  const { formProps, form } = methods

  const [isResult, setIsResult] = useState(false)
  const [isError, setIsError] = useState(false)

  const { mutate } = useCustomMutation()
  const { mutate: mutate2 } = useCustomMutation()

  const apiUrl = useApiUrl()

  useEffect(() => {
    if (isResult) {
      mutate(
        {
          method: 'post',
          url: `${apiUrl}/${name}/presigned-url`,
          values: {
            file_name: form.getFieldValue('file')?.file?.name,
            content_type: form.getFieldValue('file')?.file?.type,
            prefix: 'imports',
            expiration_minutes: 60,
          },
        },
        {
          onSuccess: (data) => {
            axios
              .put(data.data.presigned_url, form.getFieldValue('file')?.file, {
                headers: {
                  'Content-Type': data.data.content_type || 'text/csv',
                },
              })
              .then(() => {
                mutate2({
                  method: 'post',
                  url: `${apiUrl}/csv-imports/${name}/import`,
                  values: {
                    file_key: data.data.file_key,
                  },
                })
              })
              .catch((error) => {
                console.log(error)
              })
          },
        },
      )
    }
  }, [isResult])

  const dataSource = useMemo(() => {
    return [
      t('csv.step_1.noteItems.line1'),
      t('csv.step_1.noteItems.line2'),
      t('csv.step_1.noteItems.line3'),
      t('csv.step_1.noteItems.line4'),
      t('csv.step_1.noteItems.line5'),
    ]
  }, [t])
  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('system_config.system_config')}
                </Title>
              ),
            },
            {
              title: <Title level={5}>{t('csv.title')}</Title>,
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={t('csv.title')}
    >
      <Form {...formProps}>
        {isResult ? (
          <Card style={{ border: '1px dashed #d9d9d9', padding: '20px 0' }}>
            <div>
              <div className="flex justify-center">
                <Image
                  src={LoadingImport}
                  alt="loading"
                  height={40}
                  width={40}
                />
              </div>
              <Text
                strong
                style={{
                  color: '#00B998',
                  display: 'block',
                  textAlign: 'center',
                  marginBottom: 30,
                  marginTop: 20,
                }}
              >
                CSV一括登録中です。処理結果はCSVタスク履歴画面で確認してください。
              </Text>

              <Link
                to="/import-history"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginBottom: 24,
                }}
              >
                CSVタスク履歴画面
              </Link>
            </div>
          </Card>
        ) : (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div
              className={cn(
                'rounded-[8px] border-[1px] border-solid border-[#FFD591] bg-[#E6F7FF] p-6',
              )}
            >
              <Text strong style={{ color: '#FA8C16' }}>
                {t('csv.step_1.alertTitle')}
              </Text>
              <Paragraph style={{ margin: '8px 0 0', color: GREY }}>
                {t('csv.step_1.alertDesc1')}
              </Paragraph>
              <Paragraph style={{ margin: 0, color: GREY }}>
                {t('csv.step_1.alertDesc2')}
              </Paragraph>
              <Button
                type="link"
                icon={<DownloadOutlined />}
                style={{ paddingLeft: 0 }}
              >
                {t('csv.step_1.downloadButton')}
              </Button>
            </div>

            <Form.Item
              layout="vertical"
              name={'file'}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng upload file CSV!',
                },
                {
                  validator: (_, fileList) => {
                    setIsError(false)
                    const file = fileList.file
                    const isCSV = file.name.toLowerCase().endsWith('.csv')
                    const isSize = file.size / 1024 / 1024 > 5
                    if (isSize) {
                      setIsError(true)
                      return Promise.reject(
                        '5MB以下のファイルのみアップロードできます',
                      )
                    }
                    if (!isCSV) {
                      setIsError(true)
                      return Promise.reject(
                        'CSVファイルのみアップロードできます',
                      )
                    }

                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Dragger
                style={{
                  border: '1px dashed #d9d9d9',
                  textAlign: 'center',
                }}
                accept=".csv"
                name="file"
                maxCount={1}
                beforeUpload={() => false}
                onRemove={() => {
                  console.log('xxxxxxxxxxxxxxx')
                  form.setFields([{ name: 'file', errors: [], value: [] }])
                }}
              >
                <div className="m-6 flex flex-col items-center gap-3">
                  <FileAddOutlined
                    style={{ fontSize: 40, color: BLACK, marginBottom: 12 }}
                  />
                  <Paragraph style={{ marginBottom: 8, color: BLACK }}>
                    {t('csv.step_1.dragDrop')}
                  </Paragraph>
                  <Paragraph style={{ marginBottom: 20, color: GREY }}>
                    {t('csv.step_1.orSelectFile')}
                  </Paragraph>
                  <Button type="primary" size="large">
                    {t('csv.step_1.selectFileButton')}
                  </Button>
                </div>
              </Dragger>
            </Form.Item>

            <Card
              size="small"
              title={t('csv.step_1.noteTitle')}
              headStyle={{ borderBottom: 'none', margin: '10px 0 0 10px' }}
            >
              <List
                size="small"
                split={false}
                dataSource={dataSource}
                renderItem={(item) => <List.Item>・{item}</List.Item>}
              />
            </Card>
          </Space>
        )}

        <div className="mt-4 flex justify-end">
          <div className="flex justify-end gap-4">
            {isResult ? (
              <Button
                type="default"
                onClick={() => {
                  setIsResult(false)
                }}
              >
                {t('csv.buttons.back')}
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  setIsResult(true)
                }}
                disabled={isError}
              >
                {t('csv.buttons.nextStep')}
              </Button>
            )}
          </div>
        </div>
      </Form>
    </PageContainer>
  )
}

export default CSVContainer

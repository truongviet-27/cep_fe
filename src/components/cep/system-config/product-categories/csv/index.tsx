import {
  CheckCircleTwoTone,
  DownloadOutlined,
  FileAddOutlined,
  RightOutlined,
} from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import { useForm } from '@refinedev/antd'
import { useApiUrl, useCustom, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Form,
  List,
  Space,
  Typography,
} from 'antd'
import Dragger from 'antd/es/upload/Dragger'
import Title from 'antd/lib/typography/Title'
import { useMemo, useState } from 'react'

const { Text, Paragraph } = Typography

function CSVContainer({
  name,
}: {
  name: 'products' | 'category-products' | 'customers' | 'department'
}) {
  const t = useTranslate()
  const methods = useForm()
  const { formProps } = methods

  const [isResult, setIsResult] = useState(false)

  const apiUrl = useApiUrl()

  const { data } = useCustom({
    method: 'get',
    url: `${apiUrl}/${name}/presigned-url`,
    queryOptions: {
      enabled: isResult,
    },
  })

  console.log(data?.data, 'xxxxxxxxxxxx')

  const dataSource = useMemo(() => {
    return [
      t('product_categories.csv.step_1.noteItems.line1'),
      t('product_categories.csv.step_1.noteItems.line2'),
      t('product_categories.csv.step_1.noteItems.line3'),
      t('product_categories.csv.step_1.noteItems.line4'),
      t('product_categories.csv.step_1.noteItems.line5'),
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
              title: (
                <Title level={5}>{t('product_categories.csv.title')}</Title>
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={t('product_categories.csv.title')}
    >
      <Form {...formProps}>
        {isResult ? (
          <Card bordered>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: 32 }}
              />
            </div>
            <Text
              type="success"
              strong
              style={{
                display: 'block',
                textAlign: 'center',
                marginBottom: 24,
              }}
            ></Text>

            <div></div>
          </Card>
        ) : (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              type="info"
              message={
                <div>
                  <Text strong style={{ color: '#FA8C16' }}>
                    {t('product_categories.csv.step_1.alertTitle')}
                  </Text>
                  <Paragraph style={{ margin: '8px 0 0' }}>
                    {t('product_categories.csv.step_1.alertDesc1')}
                  </Paragraph>
                  <Paragraph style={{ margin: 0 }}>
                    {t('product_categories.csv.step_1.alertDesc2')}
                  </Paragraph>
                  <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    style={{ paddingLeft: 0 }}
                  >
                    {t('product_categories.csv.step_1.downloadButton')}
                  </Button>
                </div>
              }
            />

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
                    const file = fileList.file
                    const isCSV = file.name.toLowerCase().endsWith('.csv')
                    const isSize = file.size / 1024 / 1024 > 5
                    if (isSize) {
                      return Promise.reject(
                        '5MB以下のファイルのみアップロードできます',
                      )
                    }
                    if (!isCSV) {
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
                style={{ border: '2px dashed #d9d9d9', textAlign: 'center' }}
                accept=".csv"
                name="file"
                maxCount={1}
                beforeUpload={() => false}
              >
                <FileAddOutlined
                  style={{ fontSize: 40, color: '#999', marginBottom: 12 }}
                />
                <Paragraph style={{ marginBottom: 8, color: '#555' }}>
                  {t('product_categories.csv.step_1.dragDrop')}
                </Paragraph>
                <Paragraph type="secondary" style={{ marginBottom: 20 }}>
                  {t('product_categories.csv.step_1.orSelectFile')}
                </Paragraph>
                <Button type="primary" size="large">
                  {t('product_categories.csv.step_1.selectFileButton')}
                </Button>
              </Dragger>
            </Form.Item>

            <Card
              size="small"
              title={t('product_categories.csv.step_1.noteTitle')}
              headStyle={{ borderBottom: 'none' }}
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
                {t('product_categories.csv.buttons.back')}
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  setIsResult(true)
                }}
              >
                {t('product_categories.csv.buttons.nextStep')}
              </Button>
            )}
          </div>
        </div>
      </Form>
    </PageContainer>
  )
}

export default CSVContainer

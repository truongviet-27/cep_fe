/* eslint-disable simple-import-sort/imports */
import LoadingImport from '@/assets/svg/loading.svg'
import {
  DownloadOutlined,
  FileAddOutlined,
  RightOutlined,
} from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import { axiosInstance } from '@providers/data-provider/rest-data-provider/utils'
import { useForm } from '@refinedev/antd'
import {
  Link,
  useApiUrl,
  useCustomMutation,
  useGo,
  useTranslate,
} from '@refinedev/core'
import boldText from '@utility/bold-text'
import { cn } from '@utility/cn'
import { BLACK, GREY, PRIMARY } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Card,
  Form,
  List,
  Radio,
  Space,
  Typography,
} from 'antd'
import Dragger from 'antd/es/upload/Dragger'
import axios from 'axios'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import Papa from 'papaparse'
import { detectEncodingWithInfo } from '@utility/encoding-sjis'

const { Text, Paragraph } = Typography

// Define required headers for each CSV type (using Japanese column names)
const REQUIRED_HEADERS: Record<string, string[]> = {
  CATEGORY_PRODUCTS: ['カテゴリレベル', 'カテゴリ名'],
  CUSTOMERS: [
    '取引先コード',
    '取引先名',
    '郵便番号',
    '住所',
    '電話番号',
    'メールアドレス',
    '担当者名',
    '担当者部署',
    '担当者メール',
  ],
  DEPARTMENTS: ['部門コード', '部門名（支社/部/課）'],
  PRODUCTS: [
    '商品コード',
    '商品名',
    'カテゴリ',
    '単位',
    '原価（円）',
    '販売単価（円）',
    '荷姿名',
    '入数',
  ],
}

const nameToUrlMap: Record<string, string> = {
  PRODUCTS: 'products',
  CATEGORY_PRODUCTS: 'product-categories',
  CUSTOMERS: 'customers',
  DEPARTMENTS: 'departments',
}

function ImportCsv({
  name,
}: {
  name: 'PRODUCTS' | 'CATEGORY_PRODUCTS' | 'CUSTOMERS' | 'DEPARTMENTS'
}) {
  const t = useTranslate()
  const methods = useForm()
  const { formProps, form } = methods

  const [isResult, setIsResult] = useState(false)
  const [isError, setIsError] = useState(true)
  const [registrationType, setRegistrationType] = useState<'basic' | 'detail'>(
    'basic',
  )

  const { mutate } = useCustomMutation()
  const { mutate: mutate2 } = useCustomMutation()

  const apiUrl = useApiUrl()

  const go = useGo()

  // Check if this is a special case that needs two import options
  const hasTwoImportOptions = name === 'CUSTOMERS' || name === 'PRODUCTS'

  // Helper function to get API name with '_DETAIL' suffix when needed
  const getApiName = (type?: 'basic' | 'detail') => {
    return hasTwoImportOptions && type === 'detail' ? `${name}_DETAIL` : name
  }

  const handleDownload = async (type?: 'basic' | 'detail') => {
    const apiName = getApiName(type)
    const endpoint = `${apiUrl}/csv-imports/${apiName}/template`

    const response = await axiosInstance.get(endpoint, {
      responseType: 'blob',
    })

    if (!response?.data) return

    const filename = `${apiName.toLowerCase()}_example.csv`

    const url = URL.createObjectURL(response.data)
    const downloadLink = document.createElement('a')
    downloadLink.href = url
    downloadLink.download = filename
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    if (isResult) {
      const apiName = getApiName(registrationType)

      mutate(
        {
          method: 'post',
          url: `${apiUrl}/${apiName}/presigned-url`,
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
                  url: `${apiUrl}/csv-imports/${apiName}/import`,
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
  }, [isResult, registrationType, name])

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
              title: boldText(t(`csv.${name.toLowerCase()}.title`), PRIMARY),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={t(`csv.${name.toLowerCase()}.title`)}
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
                {t('csv.step_1.result.title')}
              </Text>

              <Link
                to="/import-history"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginBottom: 24,
                }}
              >
                {t('csv.step_1.result.redirect')}
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

              {hasTwoImportOptions ? (
                <div className="mt-[8px] flex flex-col items-start">
                  <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    style={{ paddingLeft: 0, height: 'unset' }}
                    onClick={() => handleDownload('basic')}
                  >
                    {t(
                      'csv.step_1.twoOptions.' +
                        name.toLowerCase() +
                        '.basicTemplate',
                    )}
                  </Button>
                  <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    style={{ paddingLeft: 0, height: 'unset' }}
                    onClick={() => handleDownload('detail')}
                  >
                    {t(
                      'csv.step_1.twoOptions.' +
                        name.toLowerCase() +
                        '.detailTemplate',
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  type="link"
                  icon={<DownloadOutlined />}
                  style={{ paddingLeft: 0 }}
                  onClick={() => handleDownload('basic')}
                >
                  {t('csv.step_1.downloadButton')}
                </Button>
              )}
            </div>
            {hasTwoImportOptions && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Text strong style={{ fontSize: 16 }}>
                    {t('csv.step_1.twoOptions.registrationLabel')}
                  </Text>
                  <Radio.Group
                    value={registrationType}
                    onChange={(e) => setRegistrationType(e.target.value)}
                    style={{ display: 'flex', gap: 24 }}
                  >
                    <Radio value="basic">
                      {t(
                        'csv.step_1.twoOptions.' +
                          name.toLowerCase() +
                          '.basicInfo',
                      )}
                    </Radio>
                    <Radio value="detail">
                      {t(
                        'csv.step_1.twoOptions.' +
                          name.toLowerCase() +
                          '.detailInfo',
                      )}
                    </Radio>
                  </Radio.Group>
                </div>
              </div>
            )}

            <Form.Item
              layout="vertical"
              name={'file'}
              rules={[
                {
                  required: true,
                  message: t('csv.step_1.error.required'),
                },
                {
                  validator: async (_, fileList) => {
                    setIsError(false)
                    const file = fileList.file

                    const isCSV = file.name.toLowerCase().endsWith('.csv')
                    if (!isCSV) {
                      setIsError(true)
                      return Promise.reject(
                        <div style={{ whiteSpace: 'pre-line' }}>
                          {t('csv.step_1.error.pattern')}
                        </div>,
                      )
                    }

                    // check file name <= 255 characters
                    if (file.name.length > 255) {
                      setIsError(true)
                      return Promise.reject(
                        <div style={{ whiteSpace: 'pre-line' }}>
                          {t('csv.validation_error.max_name_file')}
                        </div>,
                      )
                    }

                    // Check file size <= 5MB
                    const isTooLarge = file.size / 1024 / 1024 > 5
                    if (isTooLarge) {
                      setIsError(true)
                      return Promise.reject(t('csv.step_1.error.5mb'))
                    }

                    // read file content
                    const arrayBuffer = await file.arrayBuffer()

                    const encodingInfo = detectEncodingWithInfo(arrayBuffer)
                    console.log('Encoding info:', encodingInfo)
                    // Validate encoding
                    const supportedEncodings = [
                      'UTF-8',
                      'UTF-8 (BOM)',
                      'Shift-JIS',
                      'SJIS',
                    ]
                    const isSupported = supportedEncodings.some((enc) =>
                      encodingInfo.encoding
                        .toUpperCase()
                        .includes(enc.toUpperCase()),
                    )

                    if (!isSupported) {
                      setIsError(true)
                      return Promise.reject(
                        <div style={{ whiteSpace: 'pre-line' }}>
                          {t('csv.step_1.error.pattern') +
                            ` (${encodingInfo.encoding})`}
                        </div>,
                      )
                    }

                    // Convert to UTF-8 if necessary
                    const utf8Text = encodingInfo.decodedText || ''
                    const detectedEncoding = encodingInfo.encoding

                    console.log('Final detected encoding:', detectedEncoding)

                    // Validate CSV content using PapaParse
                    const result = Papa.parse(utf8Text, {
                      skipEmptyLines: true,
                    })
                    const numLines = result.data.length

                    if (numLines === 0) {
                      setIsError(true)
                      return Promise.reject(
                        <div style={{ whiteSpace: 'pre-line' }}>
                          {t('csv.step_1.error.file_empty')}
                        </div>,
                      )
                    }

                    if (numLines > 1000) {
                      setIsError(true)
                      return Promise.reject(
                        <div style={{ whiteSpace: 'pre-line' }}>
                          {t('csv.step_1.error.max_rows')}
                        </div>,
                      )
                    }

                    // Validate required headers
                    const headers = result.data[0] as string[]
                    const requiredHeaders = REQUIRED_HEADERS[name] || []
                    const missingHeaders = requiredHeaders.filter(
                      (requiredHeader) =>
                        !headers.some(
                          (header) => header?.trim() === requiredHeader.trim(),
                        ),
                    )
                    if (headers.length === 0) {
                      setIsError(true)
                      return Promise.reject(
                        <div style={{ whiteSpace: 'pre-line' }}>
                          {t('csv.step_1.error.missing_headers')}
                        </div>,
                      )
                    }

                    if (missingHeaders.length > 0) {
                      setIsError(true)
                      return Promise.reject(
                        <div style={{ whiteSpace: 'pre-line' }}>
                          {missingHeaders.join(', ')} :{' '}
                          {t('csv.step_1.error.required_column')}
                        </div>,
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
                renderItem={(item) => (
                  <List.Item style={{ padding: 2 }}>・{item}</List.Item>
                )}
              />
            </Card>
          </Space>
        )}

        <div className="mt-4 flex justify-end">
          <div className="flex justify-end gap-4">
            <Button
              type="default"
              onClick={() => {
                go({
                  to: `/${nameToUrlMap[name]}`,
                  type: 'replace',
                })
              }}
            >
              {!isResult
                ? t('csv.buttons.back')
                : t(`csv.${name.toLowerCase()}.back_to_list`)}
            </Button>

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

export default ImportCsv

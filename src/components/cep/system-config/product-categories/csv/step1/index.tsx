import { DownloadOutlined, FileAddOutlined } from '@ant-design/icons'
import useStep1 from '@components/cep/system-config/product-categories/csv/step1/useStep1'
import {
  Alert,
  Button,
  Card,
  Form,
  List,
  Space,
  Typography,
  Upload,
} from 'antd'
import Dragger from 'antd/es/upload/Dragger'

const { Text, Paragraph } = Typography

function Step1() {
  const [{ dataSource }, { t, mutate }] = useStep1()

  return (
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
            message: t('product_categories.csv.step_1.requiredError'),
          },
        ]}
      >
        <Card>
          <Dragger
            style={{ border: '2px dashed #d9d9d9', textAlign: 'center' }}
            accept=".csv"
            name="file"
            maxCount={1}
            showUploadList={true}
            beforeUpload={(file) => {
              const isCSV =
                file.type === 'text/csv' || file.name.endsWith('.csv')
              if (!isCSV) {
                return Upload.LIST_IGNORE
              }
              if (file.size / 1024 / 1024 > 10) {
                return Upload.LIST_IGNORE
              }

              return true
            }}
            customRequest={({ file, onSuccess }) => {
              const formData = new FormData()
              formData.append('file', file)
              formData.append('type', 'product-categories')
              mutate(
                {
                  resource: 'csv-imports/validate',
                  values: formData,
                  meta: {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  },
                },
                {
                  onSuccess: () => {
                    onSuccess?.('ok')
                  },
                },
              )
            }}
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
        </Card>
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
  )
}

export default Step1

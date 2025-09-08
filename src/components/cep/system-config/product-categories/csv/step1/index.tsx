import {
  DownloadOutlined,
  FileAddOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import useStep1 from '@components/cep/system-config/product-categories/csv/step1/useStep1'
import {
  Alert,
  Button,
  Card,
  Form,
  List,
  message,
  Space,
  Typography,
  Upload,
} from 'antd'

const { Text, Paragraph } = Typography

function Step1() {
  const [{ dataSource }, { t, handleUpload }] = useStep1()

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

      <Card
        style={{ border: '2px dashed #d9d9d9', textAlign: 'center' }}
        bodyStyle={{ padding: '40px 20px' }}
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
          <Upload
            accept=".csv"
            name="file"
            method="post"
            maxCount={1}
            showUploadList={true}
            beforeUpload={(file) => {
              const isCSV =
                file.type === 'text/csv' || file.name.endsWith('.csv')
              if (!isCSV) {
                message.error(t('product_categories.csv.step_1.onlyCSVError'))
                return Upload.LIST_IGNORE
              }
              if (file.size / 1024 / 1024 > 10) {
                message.error(t('product_categories.csv.step_1.maxSizeError'))
                return Upload.LIST_IGNORE
              }

              handleUpload(file)

              return true
            }}
          >
            <Button icon={<UploadOutlined />} type="primary" size="large">
              {t('product_categories.csv.step_1.selectFileButton')}
            </Button>
          </Upload>
        </Form.Item>
      </Card>

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

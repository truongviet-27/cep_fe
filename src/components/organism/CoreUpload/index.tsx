import { UploadOutlined } from '@ant-design/icons'
import { Button, message, Upload } from 'antd'
import type { RcFile } from 'antd/es/upload'

function CoreUpload({
  handleUpload,
}: {
  handleUpload: (file: RcFile) => void
}) {
  return (
    <Upload
      accept=".csv"
      name="file"
      method="post"
      maxCount={1}
      showUploadList={true}
      beforeUpload={(file) => {
        const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv')
        if (!isCSV) {
          message.error('CSVファイルのみアップロード可能です。')
          return Upload.LIST_IGNORE
        }
        if (file.size / 1024 / 1024 > 10) {
          message.error('ファイルサイズは最大5MBです。')
          return Upload.LIST_IGNORE
        }

        handleUpload(file)

        return true
      }}
    >
      <Button icon={<UploadOutlined />} type="primary" size="large">
        ファイルを選択
      </Button>
    </Upload>
  )
}

export default CoreUpload

import { CheckCircleTwoTone } from '@ant-design/icons'
import useStep4 from '@components/cep/system-config/product-categories/csv/step4/useStep4'
import { Card, Typography } from 'antd'

const { Text } = Typography

function Step4() {
  const [{ form }, {}] = useStep4()
  const {} = form
  return (
    <Card bordered>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 32 }} />
      </div>
      <Text
        type="success"
        strong
        style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}
      >
        {/* CSV一括登録が正常に完了できました。 */}
      </Text>

      <div>
        {/* <div>成功件数：10件</div>
        <div>処理時間：00:01:30</div>
        <div>完了時間：2025/09/07 23:12:30</div>
        <div>
          選択ファイル：
          <Text strong>【eeRP】部門CSV一括登録用テンプレート.csv</Text>
        </div> */}
      </div>
    </Card>
  )
}

export default Step4

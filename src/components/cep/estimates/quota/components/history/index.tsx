import CommonTable from '@components/common/table'
import { Card, Flex, Typography } from 'antd'

const { Title } = Typography

function History() {
  return (
    <Card
      title={'履歴'}
      headStyle={{
        padding: 0,
        minHeight: 0,
      }}
      bodyStyle={{
        padding: 0,
      }}
      style={{
        border: 'none',
        marginTop: 40,
      }}
    >
      <Flex vertical style={{ padding: 20 }}>
        <div className="mb-4">
          <Title level={5}>承認履歴</Title>
          <CommonTable />
        </div>
        <div>
          <Title level={5}>承認履歴</Title>
          <CommonTable />
        </div>
      </Flex>
    </Card>
  )
}

export default History

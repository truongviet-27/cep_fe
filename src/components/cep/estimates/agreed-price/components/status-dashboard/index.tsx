import { Card, Statistic } from 'antd'

const StatusDashboard = ({
  statusData,
  status,
  onChangeStatus,
}: {
  statusData: {
    title: string
    value: number
    color?: string
    key: string | null
  }[]
  status: string | null
  onChangeStatus: (status: string | null) => void
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      {statusData.map((item) => (
        <Card
          key={item.key}
          style={{
            width: '100%',
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            border:
              status === item.key ? '2px solid #1677ff' : '1px solid #f0f0f0',
            background: status === item.key ? '#E6F7FF' : '',
          }}
          onClick={() => {
            onChangeStatus(item.key)
          }}
          bodyStyle={{
            width: '100%',
            textAlign: 'center',
            padding: '10px 10px',
          }}
        >
          <Statistic
            value={item.value}
            valueStyle={{ color: item.color || 'inherit', fontSize: 16 }}
          />
          <div style={{ marginTop: 8, fontSize: 12 }}>{item.title}</div>
        </Card>
      ))}
    </div>
  )
}

export default StatusDashboard

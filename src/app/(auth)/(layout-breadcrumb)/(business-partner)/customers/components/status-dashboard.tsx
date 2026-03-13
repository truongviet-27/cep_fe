import { Card, Statistic } from 'antd'

const StatusDashboard = ({
  statusData,
  status,
  onChangeStatus,
}: {
  statusData: {
    title: string
    value: number
    background?: string
    color?: string
    key: string | null
  }[]
  status: string | null
  onChangeStatus: (status: string | null) => void
}) => {
  return (
    <div className="mb-4 flex flex-wrap gap-4">
      {statusData.map((item) => (
        <Card
          key={item.key}
          className="status-card-hover"
          style={{
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            border: '1px solid #f0f0f0',
            boxShadow: status === item.key ? 'inset 0 0 0 2px #1677ff' : 'none',
            background:
              status === item.key ? (item.background ?? '#E6F7FF') : '',
            transition: 'all 0.2s ease',
          }}
          onClick={() => {
            onChangeStatus(item.key)
          }}
          styles={{
            body: {
              width: '100%',
              textAlign: 'center',
              padding: '10px 10px',
            },
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

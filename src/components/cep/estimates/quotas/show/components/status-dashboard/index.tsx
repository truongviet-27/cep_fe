import { Card, Statistic } from 'antd'
import React, { useState } from 'react'

const StatusDashboard: React.FC = () => {
  const [status, setStatus] = useState('ALL')
  const statusData = [
    { title: 'すべて', value: 9222, key: 'ALL' },
    { title: '作成中', value: 4, key: 'CREATING' },
    { title: '承認待', value: 3, color: '#faad14', key: 'PENDING_APPROVAL' }, // vàng
    { title: '承認済', value: 11, color: '#1890ff', key: 'APPROVED' }, // xanh
    { title: '送信中', value: 10, key: 'SENDING' },
    { title: '送信済', value: 9100, color: '#1677ff', key: 'SENT' }, // xanh đậm
    { title: '進度', value: 96, color: '#fa541c', key: 'PROGRESS' }, // cam
    { title: '受注', value: 4, color: '#52c41a', key: 'WON' }, // xanh lá
    { title: '失注', value: 4, color: '#ff4d4f', key: 'LOST' }, // đỏ
  ]

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
              status === item.key ? '2px solid #1677ff ' : '1px solid #f0f0f0',
            background: status === item.key ? '#E6F7FF' : '',
          }}
          onClick={() => {
            setStatus(item.key)
          }}
          styles={{
            body: { width: '100%', textAlign: 'center' },
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

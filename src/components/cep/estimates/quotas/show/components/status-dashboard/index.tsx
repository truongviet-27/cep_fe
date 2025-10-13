import { useTranslate } from '@refinedev/core'
import { Card, Statistic } from 'antd'
import React, { useState } from 'react'

const StatusDashboard: React.FC = () => {
  const t = useTranslate()
  const [status, setStatus] = useState('ALL')
  const statusData = [
    { title: t('quotas.status.all'), value: 9222, key: 'ALL' },
    { title: t('quotas.status.creating'), value: 4, key: 'CREATING' },
    {
      title: t('quotas.status.waiting_approval'),
      value: 3,
      color: '#faad14',
      key: 'PENDING_APPROVAL',
    }, // vàng
    {
      title: t('quotas.status.approved'),
      value: 11,
      color: '#1890ff',
      key: 'APPROVED',
    }, // xanh
    { title: t('quotas.status.sent_to_customer'), value: 10, key: 'SENDING' },
    {
      title: t('quotas.status.sent_to_customer'),
      value: 9100,
      color: '#1677ff',
      key: 'SENT',
    }, // xanh đậm
    {
      title: t('quotas.status.rejected'),
      value: 96,
      color: '#fa541c',
      key: 'PROGRESS',
    }, // cam
    {
      title: t('quotas.status.completed'),
      value: 4,
      color: '#52c41a',
      key: 'WON',
    }, // xanh lá
    {
      title: t('quotas.status.cancelled'),
      value: 4,
      color: '#ff4d4f',
      key: 'LOST',
    }, // đỏ
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

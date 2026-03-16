import {
  QuotaStatus,
  STATUS_DISABLED_WHEN_OFF_APPROVE_ROUTE,
} from '@components/cep/estimates/quotas/enum'
import { Card, Spin } from 'antd'

const StatusDashboard = ({
  statusData,
  status,
  onChangeStatus,
  isLoading,
  useApproveRoute,
}: {
  statusData: {
    title: string
    value: number
    total_amount: string
    color?: string
    key: string | null
  }[]
  status: string | null
  onChangeStatus: (status: string | null) => void
  useApproveRoute: boolean
  isLoading: boolean
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      {statusData.map((item) => {
        const checkDisableCard =
          !useApproveRoute &&
          item.key &&
          STATUS_DISABLED_WHEN_OFF_APPROVE_ROUTE.indexOf(item.key) > -1

        return (
          <Card
            key={item.key}
            className={!checkDisableCard ? 'status-card-hover' : ''}
            style={{
              cursor: checkDisableCard ? '' : 'pointer',
              width: '100%',
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              border: '1px solid #f0f0f0',
              boxShadow:
                status === item.key ? 'inset 0 0 0 2px #1677ff' : 'none',
              background: checkDisableCard
                ? '#D4D4D4'
                : status === item.key
                  ? '#E6F7FF'
                  : '',
              transition: 'all 0.2s ease',
            }}
            onClick={() => {
              if (!checkDisableCard) {
                onChangeStatus(item.key === QuotaStatus.Total ? null : item.key)
              }
            }}
            styles={{
              body: {
                width: '100%',
                textAlign: 'center',
                padding: '10px 10px',
              },
            }}
          >
            {isLoading ? (
              <Spin size="small" />
            ) : (
              <>
                <div style={{ color: item.color || 'inherit', fontSize: 16 }}>
                  {item.value}
                </div>
                {item.key && (
                  <div style={{ fontSize: 16 }}>({item.total_amount})</div>
                )}
              </>
            )}
            <div style={{ marginTop: 8, fontSize: 12 }}>{item.title}</div>
          </Card>
        )
      })}
    </div>
  )
}

export default StatusDashboard

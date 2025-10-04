import { DollarOutlined, FileTextOutlined } from '@ant-design/icons'
import TabsAgreedPriceContent from '@components/cep/estimates/agreed-price/tabs/content'
import { useTranslate } from '@refinedev/core'
import { Card, Tabs } from 'antd'
import { useMemo } from 'react'

function TabsAgreedPrice({
  isEdit,
  onChange,
  isLoading,
  activeKey,
}: {
  isEdit: boolean
  onChange: (value: string) => void
  isLoading: boolean
  activeKey?: string
}) {
  const t = useTranslate()

  const items = useMemo(() => {
    return [
      {
        key: 'agreed_price_quota',
        label: t('agreed_prices.tab.decided_estimate_list'),
        children: (
          <Card
            styles={{
              header: {
                backgroundColor: '#F0F9FF',
              },
            }}
            title={
              <div className="flex items-center justify-start gap-4">
                <FileTextOutlined
                  style={{
                    fontSize: '20px',
                    color: '#1890FF',
                  }}
                />
                {t('agreed_prices.tab.decided_estimate_list')}
              </div>
            }
          >
            <TabsAgreedPriceContent index={1} />
          </Card>
        ),
      },
      {
        key: 'agreed_price_customer',
        label: t('agreed_prices.tab.agreed_price_by_customer'),
        children: (
          <Card
            styles={{
              header: {
                backgroundColor: '#F0F9FF',
              },
            }}
            title={
              <div className="flex items-center justify-start gap-4">
                <DollarOutlined
                  style={{
                    fontSize: '20px',
                    color: '#1890FF',
                  }}
                />
                {t('agreed_prices.tab.agreed_price_by_customer')}
              </div>
            }
          >
            <TabsAgreedPriceContent index={2} />
          </Card>
        ),
      },
    ]
  }, [isEdit, isLoading, t])

  return (
    <Tabs
      destroyOnHidden
      items={items}
      onChange={onChange}
      activeKey={activeKey}
    />
  )
}

export default TabsAgreedPrice

import TabsAgreedPriceContent from '@components/cep/estimates/agreed-price/tabs/content'
import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
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
            title={t('agreed_prices.tab.decided_estimate_list')}
            styles={{
              header: {
                color: PRIMARY,
                border: 0,
                minHeight: 0,
                padding: 0,
                marginBottom: 16,
                marginTop: 8,
              },
              body: {
                border: 0,
                padding: 0,
              },
            }}
            style={{ border: 0 }}
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
            title={t('agreed_prices.tab.agreed_price_by_customer')}
            styles={{
              header: {
                color: PRIMARY,
                border: 0,
                minHeight: 0,
                padding: 0,
                marginBottom: 8,
                marginTop: 8,
              },
              body: {
                border: 0,
                padding: 0,
              },
            }}
            style={{ border: 0 }}
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

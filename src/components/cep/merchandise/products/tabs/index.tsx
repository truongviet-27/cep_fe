import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Card, Tabs } from 'antd'
import { useMemo } from 'react'

import TabsProductContent from './content'

export default function TabsProduct({
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
        key: 'product',
        label: t('products.breadcrumb.productList'),
        children: (
          <Card
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
            <TabsProductContent index={1} />
          </Card>
        ),
      },
      {
        key: 'combo',
        label: t('products.breadcrumb.productCombos'),
        children: (
          <Card
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
            <TabsProductContent index={2} />
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

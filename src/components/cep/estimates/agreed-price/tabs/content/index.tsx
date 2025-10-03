import { useTranslate } from '@refinedev/core'
import React from 'react'

import AgreedPriceByCustomerTab from './AgreedPriceByCustomerTab'
import AgreedPriceQuotaTab from './AgreedPriceQuotaTab'

function TabsAgreedPriceContent({ index }: { index: number }) {
  const t = useTranslate()

  if (index === 1) {
    return <AgreedPriceQuotaTab />
  }

  if (index === 2) {
    return <AgreedPriceByCustomerTab />
  }

  return (
    <div className="space-y-6">
      <div className="py-8 text-center text-gray-500">
        {t('agreed_price.tab.agreed_price_by_customer')} -{' '}
        {t('common.coming_soon')}
      </div>
    </div>
  )
}

export default TabsAgreedPriceContent

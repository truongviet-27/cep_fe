import { useTranslate } from '@refinedev/core'
import React from 'react'

import AssortmentTab from './AssortmentTab'
import ProductTab from './ProductTab'

function TabsProductContent({ index }: { index: number }) {
  const t = useTranslate()

  if (index === 1) {
    return <ProductTab />
  }

  if (index === 2) {
    return <AssortmentTab />
  }

  return (
    <div className="space-y-6">
      <div className="py-8 text-center text-gray-500">
        {t('agreed_prices.tab.agreed_price_by_customer')} -{' '}
        {t('common.coming_soon')}
      </div>
    </div>
  )
}

export default TabsProductContent

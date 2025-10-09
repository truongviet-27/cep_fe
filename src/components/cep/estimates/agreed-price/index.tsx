'use client'
/* eslint-disable simple-import-sort/imports */

import { RightOutlined } from '@ant-design/icons'
import { useTranslate } from '@refinedev/core'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import TabsAgreedPrice from '@components/cep/estimates/agreed-price/tabs'
import PageContainer from '@components/common/page-container'
import Breadcrumbs from '@components/layout/breadcrumbs'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'

function AgreedPriceList() {
  const t = useTranslate()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isEdit] = useState(false)
  const [isLoading] = useState(false)

  const currentTabKey = useMemo(() => {
    const urlTab = searchParams?.get('tab')
    return urlTab === 'agreed_price_customer'
      ? 'agreed_price_customer'
      : 'agreed_price_quota'
  }, [searchParams])

  const onChangeTabs = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set('tab', value)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const breadcrumbItems = [
    {
      title: boldText(t('estimates.estimates')),
    },
    {
      title: boldText(t('agreed_prices.parent'), PRIMARY),
    },
  ]

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      title={t('agreed_prices.parent')}
    >
      <TabsAgreedPrice
        isEdit={isEdit}
        onChange={onChangeTabs}
        isLoading={isLoading}
        activeKey={currentTabKey}
      />
    </PageContainer>
  )
}

export default AgreedPriceList

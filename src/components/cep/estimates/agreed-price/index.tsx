'use client'
/* eslint-disable simple-import-sort/imports */

import { RightOutlined } from '@ant-design/icons'
import { useTranslate } from '@refinedev/core'

import PageContainer from '@components/common/page-container'
import Breadcrumbs from '@components/layout/breadcrumbs'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import AgreedPriceQuotaTab from './tabs/content/AgreedPriceQuotaTab'

function AgreedPriceList() {
  const t = useTranslate()

  const breadcrumbItems = [
    {
      title: boldText(t('estimates.estimates')),
    },
    {
      title: boldText(t('agreed_prices.title'), PRIMARY),
    },
  ]

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      title={t('agreed_prices.title')}
    >
      <AgreedPriceQuotaTab />
    </PageContainer>
  )
}

export default AgreedPriceList

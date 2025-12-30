'use client'
/* eslint-disable simple-import-sort/imports */

import { RightOutlined } from '@ant-design/icons'
import { useTranslate } from '@refinedev/core'

import PageContainer from '@components/common/page-container'
import Breadcrumbs from '@components/layout/breadcrumbs'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import AgreedPriceByCustomerTab from '@components/cep/estimates/agreed-price/tabs/content/AgreedPriceByCustomerTab'

export default function AgreedPriceCustomer() {
  const t = useTranslate()
  const breadcrumbItems = [
    {
      title: boldText(t('estimates.estimates')),
    },
    {
      title: boldText(t('continuous_quotes_by_customer.title'), PRIMARY),
    },
  ]

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      title={t('continuous_quotes_by_customer.title')}
    >
      <span className="text-[16px]">
        {t('continuous_quotes_by_customer.description')}
      </span>
      <AgreedPriceByCustomerTab />
    </PageContainer>
  )
}

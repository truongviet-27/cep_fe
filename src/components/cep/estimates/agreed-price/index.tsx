import { RightOutlined } from '@ant-design/icons'
import TabsAgreedPrice from '@components/cep/estimates/agreed-price/tabs'
import PageContainer from '@components/common/page-container'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Typography } from 'antd'
import React, { useState } from 'react'

const { Title } = Typography

function AgreedPriceList() {
  const t = useTranslate()
  const [isEdit] = useState(false)
  const [isLoading] = useState(false)
  const [indexTab, setIndexTab] = useState(1)

  const onChangeTabs = (value: string) => {
    setIndexTab(value === 'decided_estimate_list' ? 1 : 2)
  }

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('estimates.estimates')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('agreed_price.agreed_price')}</Title>,
    },
  ]

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      title={t('agreed_price.agreed_price')}
    >
      <TabsAgreedPrice
        isEdit={isEdit}
        onChange={onChangeTabs}
        isLoading={isLoading}
        indexTab={indexTab}
      />
    </PageContainer>
  )
}

export default AgreedPriceList

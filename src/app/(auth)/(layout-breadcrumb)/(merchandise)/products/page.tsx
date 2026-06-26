'use client'
import { RightOutlined } from '@ant-design/icons'
import TabsProduct from '@components/cep/merchandise/products/tabs'
import PageContainer from '@components/common/page-container'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Breadcrumb } from 'antd'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'

function Page() {
  const t = useTranslate()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isEdit] = useState(false)
  const [isLoading] = useState(false)

  const currentTabKey = useMemo(() => {
    const urlTab = searchParams?.get('tab')
    return urlTab === 'combo' ? 'combo' : 'product'
  }, [searchParams])

  const onChangeTabs = (value: string) => {
    router.replace(`${pathname}?tab=${value}`)
  }

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: boldText(t('products.breadcrumb.home')),
            },
            {
              title: boldText(t('products.breadcrumb.productList'), PRIMARY),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
    >
      {boldText(t('products.breadcrumb.productList'), PRIMARY)}
      <TabsProduct
        isEdit={isEdit}
        onChange={onChangeTabs}
        isLoading={isLoading}
        activeKey={currentTabKey}
      />
    </PageContainer>
  )
}

export default Page

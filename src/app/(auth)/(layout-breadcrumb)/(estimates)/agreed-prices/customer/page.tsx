// Temporarily disabled - agreed-prices/customer route
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// /* eslint-disable simple-import-sort/imports */
//
// import { RightOutlined } from '@ant-design/icons'
// import { useTranslate } from '@refinedev/core'
//
// import PageContainer from '@components/common/page-container'
// import Breadcrumbs from '@components/layout/breadcrumbs'
// import boldText from '@utility/bold-text'
// import { PRIMARY } from '@utility/color'
// import AgreedPriceByCustomerTab from '@components/cep/estimates/agreed-price/tabs/content/AgreedPriceByCustomerTab'
// import Link from 'next/link'
//
// export default function AgreedPriceCustomer() {
//   const t = useTranslate()
//   const breadcrumbItems = [
//     {
//       title: (
//         <Link href="/customers">
//           {boldText(t('continuous_quotes_by_customer.parent_title'))}
//         </Link>
//       ),
//     },
//     {
//       title: boldText(t('continuous_quotes_by_customer.title'), PRIMARY),
//     },
//   ]
//
//   return (
//     <PageContainer
//       breadcrumbs={
//         <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
//       }
//       title={t('continuous_quotes_by_customer.title')}
//     >
//       <span className="text-[16px]">
//         {t('continuous_quotes_by_customer.description')}
//       </span>
//       <AgreedPriceByCustomerTab />
//     </PageContainer>
//   )
// }

export default function AgreedPriceCustomer() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/404')
  }, [router])

  return null
}

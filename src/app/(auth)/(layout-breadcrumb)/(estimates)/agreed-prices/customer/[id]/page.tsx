// Temporarily disabled - agreed-prices/customer route
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// import AgreedPriceCustomerDetail from '@components/cep/estimates/agreed-price/customer-detail'
//
// function Page() {
//   return <AgreedPriceCustomerDetail />
// }
//
// export default Page

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/404')
  }, [router])

  return null
}

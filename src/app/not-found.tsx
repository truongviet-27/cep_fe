'use client'

import { ErrorComponent } from '@refinedev/antd'
import { Authenticated, useGo } from '@refinedev/core'
import { Suspense } from 'react'

export default function NotFound() {
  const go = useGo()

  go({
    to: '/404',
  })

  return (
    <Suspense>
      <Authenticated key="not-found">
        <ErrorComponent />
      </Authenticated>
    </Suspense>
  )
}

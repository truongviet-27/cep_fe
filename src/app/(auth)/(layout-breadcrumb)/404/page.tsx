'use client'

import { useTranslate } from '@refinedev/core'
import { Result } from 'antd'

function Page() {
  const t = useTranslate()

  return <Result status="404" title="404" subTitle={t('notFoundPageMessage')} />
}

export default Page

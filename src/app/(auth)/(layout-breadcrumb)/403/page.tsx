'use client'

import { useTranslate } from '@refinedev/core'
import { Result } from 'antd'

function Page() {
  const t = useTranslate()

  return <Result status="403" title="403" subTitle={t('forbiddenMessage')} />
}

export default Page

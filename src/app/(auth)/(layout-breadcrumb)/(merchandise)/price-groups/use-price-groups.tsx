'use client'

import { useTranslate } from '@refinedev/core'

function usePriceGroups() {
  const t = useTranslate()

  return { t }
}

export default usePriceGroups

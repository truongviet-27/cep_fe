import { useTranslate } from '@refinedev/core'

function useProduct() {
  const t = useTranslate()
  return [{}, { t }] as const
}

export default useProduct

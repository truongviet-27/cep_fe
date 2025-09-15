import { useTranslate } from '@refinedev/core'

function useApproveAction() {
  const t = useTranslate()
  return [{}, { t }] as const
}

export default useApproveAction

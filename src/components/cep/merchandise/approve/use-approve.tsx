import { useForm } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'

function useApprove() {
  const t = useTranslate()
  const methods = useForm()
  return [{ methods }, { t }] as const
}

export default useApprove

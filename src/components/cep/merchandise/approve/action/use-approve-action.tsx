import { useForm } from '@refinedev/antd'
import { useCustom, useParsed, useTranslate } from '@refinedev/core'

function useApproveAction() {
  const t = useTranslate()
  const methods = useForm()

  const { params } = useParsed()

  const isUpdate = !!params?.id

  const {} = useCustom({
    method: 'get',
    url: 'approve',
    queryOptions: {
      enabled: isUpdate,
    },
  })

  return [{ methods }, { t }] as const
}

export default useApproveAction

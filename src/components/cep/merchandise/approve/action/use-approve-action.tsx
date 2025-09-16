import { useForm } from '@refinedev/antd'
import { useCustom, useParsed, useTranslate } from '@refinedev/core'
import { useState } from 'react'

type Form = {
  code: string
  name: string
  department: { id: number; name: string; code: string }[]
  status: boolean
  steps: {
    name: number
    step_order: number
    is_multi_appover: boolean
    employees: { id: number; department: object }[]
  }[]
}
function useApproveAction() {
  const t = useTranslate()
  const methods = useForm<Form>()

  const { params } = useParsed()

  const isUpdate = !!params?.id

  const [isMultiAppover, setIsMultiApprove] = useState(false)

  const {} = useCustom({
    method: 'get',
    url: 'approve',
    queryOptions: {
      enabled: isUpdate,
    },
  })

  return [
    { methods, isMultiAppover, isUpdate },
    { t, setIsMultiApprove },
  ] as const
}

export default useApproveAction

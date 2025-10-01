import { useTable } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'

export const useController = () => {
  const t = useTranslate()

  const { tableProps, searchFormProps } = useTable({
    resource: 'quota-templates',
    filters: {},
    queryOptions: {
      enabled: false,
    },
  })

  return {
    tableProps,
    searchFormProps,
    t,
  } as const
}

import type {
  QuotaTemplateListItemType,
  SearchQuotaTemplateType,
} from '@interfaces/quota-templates'
import { useTable } from '@refinedev/antd'
import type { HttpError } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'

export const useController = () => {
  const t = useTranslate()

  const { tableProps, searchFormProps, setFilters } = useTable<
    QuotaTemplateListItemType,
    HttpError,
    SearchQuotaTemplateType
  >({
    pagination: { pageSize: 20 },
    resource: 'quota-templates',
    filters: {},
    onSearch: (params) => {
      let startDate = ''
      let endDate = ''

      if (params?.start_to_end_date) {
        startDate = params.start_to_end_date[0].format('YYYY-MM-DD')
        endDate = params.start_to_end_date[1].format('YYYY-MM-DD')
      }

      return [
        {
          field: 'name_lk',
          operator: 'eq',
          value: params.name_lk ?? null,
        },
        {
          field: 'created_by',
          operator: 'eq',
          value:
            typeof params?.created_by === 'object' &&
            params?.created_by != null &&
            'value' in params?.created_by
              ? (params?.created_by as { value: number }).value
              : params?.created_by,
        },
        {
          field: 'start_date',
          operator: 'eq',
          value: startDate ?? null,
        },
        {
          field: 'end_date',
          operator: 'eq',
          value: endDate ?? null,
        },
      ]
    },
  })

  return {
    tableProps,
    searchFormProps,
    t,
    setFilters,
  } as const
}

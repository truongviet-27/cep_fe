import type { QuotaTemplateFormType } from '@interfaces/quota-templates'
import { useForm } from '@refinedev/antd'
import type { GetOneResponse } from '@refinedev/core'
import { useApiUrl, useCustom, useParsed } from '@refinedev/core'
import type { QuotaFormSettingResponse } from '@sdk/hey-api'
import { useEffect } from 'react'

export function useController() {
  const { params } = useParsed()
  const isUpdateMode = !!params?.id
  const methods = useForm<QuotaTemplateFormType>({
    resource: 'quota-templates',
    queryOptions: {
      select: (data) => {
        const tags = (data.data?.tags ?? []) as unknown as { id: number }[]

        return {
          ...data,
          data: {
            ...data.data,
            tags: tags.map(({ id }) => id),
          },
        } as unknown as GetOneResponse<QuotaTemplateFormType>
      },
    },
  })

  const apiUrl = useApiUrl()

  const { form, query } = methods

  const { data } = useCustom<QuotaFormSettingResponse>({
    method: 'get',
    url: `${apiUrl}/quota-form-settings`,
    queryOptions: {
      enabled: !isUpdateMode,
    },
  })

  useEffect(() => {
    if (!isUpdateMode && data?.data) {
      form.setFieldsValue({
        title: '',
        type: 'normal',
        customer: null,
        status: 'waiting_approve',
        created_at: null,
        delivery_date: null,
        delivery_method: data?.data.default_delivery_method,
        payment_due_date: data?.data.default_payment_due_date,
        expiration_date: data?.data.default_expiration_date,
        consumption_tax: data?.data.consumption_tax ?? '0',
        tax_rate: data?.data.tax_rate,
        note: null,
        tags: [],
        total_cost: 0,
        consumption_tax_amount: 0,
        total_profit_margin: 0,
        total_price_tax_included: 0,
        main_product: [
          {
            group_name: '',
            products: [
              {
                product_id: null,
                package_id: null,
                name: '',
                code: '',
                cost_price: 0,
                quantity: 0,
                selling_price: 0,
                profit_margin: 0,
                is_add_total: false,
              },
            ],
          },
        ],
        optional_product: [
          {
            group_name: '',
            products: [
              {
                product_id: null,
                package_id: null,
                name: '',
                code: '',
                cost_price: 0,
                selling_price: 0,
                quantity: 0,
                profit_margin: 0,
                is_add_total: false,
              },
            ],
          },
        ],
      })
    }
  }, [data])

  return {
    isUpdateMode,
    methods,
    isLoading: isUpdateMode && query?.isLoading,
  }
}

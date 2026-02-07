import type {
  QuotaTemplateFormType,
  QuoteTemplateDetailType,
} from '@interfaces/quota-templates'
import { useForm } from '@refinedev/antd'
import type { GetOneResponse } from '@refinedev/core'
import { useApiUrl, useCustom, useGo, useParsed } from '@refinedev/core'
import type {
  QuotaFormSettingResponse,
  RoundingMethodEnumType,
} from '@sdk/hey-api'
import { RoundingMethodEnumType as RoundingMethodEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { useEffect, useState } from 'react'

export function useController() {
  const { params } = useParsed()
  const isUpdateMode = !!params?.id
  const go = useGo()
  const [taxRoundingMethod, setTaxRoundingMethod] =
    useState<RoundingMethodEnumType>(RoundingMethodEnum.ROUND_UP)
  const permission = useUserStore((state) => state.permission)

  const methods = useForm<QuotaTemplateFormType>({
    resource: 'quota-templates',
    redirect: 'show',
    queryOptions: {
      select: (data) => {
        const detail = data.data as QuoteTemplateDetailType
        const tags = (detail?.tags ?? []) as unknown as { id: number }[]
        const defaultOptionalProduct = [
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
                tax_rate: 0,
                profit_margin: 0,
                is_add_total: false,
              },
            ],
          },
        ]

        if (
          !permission?.is_module_admin &&
          permission?.user?.id != detail.author?.id
        ) {
          go({
            to: '/403',
          })
        }

        const finalOptionalProduct =
          detail.optional_product && detail.optional_product.length > 0
            ? detail.optional_product
            : defaultOptionalProduct

        return {
          ...data,
          data: {
            ...detail,
            optional_product: finalOptionalProduct,
            tags_response: tags,
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
  })

  useEffect(() => {
    // quota template, thi lay setting lam tron thue tu tenant
    if (data?.data) {
      setTaxRoundingMethod(data.data.tax_rounding_method)
    }
  }, [data?.data])
  useEffect(() => {
    if (!isUpdateMode && data?.data) {
      form.setFieldsValue({
        title: '',
        type: 'normal',
        category: 'merchandise',
        customer: null,
        status: 'waiting_approve',
        created_at: null,
        delivery_date: null,
        delivery_method: data?.data.default_delivery_method,
        payment_due_date: data?.data.default_payment_due_date,
        expiration_date: data?.data.default_expiration_date,
        consumption_tax: data?.data.consumption_tax ?? '0',
        tax_rate: data?.data.tax_rate,
        tax_rounding_method: data.data?.tax_rounding_method,
        tax_rate_group: {},
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
                tax_rate: 0,
                selling_price: 0,
                profit_margin: 0,
                is_add_total: true,
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
                tax_rate: 0,
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
    taxRoundingMethod,
    isUpdateMode,
    methods,
    isLoading: isUpdateMode && (query?.isLoading || query?.isFetching),
  }
}

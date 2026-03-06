import type {
  QuotaTemplateProductGroupRequest,
  QuotaTemplateProductGroupResponse,
  QuotaTemplateProductItemRequest,
  QuotaTemplateStoreRequest,
} from '@sdk/hey-api'
import type { Dayjs } from 'dayjs'

export type QuotaTemplateFormType = QuotaTemplateStoreRequest & {
  total_cost: number
  total_price_tax_included: number
  total_profit_margin: number
  total_tax: number
  consumption_tax_amount: number
  main_product?: QuotaTemplateMainProductType[]
  optional_product?: QuotaTemplateMainProductType[]
}
export type QuotaTemplateMainProductType = QuotaTemplateProductGroupRequest & {
  products: QuotaTemplateProductType[]
}

export type QuotaTemplateProductType = QuotaTemplateProductItemRequest & {
  unit?: string
  unit_name?: string
  product?: {
    id: number
    name: string
  } | null
  product_id?: number | null
  product_name?: string
  package_name?: string
  packagings?: Array<{
    id: number
    name: string
  }>
}

export type QuotaTemplateListResponse = {
  success?: boolean
  message?: string
  data?: {
    items?: Array<QuotaTemplateListItemType>
    meta?: {
      current_page?: number
      from?: number
      last_page?: number
      per_page?: number
      to?: number
      total?: number
    }
    links?: {
      first?: string
      last?: string
      prev?: string
      next?: string
    }
  }
}

export type QuotaTemplateListItemType = {
  id?: number
  code?: string
  name?: string
  description?: string
  number_product?: number
  total_price?: string
  created_at?: string
  updated_at?: string
  author?: {
    id?: number
    name?: string
  }
  editor?: {
    id?: number
    name?: string
  }
}

export type SearchQuotaTemplateType = {
  name_lk?: string
  created_by?: number
  start_to_end_date?: [Dayjs, Dayjs]
  start_date?: string
  end_date?: string
}

export type QuoteTemplateDetailType = {
  id?: number
  tenant_id?: string
  name?: string
  description?: string
  type?: 'normal' | 'channel_limited'
  category?: 'merchandise' | 'service'
  delivery_method?: string
  customer_term?: 'short_term' | 'long_term'
  payment_due_date?:
    | 'monthly_25'
    | 'monthly_10'
    | 'net_30_from_delivery'
    | 'net_30_from_invoice'
    | 'end_of_month_next'
    | 'end_of_month_after_next'
  expiration_date?:
    | 'days_7'
    | 'days_14'
    | 'days_45'
    | 'days_60'
    | 'months_3'
    | 'months_6'
    | 'years_1'
  consumption_tax?: 'exclusive' | 'inclusive' | 'external'
  tax_rate?: number
  note?: string
  number_product?: number
  total_price: number
  total_price_tax_included: number
  total_profit_margin: number
  tax_rate_group?: Array<{
    /**
     * Tax rate percentage
     */
    taxRate?: number
    /**
     * Tax amount for this rate
     */
    total?: number
  }>
  consumption_tax_amount: number
  tags?: Array<{
    id?: number
    name?: string
  }>
  main_product?: Array<QuotaTemplateProductGroupResponse>
  optional_product?: Array<QuotaTemplateProductGroupResponse>
  created_at?: string
  updated_at?: string
  author?: {
    id?: number
    name?: string
  } | null
  editor?: {
    id?: number
    name?: string
  } | null
}

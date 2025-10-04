import type {
  QuotaTemplateProductGroupRequest,
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
  product_id?: number | null
  product_name?: string
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
  creator?: string
  start_to_end_date?: [Dayjs, Dayjs]
  start_date?: string
  end_date?: string
}

import type {
  QuotaTemplateProductGroupRequest,
  QuotaTemplateProductItemRequest,
  QuotaTemplateStoreRequest,
} from '@sdk/hey-api'

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
}

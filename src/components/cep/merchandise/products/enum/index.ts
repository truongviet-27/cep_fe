export const ProductResourceEnum = {
  MERCHANDISE: 'merchandise',
  SERVICE: 'service',
} as const

export type ProductResourceEnum =
  (typeof ProductResourceEnum)[keyof typeof ProductResourceEnum]

// i18n keys for product/combo resource labels (resolve with useTranslate's `t`)
export const ProductResourceLabelKey: Record<ProductResourceEnum, string> = {
  [ProductResourceEnum.MERCHANDISE]: 'products.resourceOptions.merchandise',
  [ProductResourceEnum.SERVICE]: 'products.resourceOptions.service',
}

export const ProductResourceEnum = {
  MERCHANDISE: 'merchandise',
  SERVICE: 'service',
} as const

export type ProductResourceEnum =
  (typeof ProductResourceEnum)[keyof typeof ProductResourceEnum]

// i18n keys for product/combo resource labels (resolve with useTranslate's `t`)
// Kept in the `common` namespace so they are available in every locale (en/ja).
export const ProductResourceLabelKey: Record<ProductResourceEnum, string> = {
  [ProductResourceEnum.MERCHANDISE]: 'product_resource.merchandise',
  [ProductResourceEnum.SERVICE]: 'product_resource.service',
}

export const ProductResourceEnum = {
  MERCHANDISE: 'merchandise',
  SERVICE: 'service',
} as const

export type ProductResourceEnum =
  (typeof ProductResourceEnum)[keyof typeof ProductResourceEnum]

export const ProductResourceLabel: Record<ProductResourceEnum, string> = {
  [ProductResourceEnum.MERCHANDISE]: '物販',
  [ProductResourceEnum.SERVICE]: '役務ｻｰﾋﾞｽ',
}

import { ProductResourceEnum } from '@components/cep/merchandise/products/enum'

export type CmrStatusBadgeMeta = {
  label: string
  color: string
  backgroundColor: string
}

type TranslateFn = (key: string, defaultMessage?: string) => string

/**
 * Show badge only when product.cmr_shop_id matches the currently linked shop
 * (includes service 対象外 — also shop-scoped).
 */
export const shouldShowCmrStatusBadge = (
  isCmrLinked: boolean,
  currentShopId: string | null | undefined,
  productShopId: string | null | undefined,
  resource?: string | null,
): boolean => {
  if (!isCmrLinked) {
    return false
  }

  if (resource === ProductResourceEnum.SERVICE) {
    return true
  }

  const productShop = String(productShopId ?? '').trim()
  const currentShop = String(currentShopId ?? '').trim()

  return productShop !== '' && currentShop !== '' && productShop === currentShop
}

/**
 * Resolves CMR badge for list rows.
 * Service (役務) products are out of CMR scope — show 対象外, no 0/1/2 lifecycle.
 */
export const resolveCmrStatusBadge = (
  resource: string | null | undefined,
  isSentToCmr: number | string | null | undefined,
  t: TranslateFn,
): CmrStatusBadgeMeta => {
  if (resource === ProductResourceEnum.SERVICE) {
    return {
      label: t('products.list.table.text.cmrExcluded', 'CMR連携対象外'),
      color: '#666666',
      backgroundColor: '#E2E2E2',
    }
  }

  const statusMeta: Record<number, CmrStatusBadgeMeta> = {
    0: {
      label: t('products.list.table.text.cmrNotLinked', 'CMR Not Linked'),
      color: '#FF0000',
      backgroundColor: '#FFDFDF',
    },
    1: {
      label: t('products.list.table.text.cmrInitiated', 'CMR連携開始'),
      color: '#666666',
      backgroundColor: '#E2E2E2',
    },
    2: {
      label: t('products.list.table.text.cmrLinked', 'CMR Linked'),
      color: '#0066CC',
      backgroundColor: '#DAEDFF',
    },
  }

  const status = Number(isSentToCmr ?? 0)
  return statusMeta[status] ?? statusMeta[0]
}

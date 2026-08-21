/* eslint-disable @typescript-eslint/no-explicit-any */

export type TemplatePriceChangeParent = 'main_product' | 'optional_product'

export type TemplatePriceChange = {
  parent: TemplatePriceChangeParent
  productId: number
  oldPrice: number
  newPrice: number
}

function computeLinePriceChanges(
  lines: any[] | undefined,
  parent: TemplatePriceChangeParent,
): TemplatePriceChange[] {
  return (lines ?? []).reduce<TemplatePriceChange[]>((acc, line) => {
    if (!line || line.kind === 'group' || !line.product_id) return acc

    const matchedPackaging = (line.packagings ?? []).find(
      (pkg: any) => pkg.id === line.package_id,
    )
    if (!matchedPackaging) return acc

    const oldPrice = Number(line.selling_price ?? 0)
    const newPrice = Number(matchedPackaging.selling_price ?? 0)
    if (Number.isNaN(oldPrice) || Number.isNaN(newPrice)) return acc
    if (oldPrice === newPrice) return acc

    acc.push({ parent, productId: line.product_id, oldPrice, newPrice })
    return acc
  }, [])
}

export function computeTemplatePriceChanges(
  mainProduct: any[] | undefined,
  optionalProduct: any[] | undefined,
): TemplatePriceChange[] {
  return [
    ...computeLinePriceChanges(mainProduct, 'main_product'),
    ...computeLinePriceChanges(optionalProduct, 'optional_product'),
  ]
}

export function removeTemplatePriceChange(
  changes: TemplatePriceChange[],
  parent: TemplatePriceChangeParent,
  productId: number | null | undefined,
): TemplatePriceChange[] {
  if (!productId) return changes
  return changes.filter(
    (c) => !(c.parent === parent && c.productId === productId),
  )
}

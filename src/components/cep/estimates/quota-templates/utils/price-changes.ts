/* eslint-disable @typescript-eslint/no-explicit-any */

export type TemplatePriceChangeParent = 'main_product' | 'optional_product'

export type TemplatePriceField = 'selling_price' | 'cost_price'

export type TemplatePriceChange = {
  parent: TemplatePriceChangeParent
  productId: number
  field: TemplatePriceField
  oldPrice: number
  newPrice: number
}

function computeLinePriceChanges(
  lines: any[] | undefined,
  parent: TemplatePriceChangeParent,
  productsById: Map<number, any>,
): TemplatePriceChange[] {
  return (lines ?? []).reduce<TemplatePriceChange[]>((acc, line) => {
    if (!line || line.kind === 'group' || !line.product_id) return acc

    const product = productsById.get(line.product_id)
    if (!product) return acc

    const matchedPackaging = (product.packagings ?? []).find(
      (pkg: any) => pkg.id === line.package_id,
    )
    if (!matchedPackaging) return acc

    const oldSellingPrice = Number(line.selling_price ?? 0)
    const newSellingPrice = Number(matchedPackaging.selling_price ?? 0)
    if (
      !Number.isNaN(oldSellingPrice) &&
      !Number.isNaN(newSellingPrice) &&
      oldSellingPrice !== newSellingPrice
    ) {
      acc.push({
        parent,
        productId: line.product_id,
        field: 'selling_price',
        oldPrice: oldSellingPrice,
        newPrice: newSellingPrice,
      })
    }

    const oldCostPrice = Number(line.cost_price ?? 0)
    const newCostPrice =
      Number(product.cost_price ?? 0) *
      Number(matchedPackaging.quantity_in_package ?? 0)
    if (
      !Number.isNaN(oldCostPrice) &&
      !Number.isNaN(newCostPrice) &&
      oldCostPrice !== newCostPrice
    ) {
      acc.push({
        parent,
        productId: line.product_id,
        field: 'cost_price',
        oldPrice: oldCostPrice,
        newPrice: newCostPrice,
      })
    }

    return acc
  }, [])
}

export function computeTemplatePriceChanges(
  mainProduct: any[] | undefined,
  optionalProduct: any[] | undefined,
  productsById: Map<number, any>,
): TemplatePriceChange[] {
  return [
    ...computeLinePriceChanges(mainProduct, 'main_product', productsById),
    ...computeLinePriceChanges(
      optionalProduct,
      'optional_product',
      productsById,
    ),
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

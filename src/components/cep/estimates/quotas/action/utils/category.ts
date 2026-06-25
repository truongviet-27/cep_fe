import type { FormInstance } from 'antd'

export function buildEmptyProductRow(defaultUnit: string) {
  return {
    product: null,
    isSelfCreate: false,
    package: null,
    product_id: null,
    package_id: null,
    package_name: '-',
    name: '',
    code: '',
    quantity: 1,
    cost_price: 0,
    selling_price: 0,
    profit_margin: 0,
    tax_rate: 10,
    is_add_total: true,
    unit: defaultUnit,
    unit_name: defaultUnit,
    kind: 'product',
  }
}

export function clearProductsOnCategoryChange(
  form: FormInstance,
  defaultUnit: string,
) {
  const emptyRow = buildEmptyProductRow(defaultUnit)
  form.setFieldsValue({
    main_product: [emptyRow],
    optional_product: [{ ...emptyRow }],
  })
}

export function hasProductSelected(form: FormInstance): boolean {
  const mainProducts = form.getFieldValue('main_product') || []
  const optionalProducts = form.getFieldValue('optional_product') || []
  return (
    mainProducts.some((p: { product_id?: string | null }) => p?.product_id) ||
    optionalProducts.some((p: { product_id?: string | null }) => p?.product_id)
  )
}

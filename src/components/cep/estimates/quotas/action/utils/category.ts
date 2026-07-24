import type { FormInstance } from 'antd'

export function buildEmptyProductGroupRow() {
  return {
    product: null,
    product_id: null,
    package: null,
    package_id: null,
    isSelfCreate: false,
    name: '',
    code: '',
    package_name: '-',
    cost_price: 0,
    quantity: 1,
    selling_price: 0,
    profit_margin: 0,
    is_add_total: true,
    unit: null,
    unit_name: '-',
    tax_rate: 0,
    kind: 'group',
  }
}

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
  const emptyGroup = buildEmptyProductGroupRow()
  const emptyRow = buildEmptyProductRow(defaultUnit)
  form.setFieldsValue({
    main_product: [emptyGroup, emptyRow],
    optional_product: [emptyGroup, { ...emptyRow, is_add_total: false }],
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

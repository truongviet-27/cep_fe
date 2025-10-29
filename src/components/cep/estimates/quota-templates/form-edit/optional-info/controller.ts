import type {
  QuotaTemplateFormType,
  QuotaTemplateMainProductType,
  QuotaTemplateProductType,
} from '@interfaces/quota-templates'
import type { ProductListItem } from '@sdk/hey-api'
import { Form } from 'antd'

export const useController = () => {
  const form = Form.useFormInstance<QuotaTemplateFormType>()
  const optionalProducts = Form.useWatch(
    'optional_product',
    form,
  ) as QuotaTemplateMainProductType[]

  const handleAddProduct = (groupIndex: number) => {
    const values = optionalProducts || []
    const products = (values[groupIndex].products ||
      []) as QuotaTemplateProductType[]

    values[groupIndex].products = [
      ...products,
      {
        product_id: null,
        name: '',
        code: '自動採番',
        quantity: 0,
        cost_price: 0,
        selling_price: 0,
        profit_margin: 0,
        tax_rate: 0,
        is_add_total: false,
      } as unknown as QuotaTemplateProductType,
    ]

    form?.setFieldsValue({ optional_product: values })
  }

  const handleRemoveProduct = (groupIndex: number, productIndex: number) => {
    const values = form.getFieldValue('optional_product') || []
    const products = values[groupIndex].products || []

    values[groupIndex].products = products.filter(
      (_: unknown, idx: number) => idx !== productIndex,
    )

    form?.setFieldsValue({ optional_product: values })
  }

  const onChangeProductName = (
    value: ProductListItem,
    index: number,
    index2: number,
  ) => {
    form.setFieldValue(
      ['optional_product', index, 'products', index2, 'product_id'],
      value?.id,
    )
    form.setFieldValue(
      ['optional_product', index, 'products', index2, 'package_id'],
      null,
    )
    form.setFieldValue(
      ['optional_product', index, 'products', index2, 'name'],
      value?.name,
    )
    form.setFieldValue(
      ['optional_product', index, 'products', index2, 'code'],
      value?.code,
    )
    form.setFieldValue(
      ['optional_product', index, 'products', index2, 'unit'],
      value?.unit,
    )
    form.setFieldValue(
      ['optional_product', index, 'products', index2, 'cost_price'],
      value?.cost_price,
    )
    form.setFieldValue(
      ['optional_product', index, 'products', index2, 'selling_price'],
      value?.sale_price,
    )

    form.setFieldValue(
      ['optional_product', index, 'products', index2, 'tax_rate'],
      value?.tax_rate,
    )

    form.setFieldValue(
      ['optional_product', index, 'products', index2, 'quantity'],
      1,
    )

    if (!value) {
      form.setFieldValue(
        ['optional_product', index, 'products', index, 'quantity'],
        0,
      )
    }
  }

  return {
    form,
    optionalProducts,
    handleAddProduct,
    handleRemoveProduct,
    onChangeProductName,
  }
}

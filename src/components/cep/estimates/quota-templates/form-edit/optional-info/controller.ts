import type {
  QuotaTemplateFormType,
  QuotaTemplateMainProductType,
  QuotaTemplateProductType,
} from '@interfaces/quota-templates'
import { useSelect } from '@refinedev/antd'
import type { ProductListItem } from '@sdk/hey-api'
import { Form } from 'antd'

export const useController = () => {
  const form = Form.useFormInstance<QuotaTemplateFormType>()
  const optionalProducts = Form.useWatch(
    'optional_product',
    form,
  ) as QuotaTemplateMainProductType[]

  const { selectProps: selectPropsProduct, query } = useSelect({
    resource: 'products',
    optionLabel: 'name',
    optionValue: 'id',

    onSearch(value) {
      return [
        {
          field: 'name',
          operator: 'contains',
          value,
        },
      ]
    },
  })

  const handleAddProduct = (groupIndex: number) => {
    const values = optionalProducts || []
    const products = (values[groupIndex].products ||
      []) as QuotaTemplateProductType[]

    values[groupIndex].products = [
      ...products,
      {
        product_id: 0,
        name: '',
        code: '自動採番',
        quantity: 0,
        cost_price: 0,
        selling_price: 0,
        profit_margin: 0,
        is_add_total: false,
      },
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
    value: unknown,
    index: number,
    index2: number,
  ) => {
    const item = query.data?.data.find(
      (item) => item.id === value,
    ) as ProductListItem

    form.setFieldValue(
      ['optional_product', index, 'products', index2, 'package_id'],
      null,
    )
    form.setFieldValue(
      ['optional_product', index, 'products', index2, 'name'],
      item?.name,
    )
    form.setFieldValue(
      ['optional_product', index, 'products', index2, 'code'],
      item?.code,
    )
    form.setFieldValue(
      ['optional_product', index, 'products', index2, 'unit'],
      item?.unit,
    )
    form.setFieldValue(
      ['optional_product', index, 'products', index2, 'cost_price'],
      item?.cost_price,
    )
    form.setFieldValue(
      ['optional_product', index, 'products', index2, 'selling_price'],
      item?.sale_price,
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
    selectPropsProduct,
    handleAddProduct,
    handleRemoveProduct,
    onChangeProductName,
  }
}

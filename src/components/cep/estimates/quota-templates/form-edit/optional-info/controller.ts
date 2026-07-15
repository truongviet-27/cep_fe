/* eslint-disable @typescript-eslint/no-explicit-any */

import { getDefaultTaxRate } from '@components/cep/estimates/quotas/utils'
import type { QuotaTemplateFormType } from '@interfaces/quota-templates'
import type { ProductListItem } from '@sdk/hey-api'
import { Form } from 'antd'
import { useEffect } from 'react'

export const useController = () => {
  const form = Form.useFormInstance<QuotaTemplateFormType>()
  const optionalProducts = Form.useWatch('optional_product', form)

  useEffect(() => {
    if (optionalProducts && Array.isArray(optionalProducts)) {
      const updatedList = optionalProducts.map((item: any, index: number) => {
        if (item.display_order !== index + 1) {
          return { ...item, display_order: index + 1 }
        }
        return item
      })
      if (JSON.stringify(updatedList) !== JSON.stringify(optionalProducts)) {
        form.setFieldsValue({ optional_product: updatedList })
      }
    }
  }, [optionalProducts, form])

  const handleAddProduct = (index: number, isSelfCreate = false) => {
    const values = [...(form.getFieldValue('optional_product') || [])]
    const newProduct = {
      product_id: null,
      name: '',
      code: '',
      quantity: 1,
      cost_price: 0,
      isSelfCreate: isSelfCreate,
      selling_price: 0,
      profit_margin: 0,
      tax_rate: isSelfCreate ? getDefaultTaxRate() : 10,
      is_add_total: true,
      kind: 'product',
    }
    values.splice(index + 1, 0, newProduct)
    form?.setFieldsValue({ optional_product: values })
  }

  const handleRemoveProduct = (index: number) => {
    const values = form.getFieldValue('optional_product') || []
    const newValues = values.filter((_: unknown, idx: number) => idx !== index)
    form?.setFieldsValue({ optional_product: newValues })
  }

  const onChangeProductName = (
    value: ProductListItem & {
      tax_rate: number
      packagings: any[]
    },
    index: number,
  ) => {
    if (!value) {
      form.setFieldValue(['optional_product', index, 'product_id'], null)
      form.setFieldValue(['optional_product', index, 'name'], '')
      form.setFieldValue(['optional_product', index, 'packagings'], [])
      form.setFieldValue(['optional_product', index, 'package_id'], null)
      form.setFieldValue(['optional_product', index, 'code'], '')
      form.setFieldValue(['optional_product', index, 'unit'], '')
      form.setFieldValue(['optional_product', index, 'cost_price'], 0)
      form.setFieldValue(['optional_product', index, 'selling_price'], 0)
      form.setFieldValue(['optional_product', index, 'tax_rate'], 10)
      form.setFieldValue(['optional_product', index, 'quantity'], 1)
    } else {
      form.setFieldValue(['optional_product', index, 'product_id'], value.id)
      form.setFieldValue(
        ['optional_product', index, 'packagings'],
        value.packagings,
      )
      form.setFieldValue(
        ['optional_product', index, 'package_id'],
        value.packagings?.[0]?.id,
      )
      form.setFieldValue(['optional_product', index, 'name'], value.name)
      form.setFieldValue(['optional_product', index, 'code'], value.code)
      form.setFieldValue(['optional_product', index, 'unit'], value.unit)
      form.setFieldValue(
        ['optional_product', index, 'cost_price'],
        value.cost_price,
      )
      form.setFieldValue(
        ['optional_product', index, 'selling_price'],
        value.sale_price,
      )
      form.setFieldValue(
        ['optional_product', index, 'tax_rate'],
        value.tax_rate,
      )
      form.setFieldValue(['optional_product', index, 'quantity'], 1)
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

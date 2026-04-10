/* eslint-disable @typescript-eslint/no-explicit-any */

import { getDefaultTaxRate } from '@components/cep/estimates/quotas/utils'
import type { QuotaTemplateFormType } from '@interfaces/quota-templates'
import { type ProductListItem } from '@sdk/hey-api'
import { calculateTax } from '@shared/tax/tax.utils'
import { Form } from 'antd'
import { useEffect, useState } from 'react'

export const useController = () => {
  const form = Form.useFormInstance<QuotaTemplateFormType>()
  const totalPriceWatch = Form.useWatch('total_price', form)
  const totalPriceTaxIncludedWatch = Form.useWatch(
    'total_price_tax_included',
    form,
  )
  const taxRateWatch = Form.useWatch('tax_rate', form) ?? 0
  const mainProducts = Form.useWatch('main_product', form)
  const taxRoundingMethodWatch = Form.useWatch('tax_rounding_method', form)
  const consumptionTaxWatch = Form.useWatch('consumption_tax', form)

  const [costTotal, setCostTotal] = useState(0)
  const [profitRate, setProfitRate] = useState(0)
  const [taxTotal, setTaxTotal] = useState(0)
  const [sellTotalWithTax, setSellTotalWithTax] = useState(0)

  const handleAddProduct = (index: number, isSelfCreate = false) => {
    const values = [...(form.getFieldValue('main_product') || [])]
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
    form?.setFieldsValue({ main_product: values })
  }

  const handleRemoveProduct = (index: number) => {
    const values = form.getFieldValue('main_product') || []
    const newValues = values.filter((_: unknown, idx: number) => idx !== index)
    form?.setFieldsValue({ main_product: newValues })
  }

  const calculateSummary = () => {
    let _checkNull = false
    let costTotal = 0
    let sellTotal = 0

    // Group products by tax rate for separate calculation
    const taxGroups: { [key: string]: { selling: number; taxRate: number } } =
      {}

    // Calculate per-product totals and group by tax_rate
    ;(mainProducts ?? []).forEach((product: any) => {
      if (!product.is_add_total) return

      const qty = product.quantity || 0
      const selling = (product.selling_price || 0) * qty
      const cost = (product.cost_price || 0) * qty

      if (product.cost_price === null && product.kind != 'group')
        _checkNull = true

      costTotal += cost
      sellTotal += selling

      // Use product's individual tax rate, fallback to global tax_rate if not set
      const productTaxRate = product.tax_rate ?? taxRateWatch ?? 0
      const taxRateKey = productTaxRate.toString()

      // Group products by tax rate
      if (!taxGroups[taxRateKey]) {
        taxGroups[taxRateKey] = { selling: 0, taxRate: productTaxRate }
      }
      taxGroups[taxRateKey].selling += selling
    })

    // Calculate tax for each tax rate group with rounding
    let taxTotal = 0
    Object.values(taxGroups).forEach((group) => {
      const rawTax = (group.selling * group.taxRate) / 100
      const roundedTax = calculateTax(rawTax, taxRoundingMethodWatch)
      taxTotal += roundedTax
    })

    let sellTotalWithTax = 0
    sellTotalWithTax = sellTotal + taxTotal

    const profitRate =
      costTotal > 0 ? ((sellTotal - costTotal) / sellTotal) * 100 : 0

    setCostTotal(costTotal)
    setTaxTotal(taxTotal)
    setProfitRate(_checkNull ? 0 : profitRate)
    setSellTotalWithTax(sellTotalWithTax)
    form.setFieldValue('total_price', sellTotal)
    form.setFieldValue('consumption_tax_amount', taxTotal)
    form.setFieldValue('total_profit_margin', _checkNull ? 0 : profitRate)
    form.setFieldValue('total_price_tax_included', sellTotalWithTax)
  }

  const onChangeProductName = (
    value: ProductListItem & {
      tax_rate: number
      packagings: any[]
    },
    index: number,
  ) => {
    form.setFieldValue(['main_product', index, 'product_id'], value?.id)
    form.setFieldValue(['main_product', index, 'name'], value?.name)
    form.setFieldValue(['main_product', index, 'packagings'], value?.packagings)
    form.setFieldValue(
      ['main_product', index, 'package_id'],
      value?.packagings?.[0]?.id,
    )
    form.setFieldValue(['main_product', index, 'code'], value?.code)
    form.setFieldValue(['main_product', index, 'unit'], value?.unit)
    form.setFieldValue(['main_product', index, 'cost_price'], value?.cost_price)
    form.setFieldValue(
      ['main_product', index, 'selling_price'],
      value?.sale_price,
    )
    form.setFieldValue(['main_product', index, 'tax_rate'], value?.tax_rate)
    form.setFieldValue(['main_product', index, 'quantity'], 1)

    if (!value) {
      form.setFieldValue(['main_product', index, 'quantity'], 1)
    }
  }

  useEffect(() => {
    calculateSummary()
  }, [mainProducts, taxRateWatch, consumptionTaxWatch])

  return {
    form,
    mainProducts,
    taxRateWatch,
    totalPriceWatch,
    costTotal,
    taxTotal,
    profitRate,
    sellTotalWithTax,
    handleAddProduct,
    handleRemoveProduct,
    onChangeProductName,
    consumptionTaxWatch,
    totalPriceTaxIncludedWatch,
  }
}

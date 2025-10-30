import { TaxRoundingMethod } from '@components/cep/estimates/quotas/enum'
import type {
  QuotaTemplateFormType,
  QuotaTemplateMainProductType,
  QuotaTemplateProductType,
} from '@interfaces/quota-templates'
import {
  ConsumptionTaxEnum,
  type ProductListItem,
  type QuotaTemplateProductGroupRequest,
  type QuotaTemplateProductItemRequest,
} from '@sdk/hey-api'
import { Form } from 'antd'
import { useEffect, useState } from 'react'

export const useController = () => {
  const form = Form.useFormInstance<QuotaTemplateFormType>()

  const totalPriceWatch = Form.useWatch('total_price', form)
  const taxRateWatch = Form.useWatch('tax_rate', form) ?? 0
  const mainProducts = Form.useWatch(
    'main_product',
    form,
  ) as QuotaTemplateMainProductType[]
  const taxRoundingMethodWatch = Form.useWatch('tax_rounding_method', form)
  const consumptionTaxWatch = Form.useWatch('consumption_tax', form)

  const [costTotal, setCostTotal] = useState(0)
  const [profitRate, setProfitRate] = useState(0)
  const [taxTotal, setTaxTotal] = useState(0)
  const [sellTotalWithTax, setSellTotalWithTax] = useState(0)

  const handleAddProduct = (groupIndex: number) => {
    const values = mainProducts || []
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
        is_add_total: true,
      } as unknown as QuotaTemplateProductType,
    ]

    form?.setFieldsValue({ main_product: values })
  }

  const handleRemoveProduct = (groupIndex: number, productIndex: number) => {
    const values = form.getFieldValue('main_product') || []
    const products = values[groupIndex].products || []

    values[groupIndex].products = products.filter(
      (_: unknown, idx: number) => idx !== productIndex,
    )

    form?.setFieldsValue({ main_product: values })
  }

  const calculateSummary = () => {
    let costTotal = 0
    let sellTotal = 0
    let taxTotal = 0

    // Calculate per-product totals and per-product tax using each product's tax_rate
    ;(mainProducts ?? []).forEach((group: QuotaTemplateProductGroupRequest) => {
      ;(group.products ?? []).forEach(
        (product: QuotaTemplateProductItemRequest) => {
          if (!product.is_add_total) return

          const qty = product.quantity || 0
          const selling = (product.selling_price || 0) * qty
          const cost = (product.cost_price || 0) * qty

          costTotal += cost
          sellTotal += selling

          // Use product's individual tax rate, fallback to global tax_rate if not set
          const productTaxRate = product.tax_rate ?? taxRateWatch ?? 0

          // Calculate tax for this specific product
          let productTax = 0
          if (consumptionTaxWatch === ConsumptionTaxEnum.INCLUSIVE) {
            // For inclusive tax, extract tax portion from selling price
            const rawTax = selling - selling / (1 + productTaxRate / 100)
            if (taxRoundingMethodWatch === TaxRoundingMethod.RoundDown) {
              productTax = Math.floor(rawTax)
            } else if (taxRoundingMethodWatch === TaxRoundingMethod.RoundUp) {
              productTax = Math.ceil(rawTax)
            } else {
              productTax = Number(rawTax.toFixed(0))
            }
          } else {
            // For exclusive tax, calculate tax on top of selling price
            const rawTax = (selling * productTaxRate) / 100
            if (taxRoundingMethodWatch === TaxRoundingMethod.RoundDown) {
              productTax = Math.floor(rawTax)
            } else if (taxRoundingMethodWatch === TaxRoundingMethod.RoundUp) {
              productTax = Math.ceil(rawTax)
            } else {
              productTax = Number(rawTax.toFixed(0))
            }
          }

          taxTotal += productTax
        },
      )
    })

    let sellTotalWithTax = 0
    if (consumptionTaxWatch === ConsumptionTaxEnum.INCLUSIVE) {
      // For inclusive tax, selling total already includes tax
      sellTotalWithTax = sellTotal
    } else {
      // For exclusive tax, add tax to selling total
      sellTotalWithTax = sellTotal + taxTotal
    }
    const profitRate =
      costTotal > 0 ? ((sellTotal - costTotal) / sellTotal) * 100 : 0

    setCostTotal(costTotal)
    setTaxTotal(taxTotal)
    setProfitRate(profitRate)
    setSellTotalWithTax(sellTotalWithTax)
    form.setFieldValue('total_price', sellTotal)
    form.setFieldValue('consumption_tax_amount', taxTotal)
    form.setFieldValue('total_profit_margin', profitRate)
    form.setFieldValue('total_price_tax_included', sellTotalWithTax)
  }

  const onChangeProductName = (
    value: ProductListItem & {
      tax_rate: number
    },
    index: number,
    index2: number,
  ) => {
    form.setFieldValue(
      ['main_product', index, 'products', index2, 'product_id'],
      value?.id,
    )
    form.setFieldValue(
      ['main_product', index, 'products', index2, 'package_id'],
      null,
    )
    form.setFieldValue(
      ['main_product', index, 'products', index2, 'name'],
      value?.name,
    )
    form.setFieldValue(
      ['main_product', index, 'products', index2, 'code'],
      value?.code,
    )
    form.setFieldValue(
      ['main_product', index, 'products', index2, 'unit'],
      value?.unit,
    )
    form.setFieldValue(
      ['main_product', index, 'products', index2, 'cost_price'],
      value?.cost_price,
    )
    form.setFieldValue(
      ['main_product', index, 'products', index2, 'selling_price'],
      value?.sale_price,
    )
    form.setFieldValue(
      ['main_product', index, 'products', index2, 'tax_rate'],
      value?.tax_rate,
    )
    form.setFieldValue(
      ['main_product', index, 'products', index2, 'quantity'],
      1,
    )

    if (!value) {
      form.setFieldValue(
        ['main_product', index, 'products', index, 'quantity'],
        0,
      )
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
  }
}

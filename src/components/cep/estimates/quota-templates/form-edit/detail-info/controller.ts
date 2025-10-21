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
        is_add_total: false,
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

    ;(mainProducts ?? []).forEach((group: QuotaTemplateProductGroupRequest) => {
      ;(group.products ?? []).forEach(
        (product: QuotaTemplateProductItemRequest) => {
          if (product.is_add_total) {
            costTotal += (product.cost_price || 0) * (product.quantity || 0)
            sellTotal += (product.selling_price || 0) * (product.quantity || 0)
          }
        },
      )
    })

    let taxTotal = 0
    let sellTotalWithTax = 0
    if (consumptionTaxWatch === ConsumptionTaxEnum.INCLUSIVE) {
      if (taxRoundingMethodWatch === TaxRoundingMethod.RoundDown) {
        taxTotal = Math.floor(sellTotal - sellTotal / (1 + taxRateWatch / 100))
      } else if (taxRoundingMethodWatch === TaxRoundingMethod.RoundUp) {
        taxTotal = Math.ceil(sellTotal - sellTotal / (1 + taxRateWatch / 100))
      } else {
        taxTotal = Number(
          (sellTotal - sellTotal / (1 + taxRateWatch / 100)).toFixed(0),
        )
      }
    } else {
      if (taxRoundingMethodWatch === TaxRoundingMethod.RoundDown) {
        taxTotal = Math.floor((sellTotal * taxRateWatch) / 100)
      } else if (taxRoundingMethodWatch === TaxRoundingMethod.RoundUp) {
        taxTotal = Math.ceil((sellTotal * taxRateWatch) / 100)
      } else {
        taxTotal = Number(((sellTotal * taxRateWatch) / 100).toFixed(0))
      }
    }

    if (consumptionTaxWatch === ConsumptionTaxEnum.EXCLUSIVE) {
      sellTotalWithTax = sellTotal + taxTotal
    } else {
      sellTotalWithTax = sellTotal
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
    value: ProductListItem,
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

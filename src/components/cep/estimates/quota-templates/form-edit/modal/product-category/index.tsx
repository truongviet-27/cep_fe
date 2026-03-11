/* eslint-disable */
import { useApiUrl, useCustom, useTranslate } from '@refinedev/core'
import { Button, Col, Divider, Flex, Form, notification, Row } from 'antd'
import React, { useState } from 'react'

import CoreInput from '@components/common/core-input'
import ProductCategoryDropdown from '@components/common/product-category-dropdown'

interface Props {
  name: string
  close: () => void
}

export const ProductCategoryModal: React.FC<Props> = (props) => {
  const { name, close } = props
  const t = useTranslate()
  const form = Form.useFormInstance()
  const apiUrl = useApiUrl()
  const categoryIdWatch = Form.useWatch('category_id', form)
  const productWatch = Form.useWatch(name, form)
  const isDirtyProduct = (productWatch ?? [])[1]?.product_id

  const { data, isFetching } = useCustom({
    method: 'get',
    url: `${apiUrl}/product-categories/${categoryIdWatch}/products`,
    queryOptions: {
      enabled: !!categoryIdWatch,
    },
  })

  const handleCreateCategory = () => {
    if (data?.data?.products?.length > 0) {
      const headerItem = {
        kind: 'group',
        isHeader: true,
        name: data?.data.products[0]?.category?.name,
        title: data?.data.products[0]?.category?.name,
        quantity: 1,
      }

      const productItems = data?.data.products?.map((item: any) => ({
        kind: 'product',
        product: { value: item.id, label: item.name },
        package: {
          value: item?.packagings?.[0]?.id || null,
          label: item?.packagings?.[0]?.name || null,
        },
        product_id: item.id,
        package_id: item?.packagings?.[0]?.id,
        package_name: item?.packagings?.[0]?.name,
        name: item?.name,
        code: item?.code,
        unit: item?.unit?.name,
        unit_name: item?.unit?.name,
        cost_price: item?.cost_price,
        quantity: 1,
        selling_price:
          item?.packagings?.[0]?.rank_prices != null &&
          item?.packagings?.[0]?.rank_prices !== 0
            ? item?.packagings?.[0]?.rank_prices
            : item?.packagings?.[0]?.selling_price,
        tax_rate: item?.tax_rate,
        profit_margin: 0,
        is_add_total: true,
      }))

      const currentProducts = isDirtyProduct
        ? form.getFieldValue(name) || []
        : []

      form.setFieldValue(name, [
        ...currentProducts,
        headerItem,
        ...productItems,
      ])
    } else {
      notification.error({
        message: t('quotas.action.modal.no_products.description'),
        placement: 'topRight',
      })
    }

    close()
  }

  return (
    <>
      <CoreInput name="category_id" hidden />
      <div style={{ width: '100%', position: 'relative' }}>
        <Row>
          <Col xs={24}>
            <Form.Item name="parent" layout="horizontal" colon={false}>
              <ProductCategoryDropdown
                placeholder="例: 文房具 > 筆記用具"
                onSelect={(level, currentPath, currentCat, categoryId) => {
                  form.setFieldValue('category_id', categoryId)
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
      <Flex justify="end" gap="small">
        <Button
          onClick={() => {
            close()
          }}
          color="primary"
          variant="outlined"
        >
          {t('buttons.cancel')}
        </Button>
        <Button
          type="primary"
          onClick={handleCreateCategory}
          disabled={!categoryIdWatch || isFetching}
        >
          {t('products.buttons.save')}
        </Button>
      </Flex>
    </>
  )
}

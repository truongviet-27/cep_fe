/* eslint-disable */
import { useApiUrl, useCustom, useTranslate } from '@refinedev/core'
import { Button, Col, Divider, Flex, Form, Row } from 'antd'
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
  const isDirtyProduct = (productWatch ?? [])[0]?.products[0]?.product_id

  const { data } = useCustom({
    method: 'get',
    url: `${apiUrl}/product-categories/${categoryIdWatch}/products`,
    queryOptions: {
      enabled: !!categoryIdWatch,
    },
  })

  console.log(productWatch, 'productWatch')

  const handleCreateCategory = () => {
    if (data?.data?.products?.length > 0) {
      form.setFieldValue(
        name,
        isDirtyProduct
          ? [
              ...productWatch,
              {
                group_name: data?.data.products[0]?.category?.name,
                products: data?.data.products?.map((item: any) => ({
                  product_id: item.id,
                  package_id: null,
                  name: item?.name,
                  code: item?.code,
                  unit: item?.unit?.name,
                  cost_price: item?.cost_price,
                  quantity: 1,
                  selling_price: item?.selling_price,
                  profit_margin: 0,
                  is_add_total: true,
                })),
              },
            ]
          : [
              {
                group_name: data?.data.products[0]?.category?.name,
                products: data?.data.products?.map((item: any) => ({
                  product_id: item.id,
                  package_id: null,
                  name: item?.name,
                  code: item?.code,
                  unit: item?.unit?.name,
                  cost_price: item?.cost_price,
                  quantity: 1,
                  selling_price: item?.selling_price,
                  profit_margin: 0,
                  is_add_total: true,
                })),
              },
            ],
      )
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
          disabled={!(data?.data.products?.length > 0)}
        >
          {t('products.buttons.save')}
        </Button>
      </Flex>
    </>
  )
}

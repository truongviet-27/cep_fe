/* eslint-disable */
import {
  useApiUrl,
  useCustom,
  useNotification,
  useTranslate,
} from '@refinedev/core'
import { Button, Col, Divider, Flex, Form, Row } from 'antd'
import React, { useState } from 'react'

import CoreInput from '@components/common/core-input'
import ProductCategoryDropdown from '@components/common/product-category-dropdown'

export const ProductCategoryModal = ({
  name,
  close,
}: {
  name: string
  close: () => void
}) => {
  const t = useTranslate()
  const form = Form.useFormInstance()
  const apiUrl = useApiUrl()
  const categoryIdWatch = Form.useWatch('category_id', form)
  const customerIdWatch = Form.useWatch('customer', form)?.value
  const mainProductWatch = Form.useWatch(name, form)

  const isDirtyProduct = (mainProductWatch ?? [])[0]?.products[0]?.product_id

  const { open } = useNotification()

  const { data } = useCustom({
    method: 'get',
    url: `${apiUrl}/product-categories/${categoryIdWatch}/products?rank_id=${customerIdWatch}`,
    queryOptions: {
      enabled: !!categoryIdWatch,
    },
  })

  const handleCreateCategory = () => {
    if (data?.data?.products?.length > 0) {
      form.setFieldValue(
        name,
        isDirtyProduct
          ? [
              ...mainProductWatch,
              {
                group_name: data?.data.products[0]?.category?.name,
                products: data?.data.products?.map((item: any) => ({
                  product: {
                    value: item.id,
                    label: item.name,
                  },
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
                  product: {
                    value: item.id,
                    label: item.name,
                  },
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
      close()
    } else {
      open &&
        open({
          message: t('quotas.action.modal.no_products.message'),
          description: t('quotas.action.modal.no_products.description'),
          type: 'error',
        })
    }
  }

  return (
    <>
      <CoreInput name="category_id" hidden />
      <div style={{ width: '100%', position: 'relative' }}>
        <Row>
          <Col xs={24}>
            <Form.Item name="parent" layout="horizontal" colon={false}>
              <ProductCategoryDropdown
                placeholder={t(
                  'quotas.action.detail_info.placeholders.product_search',
                )}
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
          disabled={!categoryIdWatch}
        >
          {t('products.buttons.save')}
        </Button>
      </Flex>
    </>
  )
}

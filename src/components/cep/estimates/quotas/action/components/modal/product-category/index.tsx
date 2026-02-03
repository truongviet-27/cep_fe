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
  handleChangeProductPrincing,
}: {
  name: string
  close: () => void
  handleChangeProductPrincing: (
    productIds: number[],
    isSimple?: boolean,
  ) => void
}) => {
  const t = useTranslate()
  const form = Form.useFormInstance()
  const apiUrl = useApiUrl()
  const categoryIdWatch = Form.useWatch('category_id', form)
  const rankIdWatch = form.getFieldValue('rank_id')
  const mainProductWatch = Form.useWatch(name, form)

  const isDirtyProduct = (mainProductWatch ?? [])[0]?.products[0]?.product_id

  const { open } = useNotification()

  const { data, isFetching } = useCustom({
    method: 'get',
    url: `${apiUrl}/product-categories/${categoryIdWatch}/products?rank_id=${rankIdWatch}`,
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
                  package: {
                    value:
                      item?.packagings.length > 0
                        ? item?.packagings[0]?.id
                        : null,
                    label:
                      item?.packagings.length > 0
                        ? item?.packagings[0]?.name
                        : null,
                  },
                  package_id: item?.packagings[0]?.id,
                  package_name: item?.packagings[0]?.name,
                  product_id: item.id,
                  name: item?.name,
                  code: item?.code,
                  unit: item?.unit?.name,
                  unit_name: item?.unit?.name,
                  cost_price: item?.cost_price,
                  quantity: 1,
                  selling_price:
                    item?.packagings[0]?.rank_prices != 0
                      ? item?.packagings[0]?.rank_prices
                      : item?.packagings[0]?.selling_price,
                  tax_rate: item?.tax_rate,
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
                  package: {
                    value:
                      item?.packagings.length > 0
                        ? item?.packagings[0]?.id
                        : null,
                    label:
                      item?.packagings.length > 0
                        ? item?.packagings[0]?.name
                        : null,
                  },
                  product_id: item.id,
                  package_name: item?.packagings[0]?.name,
                  name: item?.name,
                  code: item?.code,
                  unit: item?.unit?.name,
                  unit_name: item?.unit?.name,
                  cost_price: item?.cost_price,
                  quantity: 1,
                  tax_rate: item?.tax_rate,
                  selling_price:
                    item?.packagings[0]?.rank_prices != 0
                      ? item?.packagings[0]?.rank_prices
                      : item?.packagings[0]?.selling_price,
                  profit_margin: 0,
                  is_add_total: true,
                })),
              },
            ],
      )

      handleChangeProductPrincing(
        data?.data.products?.map((item: any) => item.id),
        true,
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
          disabled={!categoryIdWatch || isFetching}
        >
          {t('products.buttons.save')}
        </Button>
      </Flex>
    </>
  )
}

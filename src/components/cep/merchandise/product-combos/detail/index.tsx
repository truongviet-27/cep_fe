/* eslint-disable @typescript-eslint/no-explicit-any */
import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { DeleteButton, EditButton } from '@refinedev/antd'
import { useGo, useTranslate } from '@refinedev/core'
import { ParameterResourceEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Button, Divider, Flex, Space, Typography } from 'antd'
import { Empty, Spin } from 'antd/lib'
import dayjs from 'dayjs'
import Link from 'next/link'

import BasicInfo from './basic-info'
import PriceGroup from './price-group'
import ProductInformation from './product-information'
import useProductComboDetail from './use-product-combo-detail'

const { Title } = Typography

const ProductComboDetailContainer: React.FC = () => {
  const t = useTranslate()
  const go = useGo()
  const { product, isLoading } = useProductComboDetail()
  const parameterSettings = useUserStore((state) => state.parameterSettings)

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/products">
                  {boldText(t('products.breadcrumb.home'))}
                </Link>
              ),
            },
            {
              title: boldText(t('products.breadcrumb.comboDetail'), PRIMARY),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={
        <Title level={5} style={{ color: PRIMARY }}>
          {t('products.breadcrumb.comboDetail')}
        </Title>
      }
    >
      <Spin spinning={isLoading}>
        {product ? (
          <>
            <BasicInfo product={product} />
            <ProductInformation products={product.products} />
            {parameterSettings.get(ParameterResourceEnum.RANKS) && (
              <PriceGroup product={product} />
            )}

            <Divider />
            <ShowMoreInfo
              descriptions={[
                {
                  title: t('common.created_by'),
                  value: product?.author?.name
                    ? `${product.author.name} ${dayjs(product?.created_at).format('YYYY/MM/DD HH:mm')}`
                    : '---',
                },
                {
                  title: t('common.updated_by'),
                  value: product?.editor?.name
                    ? `${product.editor.name} ${dayjs(product?.updated_at).format('YYYY/MM/DD HH:mm')}`
                    : '---',
                },
              ]}
            />
            <Flex justify="space-between" style={{ marginTop: 24 }}>
              <DeleteButton
                icon={null}
                size={'small'}
                onSuccess={() => {
                  go({
                    to: '/products',
                  })
                }}
              />
              <Space size="small">
                <Button
                  onClick={() => {
                    go({
                      to: `/products?tab=combo`,
                    })
                  }}
                  color="primary"
                  variant="outlined"
                >
                  {t('products.buttons.back')}
                </Button>
                <EditButton
                  resource="product-combos"
                  type="primary"
                  icon={null}
                >
                  {t('products.buttons.edit')}
                </EditButton>
              </Space>
            </Flex>
          </>
        ) : (
          <Empty />
        )}
      </Spin>
    </PageContainer>
  )
}

export default ProductComboDetailContainer

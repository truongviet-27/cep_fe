/* eslint-disable @typescript-eslint/no-explicit-any */
import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import { useGo, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Button, Divider, Flex, Space, Typography } from 'antd'
import { Empty, Spin } from 'antd/lib'
import Link from 'next/link'

import BasicInfo from './basic-info'
import PackagingUnitPrice from './packaging-unit-price'
import PriceGroup from './price-group'
import useProductDetail from './use-product-detail'

const { Title } = Typography

const ProductDetailContainer: React.FC = () => {
  const t = useTranslate()
  const go = useGo()
  const { product, isLoading } = useProductDetail()

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: <Title level={5}>{t('merchandise.merchandise')}</Title>,
            },
            {
              title: (
                <Link href="/products">
                  <Title level={5}>{t('products.products')}</Title>
                </Link>
              ),
            },
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('products.detail.title')}
                </Title>
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={
        <Title level={5} style={{ color: PRIMARY }}>
          {t('products.detail.title')}
        </Title>
      }
    >
      <Spin spinning={isLoading}>
        {product ? (
          <>
            <BasicInfo product={product} />
            <PackagingUnitPrice product={product} />
            <PriceGroup product={product} />
            <Divider />
            <Flex justify="space-between">
              <div></div>
              <Space size="small">
                <Button
                  onClick={() => {
                    go({ to: '/products' })
                  }}
                  color="primary"
                  variant="outlined"
                >
                  {t('products.buttons.back')}
                </Button>
                <Button type="primary">{t('products.buttons.edit')}</Button>
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

export default ProductDetailContainer

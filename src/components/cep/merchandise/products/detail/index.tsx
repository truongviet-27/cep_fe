/* eslint-disable @typescript-eslint/no-explicit-any */
import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { DeleteButton, EditButton } from '@refinedev/antd'
import { useGo, useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Button, Divider, Flex, Space, Typography } from 'antd'
import { Empty, Spin } from 'antd/lib'
import dayjs from 'dayjs'
import Link from 'next/link'

import BasicInfo from './basic-info'
import PackagingUnitPrice from './packaging-unit-price'
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
              title: (
                <Link href="/products">
                  {boldText(t('products.breadcrumb.home'))}
                </Link>
              ),
            },
            {
              title: boldText(t('products.breadcrumb.productDetail'), PRIMARY),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={
        <Title level={5} style={{ color: PRIMARY }}>
          {t('products.breadcrumb.productDetail')}
        </Title>
      }
    >
      <Spin spinning={isLoading}>
        {product ? (
          <>
            <BasicInfo product={product} />
            <PackagingUnitPrice product={product} />
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
                      to: `/${sessionStorage.getItem('list_products') ?? 'products'}`,
                    })
                  }}
                  color="primary"
                  variant="outlined"
                >
                  {t('products.buttons.back')}
                </Button>
                <EditButton resource="products" type="primary" icon={null}>
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

export default ProductDetailContainer

/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownOutlined, RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { DeleteButton } from '@refinedev/antd'
import { useGo, useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Collapse,
  Divider,
  Flex,
  Form,
  Space,
  Spin,
  Typography,
} from 'antd'
import type { FormInstance } from 'antd/lib'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRef } from 'react'

import BasicInfo from './basic-info'
import Packaging from './packaging'
import ProductInformation from './product-information'
import type { ProductComboFormType } from './use-product-combo-form'
import useProductComboForm from './use-product-combo-form'

const { Title } = Typography

const ProductComboFormContainer: React.FC = () => {
  const t = useTranslate()
  const go = useGo()
  const [
    {
      methods,
      isLoadingSubmit,
      isUpdateMode,
      isPendingDraft,
      dataProductComboDraft,
      isFetchingProductComboDraft,
    },
    { handleOnSubmit, handleSaveDraft, handleApplyDraft },
  ] = useProductComboForm()
  const { form, formProps, query } = methods
  const product = query?.data?.data
  const addRef = useRef<(defaultValue?: object, insertIndex?: number) => void>()

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
              title: boldText(
                isUpdateMode
                  ? t('products.breadcrumb.productComboEdit')
                  : t('products.breadcrumb.productComboCreate'),
                PRIMARY,
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={
        <Title level={5} style={{ color: PRIMARY }}>
          {isUpdateMode
            ? t('products.breadcrumb.productComboEdit')
            : t('products.breadcrumb.productComboCreate')}
        </Title>
      }
    >
      <Spin spinning={methods.formLoading}>
        <Form<ProductComboFormType>
          {...formProps}
          form={form as unknown as FormInstance<ProductComboFormType>}
          labelCol={{ span: 6 }}
          labelAlign="left"
          className="mb-[24px]"
          onFinish={handleOnSubmit}
          scrollToFirstError
        >
          <Collapse
            items={[
              {
                key: 1,
                label: (
                  <span className="font-bold">
                    {t('product_combos.sections.basicInfo')}
                  </span>
                ),
                children: (
                  <BasicInfo
                    form={form as unknown as FormInstance<ProductComboFormType>}
                  />
                ),
              },
            ]}
            expandIconPosition="end"
            defaultActiveKey={[1]}
            expandIcon={({ isActive }) => (
              <DownOutlined
                style={{ transition: '0.3s' }}
                rotate={isActive ? 180 : 0}
              />
            )}
          />

          <Collapse
            style={{
              marginTop: '20px',
            }}
            items={[
              {
                key: 1,
                label: (
                  <span className="font-bold">
                    {t('product_combos.sections.productInformation')}
                  </span>
                ),
                children: (
                  <ProductInformation
                    form={form as unknown as FormInstance<ProductComboFormType>}
                    addRef={addRef}
                  />
                ),
              },
            ]}
            expandIconPosition="end"
            defaultActiveKey={[1]}
            expandIcon={({ isActive }) => (
              <DownOutlined
                style={{ transition: '0.3s' }}
                rotate={isActive ? 180 : 0}
              />
            )}
          />

          <div className="hidden">
            <Packaging />
          </div>

          {isUpdateMode && (
            <>
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
            </>
          )}
          <Flex justify="space-between" style={{ marginTop: 24 }}>
            {isUpdateMode ? (
              <DeleteButton
                icon={null}
                size={'small'}
                onSuccess={() => {
                  go({
                    to: `/products?tab=combo`,
                  })
                }}
              />
            ) : (
              <div></div>
            )}
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
              {!isUpdateMode &&
                dataProductComboDraft?.data &&
                Array.isArray(dataProductComboDraft.data) &&
                dataProductComboDraft.data.length > 0 && (
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleApplyDraft}
                    disabled={isFetchingProductComboDraft}
                  >
                    {t('buttons.apply_draft')}
                  </Button>
                )}
              {!isUpdateMode && (
                <Button
                  type="primary"
                  onClick={handleSaveDraft}
                  loading={isPendingDraft}
                >
                  {t('buttons.draft')}
                </Button>
              )}
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoadingSubmit}
              >
                {isUpdateMode
                  ? t('products.buttons.save')
                  : t('products.buttons.register')}
              </Button>
            </Space>
          </Flex>
        </Form>
      </Spin>
    </PageContainer>
  )
}

export default ProductComboFormContainer

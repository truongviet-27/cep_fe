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
import { useRef, useState } from 'react'

import BasicInfo from './basic-info'
import PackagingUnitPrice from './packaging-unit-price'
import type { ProductFormType } from './use-product-form'
import useProductForm from './use-product-form'

const { Title } = Typography

const ProductFormContainer: React.FC = () => {
  const t = useTranslate()
  const go = useGo()
  const [
    {
      methods,
      isLoadingSubmit,
      isUpdateMode,
      isPendingDraft,
      dataProductDraft,
      isFetchingProductDraft,
    },
    { handleOnSubmit, handleSaveDraft, handleApplyDraft },
  ] = useProductForm()
  const { form, formProps, query } = methods
  const product = query?.data?.data
  const addRef = useRef<(defaultValue?: object, insertIndex?: number) => void>()
  const [isAllowedSaveButton, setIsAllowedSaveButton] = useState(isUpdateMode)
  const [showEditPackaging, setShowEditPackaging] = useState<boolean>(false)
  const [isInitializingCode, setIsInitializingCode] = useState(!isUpdateMode)

  const currentPackagings = form.getFieldValue('packagings') || []
  const newPackaging = {
    code: form.getFieldValue('code') ? `${form.getFieldValue('code')}-1` : '1',
    name: '',
    quantity_in_package: 1,
    unit_id: form.getFieldValue('unit_id'),
    selling_price: form.getFieldValue('selling_price'),
    is_standard_price: true,
    is_rate_based: true,
  }

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
                  ? t('products.breadcrumb.productEdit')
                  : t('products.breadcrumb.productCreate'),
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
            ? t('products.breadcrumb.productEdit')
            : t('products.breadcrumb.productCreate')}
        </Title>
      }
    >
      <Spin spinning={methods.formLoading || isInitializingCode}>
        <Form<ProductFormType>
          {...formProps}
          form={form as unknown as FormInstance<ProductFormType>}
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
                    {t('products.sections.basicInfo')}
                  </span>
                ),
                children: (
                  <BasicInfo
                    form={form as unknown as FormInstance<ProductFormType>}
                    addRef={addRef}
                    isAllowedSaveButton={isAllowedSaveButton}
                    setIsAllowedSaveButton={setIsAllowedSaveButton}
                    setIsInitializingCode={setIsInitializingCode}
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
                    to: '/products',
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
                dataProductDraft?.data &&
                Array.isArray(dataProductDraft.data) &&
                dataProductDraft.data.length > 0 && (
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleApplyDraft}
                    disabled={isFetchingProductDraft}
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
                autoInsertSpace={false}
              >
                {isUpdateMode
                  ? t('products.buttons.save')
                  : t('products.buttons.register')}
              </Button>
              <Button
                disabled={
                  showEditPackaging ||
                  (form.getFieldValue('packagings')?.length ?? 0) >= 2
                }
                onClick={() => {
                  setShowEditPackaging(true)
                  form.setFieldsValue({
                    packagings: [...currentPackagings, newPackaging],
                  })
                }}
                color="primary"
                variant="outlined"
              >
                {t('products.buttons.addPackage')}
              </Button>
            </Space>
          </Flex>
          <Collapse
            style={{
              marginTop: '20px',
              display:
                showEditPackaging ||
                (form.getFieldValue('packagings')?.length ?? 0) >= 2
                  ? 'block'
                  : 'none',
            }}
            items={[
              {
                key: 1,
                label: (
                  <span className="font-bold">
                    {t('products.sections.packagingPrice')}
                  </span>
                ),
                children: (
                  <PackagingUnitPrice
                    form={form as unknown as FormInstance<ProductFormType>}
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
        </Form>
      </Spin>
    </PageContainer>
  )
}

export default ProductFormContainer

/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownOutlined, RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { useGo, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Collapse,
  Divider,
  Flex,
  Form,
  Spin,
  Typography,
} from 'antd'
import type { FormInstance } from 'antd/lib'
import Link from 'next/link'
import { useRef } from 'react'

import BasicInfo from './basic-info'
import PackagingUnitPrice from './packaging-unit-price'
import PriceGroup from './price-group'
import type { ProductFormType } from './use-product-form'
import useProductForm from './use-product-form'

const { Title } = Typography

const ProductFormContainer: React.FC = () => {
  const t = useTranslate()
  const go = useGo()
  const [{ methods, isLoadingSubmit, isUpdateMode }] = useProductForm()
  const { form, formProps } = methods

  const addRef = useRef<(defaultValue?: object, insertIndex?: number) => void>()

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
                  {isUpdateMode ? t('buttons.edit') : t('buttons.create')}
                </Title>
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={
        <Title level={5} style={{ color: PRIMARY }}>
          {isUpdateMode ? t('buttons.edit') : t('buttons.create')}
        </Title>
      }
    >
      <Spin spinning={methods.formLoading}>
        <Form<ProductFormType>
          {...formProps}
          form={form as unknown as FormInstance<ProductFormType>}
          labelCol={{ span: 6 }}
          labelAlign="left"
          className="mb-[24px]"
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

          <Collapse
            style={{
              marginTop: '20px',
            }}
            items={[
              {
                key: 1,
                label: (
                  <span className="font-bold">
                    {t('products.unitPriceGroup.tableTitle')}
                  </span>
                ),
                children: (
                  <PriceGroup
                    form={form as unknown as FormInstance<ProductFormType>}
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
                    value: '',
                    // data?.author?.name ??
                    // '---' +
                    //   ' ' +
                    //   dayjs(data?.created_at).format('YYYY/MM/DD HH:mm'),
                  },
                  {
                    title: t('common.updated_by'),
                    value: '',
                    // data?.editor?.name ??
                    // '---' +
                    //   ' ' +
                    //   dayjs(data?.updated_at).format('YYYY/MM/DD HH:mm'),
                  },
                ]}
              />
            </>
          )}
          <Flex justify="end" gap="small" style={{ marginTop: 24 }}>
            <Button
              onClick={() => {
                go({ to: '/products' })
              }}
              color="primary"
              variant="outlined"
            >
              {t('products.buttons.back')}
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoadingSubmit}>
              {isUpdateMode
                ? t('products.buttons.save')
                : t('products.buttons.register')}
            </Button>
          </Flex>
        </Form>
      </Spin>
    </PageContainer>
  )
}

export default ProductFormContainer

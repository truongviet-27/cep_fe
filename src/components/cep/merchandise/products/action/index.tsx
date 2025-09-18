/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownOutlined, RightOutlined } from '@ant-design/icons'
import type { ProductFormType } from '@components/cep/merchandise/products/action/use-product-detail'
import useProductDetail from '@components/cep/merchandise/products/action/use-product-detail'
import ShowMoreInfo from '@components/common/show-more-info'
import PageContainer from '@components/organism/PageContainer'
import { useParsed } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Collapse,
  Divider,
  Flex,
  Form,
  Typography,
} from 'antd'
import type { FormInstance } from 'antd/lib'
import Link from 'next/link'
import { useRef } from 'react'

import BasicInfo from './basic-info'
import PackagingUnitPrice from './packaging-unit-price'
import PriceGroup from './price-group'

const { Title } = Typography

function ProductDetailContainer() {
  const [{ methods, isLoadingSubmit }, { t, onSubmit }] = useProductDetail()
  const { form, formProps } = methods
  const { params } = useParsed()

  const isUpdate = !!params?.id
  const actionType = params?.actionType
  const isView = actionType === 'VIEW'

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
                  {isView
                    ? t('buttons.detail')
                    : isUpdate
                      ? t('buttons.edit')
                      : t('buttons.create')}
                </Title>
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={
        <Title level={5} style={{ color: PRIMARY }}>
          {isView
            ? t('buttons.detail')
            : isUpdate
              ? t('buttons.edit')
              : t('buttons.create')}
        </Title>
      }
    >
      <Form<ProductFormType>
        {...formProps}
        form={form as unknown as FormInstance<ProductFormType>}
        labelCol={{ span: 6 }}
        labelAlign="left"
        className="mb-[24px]"
        onFinish={onSubmit}
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
                  isView={isView}
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
              rotate={isActive ? 0 : 180}
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
                  isView={isView}
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
              rotate={isActive ? 0 : 180}
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
              rotate={isActive ? 0 : 180}
            />
          )}
        />

        {isUpdate && (
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
        {!(isView && isUpdate) && (
          <Flex justify="end" gap="small" style={{ marginTop: 24 }}>
            <Button onClick={() => {}} color="primary" variant="outlined">
              {t('products.buttons.back')}
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoadingSubmit}>
              {t('products.buttons.register')}
            </Button>
          </Flex>
        )}
      </Form>
    </PageContainer>
  )
}

export default ProductDetailContainer

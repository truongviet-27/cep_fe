import useProduct from '@components/cep/merchandise/products/use-product'
import CoreInput from '@components/common/core-input'
import ProductCategoryDropdown from '@components/common/product-category-dropdown'
import CommonTable from '@components/common/table'
import { CreateButton } from '@refinedev/antd'
import { Button, Col, Form, Row } from 'antd'
import Link from 'next/link'

export default function ProductTab() {
  const [
    { columns, tableProps, searchFormProps, isFullAccess },
    { t, setFilters },
  ] = useProduct()

  return (
    <Form {...searchFormProps}>
      <Row gutter={16}>
        <Col sm={12} md={6} lg={4}>
          <CoreInput
            name="search"
            label={
              <span className="font-bold">
                {t('products.list.searchArea.productInputLabel')}
              </span>
            }
            placeholder={t('products.list.searchArea.productInputPlaceholder')}
          />
        </Col>

        <Col sm={12} md={6} lg={4}>
          <Form.Item
            label={
              <span className="font-bold">
                {t('products.list.searchArea.categoryLabel')}
              </span>
            }
            layout="vertical"
            name="category_id"
          >
            <ProductCategoryDropdown
              placeholder={t('products.list.searchArea.categoryPlaceholder')}
              onSelect={(_, __, ___, categoryId) => {
                searchFormProps.form?.setFieldValue('category_id', categoryId)
              }}
            />
          </Form.Item>
        </Col>

        <div className="mx-3 mt-[29px] mb-2 flex flex-1 flex-wrap justify-between gap-4">
          <div className="mr-auto flex flex-1 gap-4">
            <Button
              type="primary"
              htmlType="submit"
              onClick={searchFormProps.form?.submit}
              autoInsertSpace={false}
            >
              {t('buttons.search')}
            </Button>
            <Button
              onClick={() => {
                searchFormProps.form?.resetFields?.()
                setFilters([], 'replace')
              }}
              color="primary"
              variant="outlined"
            >
              {t('products.list.searchArea.clearButton')}
            </Button>
          </div>
          <div className="flex flex-col items-start">
            <Link href={'products/create'}>
              <CreateButton type="primary" icon={null}>
                {t('products.list.actions.createNewButton')}
              </CreateButton>
            </Link>
            <Link href={'products/csv'}>
              <Button
                className="!px-0 !text-[#721C24] underline"
                type="link"
                icon={null}
                disabled={!isFullAccess}
              >
                {t('products.list.actions.csvBulkUploadLink')}
              </Button>
            </Link>
          </div>
        </div>
      </Row>
      <div>
        <CommonTable
          {...tableProps}
          columns={columns}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
          }}
        />
      </div>
    </Form>
  )
}

import {
  ProductResourceEnum,
  ProductResourceLabelKey,
} from '@components/cep/merchandise/products/enum'
import useCombo from '@components/cep/merchandise/products/use-combo'
import CoreInput from '@components/common/core-input'
import ProductCategoryDropdown from '@components/common/product-category-dropdown'
import CommonTable from '@components/common/table'
import { CreateButton } from '@refinedev/antd'
import { Button, Col, Form, Row, Select } from 'antd'
import Link from 'next/link'

export default function AssortmentTab() {
  const [
    { columns, tableProps, searchFormProps },
    { t, setFilters, clearCmrFilterAndSearch },
  ] = useCombo()

  return (
    <Form {...searchFormProps}>
      <Row gutter={16}>
        <Col sm={12} md={6} lg={4}>
          <CoreInput
            name="search"
            label={
              <span className="font-bold">
                {t('product_combos.list.searchArea.code_or_name')}
              </span>
            }
            placeholder={t('products.list.searchArea.productInputPlaceholder')}
          />
        </Col>

        <Col sm={12} md={6} lg={4}>
          <Form.Item
            label={
              <span className="font-bold">
                {t('product_combos.fields.resource')}
              </span>
            }
            layout="vertical"
            name="resource"
          >
            <Select
              allowClear
              placeholder={t('pleaseSelect')}
              options={[
                {
                  label: t(
                    ProductResourceLabelKey[ProductResourceEnum.MERCHANDISE],
                  ),
                  value: ProductResourceEnum.MERCHANDISE,
                },
                {
                  label: t(
                    ProductResourceLabelKey[ProductResourceEnum.SERVICE],
                  ),
                  value: ProductResourceEnum.SERVICE,
                },
              ]}
            />
          </Form.Item>
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

        <Col sm={12} md={6} lg={4}>
          <Form.Item
            label={
              <span className="font-bold">
                {t('products.list.searchArea.cmrStatusLabel', 'CMR連携')}
              </span>
            }
            layout="vertical"
            name="is_sent_to_cmr"
            normalize={(value) => {
              if (value === null || value === undefined || value === '') {
                return undefined
              }

              const status = Number(value)
              return [0, 1, 2].includes(status) ? status : undefined
            }}
          >
            <Select
              allowClear
              placeholder={t(
                'products.list.searchArea.cmrStatusPlaceholder',
                '選択してください',
              )}
              optionFilterProp="label"
              onClear={clearCmrFilterAndSearch}
              onChange={(value) => {
                if (value === undefined || value === null) {
                  clearCmrFilterAndSearch()
                }
              }}
              options={[
                {
                  value: 0,
                  label: t(
                    'products.list.table.text.cmrNotLinked',
                    'CMR Not Linked',
                  ),
                },
                {
                  value: 1,
                  label: t(
                    'products.list.table.text.cmrInitiated',
                    'CMR連携開始',
                  ),
                },
                {
                  value: 2,
                  label: t('products.list.table.text.cmrLinked', 'CMR Linked'),
                },
              ]}
            />
          </Form.Item>
        </Col>

        <div className="mx-3 mt-[29px] mb-2 flex flex-1 flex-wrap justify-between gap-4">
          <div className="mr-auto flex flex-1 gap-4">
            <Button
              type="primary"
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
            <Link href={'product-combos/create'}>
              <CreateButton
                type="primary"
                icon={null}
                resource="product-combos"
              >
                {t('products.list.actions.createNewButton')}
              </CreateButton>
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

import {
  CaretDownOutlined,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import useProduct from '@components/cep/merchandise/products/use-product'
import CoreInput from '@components/common/core-input'
import PageContainer from '@components/common/page-container'
import CommonTable from '@components/common/table'
import { PRIMARY } from '@utility/color'
import renderCategories from '@utility/renderCategories'
import {
  AutoComplete,
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Form,
  Row,
  Typography,
} from 'antd'
import Link from 'next/link'

const { Title } = Typography

function ProductContainer() {
  const [
    {
      methods,
      dataSource,
      columns,
      page,
      pageSize,
      total,
      dataProductCategories,
    },
    { t, onSubmit, onReset, onChangePageSize, handleChooseCategory },
  ] = useProduct()

  const { formProps } = methods
  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('products.products')}
                </Title>
              ),
            },
            {
              title: <Title level={5}>{t('products.list.title')}</Title>,
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={t('products.list.title')}
    >
      <Form {...formProps}>
        <Row gutter={16}>
          <Col sm={12} md={6} lg={4}>
            <CoreInput
              name="search"
              label={
                <span className="font-bold">
                  {t('products.list.searchArea.productInputLabel')}
                </span>
              }
              placeholder={t(
                'products.list.searchArea.productInputPlaceholder',
              )}
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
            >
              <Dropdown
                trigger={['click']}
                popupRender={() => (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      padding: 10,
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      background: '#fff',
                    }}
                  >
                    <Form.Item name={'name_lk'}>
                      <AutoComplete
                        style={{ width: '100%' }}
                        options={dataProductCategories?.data.map((item) => ({
                          value: item.name,
                          label: item.name,
                        }))}
                        placeholder="検索..."
                        suffixIcon={<SearchOutlined />}
                        popupRender={() => {
                          return (
                            <div className="my-2 max-h-[300px] overflow-y-auto px-2">
                              {renderCategories(
                                dataProductCategories?.data || [],
                                1,
                                [],
                                [],
                                handleChooseCategory,
                              )}
                            </div>
                          )
                        }}
                      />
                    </Form.Item>
                  </div>
                )}
              >
                <CoreInput
                  icon={
                    <CaretDownOutlined
                      style={{
                        color: '#00000040',
                        fontSize: '12px',
                      }}
                    />
                  }
                  name="category"
                  readOnly={true}
                  placeholder={t(
                    'products.list.searchArea.categoryPlaceholder',
                  )}
                />
              </Dropdown>
            </Form.Item>
          </Col>

          <div className="mx-3 mt-[29px] mb-2 flex flex-1 flex-wrap justify-between gap-4">
            <div className="mr-auto flex flex-1 gap-4">
              <Button type="primary" onClick={onSubmit}>
                {t('buttons.search')}
              </Button>
              <Button onClick={onReset} color="primary" variant="outlined">
                {t('products.list.searchArea.clearButton')}
              </Button>
            </div>
            <div className="flex flex-col items-start">
              <Link href={'products/create'}>
                <Button type="primary">
                  {t('products.list.actions.createNewButton')}
                </Button>
              </Link>
              <Link href={'products/csv'}>
                <Button className="!px-0" type="link">
                  {t('products.list.actions.csvBulkUploadLink')}
                </Button>
              </Link>
            </div>
          </div>
        </Row>

        <CommonTable
          columns={columns}
          dataSource={dataSource}
          loading={false}
          pagination={{
            pageSize,
            current: page,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total}${t('products.list.table.text.pieces')}`,
            total: total,
            onChange: onChangePageSize,
            showSizeChanger: true,
          }}
          isPagination
        />

        <div className="mt-4 text-right">
          <Link href={''}>
            <Button color="primary" variant="outlined">
              {t('buttons.back')}
            </Button>
          </Link>
        </div>
      </Form>
    </PageContainer>
  )
}

export default ProductContainer

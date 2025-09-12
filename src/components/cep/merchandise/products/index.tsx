import {
  CaretDownOutlined,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import useProduct from '@components/cep/merchandise/products/use-product'
import CommonTable from '@components/common/table'
import CoreInput from '@components/organism/CoreInput'
import PageContainer from '@components/organism/PageContainer'
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
      title={
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
              title: <Title level={5}>{t('商品一覧')}</Title>,
            },
          ]}
          separator={<RightOutlined />}
        />
      }
    >
      <Form {...formProps}>
        <Title
          level={5}
          style={{
            color: '#1890FF',
          }}
        >
          {t('商品一覧')}
        </Title>
        <Row gutter={16}>
          <Col sm={12} md={6} lg={4}>
            <CoreInput
              name="search"
              label={<span className="font-bold">{t('商品名')}</span>}
              placeholder={t('検索キーワード')}
            />
          </Col>

          <Col sm={12} md={6} lg={4}>
            <Form.Item
              label={<span className="font-bold">{t('カテゴリ')}</span>}
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
                  placeholder="選択してください"
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
                {t('クリア')}
              </Button>
            </div>
            <div className="flex flex-col items-start">
              <Link href={'products/create'}>
                <Button type="primary">{t('新規作成')}</Button>
              </Link>
              <Link href={'products/csv'}>
                <Button className="!px-0" type="link">
                  {t('CSV一括登録')}
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
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}件`,
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

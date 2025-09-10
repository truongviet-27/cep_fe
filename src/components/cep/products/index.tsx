import { CaretDownOutlined, RightOutlined } from '@ant-design/icons'
import useProduct from '@components/cep/products/useProduct'
import CommonTable from '@components/common/table'
import CoreInput from '@components/organism/CoreInput'
import PageContainer from '@components/organism/PageContainer'
import { PRIMARY } from '@utility/color'
import {
  AutoComplete,
  Breadcrumb,
  Button,
  Col,
  Form,
  Row,
  Typography,
} from 'antd'
import Link from 'next/link'
import React from 'react'

const { Title } = Typography

function ProductContainer() {
  const [
    { dataSource, columns, page, pageSize, total },
    { t, onChangePageSize },
  ] = useProduct()
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
      <Form>
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
              name="subCategory"
              label={<span className="font-bold">{t('カテゴリ')}</span>}
              layout="vertical"
            >
              <AutoComplete
                options={[
                  {
                    label: 'tes1',
                    value: '123',
                  },
                  {
                    label: 'tes2',
                    value: '1234',
                  },
                ]}
                placeholder="サブカテゴリーを選択"
                filterOption={(inputValue, option) => {
                  return (
                    option!.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  )
                }}
                maxCount={1}
                suffixIcon={<CaretDownOutlined />}
              />
            </Form.Item>
          </Col>

          <div className="mx-3 mt-[29px] mb-2 flex flex-1 flex-wrap justify-between gap-4">
            <div className="mr-auto flex flex-1 gap-4">
              <Button type="primary">{t('buttons.search')}</Button>
              <Button color="primary" variant="outlined">
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
          bordered
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

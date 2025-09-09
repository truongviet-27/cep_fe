import { CaretDownOutlined, RightOutlined } from '@ant-design/icons'
import useProduct from '@components/cep/products/useProduct'
import CommonTable from '@components/common/table'
import CoreInput from '@components/organism/CoreInput'
import PageContainer from '@components/organism/PageContainer'
import { PRIMARY } from '@utility/color'
import { AutoComplete, Breadcrumb, Col, Form, Row, Typography } from 'antd'
import React from 'react'

const { Title } = Typography

function ProductContainer() {
  const [{}, { t }] = useProduct()
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
          <Col span={4}>
            <CoreInput
              name="search"
              label={<span className="font-bold">{t('タスクコード')}</span>}
              placeholder={t('検索キーワード')}
            />
          </Col>

          <Col span={4}>
            <Form.Item
              name="category"
              label={<span className="font-bold">{t('ステータス')}</span>}
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
                placeholder={t('カテゴリーを選択')}
                optionFilterProp="label"
                filterOption={(inputValue, option) =>
                  option!.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
                suffixIcon={<CaretDownOutlined />}
              />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item
              name="subCategory"
              label={<span className="font-bold">種別</span>}
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

          <Col span={4}>
            <Form.Item
              name="subCategory"
              label={<span className="font-bold">種別</span>}
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
        </Row>

        <CommonTable
          bordered
          columns={[]}
          dataSource={[]}
          loading={false}
          //   pagination={{
          //     pageSize,
          //     current: page,
          //     showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}件`,
          //     total: total,
          //     onChange: onChangePageSize,
          //     showSizeChanger: true,
          //   }}
        />
      </Form>
    </PageContainer>
  )
}

export default ProductContainer

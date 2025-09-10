import {
  CaretDownOutlined,
  DownOutlined,
  EditFilled,
  RightOutlined,
} from '@ant-design/icons'
import useProductDetail from '@components/cep/products/detail/useProductDetail'
import CommonTable from '@components/common/table'
import CoreInput from '@components/organism/CoreInput'
import PageContainer from '@components/organism/PageContainer'
import { useParsed } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import {
  AutoComplete,
  Breadcrumb,
  Button,
  Col,
  Collapse,
  Form,
  Row,
  Typography,
} from 'antd'
import Link from 'next/link'
import { Controller } from 'react-hook-form'

const { Title } = Typography

function ProductDetailContainer() {
  const [
    {
      methods,
      columnsPackageInfo,
      dataSourcePackageInfo,
      columnsPackagePrice,
      dataSourcePackagePrice,
      isAppend,
      fields,
    },
    { t, append, onSubmit, setIsAppend },
  ] = useProductDetail()
  const { getValues, control } = methods
  const { params } = useParsed()

  const code = params?.code
  const actionType = params?.actionType
  const isView = actionType === 'VIEW'

  return (
    <PageContainer
      title={
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/products">
                  <Title level={5}>{t('products.products')}</Title>
                </Link>
              ),
            },
            {
              title: (
                <Link href="/products">
                  <Title level={5}>{t('商品一覧')}</Title>
                </Link>
              ),
            },
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {code}
                </Title>
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
    >
      <form>
        <Collapse
          items={[
            {
              key: 1,
              label: <span className="font-bold">{t('基本情報')}</span>,
              children: (
                <div className="px-2">
                  <Row gutter={[16, 16]}>
                    <Col xs={12} lg={8}>
                      <Controller
                        name="code"
                        control={control}
                        render={({ field }) => {
                          return (
                            <CoreInput
                              isView={isView}
                              label={
                                <span className="font-bold">
                                  {t('商品コード')}
                                </span>
                              }
                              required={true}
                              layout="horizontal"
                              {...field}
                            />
                          )
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} lg={10}>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => {
                          return (
                            <CoreInput
                              isView={isView}
                              label={
                                <span className="font-bold">{t('商品名')}</span>
                              }
                              required={true}
                              layout="horizontal"
                              {...field}
                            />
                          )
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} lg={10}>
                      <Controller
                        name="shortName"
                        control={control}
                        render={({ field }) => {
                          return (
                            <CoreInput
                              isView={isView}
                              label={
                                <span className="font-bold">
                                  {t('商品名（略称）')}
                                </span>
                              }
                              required={true}
                              layout="horizontal"
                              {...field}
                            />
                          )
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} lg={8}>
                      <Controller
                        name="barcode"
                        control={control}
                        render={({ field }) => {
                          return (
                            <CoreInput
                              isView={isView}
                              label={
                                <span className="font-bold">
                                  {t('バーコード')}
                                </span>
                              }
                              required={true}
                              layout="horizontal"
                              {...field}
                            />
                          )
                        }}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} md={12} xxl={6}>
                      <Form.Item
                        label={
                          <span className="w-[200px] text-left font-bold">
                            {t('カテゴリ')}
                          </span>
                        }
                        colon={false}
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

                  <Row>
                    <Col xs={12} md={12} xxl={6}>
                      <Form.Item
                        label={
                          <span className="w-[200px] text-left font-bold">
                            {t('単位')}
                          </span>
                        }
                        colon={false}
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
                  <Row>
                    <Col xs={12} lg={6}>
                      <Controller
                        name="costPrice"
                        control={control}
                        render={({ field }) => {
                          return (
                            <CoreInput
                              isView={isView}
                              label={
                                <span className="font-bold">
                                  {t('原価（円）')}
                                </span>
                              }
                              required={true}
                              layout="horizontal"
                              type="number"
                              {...field}
                              style={{
                                width: '225px',
                              }}
                            />
                          )
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} lg={6}>
                      <Controller
                        name="sellingPrice"
                        control={control}
                        render={({ field }) => {
                          return (
                            <CoreInput
                              isView={isView}
                              label={
                                <span className="font-bold">
                                  {t('販売単価（円）')}
                                </span>
                              }
                              required={true}
                              layout="horizontal"
                              type="number"
                              {...field}
                              style={{
                                width: '225px',
                              }}
                            />
                          )
                        }}
                      />
                    </Col>
                    <Col>
                      <div className="mt-1 ml-10">
                        {isAppend ? (
                          <EditFilled
                            onClick={() => {
                              setIsAppend(false)
                            }}
                          />
                        ) : (
                          <Button
                            size="small"
                            color="blue"
                            variant="outlined"
                            onClick={() => {
                              setIsAppend(true)
                              if (dataSourcePackageInfo.length === 0) {
                                append({
                                  packageCode: getValues('code'),
                                  packageName: getValues('name'),
                                  status: 'active',
                                  quantity: 0,
                                  unit: getValues('unit'),
                                  standardPrice: 0,
                                  salesPrice: 0,
                                  standardPrint: true,
                                })
                              }
                            }}
                          >
                            {t('更新')}
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} lg={10}>
                      <Controller
                        name="note"
                        control={control}
                        render={({ field }) => {
                          return (
                            <CoreInput
                              isView={isView}
                              label={
                                <span className="font-bold">{t('備考')}</span>
                              }
                              required={true}
                              layout="horizontal"
                              {...field}
                            />
                          )
                        }}
                      />
                    </Col>
                  </Row>
                </div>
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
              label: <span className="font-bold">{t('基本情報')}</span>,
              children: (
                <div className="px-2">
                  <CommonTable
                    columns={columnsPackageInfo}
                    dataSource={dataSourcePackageInfo}
                    bordered
                    pagination={false}
                    rowClassName={(_, index) => {
                      return getValues(`info.${index}.status`) === 'inactive'
                        ? 'bg-[#BBBBBB] hover:!bg-[#ccc]'
                        : ''
                    }}
                  />
                  <div className="mt-4 text-right">
                    <Button
                      type="primary"
                      disabled={fields.length < 1}
                      onClick={() => {
                        append({
                          packageCode: `${getValues('code')}-${fields.length}`,
                          packageName: '',
                          status: 'active',
                          quantity: 1,
                          unit: '',
                          standardPrice: getValues(`sellingPrice`),
                          salesPrice: getValues(`sellingPrice`),
                          standardPrint: true,
                        })
                      }}
                    >
                      行を追加
                    </Button>
                  </div>
                </div>
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
              label: <span className="font-bold">{t('基本情報')}</span>,
              children: (
                <div className="px-2">
                  <CommonTable
                    columns={columnsPackagePrice}
                    dataSource={dataSourcePackagePrice}
                    bordered
                    pagination={false}
                    rowClassName={(_, index) => {
                      return getValues(`info.${index}.status`) === 'inactive'
                        ? 'bg-[#BBBBBB] hover:!bg-[#ccc]'
                        : ''
                    }}
                  />
                </div>
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

        <div className="mt-10 flex justify-between">
          <div></div>
          <div className="flex items-center gap-4">
            <Button color="primary" variant="outlined">
              123
            </Button>
            <Button type="primary" onClick={onSubmit}>
              456
            </Button>
          </div>
        </div>
      </form>
    </PageContainer>
  )
}

export default ProductDetailContainer

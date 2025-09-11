import {
  CaretDownOutlined,
  DownOutlined,
  EditFilled,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import useProductDetail from '@components/cep/products/detail2/useProductDetail'
import CommonTable from '@components/common/table'
import CoreInput from '@components/organism/CoreInput'
import PageContainer from '@components/organism/PageContainer'
import { useGo, useParsed } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import renderCategories from '@utility/renderCategories'
import {
  AutoComplete,
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Collapse,
  Dropdown,
  Form,
  Input,
  Radio,
  Row,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Link from 'next/link'
import { useRef } from 'react'

const { Title } = Typography

function ProductDetailContainer() {
  const [
    {
      methods,
      dataSourcePackageInfo,
      columnsPackagePrice,
      dataSourcePackagePrice,
      isAppend,
      dataProductCategories,
    },
    { t, setIsAppend, handleChooseCategory },
  ] = useProductDetail()
  const { form, formProps, saveButtonProps } = methods
  const { getFieldValue } = form
  const { params } = useParsed()

  const id = params?.id
  const actionType = params?.actionType
  const isView = actionType === 'VIEW'

  const go = useGo()

  const addRef = useRef<(defaultValue?: object, insertIndex?: number) => void>()

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
                  {id}
                </Title>
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
    >
      <Form {...formProps}>
        <Collapse
          items={[
            {
              key: 1,
              label: <span className="font-bold">{t('基本情報')}</span>,
              children: (
                <div className="px-2">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={8}>
                      <CoreInput
                        name="code"
                        isView={isView}
                        label={
                          <span className="font-bold">{t('商品コード')}</span>
                        }
                        required={true}
                        layout="horizontal"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
                      <CoreInput
                        name="name"
                        isView={isView}
                        label={<span className="font-bold">{t('商品名')}</span>}
                        required={true}
                        layout="horizontal"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
                      <CoreInput
                        name="short_name"
                        isView={isView}
                        label={
                          <span className="font-bold">
                            {t('商品名（略称）')}
                          </span>
                        }
                        required={true}
                        layout="horizontal"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={8}>
                      <CoreInput
                        name="barcode"
                        isView={isView}
                        label={
                          <span className="font-bold">{t('バーコード')}</span>
                        }
                        required={true}
                        layout="horizontal"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={24} sm={22} md={20} lg={16} xl={10} xxl={6}>
                      <div className="flex">
                        <label className="w-[214px] text-left font-bold">
                          {t('カテゴリ')}
                        </label>
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
                                  options={dataProductCategories?.data.map(
                                    (item) => ({
                                      value: item.name,
                                      label: item.name,
                                    }),
                                  )}
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
                          <CoreInput icon={<DownOutlined />} readOnly={true} />
                        </Dropdown>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={24} sm={22} md={20} lg={16} xl={10} xxl={6}>
                      <Form.Item
                        name="unit"
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
                    <Col xs={24} sm={22} md={20} lg={16} xl={10} xxl={6}>
                      <CoreInput
                        name="costPrice"
                        isView={isView}
                        label={
                          <span className="font-bold">{t('原価（円）')}</span>
                        }
                        required={true}
                        layout="horizontal"
                        type="number"
                        style={{
                          width: '225px',
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24} sm={22} md={20} lg={16} xl={10} xxl={6}>
                      <CoreInput
                        name="sellingPrice"
                        isView={isView}
                        label={
                          <span className="font-bold">
                            {t('販売単価（円）')}
                          </span>
                        }
                        required={true}
                        layout="horizontal"
                        type="number"
                        style={{
                          width: '225px',
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
                                if (addRef.current) {
                                  addRef.current({
                                    packageCode: getFieldValue('code'),
                                    packageName: getFieldValue('name'),
                                    status: 'active',
                                    quantity: 0,
                                    unit: getFieldValue('unit'),
                                    standardPrice: 0,
                                    salesPrice: 0,
                                    standardPrint: true,
                                  })
                                }
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
                    <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
                      <CoreInput
                        name="note"
                        isView={isView}
                        label={<span className="font-bold">{t('備考')}</span>}
                        required={true}
                        layout="horizontal"
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
                  <Form.List name={'info'}>
                    {(fields, { add, remove }) => {
                      addRef.current = add
                      const columnsPackageInfo = [
                        {
                          title: '荷姿コード',
                          dataIndex: 'packageCode',
                          render: (_, __, index) => (
                            <CoreInput
                              name={[index, 'packageCode']}
                              readOnly={index === 0}
                              style={{
                                ...(index === 0
                                  ? {
                                      background: 'transparent',
                                      paddingLeft: 0,
                                      color: 'inherit',
                                      border: 'none',
                                      boxShadow: 'none',
                                      cursor: 'default',
                                    }
                                  : {}),
                              }}
                            />
                          ),
                        },
                        {
                          title: '荷姿名',
                          dataIndex: 'packageName',
                          render: (_, __, index) => (
                            <CoreInput
                              name={[index, 'packageName']}
                              readOnly={index === 0}
                              style={{
                                ...(index === 0
                                  ? {
                                      background: 'transparent',
                                      paddingLeft: 0,
                                      color: 'inherit',
                                      border: 'none',
                                      boxShadow: 'none',
                                      cursor: 'default',
                                    }
                                  : {}),
                              }}
                            />
                          ),
                        },
                        {
                          title: 'ステータス',
                          dataIndex: 'status',
                          render: (_, __, index) => (
                            <Form.Item
                              name={[index, 'status']}
                              noStyle
                              style={{
                                display: 'flex',
                              }}
                            >
                              <Radio.Group
                                options={[
                                  { value: 'active', label: '有効' },
                                  { value: 'inactive', label: '無効' },
                                ]}
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: '入数',
                          dataIndex: 'quantity',
                          render: (_, __, index) => (
                            <Form.Item name={[index, 'quantity']} noStyle>
                              <Input type="number" readOnly={index === 0} />
                            </Form.Item>
                          ),
                        },
                        {
                          title: '単位',
                          dataIndex: 'unit',
                          render: (_, __, index) => (
                            <Form.Item name={[index, 'quantity']} noStyle>
                              <Input type="number" readOnly={index === 0} />
                            </Form.Item>
                          ),
                        },
                        {
                          title: '標準価格(円)',
                          dataIndex: 'salesPrice',
                          render: (_, __, index) => (
                            <Form.Item name={[index, 'salesPrice']} noStyle>
                              <Input readOnly={index === 0} />
                            </Form.Item>
                          ),
                        },
                        {
                          title: '販売価格(円)',
                          dataIndex: 'salesPrice',
                          render: (_, __, index) => (
                            <Form.Item name={[index, 'salesPrice']} noStyle>
                              <Input readOnly={index === 0} />
                            </Form.Item>
                          ),
                        },
                        {
                          title: '標準印刷',
                          dataIndex: 'standardPrint',
                          render: (_, __, index) => (
                            <Form.Item
                              name={[index, 'standardPrint']}
                              valuePropName="checked"
                              noStyle
                            >
                              <Checkbox />
                            </Form.Item>
                          ),
                        },
                        {
                          title: '操作',
                          dataIndex: 'action',
                          render: (_, __, index) =>
                            index > 0 && (
                              <Button
                                onClick={() => {
                                  remove(index)
                                }}
                                style={{
                                  backgroundColor: '#721C24',
                                  borderColor: '#721C24',
                                  color: '#fff',
                                }}
                              >
                                {t('削除')}
                              </Button>
                            ),
                        },
                      ] as ColumnsType

                      return (
                        <>
                          <CommonTable
                            columns={columnsPackageInfo}
                            dataSource={fields}
                            bordered
                            pagination={false}
                            rowClassName={(_, index) => {
                              return getFieldValue(`info.${index}.status`) ===
                                'inactive'
                                ? 'bg-[#BBBBBB] hover:!bg-[#ccc]'
                                : ''
                            }}
                          />
                          <div className="mt-4 text-right">
                            <Button
                              type="primary"
                              // disabled={[].length < 1}
                              onClick={() => {
                                add({
                                  packageCode: `${getFieldValue('code')}-${fields.length}`,
                                  packageName: '',
                                  status: 'active',
                                  quantity: 1,
                                  unit: '',
                                  standardPrice: getFieldValue(`sellingPrice`),
                                  salesPrice: getFieldValue(`sellingPrice`),
                                  standardPrint: true,
                                })
                              }}
                            >
                              行を追加
                            </Button>
                          </div>
                        </>
                      )
                    }}
                  </Form.List>
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
                      return getFieldValue(`info.${index}.status`) ===
                        'inactive'
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
            <Button
              color="primary"
              variant="outlined"
              size="large"
              onClick={() => {
                go({
                  to: '/products',
                })
              }}
            >
              戻る
            </Button>
            {isView ? (
              <Button
                type="primary"
                onClick={() => {
                  go({
                    to: `/products/edit/${1}`,
                  })
                }}
                size="large"
              >
                {t('buttons.edit')}
              </Button>
            ) : (
              <Button type="primary" {...saveButtonProps} size="large">
                {t('buttons.confirm')}
              </Button>
            )}
          </div>
        </div>
      </Form>
    </PageContainer>
  )
}

export default ProductDetailContainer

import {
  CaretDownOutlined,
  DownOutlined,
  EditFilled,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import useProductDetail from '@components/cep/products/action/useProductDetail'
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
    { methods, isAppend, dataProductCategories },
    { t, setIsAppend, handleChooseCategory },
  ] = useProductDetail()
  const { form, formProps, saveButtonProps } = methods
  const { getFieldValue, setFieldsValue } = form
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
                        isView={isView || isAppend}
                        label={
                          <span className="font-bold">{t('商品コード')}</span>
                        }
                        required={true}
                        layout="horizontal"
                        rules={[
                          {
                            required: true,
                            message: 'helo anhe em',
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
                      <CoreInput
                        name="name"
                        isView={isView || isAppend}
                        label={<span className="font-bold">{t('商品名')}</span>}
                        required={true}
                        layout="horizontal"
                        rules={[
                          {
                            required: true,
                            message: 'helo anhe em',
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
                      <CoreInput
                        name="short_name"
                        isView={isView || isAppend}
                        label={
                          <span className="font-bold">
                            {t('商品名（略称）')}
                          </span>
                        }
                        layout="horizontal"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={8}>
                      <CoreInput
                        name="barcode"
                        isView={isView || isAppend}
                        label={
                          <span className="font-bold">{t('バーコード')}</span>
                        }
                        layout="horizontal"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={24} sm={22} md={20} lg={16} xl={10} xxl={6}>
                      <div className="flex">
                        <div className="w-[214px] text-left font-bold">
                          {t('カテゴリ')}
                          <span style={{ color: 'red', marginLeft: 4 }}>*</span>
                        </div>
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
                          <CoreInput
                            icon={
                              <CaretDownOutlined
                                style={{
                                  color: '#00000040',
                                  fontSize: '12px',
                                }}
                              />
                            }
                            readOnly={true}
                            placeholder="選択してください"
                            // isView={isView || isAppend}
                          />
                        </Dropdown>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={24} sm={22} md={20} lg={16} xl={10} xxl={6}>
                      <Form.Item
                        name="unit"
                        label={
                          <div className="w-[200px] text-left font-bold">
                            {t('単位')}
                            <span style={{ color: 'red', marginLeft: 4 }}>
                              *
                            </span>
                          </div>
                        }
                        colon={false}
                        required={false}
                        rules={[
                          {
                            required: true,
                            message: 'helo anhe em',
                          },
                        ]}
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
                          placeholder="選択してください"
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
                        isView={isView || isAppend}
                        label={
                          <span className="font-bold">{t('原価（円）')}</span>
                        }
                        required={true}
                        layout="horizontal"
                        type="number"
                        style={{
                          width: '225px',
                        }}
                        rules={[
                          {
                            required: true,
                            message: 'helo anhe em',
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24} sm={22} md={20} lg={16} xl={10} xxl={6}>
                      <CoreInput
                        name="sellingPrice"
                        isView={isView || isAppend}
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
                        rules={[
                          {
                            required: true,
                            message: 'helo anhe em',
                          },
                        ]}
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
                            onClick={async () => {
                              await form.validateFields()
                              setIsAppend(true)
                              if (getFieldValue(['info']).length === 0) {
                                if (addRef.current) {
                                  addRef.current({
                                    packageCode: getFieldValue('code'),
                                    packageName: getFieldValue('name'),
                                    status: 'active',
                                    quantity: 1,
                                    unit: getFieldValue('unit'),
                                    standardPrice:
                                      getFieldValue('sellingPrice') * 1,
                                    salesPrice: getFieldValue('sellingPrice'),
                                    standardPrint: true,
                                  })
                                }
                                return
                              }

                              setFieldsValue({
                                info: getFieldValue('info').map(
                                  (item: object, index: number) => {
                                    return index === 0
                                      ? {
                                          packageCode: getFieldValue('code'),
                                          packageName: getFieldValue('name'),
                                          status: 'active',
                                          quantity: 1,
                                          unit: getFieldValue('unit'),
                                          standardPrice:
                                            getFieldValue('sellingPrice') * 1,
                                          salesPrice:
                                            getFieldValue('sellingPrice'),
                                          standardPrint: true,
                                        }
                                      : item
                                  },
                                ),
                              })
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
                        isView={isView || isAppend}
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
                      const columns = [
                        {
                          title: '荷姿コード',
                          dataIndex: 'packageCode',
                          render: (_, __, index) => (
                            <CoreInput
                              name={[index, 'packageCode']}
                              readOnly={true}
                              style={{
                                background: 'transparent',
                                paddingLeft: 0,
                                color: 'inherit',
                                border: 'none',
                                boxShadow: 'none',
                                cursor: 'default',
                              }}
                              styleForm={{
                                marginBottom: '0px',
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
                              readOnly={
                                index === 0 ||
                                getFieldValue(['info', index, 'status']) ===
                                  'inactive'
                              }
                              style={{
                                ...(index === 0 ||
                                getFieldValue(['info', index, 'status']) ===
                                  'inactive'
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
                              styleForm={{
                                marginBottom: '0px',
                              }}
                            />
                          ),
                        },
                        {
                          title: 'ステータス',
                          dataIndex: 'status',
                          render: (_, __, index) =>
                            index === 0 ? (
                              <div>有効</div>
                            ) : (
                              <Form.Item
                                name={[index, 'status']}
                                style={{
                                  marginBottom: 0,
                                }}
                              >
                                <Radio.Group
                                  options={[
                                    {
                                      value: 'active',
                                      label: t('有効'),
                                    },
                                    {
                                      value: 'inactive',
                                      label: t('無効'),
                                    },
                                  ]}
                                />
                              </Form.Item>
                            ),
                        },
                        {
                          title: '入数',
                          dataIndex: 'quantity',
                          render: (_, __, index) => (
                            <CoreInput
                              name={[index, 'quantity']}
                              readOnly={
                                index === 0 ||
                                getFieldValue(['info', index, 'status']) ===
                                  'inactive'
                              }
                              style={{
                                ...(index === 0 ||
                                getFieldValue(['info', index, 'status']) ===
                                  'inactive'
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
                              styleForm={{
                                marginBottom: '0px',
                              }}
                            />
                          ),
                        },
                        {
                          title: '単位',
                          dataIndex: 'unit',
                          render: (_, __, index) => (
                            <CoreInput
                              name={[index, 'unit']}
                              readOnly={true}
                              style={{
                                background: 'transparent',
                                paddingLeft: 0,
                                color: 'inherit',
                                border: 'none',
                                boxShadow: 'none',
                                cursor: 'default',
                              }}
                              styleForm={{
                                marginBottom: '0px',
                              }}
                            />
                          ),
                        },
                        {
                          title: '標準価格(円)',
                          dataIndex: 'standardPrice',
                          render: (_, __, index) => {
                            return (
                              <CoreInput
                                name={[index, 'standardPrice']}
                                readOnly={true}
                                style={{
                                  background: 'transparent',
                                  paddingLeft: 0,
                                  color: 'inherit',
                                  border: 'none',
                                  boxShadow: 'none',
                                  cursor: 'default',
                                }}
                                styleForm={{
                                  marginBottom: '0px',
                                }}
                              />
                            )
                          },
                        },
                        {
                          title: '販売価格(円)',
                          dataIndex: 'salesPrice',
                          render: (_, __, index) => {
                            return (
                              <CoreInput
                                name={[index, 'salesPrice']}
                                readOnly={
                                  index === 0 ||
                                  getFieldValue(['info', index, 'status']) ===
                                    'inactive'
                                }
                                style={{
                                  ...(index === 0 ||
                                  getFieldValue(['info', index, 'status']) ===
                                    'inactive'
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
                                styleForm={{
                                  marginBottom: '0px',
                                }}
                              />
                            )
                          },
                        },
                        {
                          title: '標準印刷',
                          dataIndex: 'standardPrint',
                          render: (_, __, index) =>
                            index !== 0 && (
                              <Form.Item
                                name={[index, 'standardPrint']}
                                valuePropName="checked"
                                noStyle
                              >
                                <Checkbox
                                  style={{
                                    transform: 'scale(1.3)',
                                    marginBottom: 0,
                                  }}
                                  checked={getFieldValue([
                                    index,
                                    'standardPrint',
                                  ])}
                                  disabled={
                                    getFieldValue(['info', index, 'status']) ===
                                    'inactive'
                                  }
                                />
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
                        <Form.Item shouldUpdate noStyle>
                          {({ getFieldValue }) => (
                            <>
                              <CommonTable
                                columns={columns}
                                dataSource={fields}
                                pagination={false}
                                rowClassName={(_, index) =>
                                  getFieldValue(['info', index, 'status']) ===
                                  'inactive'
                                    ? 'bg-[#BBBBBB] hover:!bg-[#ccc]'
                                    : ''
                                }
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
                                      unit: getFieldValue('unit'),
                                      standardPrice:
                                        getFieldValue(`sellingPrice`),
                                      salesPrice: getFieldValue(`sellingPrice`),
                                      standardPrint: true,
                                    })
                                  }}
                                >
                                  行を追加
                                </Button>
                              </div>
                            </>
                          )}
                        </Form.Item>
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
                  <Form.List name={'info'}>
                    {(fields) => {
                      const columns = [
                        {
                          title: '荷姿コード',
                          dataIndex: 'packageCode',
                          key: 'packageCode',
                          render: (_, __, index) => {
                            return (
                              <Form.Item shouldUpdate noStyle>
                                {() =>
                                  getFieldValue(['info', index, 'packageCode'])
                                }
                              </Form.Item>
                            )
                          },
                        },
                        {
                          title: '荷姿名',
                          dataIndex: 'packageName',
                          key: 'packageName',
                          render: (_, __, index) => {
                            return (
                              <Form.Item shouldUpdate>
                                {() =>
                                  getFieldValue(['info', index, 'packageName'])
                                }
                              </Form.Item>
                            )
                          },
                        },
                        {
                          title: '販売価格(円)',
                          dataIndex: 'salesPrice',
                          key: 'salesPrice',
                          render: (_, __, index) => {
                            return (
                              <Form.Item shouldUpdate noStyle>
                                {() =>
                                  getFieldValue(['info', index, 'salesPrice'])
                                }
                              </Form.Item>
                            )
                          },
                        },
                        {
                          title: '設定方式',
                          dataIndex: 'status',
                          key: 'status',
                          render: (_, __, index) =>
                            index === 0 ? (
                              <div>有効</div>
                            ) : (
                              <Form.Item name={[index, 'status']}>
                                <Radio.Group
                                  options={[
                                    {
                                      value: 'active',
                                      label: t('有効'),
                                    },
                                    {
                                      value: 'inactive',
                                      label: t('無効'),
                                    },
                                  ]}
                                />
                              </Form.Item>
                            ),
                        },
                        {
                          title: 'S 80%(円)',
                          dataIndex: 'sPrice',
                          key: 'sPrice',
                          render: (_, __, index) => {
                            return (
                              <Form.Item shouldUpdate noStyle>
                                {() =>
                                  (
                                    getFieldValue([
                                      'info',
                                      index,
                                      'salesPrice',
                                    ]) * 0.8
                                  ).toFixed(2)
                                }
                              </Form.Item>
                            )
                          },
                        },
                        {
                          title: 'A 85%(円)',
                          dataIndex: 'aPrice',
                          key: 'aPrice',

                          render: (_, __, index) => {
                            return (
                              <Form.Item shouldUpdate noStyle>
                                {() =>
                                  (
                                    getFieldValue([
                                      'info',
                                      index,
                                      'salesPrice',
                                    ]) * 0.85
                                  ).toFixed(2)
                                }
                              </Form.Item>
                            )
                          },
                        },
                        {
                          title: 'B 90%(円)',
                          dataIndex: 'bPrice',
                          key: 'bPrice',

                          render: (_, __, index) => {
                            return (
                              <Form.Item shouldUpdate noStyle>
                                {() =>
                                  (
                                    getFieldValue([
                                      'info',
                                      index,
                                      'salesPrice',
                                    ]) * 0.9
                                  ).toFixed(2)
                                }
                              </Form.Item>
                            )
                          },
                        },
                        {
                          title: 'C 95%(円)',
                          dataIndex: 'cPrice',
                          key: 'cPrice',

                          render: (_, __, index) => {
                            return (
                              <Form.Item shouldUpdate noStyle>
                                {() =>
                                  (
                                    getFieldValue([
                                      'info',
                                      index,
                                      'salesPrice',
                                    ]) * 0.95
                                  ).toFixed(2)
                                }
                              </Form.Item>
                            )
                          },
                        },
                        {
                          title: 'D 100%(円)',
                          dataIndex: 'dPrice',
                          key: 'dPrice',

                          render: (_, __, index) => {
                            return (
                              <Form.Item shouldUpdate noStyle>
                                {() =>
                                  (
                                    getFieldValue([
                                      'info',
                                      index,
                                      'salesPrice',
                                    ]) * 1
                                  ).toFixed(2)
                                }
                              </Form.Item>
                            )
                          },
                        },
                        {
                          title: 'E 105%(円)',
                          dataIndex: 'ePrice',
                          key: 'ePrice',

                          render: (_, __, index) => {
                            return (
                              <Form.Item shouldUpdate noStyle>
                                {() =>
                                  (
                                    getFieldValue([
                                      'info',
                                      index,
                                      'salesPrice',
                                    ]) * 1.05
                                  ).toFixed(2)
                                }
                              </Form.Item>
                            )
                          },
                        },
                      ] as ColumnsType
                      return (
                        <CommonTable
                          columns={columns}
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

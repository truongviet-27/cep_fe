import {
  CaretDownOutlined,
  DownOutlined,
  EditFilled,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import useProductDetail from '@components/cep/merchandise/products/action/use-product-detail'
import { Action } from '@components/common/action'
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
  Divider,
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
  const { getFieldValue, setFieldsValue, setFieldValue } = form
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
                  {isView ? id : !!id ? t('buttons.edit') : t('buttons.create')}
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
              label: (
                <span className="font-bold">
                  {t('products.sections.basicInfo')}
                </span>
              ),
              children: (
                <div className="px-2">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={8}>
                      <CoreInput
                        name="code"
                        isView={isView || isAppend}
                        label={
                          <span className="font-bold">
                            {t('products.fields.productCode')}
                          </span>
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
                        label={
                          <span className="font-bold">
                            {t('products.fields.productName')}
                          </span>
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
                        name="short_name"
                        isView={isView || isAppend}
                        label={
                          <span className="font-bold">
                            {t('products.fields.productNameAbbr')}
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
                          <span className="font-bold">
                            {t('products.fields.barcode')}
                          </span>
                        }
                        layout="horizontal"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={24} sm={22} md={20} lg={16} xl={10} xxl={6}>
                      <div className="flex">
                        <div className="w-[214px] text-left font-bold">
                          {t('products.fields.category')}
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
                            name={'category'}
                            readOnly={true}
                            placeholder="選択してください"
                            isView={isView || isAppend}
                            icon={
                              <CaretDownOutlined
                                style={{
                                  color: '#00000040',
                                  fontSize: '12px',
                                }}
                              />
                            }
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: 'helo anhe em',
                            //   },
                            // ]}
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
                            {t('products.fields.unit')}
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
                          <span className="font-bold">
                            {t('products.fields.costPrice')}
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
                  </Row>
                  <Row>
                    <Col xs={24} sm={22} md={20} lg={16} xl={10} xxl={6}>
                      <CoreInput
                        name="sellingPrice"
                        isView={isView || isAppend}
                        label={
                          <span className="font-bold">
                            {t('products.fields.sellingPrice')}
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
                                      : {
                                          ...item,
                                          packageCode: `${getFieldValue('code')}-${index + 1}`,
                                          standardPrice:
                                            getFieldValue('sellingPrice') *
                                            getFieldValue([
                                              'info',
                                              index,
                                              'quantity',
                                            ]),
                                          quantity: getFieldValue([
                                            'info',
                                            index,
                                            'quantity',
                                          ]),
                                          salesPrice:
                                            getFieldValue('sellingPrice') *
                                            getFieldValue([
                                              'info',
                                              index,
                                              'quantity',
                                            ]),
                                        }
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
                        label={
                          <span className="font-bold">
                            {t('products.fields.remarks')}
                          </span>
                        }
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
              label: (
                <span className="font-bold">
                  {t('products.sections.packagingPrice')}
                </span>
              ),
              children: (
                <div className="px-2">
                  <Form.List name={'info'}>
                    {(fields, { add, remove }) => {
                      addRef.current = add

                      const columns = [
                        {
                          title: t('products.fields.packagingCode'),
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
                          title: t('products.fields.packagingName'),
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
                          title: t('products.fields.status'),
                          dataIndex: 'status',
                          render: (_, __, index) =>
                            index === 0 ? (
                              <div>{t('products.text.active')}</div>
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
                                      label: t('products.text.active'),
                                    },
                                    {
                                      value: 'inactive',
                                      label: t('products.text.inactive'),
                                    },
                                  ]}
                                />
                              </Form.Item>
                            ),
                        },
                        {
                          title: t('products.fields.quantity'),
                          dataIndex: 'quantity',
                          render: (_, __, index) => (
                            <CoreInput
                              name={[index, 'quantity']}
                              readOnly={
                                index === 0 ||
                                getFieldValue(['info', index, 'status']) ===
                                  'inactive'
                              }
                              type="number"
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
                              onChangeValue={(value) => {
                                setFieldValue(
                                  ['info', index, 'standardPrice'],
                                  (value as number) *
                                    getFieldValue('sellingPrice'),
                                )
                                setFieldValue(
                                  ['info', index, 'salesPrice'],
                                  (value as number) *
                                    getFieldValue('sellingPrice'),
                                )
                              }}
                            />
                          ),
                        },
                        {
                          title: t('products.fields.unit'),
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
                          title: t('products.fields.standardPrice'),
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
                          title: t('products.fields.sellingPrice'),
                          dataIndex: 'salesPrice',
                          render: (_, __, index) => {
                            return (
                              <CoreInput
                                name={[index, 'salesPrice']}
                                readOnly={
                                  index === 0 ||
                                  getFieldValue(['info', index, 'status']) ===
                                    t('products.text.inactive')
                                }
                                type="number"
                                style={{
                                  ...(index === 0 ||
                                  getFieldValue(['info', index, 'status']) ===
                                    t('products.text.inactive')
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
                          title: t('products.fields.isStandard'),
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
                          title: t('products.fields.actions'),
                          dataIndex: 'action',
                          render: (_, __, index) =>
                            index > 0 && (
                              <Action
                                actionList={['delete']}
                                onRemoveAction={() => {
                                  remove(index)
                                }}
                              />
                            ),
                        },
                      ] as ColumnsType

                      return (
                        <>
                          <Form.Item shouldUpdate>
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
                          </Form.Item>
                          <div className="mt-4 text-right">
                            <Button
                              type="primary"
                              disabled={fields.length < 1}
                              onClick={() => {
                                add({
                                  packageCode: `${getFieldValue('code')}-${fields.length}`,
                                  packageName: '',
                                  status: 'active',
                                  quantity: 1,
                                  unit: getFieldValue('unit'),
                                  standardPrice: getFieldValue(`sellingPrice`),
                                  salesPrice: getFieldValue(`sellingPrice`),
                                  standardPrint: true,
                                })
                              }}
                            >
                              {t('products.buttons.addRow')}
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
              label: (
                <span className="font-bold">
                  {t('products.unitPriceGroup.tableTitle')}
                </span>
              ),
              children: (
                <div className="px-2">
                  <Form.List name={'info'}>
                    {(fields) => {
                      const columns = [
                        {
                          title: t('products.fields.productCode'),
                          dataIndex: 'packageCode',
                          key: 'packageCode',
                          render: (_, __, index) => {
                            return (
                              <Form.Item
                                shouldUpdate
                                style={{
                                  marginBottom: 0,
                                }}
                              >
                                {() =>
                                  getFieldValue(['info', index, 'packageCode'])
                                }
                              </Form.Item>
                            )
                          },
                        },
                        {
                          title: t('products.fields.productName'),
                          dataIndex: 'packageName',
                          key: 'packageName',
                          render: (_, __, index) => {
                            return (
                              <Form.Item
                                shouldUpdate
                                style={{
                                  marginBottom: 0,
                                }}
                              >
                                {() =>
                                  getFieldValue(['info', index, 'packageName'])
                                }
                              </Form.Item>
                            )
                          },
                        },
                        {
                          title: t('products.unitPriceGroup.sellingPrice'),
                          dataIndex: 'salesPrice',
                          key: 'salesPrice',
                          render: (_, __, index) => {
                            return (
                              <Form.Item
                                shouldUpdate
                                style={{
                                  marginBottom: 0,
                                }}
                              >
                                {() =>
                                  getFieldValue(['info', index, 'salesPrice'])
                                }
                              </Form.Item>
                            )
                          },
                        },
                        {
                          title: t('products.unitPriceGroup.settingMethod'),
                          dataIndex: 'status',
                          key: 'status',
                          render: (_, __, index) =>
                            index === 0 ? (
                              <div>{t('products.text.active')}</div>
                            ) : (
                              <Form.Item name={[index, 'status']}>
                                <Radio.Group
                                  options={[
                                    {
                                      value: 'active',
                                      label: t('products.text.active'),
                                    },
                                    {
                                      value: 'inactive',
                                      label: t('products.text.inactive'),
                                    },
                                  ]}
                                />
                              </Form.Item>
                            ),
                        },
                        {
                          title: t('products.unitPriceGroup.rankS'),
                          dataIndex: 'sPrice',
                          key: 'sPrice',
                          render: (_, __, index) => {
                            return (
                              <Form.Item
                                shouldUpdate
                                style={{
                                  marginBottom: 0,
                                }}
                              >
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
                          title: t('products.unitPriceGroup.rankA'),
                          dataIndex: 'aPrice',
                          key: 'aPrice',

                          render: (_, __, index) => {
                            return (
                              <Form.Item
                                shouldUpdate
                                style={{
                                  marginBottom: 0,
                                }}
                              >
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
                          title: t('products.unitPriceGroup.rankB'),
                          dataIndex: 'bPrice',
                          key: 'bPrice',

                          render: (_, __, index) => {
                            return (
                              <Form.Item
                                shouldUpdate
                                style={{
                                  marginBottom: 0,
                                }}
                              >
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
                          title: t('products.unitPriceGroup.rankC'),
                          dataIndex: 'cPrice',
                          key: 'cPrice',

                          render: (_, __, index) => {
                            return (
                              <Form.Item
                                shouldUpdate
                                style={{
                                  marginBottom: 0,
                                }}
                              >
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
                          title: t('products.unitPriceGroup.rankD'),
                          dataIndex: 'dPrice',
                          key: 'dPrice',

                          render: (_, __, index) => {
                            return (
                              <Form.Item
                                shouldUpdate
                                style={{
                                  marginBottom: 0,
                                }}
                              >
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
                          title: t('products.unitPriceGroup.rankE'),
                          dataIndex: 'ePrice',
                          key: 'ePrice',

                          render: (_, __, index) => {
                            return (
                              <Form.Item
                                shouldUpdate
                                style={{
                                  marginBottom: 0,
                                }}
                              >
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
                        <Form.Item shouldUpdate>
                          {({ getFieldValue }) => {
                            return (
                              <CommonTable
                                columns={columns}
                                dataSource={fields}
                                bordered
                                pagination={false}
                                rowClassName={(_, index) => {
                                  return getFieldValue(
                                    `info.${index}.status`,
                                  ) === t('products.text.inactive')
                                    ? 'bg-[#BBBBBB] hover:!bg-[#ccc]'
                                    : ''
                                }}
                              />
                            )
                          }}
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

        <Divider />

        <div className="flex flex-col justify-between">
          {isView && (
            <div className="space-y-2">
              <div className="flex gap-4">
                <span className="font-bold">作成者:</span>
                <div>
                  <span>伊藤太郎</span>
                  <span>2025/08/05 14:33</span>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="font-bold">更新者:</span>
                <div>
                  <span>伊藤太郎</span>
                  <span>2025/08/05 14:33</span>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between">
            <div>
              {isView && (
                <Button
                  color="danger"
                  variant="filled"
                  size="small"
                  onClick={() => {}}
                >
                  {t('buttons.delete')}
                </Button>
              )}
            </div>
            <div className="flex gap-4">
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
        </div>
      </Form>
    </PageContainer>
  )
}

export default ProductDetailContainer

/* eslint-disable */
'use client'

import { DownOutlined } from '@ant-design/icons'
import type { useCustomerCreate } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/create/use-customer-create'
import type { useCustomerEdit } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/edit/[id]/use-customers-edit'
import { ParameterResourceEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { countryOptions, typesCompanyOptions } from '@utility/options'
import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'

import styles from '../styles.module.css'
import React from 'react'
import { SelectPagination } from '@components/common/select-pagination'
import { CustomerStatusStyle } from './utils/customer-status-style'

const { Title, Text } = Typography
const { Panel } = Collapse

function BasicInformation(
  props: ReturnType<typeof useCustomerCreate | typeof useCustomerEdit>,
) {
  const {
    t,
    rule,
    handleAutoNumber,
    isCodeGenLoading,
    modalFormProps,
    codeGenData,
    form,
    modalFormCorporate,
    isAutomatic,
  } = props

  const isCompany = Form.useWatch('customer_type', form) === 'company'
  const isJapan = Form.useWatch('country', form) === '日本'
  const isNameAfter =
    Form.useWatch('company_name_display_format', form) === 'after'
  const name = Form.useWatch('name', form)
  const companyType = Form.useWatch('company_type', form)
  const isOtherSelected = companyType === 'other'

  const tempCompanyType = Form.useWatch('temp_company_type', form)
  const nameDisplay = isOtherSelected ? tempCompanyType : companyType
  const parameterSettings = useUserStore((state) => state.parameterSettings)
  const parts = isNameAfter ? [name, nameDisplay] : [nameDisplay, name]
  const allowRankResource = parameterSettings?.get?.(
    ParameterResourceEnum.RANKS,
  )

  React.useEffect(() => {
    const companyType = form.getFieldValue('company_type')

    if (companyType) {
      const isKnownType = typesCompanyOptions.some(
        (opt) => opt.value === companyType,
      )

      if (!isKnownType && companyType !== 'other') {
        form.setFieldsValue({
          company_type: 'other',
          temp_company_type: companyType,
        })
      }
    }
  }, [companyType, typesCompanyOptions])

  return (
    <Collapse
      expandIconPosition="end"
      defaultActiveKey={['1']}
      className={`mb-4 ${styles.formPanel}`}
      expandIcon={({ isActive }) => (
        <DownOutlined
          style={{ transition: '0.3s' }}
          rotate={isActive ? 180 : 0}
        />
      )}
    >
      <Panel header={boldText(t('customers.show.basic_info'))} key="1">
        <Form.Item
          label={boldText(t('customers.fields.code'))}
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
          required
        >
          <Row align="middle" gutter={8}>
            <Col>
              <Form.Item rules={[rule]} name="customer_code" required noStyle>
                <Input style={{ width: 240 }} />
              </Form.Item>
            </Col>
            <Col flex="none">
              <Text
                type="secondary"
                style={{ whiteSpace: 'nowrap', color: '#000' }}
              >
                (A-Z, 0-9, -)
              </Text>
            </Col>
            <Col>
              <Button
                onClick={handleAutoNumber}
                loading={isCodeGenLoading}
                disabled={!isAutomatic}
              >
                {t('departments.create.auto_number')}
              </Button>
            </Col>
            <Col>
              <Button
                type="link"
                onClick={() => modalFormProps.show(codeGenData?.data?.id)}
              >
                {t('departments.create.popup_number_setting')}
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label={boldText(t('customers.fields.status'))}
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
          required
        >
          <Row align="middle" gutter={8}>
            <Col flex="none">
              <Form.Item
                rules={[rule]}
                name="status"
                required
                noStyle
                initialValue="new"
              >
                <Select
                  style={{ width: '100%' }}
                  options={[
                    'new',
                    'prospecting',
                    'contracted',
                    'lost',
                    'suspended',
                  ].map((key) => {
                    const style = CustomerStatusStyle(key, t)
                    return {
                      value: key,
                      label: (
                        <Tag
                          color={style.background}
                          style={{
                            color: style.color,
                            textAlign: 'center',
                            fontSize: '14px',
                          }}
                        >
                          {style.text}
                        </Tag>
                      ),
                    }
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.fields.company_classification'))}
          required
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
        >
          <Row align={'middle'} gutter={8} style={{ width: '100%' }}>
            <Col>
              <Form.Item
                name="customer_type"
                rules={[rule]}
                initialValue="company"
                required
              >
                <Radio.Group
                  onChange={(e) => {
                    if (e.target.value === 'company') {
                      form.setFieldValue('company_name_display_format', 'after')
                    }
                  }}
                >
                  <Radio value="company">
                    {t('customers.enums.corporation')}
                  </Radio>
                  <Radio value="individual">
                    {t('customers.enums.individual')}
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {isCompany && (
              <>
                <Col>
                  <Form.Item
                    name="company_type"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (
                            form.getFieldValue('customer_type') === 'company' &&
                            !value
                          ) {
                            return Promise.reject(
                              new Error(
                                t('validation.customer.customer_type.required'),
                              ),
                            )
                          }
                          return Promise.resolve()
                        },
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      placeholder={t('placeholders.select')}
                      options={typesCompanyOptions}
                      style={{
                        minWidth: 160,
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    name="company_name_display_format"
                    rules={[rule]}
                    initialValue="after"
                    required
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    <Radio.Group>
                      <Radio value="before">前</Radio>
                      <Radio value="after">後</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>

                <Col style={{ display: isOtherSelected ? 'block' : 'none' }}>
                  <Form.Item
                    name="temp_company_type"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (
                            isOtherSelected &&
                            (!value || value.trim() === '')
                          ) {
                            return Promise.reject(
                              new Error(
                                t(
                                  'validation.customer.temp_company_type.required',
                                ),
                              ),
                            )
                          }
                          return Promise.resolve()
                        },
                      },
                    ]}
                  >
                    <Input
                      placeholder={t(
                        'customers.fields.manual_input_placeholder',
                      )}
                      onChange={(e) => {
                        if (!e.target.value) {
                          form.setFieldsValue({
                            company_type: null,
                          })
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
        </Form.Item>

        <Form.Item
          style={{ marginTop: -10 }}
          label={boldText(t('customers.fields.name'))}
          required
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
        >
          <Row>
            <Col style={{ width: 575 }}>
              <Form.Item name="name" rules={[rule]} required>
                <Input style={{ maxWidth: 560 }} />
              </Form.Item>
            </Col>

            {isCompany && name && companyType && (
              <Col>
                <Space direction={'horizontal'}>
                  <Form.Item>
                    <Typography.Text strong>
                      {t('customers.create.example')} :
                    </Typography.Text>
                  </Form.Item>
                  <Form.Item>
                    {form.getFieldValue('company_name_display_format') ===
                      'after'}
                    <Typography.Text>{parts.join('')}</Typography.Text>
                  </Form.Item>
                </Space>
              </Col>
            )}
          </Row>
        </Form.Item>

        <Form.Item
          style={{ marginTop: -8 }}
          label={boldText(t('customers.fields.name_kana'))}
          name="customer_name_by_kana"
          rules={[rule]}
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.fields.country'))}
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
        >
          <Row align="top" gutter={8} wrap={false} style={{ width: '100%' }}>
            <Col flex="none">
              <Form.Item name="country" rules={[rule]} initialValue="日本">
                <Select
                  allowClear
                  style={{ minWidth: 200 }}
                  placeholder={t('placeholders.select')}
                  options={countryOptions}
                  showSearch
                  filterOption={true}
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>

            {isJapan && (
              <>
                <Col flex="none" style={{ minWidth: 0 }}>
                  <Form.Item
                    label={boldText(t('customers.fields.corporate_number'))}
                    name="corporate_number"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (value != null && value !== '') {
                            if (!/^\d*$/.test(value)) {
                              return Promise.reject(
                                t(
                                  'validation.customer.corporate_number.numeric_only',
                                ),
                              )
                            }
                            if (value.length > 50) {
                              return Promise.reject(
                                t('validation.customer.corporate_number.max', {
                                  max: 50,
                                }),
                              )
                            }
                          }
                          return Promise.resolve()
                        },
                      },
                    ]}
                  >
                    <Input style={{ maxWidth: 300 }} />
                  </Form.Item>
                </Col>
                <Col flex="none">
                  <Form.Item>
                    <Button
                      type={'primary'}
                      onClick={() => modalFormCorporate.show()}
                    >
                      {t('customers.modal.title')}
                    </Button>
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
        </Form.Item>
        <Form.Item
          label={boldText(t('customers.fields.unit_price_rank_code'))}
          required
          hidden={!allowRankResource}
          style={{ marginTop: -10 }}
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
        >
          <Row align="middle" gutter={12}>
            <Col flex="none" style={{ width: 570 }}>
              <SelectPagination
                selectProps={{
                  resource: 'ranks',
                  queryOptions: { enabled: allowRankResource },
                  filters: [
                    { field: 'null_option', operator: 'eq', value: true },
                  ],
                }}
                formItemProps={{
                  name: 'price_rank_id',
                  noStyle: true,
                  required: true,
                }}
                allowClear={false}
                optionLabel={'code'}
                optionValue={'id'}
                selectComponentProps={{
                  placeholder: t('placeholders.select'),
                  style: { width: '100%' },
                  defaultValue: null,
                }}
              />
            </Col>
            <Col>
              <Tag
                color="#BCC2BC"
                style={{
                  color: '#000000',
                  textAlign: 'center',
                  margin: 0, // Bỏ margin thừa vì đã có gutter của Row
                  padding: '4px 8px',
                  fontSize: '14px',
                }}
              >
                去年取引実績:{' '}
                {Number(
                  form.getFieldValue('total_revenue') ?? 0,
                ).toLocaleString()}
                円
                {/* 去年取引実績: {Number(312434324340).toLocaleString()}円 */}
              </Tag>
            </Col>
          </Row>
        </Form.Item>
      </Panel>
    </Collapse>
  )
}

export default BasicInformation

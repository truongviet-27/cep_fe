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
  Typography,
} from 'antd'

import styles from '../styles.module.css'
import React from 'react'
import { SelectPagination } from '@components/common/select-pagination'

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

  if (companyType && isOtherSelected && companyType !== 'other') {
    form.setFieldValue('temp_company_type', companyType)
    form.setFieldValue('company_type', 'other')
  }

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
        <Form.Item label={boldText(t('customers.fields.code'))} required>
          <Row align="middle" gutter={8}>
            <Col>
              <Form.Item rules={[rule]} name="customer_code" required noStyle>
                <Input style={{ width: 240 }} />
              </Form.Item>
            </Col>
            <Col flex="none">
              <Text type="secondary">(A-Z, 0-9, -)</Text>
            </Col>
            <Col>
              <Button
                onClick={handleAutoNumber}
                loading={isCodeGenLoading}
                color="primary"
                variant="outlined"
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
          label={boldText(t('customers.fields.company_classification'))}
          required
        >
          <Row align={'middle'} gutter={8} style={{ width: '100%' }}>
            <Col>
              <Form.Item
                name="customer_type"
                rules={[rule]}
                initialValue="company"
                required
              >
                <Radio.Group>
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
        >
          <Row gutter={8} style={{ width: '100%' }}>
            <Col>
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
                    <Typography.Text>{parts.join(' ')}</Typography.Text>
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
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>

        <Form.Item label={boldText(t('customers.fields.country'))}>
          <Row align={'middle'} gutter={8} style={{ width: '100%' }}>
            <Col>
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
                <Col>
                  <Form.Item>
                    <Typography.Text>
                      {t('customers.fields.corporate_number')}
                    </Typography.Text>
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item name="corporate_number" rules={[rule]}>
                    <Input style={{ maxWidth: 300 }} />
                  </Form.Item>
                </Col>
                <Col>
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

        <SelectPagination
          selectProps={{
            resource: 'ranks',
            queryOptions: {
              enabled: allowRankResource,
            },
            filters: [
              {
                field: 'null_option',
                operator: 'eq',
                value: true,
              },
            ],
          }}
          formItemProps={{
            label: boldText(t('customers.fields.unit_price_rank_code')),
            name: 'price_rank_id',
            rules: [rule],
            style: { marginTop: -8 },
            hidden: !allowRankResource,
            required: true,
          }}
          optionLabel={'code'}
          optionValue={'id'}
          selectComponentProps={{
            placeholder: t('placeholders.select'),
            style: { maxWidth: 560, minWidth: '150px' },
          }}
        />
      </Panel>
    </Collapse>
  )
}

export default BasicInformation

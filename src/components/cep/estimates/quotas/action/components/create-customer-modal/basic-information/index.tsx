/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line simple-import-sort/imports */

import { DownOutlined } from '@ant-design/icons'
import { CustomerStatusStyle } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/utils/customer-status-style'
import styles from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/styles.module.css'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import { SelectPagination } from '@components/common/select-pagination'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { typesCompanyOptions } from '@utility/options'
import requiredLabel from '@utility/required-label'
import { validateCustomerRule } from '@validate/customer'
import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'
import React from 'react'

import { useBasicInformation } from './use-basic-information'

export default function BasicInformation() {
  const t = useTranslate()
  const rule = validateCustomerRule(t)
  const { Panel } = Collapse
  const { Text } = Typography

  const {
    form,
    handleAutoNumber,
    isCodeGenLoading,
    isAutomatic,
    modalFormProps,
    modalOpen,
    closeModal,
    codeGenData,
    isCompany,
    isOtherSelected,
    companyType,
    parts,
    allowRankResource,
    name,
  } = useBasicInformation()

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
          label={boldText(requiredLabel(t('customers.fields.code')))}
          required
        >
          <Row align="middle" gutter={[8, 8]}>
            <Col>
              <Form.Item rules={[rule]} name="customer_code" required noStyle>
                <Input
                  style={{ width: 200 }}
                  size="middle"
                  disabled={isAutomatic}
                />
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
            <Col xs={24} sm="auto" flex="none">
              <Space direction="horizontal" size={3} wrap>
                <Button
                  size="middle"
                  onClick={handleAutoNumber}
                  loading={isCodeGenLoading}
                  disabled={!isAutomatic}
                  {...(isAutomatic
                    ? {
                        color: 'primary' as const,
                        variant: 'outlined' as const,
                      }
                    : {})}
                >
                  {t('departments.create.auto_number')}
                </Button>
                <Button
                  type="link"
                  onClick={() => modalFormProps.show(codeGenData?.data?.id)}
                  style={{
                    marginLeft: -16,
                    color: PRIMARY,
                  }}
                >
                  {t('departments.create.popup_number_setting')}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label={boldText(requiredLabel(t('customers.fields.status')))}
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
          label={boldText(
            requiredLabel(t('customers.fields.company_classification')),
          )}
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

                <Col
                  style={{
                    display: isOtherSelected ? 'block' : 'none',
                  }}
                >
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
          label={boldText(requiredLabel(t('customers.fields.name')))}
          required
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
          label={boldText(
            requiredLabel(t('customers.fields.unit_price_rank_code')),
          )}
          required
          style={{ marginTop: -10 }}
        >
          <Row align="middle" gutter={12}>
            <Col flex="none" style={{ width: 570 }}>
              <SelectPagination
                disabled={!allowRankResource}
                selectProps={{
                  resource: 'ranks',
                  queryOptions: { enabled: allowRankResource },
                  filters: [
                    {
                      field: 'null_option',
                      operator: 'eq',
                      value: true,
                    },
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
          </Row>
        </Form.Item>
        <Modal open={modalOpen} onCancel={closeModal} footer={null}>
          <CodeIssueSettingEdit modalProps={modalFormProps} />
        </Modal>
      </Panel>
    </Collapse>
  )
}

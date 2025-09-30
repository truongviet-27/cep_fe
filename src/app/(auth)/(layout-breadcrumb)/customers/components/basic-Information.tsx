/* eslint-disable */
'use client'

import { DownOutlined } from '@ant-design/icons'
import type { useCustomerCreate } from '@app/(auth)/(layout-breadcrumb)/customers/create/use-customer-create'
import type { useCustomerEdit } from '@app/(auth)/(layout-breadcrumb)/customers/edit/[id]/use-customers-edit'
import { useSelect } from '@refinedev/antd'
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

const { Title } = Typography
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
  } = props

  const isIndividual = Form.useWatch('customer_type', form) === 'individual'
  const isJapan = Form.useWatch('country', form) === 'Japan'
  const isNameAfter =
    Form.useWatch('company_name_display_format', form) === 'after'
  const name = Form.useWatch('name', form)
  const companyType = Form.useWatch('company_type', form)
  const parameterSettings = useUserStore((state) => state.parameterSettings)
  const parts = isNameAfter ? [companyType, name] : [name, companyType]
  const allowRankResource = parameterSettings.get(ParameterResourceEnum.RANKS)

  const isOtherSelected = companyType === null

  const { selectProps: ranksSelectProps } = useSelect({
    resource: 'ranks',
    optionLabel: 'name',
    optionValue: 'id',
    queryOptions: {
      enabled: allowRankResource,
    },
  })

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
      <Panel
        header={<Title level={5}>{t('customers.show.basic_info')}</Title>}
        key="1"
      >
        <Form.Item label={boldText(t('customers.fields.code'))} required>
          <Row align="middle" gutter={8}>
            <Col>
              <Form.Item rules={[rule]} name="customer_code" required noStyle>
                <Input style={{ width: 240 }} />
              </Form.Item>
            </Col>
            <Col>
              <Button onClick={handleAutoNumber} loading={isCodeGenLoading}>
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

            {isIndividual && (
              <>
                <Col>
                  <Form.Item
                    name="company_type"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (
                            form.getFieldValue('customer_type') ===
                              'individual' &&
                            !value
                          ) {
                            return Promise.reject(
                              new Error(t('validation.required')),
                            )
                          }
                          return Promise.resolve()
                        },
                      },
                    ]}
                  >
                    {isOtherSelected ? (
                      <Input />
                    ) : (
                      <Select
                        placeholder={t('placeholders.select')}
                        options={typesCompanyOptions}
                      />
                    )}
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    name="company_name_display_format"
                    rules={[rule]}
                    initialValue="after"
                    required
                  >
                    <Radio.Group>
                      <Radio value="after">前</Radio>
                      <Radio value="before">後</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
        </Form.Item>

        <Form.Item
          style={{ marginTop: -26 }}
          label={boldText(t('customers.fields.name'))}
          required
        >
          <Row gutter={8} style={{ width: '100%' }}>
            <Col>
              <Form.Item name="name" rules={[rule]} required>
                <Input style={{ maxWidth: 560 }} />
              </Form.Item>
            </Col>

            {isIndividual && name && companyType && (
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
          style={{ marginTop: -26 }}
          label={boldText(t('customers.fields.name_kana'))}
          name="customer_name_by_kana"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>

        <Form.Item label={boldText(t('customers.fields.country'))}>
          <Row align={'middle'} gutter={8} style={{ width: '100%' }}>
            <Col>
              <Form.Item name="country" rules={[rule]}>
                <Select
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
                    <Input style={{ maxWidth: 560 }} />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
        </Form.Item>

        <Form.Item
          label={boldText(t('ranks.fields.code'))}
          name="price_rank_id"
          rules={[rule]}
          required
          style={{ marginTop: -26 }}
          hidden={!allowRankResource}
        >
          <Select
            {...ranksSelectProps}
            placeholder={t('placeholders.select')}
            style={{ maxWidth: 560 }}
          />
        </Form.Item>
      </Panel>
    </Collapse>
  )
}

export default BasicInformation

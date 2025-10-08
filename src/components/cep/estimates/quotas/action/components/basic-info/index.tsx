/* eslint-disable @typescript-eslint/no-explicit-any */
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import { IssueMethod } from '@components/cep/estimates/quotas/enum'
import { getExpiryDate } from '@components/cep/estimates/quotas/utils'
import { useModalForm, useSelect } from '@refinedev/antd'
import { useApiUrl, useCustom, useParsed, useTranslate } from '@refinedev/core'
import { type CodeIssueSetting } from '@sdk/hey-api'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { FORMAT_DATE } from '@utility/instances'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
} from 'antd'
import dayjs from 'dayjs'

const BasicInfo = () => {
  const t = useTranslate()

  const { params } = useParsed()

  const { actionType } = params as any
  const isCloneVersion = actionType === 'VERSION'

  const form = Form.useFormInstance()

  const apiUrl = useApiUrl()

  const { selectProps: selectPropsCt } = useSelect({
    resource: 'customers',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: {
      mode: 'server',
      pageSize: 100,
    },

    onSearch(value) {
      return [
        {
          field: 'q',
          operator: 'eq',
          value,
        },
      ]
    },
  })

  const {
    data: codeIssueSetting,
    isLoading: loadingQuota,
    refetch: refetchIssueSetting,
  } = useCustom<CodeIssueSetting>({
    url: `${apiUrl}/code-issue-settings/by-code/quotas`,
    method: 'get',
  })

  const modalFormProps = useModalForm({
    action: 'edit',
    resource: 'code-issue-settings',
    autoResetFormWhenClose: true,
    warnWhenUnsavedChanges: false,
    defaultFormValues: {
      hash_dash: true,
    },
    redirect: false,
    onMutationSuccess: () => {
      modalFormProps.close()
      refetchIssueSetting()
    },
  })

  const handleAutoNumber = () => {
    const code = codeIssueSetting?.data?.preview_code
    if (code) {
      form.setFieldsValue({ code })
    }
  }

  const { show, close, open } = modalFormProps

  return (
    <Card
      title={boldText('基本情報', PRIMARY, 18)}
      style={{
        border: 'none',
      }}
      styles={{
        body: { padding: 0 },
        header: { padding: 0, minHeight: 0 },
      }}
    >
      {/* <Form.Item
        label={boldText('見積番号')}
        required
        style={{ marginTop: 20 }}
      >
        <Row>
          <Col>
            <Form.Item name={'tax_rounding_method'} hidden />
          </Col>
        </Row>
        <Row align="middle" gutter={[8, 0]}>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: t('approve_routes.validation.route_code.required'),
                },
                {
                  whitespace: true,
                  message: t(
                    'approve_routes.validation.route_code.invalid_whitespace',
                  ),
                },
                {
                  pattern: /^[A-Z0-9-]+$/,
                  message: t(
                    'approve_routes.validation.route_code.invalid_format',
                  ),
                },
                {
                  max: 255,
                  message: t(
                    'approve_routes.validation.route_code.invalid_format',
                  ),
                },
              ]}
              name={'code'}
              required
            >
              <Input disabled={isCloneVersion} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button
                onClick={handleAutoNumber}
                loading={loadingQuota}
                color="primary"
                variant="outlined"
                disabled={
                  isCloneVersion ||
                  codeIssueSetting?.data.issue_method === IssueMethod.Manual
                }
              >
                {t('departments.create.auto_number')}
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button
                color="primary"
                variant="link"
                size="small"
                onClick={() => {
                  show(codeIssueSetting?.data.id)
                }}
                disabled={isCloneVersion}
              >
                {t('departments.create.popup_number_setting')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item required label={boldText('見積区分')}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item name={'type'}>
              <Radio.Group
                defaultValue={'normal'}
                options={[
                  {
                    value: 'normal',
                    label: '通常',
                  },
                  {
                    value: 'channel_limited',
                    label: '販路限定',
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item required label={boldText('タイトル')}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item
              name={'title'}
              rules={[
                {
                  required: true,
                  message: t('approve_routes.validation.route_code.required'),
                },
                {
                  whitespace: true,
                  message: t(
                    'approve_routes.validation.route_code.invalid_whitespace',
                  ),
                },
                {
                  max: 255,
                  message: t(
                    'approve_routes.validation.route_code.invalid_format',
                  ),
                },
              ]}
            >
              <Input disabled={isCloneVersion} />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('取引先')}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item name={'customer'}>
              <Select
                {...selectPropsCt}
                allowClear
                showSearch
                disabled={isCloneVersion}
                labelInValue
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('見積日')}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item name={'created_at'}>
              <DatePicker style={{ width: '100%' }} placeholder={FORMAT_DATE} />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('納入期日')}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item name={'delivery_date'}>
              <DatePicker
                style={{ width: '100%' }}
                placeholder={FORMAT_DATE}
                minDate={Form.useWatch('created_at', form)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('納品方法')}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item name={'delivery_method'}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('支払期日')}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item name={'payment_due_date'}>
              <Select
                allowClear
                options={[
                  {
                    value: 'monthly_25',
                    label: t(
                      'tenant_settings.paymentDueDate.options.monthly_25th',
                    ),
                  },
                  {
                    value: 'monthly_10',
                    label: t(
                      'tenant_settings.paymentDueDate.options.monthly_10th',
                    ),
                  },
                  {
                    value: 'net_30_from_delivery',
                    label: t(
                      'tenant_settings.paymentDueDate.options.30_days_after_delivery',
                    ),
                  },
                  {
                    value: 'net_30_from_invoice',
                    label: t(
                      'tenant_settings.paymentDueDate.options.30_days_after_invoice',
                    ),
                  },
                  {
                    value: 'end_of_month_next',
                    label: t(
                      'tenant_settings.paymentDueDate.options.eom_next_eom',
                    ),
                  },
                  {
                    value: 'end_of_month_after_next',
                    label: t(
                      'tenant_settings.paymentDueDate.options.eom_next_next_eom',
                    ),
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('有効期限')}>
        <Row gutter={[8, 0]}>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item name={'expiration_date'}>
              <Select
                allowClear
                options={[
                  {
                    value: 'days_7',
                    label: t('tenant_settings.validityPeriod.options.days_7'),
                  },
                  {
                    value: 'days_14',
                    label: t('tenant_settings.validityPeriod.options.days_14'),
                  },
                  {
                    value: 'days_30',
                    label: t('tenant_settings.validityPeriod.options.days_30'),
                  },
                  {
                    value: 'days_45',
                    label: t('tenant_settings.validityPeriod.options.days_45'),
                  },
                  {
                    value: 'days_60',
                    label: t('tenant_settings.validityPeriod.options.days_60'),
                  },
                  {
                    value: 'months_3',
                    label: t('tenant_settings.validityPeriod.options.months_3'),
                  },
                  {
                    value: 'months_6',
                    label: t('tenant_settings.validityPeriod.options.months_6'),
                  },
                  {
                    value: 'years_1',
                    label: t('tenant_settings.validityPeriod.options.year_1'),
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xl={8}>
            <Form.Item>
              {dayjs(
                getExpiryDate(
                  Form.useWatch('expiration_date', form),
                  Form.useWatch('created_at', form),
                ),
              ).format('YYYY/MM/DD')}
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('消費税')}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={4}>
            <Form.Item name="consumption_tax">
              <Radio.Group
                defaultValue={'exclusive'}
                options={[
                  {
                    value: 'exclusive',
                    label: t('tenant_settings.consumptionTax.taxExclusive'),
                  },
                  {
                    value: 'inclusive',
                    label: t('tenant_settings.consumptionTax.taxInclusive'),
                  },
                  {
                    value: 'external',
                    label: t('tenant_settings.consumptionTax.taxExempt'),
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label={t('tenant_settings.consumptionTax.taxRateLabel')}
              name="tax_rate"
            >
              <InputNumber
                controls={false}
                min={0}
                max={100}
                addonAfter="%"
                style={{ minWidth: '75%' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item> */}

      <div className="mt-4">
        <Row>
          <Col>
            <Form.Item name={'tax_rounding_method'} hidden />
          </Col>
        </Row>

        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={12} lg={10} xl={12}>
            <div className="flex flex-col flex-wrap gap-4 xl:flex-row">
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: t('approve_routes.validation.route_code.required'),
                  },
                  {
                    whitespace: true,
                    message: t(
                      'approve_routes.validation.route_code.invalid_whitespace',
                    ),
                  },
                  {
                    pattern: /^[A-Z0-9-]+$/,
                    message: t(
                      'approve_routes.validation.route_code.invalid_format',
                    ),
                  },
                  {
                    max: 255,
                    message: t(
                      'approve_routes.validation.route_code.invalid_format',
                    ),
                  },
                ]}
                name={'code'}
                required
                label={boldText('見積番号')}
                style={{
                  marginBottom: 0,
                  flex: 1,
                }}
              >
                <Input disabled={isCloneVersion} />
              </Form.Item>
              <Form.Item>
                <Button
                  onClick={handleAutoNumber}
                  loading={loadingQuota}
                  color="primary"
                  variant="outlined"
                  disabled={
                    isCloneVersion ||
                    codeIssueSetting?.data.issue_method === IssueMethod.Manual
                  }
                >
                  {t('departments.create.auto_number')}
                </Button>
                <Button
                  color="primary"
                  variant="link"
                  size="small"
                  onClick={() => {
                    show(codeIssueSetting?.data.id)
                  }}
                  disabled={isCloneVersion}
                >
                  {t('departments.create.popup_number_setting')}
                </Button>
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item name={'type'} label={boldText('見積区分')}>
              <Radio.Group
                defaultValue={'normal'}
                options={[
                  {
                    value: 'normal',
                    label: '通常',
                  },
                  {
                    value: 'channel_limited',
                    label: '販路限定',
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              required
              label={boldText('タイトル')}
              name={'title'}
              rules={[
                {
                  required: true,
                  message: t('approve_routes.validation.route_code.required'),
                },
                {
                  whitespace: true,
                  message: t(
                    'approve_routes.validation.route_code.invalid_whitespace',
                  ),
                },
                {
                  max: 255,
                  message: t(
                    'approve_routes.validation.route_code.invalid_format',
                  ),
                },
              ]}
            >
              <Input disabled={isCloneVersion} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              label={boldText('取引先')}
              name={'customer'}
              rules={[
                {
                  required: true,
                  message: t('approve_routes.validation.route_code.required'),
                },
              ]}
            >
              <Select
                {...selectPropsCt}
                allowClear
                showSearch
                disabled={isCloneVersion}
                labelInValue
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[100, 0]} wrap>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item name={'created_at'} label={boldText('見積日')}>
              <DatePicker style={{ width: '100%' }} placeholder={FORMAT_DATE} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'delivery_date'}
              label={boldText('納入期日')}
              rules={[
                {
                  required: true,
                  message: t('approve_routes.validation.route_code.required'),
                },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder={FORMAT_DATE}
                minDate={Form.useWatch('created_at', form)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item name={'delivery_method'} label={boldText('納品方法')}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item name={'payment_due_date'} label={boldText('支払期日')}>
              <Select
                allowClear
                options={[
                  {
                    value: 'monthly_25',
                    label: t(
                      'tenant_settings.paymentDueDate.options.monthly_25th',
                    ),
                  },
                  {
                    value: 'monthly_10',
                    label: t(
                      'tenant_settings.paymentDueDate.options.monthly_10th',
                    ),
                  },
                  {
                    value: 'net_30_from_delivery',
                    label: t(
                      'tenant_settings.paymentDueDate.options.30_days_after_delivery',
                    ),
                  },
                  {
                    value: 'net_30_from_invoice',
                    label: t(
                      'tenant_settings.paymentDueDate.options.30_days_after_invoice',
                    ),
                  },
                  {
                    value: 'end_of_month_next',
                    label: t(
                      'tenant_settings.paymentDueDate.options.eom_next_eom',
                    ),
                  },
                  {
                    value: 'end_of_month_after_next',
                    label: t(
                      'tenant_settings.paymentDueDate.options.eom_next_next_eom',
                    ),
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Form.Item
                name={'expiration_date'}
                label={boldText('有効期限')}
                style={{ marginBottom: 0, flex: 1 }}
              >
                <Select
                  allowClear
                  options={[
                    {
                      value: 'days_7',
                      label: t('tenant_settings.validityPeriod.options.days_7'),
                    },
                    {
                      value: 'days_14',
                      label: t(
                        'tenant_settings.validityPeriod.options.days_14',
                      ),
                    },
                    {
                      value: 'days_30',
                      label: t(
                        'tenant_settings.validityPeriod.options.days_30',
                      ),
                    },
                    {
                      value: 'days_45',
                      label: t(
                        'tenant_settings.validityPeriod.options.days_45',
                      ),
                    },
                    {
                      value: 'days_60',
                      label: t(
                        'tenant_settings.validityPeriod.options.days_60',
                      ),
                    },
                    {
                      value: 'months_3',
                      label: t(
                        'tenant_settings.validityPeriod.options.months_3',
                      ),
                    },
                    {
                      value: 'months_6',
                      label: t(
                        'tenant_settings.validityPeriod.options.months_6',
                      ),
                    },
                    {
                      value: 'years_1',
                      label: t('tenant_settings.validityPeriod.options.year_1'),
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <span style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                  {dayjs(
                    getExpiryDate(
                      Form.useWatch('expiration_date', form),
                      Form.useWatch('created_at', form),
                    ),
                  ).format('YYYY/MM/DD')}
                </span>
              </Form.Item>
            </div>
          </Col>

          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <div className="flex flex-wrap gap-4">
              <Form.Item
                name="consumption_tax"
                label={boldText('消費税')}
                style={{ marginBottom: 0, flex: 1 }}
              >
                <Radio.Group
                  defaultValue={'exclusive'}
                  options={[
                    {
                      value: 'exclusive',
                      label: t('tenant_settings.consumptionTax.taxExclusive'),
                    },
                    {
                      value: 'inclusive',
                      label: t('tenant_settings.consumptionTax.taxInclusive'),
                    },
                    {
                      value: 'external',
                      label: t('tenant_settings.consumptionTax.taxExempt'),
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label={boldText(
                  t('tenant_settings.consumptionTax.taxRateLabel'),
                )}
                name="tax_rate"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  controls={false}
                  min={0}
                  max={100}
                  addonAfter="%"
                  style={{ width: 100 }}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>
      </div>

      <Modal open={open} onCancel={close} footer={null}>
        <CodeIssueSettingEdit modalProps={modalFormProps} />
      </Modal>
    </Card>
  )
}

export default BasicInfo

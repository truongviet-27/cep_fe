import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import { useModalForm, useSelect } from '@refinedev/antd'
import { useApiUrl, useCustom, useTranslate } from '@refinedev/core'
import { type CodeIssueSetting } from '@sdk/hey-api'
import boldText from '@utility/bold-text'
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

const BasicInfo = () => {
  const t = useTranslate()

  const form = Form.useFormInstance()

  const apiUrl = useApiUrl()

  const { selectProps: selectPropsCt } = useSelect({
    resource: 'customers',
    optionLabel: 'name',
    optionValue: 'id',
  })

  const { data: codeIssueSetting, isLoading: loadingQuota } =
    useCustom<CodeIssueSetting>({
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
      title={'基本情報'}
      style={{
        border: 'none',
      }}
      headStyle={{
        padding: 0,
        minHeight: 0,
      }}
      bodyStyle={{
        padding: 0,
      }}
    >
      <Form.Item
        label={boldText('見積番号')}
        required
        style={{ marginTop: 20 }}
      >
        <Row align="middle" gutter={20}>
          <Col>
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
              <Input style={{ width: 240 }} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button
                onClick={handleAutoNumber}
                loading={loadingQuota}
                color="primary"
                variant="outlined"
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
                defaultValue={'exclusive'}
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
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('取引先')}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item name={'customer'}>
              <Select allowClear showSearch {...selectPropsCt} labelInValue />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('見積日')}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item name={'created_at'}>
              <DatePicker style={{ width: '75%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('納入期日')}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item name={'delivery_date'}>
              <DatePicker style={{ width: '75%' }} />
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
        <Row>
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
        </Row>
      </Form.Item>

      <Form.Item label={boldText('消費税')}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
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
        </Row>
      </Form.Item>

      <Form.Item
        label={boldText(t('tenant_settings.consumptionTax.taxRateLabel'))}
      >
        <Row>
          <Col xs={24} sm={16} md={10} lg={8}>
            <Form.Item name="tax_rate" layout="horizontal">
              <InputNumber controls={false} min={0} max={100} addonAfter="%" />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Modal open={open} onCancel={close} footer={null}>
        <CodeIssueSettingEdit modalProps={modalFormProps} />
      </Modal>
    </Card>
  )
}

export default BasicInfo

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
import { useCallback, useEffect, useState } from 'react'

const BasicInfo = () => {
  const t = useTranslate()

  const { params } = useParsed()

  const { actionType } = params as any
  const isCloneVersion = actionType === 'VERSION'

  const form = Form.useFormInstance()

  const apiUrl = useApiUrl()

  const [current, setCurrent] = useState(1)
  const [options, setOptions] = useState<any[]>([])

  const expirationDate = Form.useWatch('expiration_date', form)
  const createdAt = Form.useWatch('created_at', form)

  const { selectProps: selectPropsCt, query } = useSelect({
    resource: 'customers',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: {
      mode: 'server',
      pageSize: 20,
      current,
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

  useEffect(() => {
    if (query.data?.data) {
      setOptions((prev) => [...prev, ...query.data.data])
    }
  }, [query.data?.data])

  const handlePopupScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      if (
        scrollTop + clientHeight >= scrollHeight - 10 &&
        !query.isFetching &&
        (query.data?.total ?? 0) > options.length
      ) {
        setCurrent((prev) => prev + 1)
      }
    },
    [query, options],
  )

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
      title={boldText(t('quotas.action.basic_info.title'), PRIMARY, 16)}
      style={{
        border: 'none',
      }}
      styles={{
        body: { padding: 0 },
        header: { padding: 0, minHeight: 0 },
      }}
    >
      {/* <Form.Item
        label={boldText(t('quotas.action.basic_info.fields.estimate_number'))}
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
                  message: t('validation.required'),
                },
                {
                  whitespace: true,
                  message: t(
                    t('validation.invalid_format'),
                  ),
                },
                {
                  pattern: /^[A-Z0-9-]+$/,
                  message: t(
                    t('validation.invalid_format'),
                  ),
                },
                {
                  max: 255,
                  message: t(
                    t('validation.invalid_format'),
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

      <Form.Item required label={boldText(t('quotas.action.fields.type'))}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item name={'type'}>
              <Radio.Group
                defaultValue={'normal'}
                options={[
                  {
                    value: 'normal',
                    label: t('quotas.action.type.normal'),
                  },
                  {
                    value: 'channel_limited',
                    label: t('quotas.action.type.limited'),
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item required label={boldText(t('quotas.action.fields.title'))}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item
              name={'title'}
              rules={[
                {
                  required: true,
                  message: t('validation.required'),
                },
                {
                  whitespace: true,
                  message: t(
                    t('validation.invalid_format'),
                  ),
                },
                {
                  max: 255,
                  message: t(
                    t('validation.invalid_format'),
                  ),
                },
              ]}
            >
              <Input disabled={isCloneVersion} />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText(t('quotas.action.fields.customer'))}>
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

      <Form.Item label={boldText(t('quotas.action.fields.created_at'))}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item name={'created_at'}>
              <DatePicker style={{ width: '100%' }} placeholder={FORMAT_DATE} />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText(t('quotas.action.fields.delivery_date'))}>
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

      <Form.Item label={boldText(t('quotas.action.fields.delivery_method'))}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item name={'delivery_method'}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText(t('quotas.action.fields.payment_due_date'))}>
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

      <Form.Item label={boldText(t('quotas.action.basic_info.fields.expiration_date'))}>
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

      <Form.Item label={boldText(t('quotas.action.basic_info.fields.consumption_tax'))}>
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
                    message: t('validations.required'),
                  },
                  {
                    whitespace: true,
                    message: t('validations.invalid_format'),
                  },
                  {
                    pattern: /^[A-Z0-9-]+$/,
                    message: t('validations.invalid_format'),
                  },
                  {
                    max: 255,
                    message: t('validations.max255'),
                  },
                ]}
                name={'code'}
                required
                label={boldText(
                  t('quotas.action.basic_info.fields.estimate_number'),
                )}
                style={{
                  marginBottom: 0,
                  flex: 1,
                }}
              >
                <Input disabled={isCloneVersion} />
              </Form.Item>
              <Form.Item>
                （A-Z, 0-9, -）
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
                  style={{
                    textDecoration: 'underline',
                  }}
                >
                  {t('departments.create.popup_number_setting')}
                </Button>
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              required
              name={'type'}
              label={boldText(
                t('quotas.action.basic_info.fields.estimate_type'),
              )}
            >
              <Radio.Group
                defaultValue={'normal'}
                options={[
                  {
                    value: 'normal',
                    label: t('quotas.action.basic_info.types.normal'),
                  },
                  {
                    value: 'channel_limited',
                    label: t('quotas.action.basic_info.types.limited'),
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
              label={boldText(t('quotas.action.basic_info.fields.title'))}
              name={'title'}
              rules={[
                {
                  required: true,
                  message: t('validations.required'),
                },
                {
                  whitespace: true,
                  message: t('validations.invalid_format'),
                },
                {
                  max: 255,
                  message: t('validations.invalid_format'),
                },
              ]}
            >
              <Input disabled={isCloneVersion} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              label={boldText(t('quotas.action.basic_info.fields.customer'))}
              name={'customer'}
              rules={[
                {
                  required: true,
                  message: t('validations.required'),
                },
              ]}
            >
              <Select
                {...selectPropsCt}
                options={options.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                allowClear
                showSearch
                disabled={isCloneVersion}
                labelInValue
                onSearch={() => {}}
                loading={query.isFetching}
                onPopupScroll={handlePopupScroll}
                filterOption={(input, option) =>
                  ((option?.label ?? '') as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                // notFoundContent={
                //   query.isFetching ? <Spin size="small" /> : null
                // }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[100, 0]} wrap>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'created_at'}
              label={boldText(
                t('quotas.action.basic_info.fields.estimate_date'),
              )}
              required
              rules={[
                {
                  required: true,
                  message: t('validations.required'),
                },
              ]}
            >
              <DatePicker style={{ width: '100%' }} placeholder={FORMAT_DATE} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'delivery_date'}
              label={boldText(
                t('quotas.action.basic_info.fields.delivery_date'),
              )}
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
            <Form.Item
              name={'delivery_method'}
              label={boldText(
                t('quotas.action.basic_info.fields.delivery_method'),
              )}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'payment_due_date'}
              label={boldText(
                t('quotas.action.basic_info.fields.payment_due_date'),
              )}
            >
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
                label={boldText(
                  t('quotas.action.basic_info.fields.expiration_date'),
                )}
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
                {expirationDate && (
                  <span style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                    {dayjs(getExpiryDate(expirationDate, createdAt)).format(
                      'YYYY/MM/DD',
                    )}
                    {t('quotas.action.basic_info.labels.until')}
                  </span>
                )}
              </Form.Item>
            </div>
          </Col>

          <Col xs={24} sm={16} md={14} lg={14} xl={11} xxl={10}>
            <div className="flex flex-wrap gap-4">
              <Form.Item
                name="consumption_tax"
                label={boldText(
                  t('quotas.action.basic_info.fields.consumption_tax'),
                )}
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
                style={{
                  marginBottom: 0,
                }}
              >
                <InputNumber
                  controls={false}
                  min={0}
                  defaultValue={0}
                  max={100}
                  addonAfter="%"
                  style={{ width: 100 }}
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <span className="ml-1 text-[#FA8C16]">
                  {t('quotas.action.basic_info.labels.default_tax_rate')}
                  {Form.useWatch('tax_rate') ?? 0}%
                </span>
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

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line simple-import-sort/imports */
import { useCallback, useEffect, useState } from 'react'

import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
} from 'antd'
import dayjs from 'dayjs'

import { useModalForm, useSelect } from '@refinedev/antd'
import { useApiUrl, useCustom, useParsed, useTranslate } from '@refinedev/core'

import type { CodeIssueSetting, CustomerContact } from '@sdk/hey-api'

import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import { IssueMethod } from '@components/cep/estimates/quotas/enum'
import { getExpiryDate } from '@components/cep/estimates/quotas/utils'
import CustomerContactSelectionModal from '@components/cep/estimates/quotas/action/components/customer-contact-modal'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { FORMAT_DATE } from '@utility/instances'

const BasicInfo = () => {
  const t = useTranslate()

  const { params } = useParsed()

  const { actionType } = params as any
  const isCloneVersion = actionType === 'VERSION'

  const form = Form.useFormInstance()

  const apiUrl = useApiUrl()

  const [current, setCurrent] = useState(1)
  const [options, setOptions] = useState<any[]>([])
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] =
    useState<CustomerContact | null>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  )

  const expirationDate = Form.useWatch('expiration_date', form)
  const createdAt = Form.useWatch('created_at', form)
  const customer = Form.useWatch('customer', form)
  const selectedContactId = Form.useWatch('customer_contact_id', form)

  const { data: customerContactData } = useCustom<CustomerContact>({
    url: selectedContactId
      ? `${apiUrl}/customer-contacts/${selectedContactId}`
      : '',
    method: 'get',
    queryOptions: {
      enabled: !!selectedContactId,
    },
  })

  useEffect(() => {
    if (customerContactData?.data) {
      setSelectedContact(customerContactData.data)
    }
  }, [customerContactData?.data])

  useEffect(() => {
    if (selectedContactId) {
      // selectedContactId updated
    } else {
      setSelectedContact(null)
    }
  }, [selectedContactId])

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
      // Only include items that are not deleted
      const filtered = query.data.data.filter(
        (it: any) => it.deleted_at == null,
      )
      setOptions((prev) => [...prev, ...filtered])
    }
  }, [query.data?.data])

  useEffect(() => {
    if (customer?.value) {
      setSelectedCustomerId(customer.value)
    } else {
      setSelectedCustomerId(null)
    }
  }, [customer?.value, customer?.label])

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

  const handleOpenContactModal = () => {
    if (!selectedCustomerId) {
      return
    }
    setContactModalOpen(true)
  }

  const handleSelectContact = (contact: CustomerContact) => {
    setSelectedContact(contact)
    // Save the selected contact ID to the form
    const contactId = contact.id
    if (contactId !== null && contactId !== undefined) {
      form.setFieldsValue({ customer_contact_id: contactId })
      // Validate the field after setting value
      form.validateFields(['customer_contact_id'])
    } else {
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
      <div className="mt-4">
        <Row>
          <Col>
            <Form.Item name={'tax_rounding_method'} hidden />
          </Col>
        </Row>

        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              label={boldText(
                t('quotas.action.basic_info.fields.estimate_number'),
              )}
            >
              <div className="flex flex-col flex-wrap gap-4 xl:flex-row">
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: t('quotas.validation.basic_info.required.code'),
                    },
                    {
                      whitespace: true,
                      message: t('quotas.validation.basic_info.invalid_format'),
                    },
                    {
                      pattern: /^[A-Z0-9-]+$/,
                      message: t('quotas.validation.basic_info.invalid_format'),
                    },
                    {
                      max: 255,
                      message: t('validations.max255'),
                    },
                  ]}
                  name={'code'}
                  required
                  style={{
                    marginBottom: 0,
                    flex: 1,
                    minWidth: '150px',
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
            </Form.Item>
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
              rules={[
                {
                  required: true,
                  message: t('validations.required'),
                },
              ]}
            >
              <Radio.Group
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

        <Row>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              required
              name={'category'}
              label={boldText(
                t('quotas.action.basic_info.fields.estimate_category'),
              )}
              rules={[
                {
                  required: true,
                  message: t('validations.required'),
                },
              ]}
            >
              <Radio.Group
                options={[
                  {
                    value: 'merchandise',
                    label: t('quotas.action.basic_info.categories.merchandise'),
                  },
                  {
                    value: 'service',
                    label: t('quotas.action.basic_info.categories.service'),
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
                  message: t('quotas.validation.basic_info.required.title'),
                },
                {
                  whitespace: true,
                  message: t('quotas.validation.basic_info.invalid_format'),
                },
                {
                  max: 255,
                  message: t('quotas.validation.basic_info.max255'),
                },
              ]}
            >
              <Input disabled={isCloneVersion} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              label={boldText(t('quotas.action.basic_info.fields.customer'))}
            >
              <Row gutter={[8, 0]} align="top" wrap={false}>
                <Col style={{ width: '100%' }}>
                  <Form.Item
                    name={'customer'}
                    rules={[
                      {
                        required: true,
                        message: t(
                          'quotas.validation.basic_info.required.customer',
                        ),
                      },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      key={`customer-select-${selectedCustomerId}`}
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
                      onChange={(value) => {
                        setSelectedCustomerId(value?.value || null)
                        form.setFieldsValue({ customer: value })
                        // Clear selected contact when customer changes
                        setSelectedContact(null)
                        form.setFieldsValue({ customer_contact_id: null })
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleOpenContactModal}
                    disabled={!selectedCustomerId}
                    style={{ marginBottom: 12 }}
                  >
                    {t('quotas.action.customer_contact_modal.select_button')}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10} />
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            {/* Display selected contact information with validation */}
            <Form.Item
              label={boldText(
                t(
                  'quotas.action.customer_contact_modal.selected_contact_label',
                ),
              )}
              name="customer_contact_id"
              rules={[
                {
                  required: true,
                  message: t('validation.quotas.selected_contact.required'),
                },
              ]}
              required
            >
              <Row gutter={[8, 0]} align="middle">
                <Col
                  flex="auto"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <strong>
                    {t('quotas.action.customer_contact_modal.department_name')}:
                  </strong>{' '}
                  {selectedContact?.department_name || ''}
                </Col>
                <Col
                  flex="auto"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <strong>
                    {t(
                      'quotas.action.customer_contact_modal.contact_person_name',
                    )}
                    :
                  </strong>{' '}
                  {selectedContact?.contact_person_name || ''}
                </Col>
                <Col
                  flex="auto"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <strong>
                    {t('quotas.action.customer_contact_modal.email')}:
                  </strong>
                  {selectedContact?.email || ''}
                </Col>
              </Row>
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
                  message: t(
                    'quotas.validation.basic_info.required.estimate_date',
                  ),
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
            <Form.Item
              label={boldText(
                t('quotas.action.basic_info.fields.expiration_date'),
              )}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Form.Item
                  name={'expiration_date'}
                  style={{ marginBottom: 0, flex: 1 }}
                >
                  <Select
                    allowClear
                    options={[
                      {
                        value: 'days_7',
                        label: t(
                          'tenant_settings.validityPeriod.options.days_7',
                        ),
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
                        label: t(
                          'tenant_settings.validityPeriod.options.year_1',
                        ),
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
            </Form.Item>
          </Col>

          <Col xs={24} sm={16} md={14} lg={14} xl={11} xxl={10}>
            <div className="flex flex-wrap gap-4">
              <Form.Item
                name="consumption_tax"
                label={boldText(
                  t('quotas.action.basic_info.fields.consumption_tax'),
                )}
                style={{ marginBottom: 0, flex: 1 }}
                rules={[
                  {
                    required: true,
                    message: t('validations.required'),
                  },
                ]}
              >
                <Radio.Group
                  options={[
                    {
                      value: 'exclusive',
                      label: t('tenant_settings.consumptionTax.taxExclusive'),
                    },
                    // {
                    //   value: 'inclusive',
                    //   label: t('tenant_settings.consumptionTax.taxInclusive'),
                    // },
                    {
                      value: 'external',
                      label: t('tenant_settings.consumptionTax.taxExempt'),
                    },
                  ]}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>
      </div>

      <Modal open={open} onCancel={close} footer={null}>
        <CodeIssueSettingEdit modalProps={modalFormProps} />
      </Modal>

      <CustomerContactSelectionModal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        customerId={selectedCustomerId}
        onSelect={handleSelectContact}
      />
    </Card>
  )
}

export default BasicInfo

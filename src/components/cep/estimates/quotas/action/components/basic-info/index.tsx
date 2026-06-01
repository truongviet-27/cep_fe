/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line simple-import-sort/imports */
import { useCallback, useEffect, useState } from 'react'
import './basic-info.css'

import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Radio,
  Row,
  Select,
} from 'antd'
import dayjs from 'dayjs'

import { useModalForm } from '@refinedev/antd'
import { useApiUrl, useCustom, useParsed, useTranslate } from '@refinedev/core'

import type { CodeIssueSetting, CustomerContact } from '@sdk/hey-api'

import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import { CoreAutocompleteAPI } from '@components/common/autocomplete-api'
import { IssueMethod } from '@components/cep/estimates/quotas/enum'
import { getExpiryDate } from '@components/cep/estimates/quotas/utils'
import CustomerContactSelectionModal from '@components/cep/estimates/quotas/action/components/customer-contact-modal'
import { axiosInstance } from '@providers/data-provider/rest-data-provider/utils/axios'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { FORMAT_DATE_CROSS } from '@utility/instances'
import CreateCustomerModal from '../create-customer-modal'
import type { ParameterSettingType } from '@interfaces/permission'

const BasicInfo = ({
  handleChangeProductPrincing,
  parameterSettings,
  isEdit,
  embeddedContactFromQuota,
  quotaCustomerContactId,
}: {
  handleChangeProductPrincing: (
    productIds: number[],
    productIdsOptional: number[],
  ) => void
  parameterSettings: ParameterSettingType
  isEdit?: boolean
  embeddedContactFromQuota?: {
    department_name?: string
    contact_person_name?: string
    email?: string
  }
  quotaCustomerContactId?: number | null
}) => {
  const t = useTranslate()

  const { params } = useParsed()

  const { actionType } = params as any
  const isCloneVersion = actionType === 'VERSION'

  const form = Form.useFormInstance()

  const apiUrl = useApiUrl()

  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] =
    useState<CustomerContact | null>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  )
  const [openModalCreateCustomer, setOpenModalCreateCustomer] =
    useState<boolean>(false)

  const expirationDate = Form.useWatch('expiration_date', form)
  const issueDate = Form.useWatch('issue_date', form)
  const deliveryDate = Form.useWatch('delivery_date', form)
  const customer = Form.useWatch('customer', form)
  const selectedContactId = Form.useWatch('customer_contact_id', form)

  const useEmbeddedContact =
    !!embeddedContactFromQuota &&
    selectedContactId != null &&
    selectedContactId === quotaCustomerContactId

  const { data: customerContactData } = useCustom<CustomerContact>({
    url: selectedContactId
      ? `${apiUrl}/customer-contacts/${selectedContactId}`
      : '',
    method: 'get',
    queryOptions: {
      enabled: !!selectedContactId && !useEmbeddedContact && !isEdit,
    },
  })

  useEffect(() => {
    if (customerContactData?.data) {
      setSelectedContact(customerContactData.data)
    }
  }, [customerContactData?.data])

  useEffect(() => {
    if (selectedContactId) {
      if (useEmbeddedContact && embeddedContactFromQuota) {
        setSelectedContact({
          id: selectedContactId,
          department_name: embeddedContactFromQuota.department_name ?? '',
          contact_person_name:
            embeddedContactFromQuota.contact_person_name ?? '',
          email: embeddedContactFromQuota.email ?? '',
        } as CustomerContact)
      }
    } else {
      setSelectedContact(null)
    }
  }, [
    selectedContactId,
    useEmbeddedContact,
    embeddedContactFromQuota?.department_name,
    embeddedContactFromQuota?.contact_person_name,
    embeddedContactFromQuota?.email,
  ])

  useEffect(() => {
    if (customer?.value) {
      setSelectedCustomerId(customer.value)
    } else {
      setSelectedCustomerId(null)
    }
  }, [customer?.value, customer?.label])

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

  const handleAutoNumber = async () => {
    const { data: latestData } = await refetchIssueSetting()
    const code = latestData?.data?.preview_code
    if (code) {
      form.setFieldsValue({ code })
    }
  }

  useEffect(() => {
    if (
      codeIssueSetting?.data?.issue_method === 'automatic' &&
      !form.getFieldValue('code') &&
      !isCloneVersion &&
      !isEdit
    ) {
      refetchIssueSetting().then(({ data: latestData }) => {
        const code = latestData?.data?.preview_code
        if (code) {
          form.setFieldsValue({ code })
        }
      })
    }
  }, [codeIssueSetting?.data?.issue_method, form, refetchIssueSetting, isEdit])

  const handleOpenContactModal = async () => {
    if (!selectedCustomerId) {
      return
    }
    try {
      const response = await axiosInstance.get(`${apiUrl}/customer-contacts`, {
        params: { customer_id: selectedCustomerId },
      })
      const data = response?.data
      if (data?.message && String(data.message).includes('deleted')) {
        notification.error({
          message: t('notifications.error'),
          description: data.message,
        })
        return
      }
      setContactModalOpen(true)
    } catch (err: any) {
      const description =
        err?.response?.data?.message || err?.message || t('notifications.error')
      notification.error({
        message: t('notifications.error'),
        description,
      })
    }
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

  const getCustomerContacts = useCallback(
    async (customerId: number) => {
      const response = await axiosInstance.get(`${apiUrl}/customer-contacts`, {
        params: { customer_id: customerId },
      })
      const data = response?.data?.data
      if (data?.length > 0) {
        handleSelectContact(data[0])
      }
    },
    [handleSelectContact],
  )

  const { show, close, open } = modalFormProps

  return (
    <Card
      className="quotas-basic-info-card"
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

        {/* Row 1: Estimate Number + Customer */}
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              required
              label={boldText(
                t('quotas.action.basic_info.fields.estimate_number'),
              )}
              labelCol={{ span: 3 }}
              className="[&>.ant-row]:!flex-nowrap"
            >
              <div className="flex flex-row flex-wrap items-center gap-4">
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
                    minWidth: '160px',
                  }}
                >
                  <Input disabled={isCloneVersion} />
                </Form.Item>
                <Form.Item style={{ whiteSpace: 'nowrap' }}>
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
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              label={boldText(t('quotas.action.basic_info.fields.customer'))}
              labelCol={{ span: 3 }}
              required
            >
              <Row gutter={[8, 0]} align="top" wrap={false}>
                <Col style={{ width: '100%' }}>
                  <CoreAutocompleteAPI
                    name={'customer'}
                    resource="customers"
                    rules={[
                      {
                        required: true,
                        message: t(
                          'quotas.validation.basic_info.required.customer',
                        ),
                      },
                    ]}
                    disabled={isCloneVersion}
                    labelInValue
                    pageSize={20}
                    onChangeValue={(valueOption) => {
                      const rankId = valueOption?.rank?.id ?? null
                      form.setFieldsValue({ rank_id: rankId })
                      setSelectedContact(null)
                      form.setFieldsValue({ customer_contact_id: null })
                      handleChangeProductPrincing(
                        (form.getFieldValue(['main_product']) ?? []).flatMap(
                          (item: any) => item.product_id,
                        ),
                        (
                          form.getFieldValue(['optional_product']) ?? []
                        ).flatMap((item: any) => item.product_id),
                      )
                      if (valueOption?.id) {
                        getCustomerContacts(valueOption.id)
                      }
                    }}
                  />
                </Col>
                <Col>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => setOpenModalCreateCustomer(true)}
                    style={{ marginBottom: 12 }}
                  >
                    {t('quotas.action.create_customer_button')}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>
        {/* Row 2: Customer Term, Estimate Category + Customer Contact */}
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={5} lg={5} xl={5}>
            <Form.Item
              required
              name={'type'}
              className="hidden"
              label={boldText(
                t('quotas.action.basic_info.fields.estimate_type'),
              )}
              labelCol={{ span: 3 }}
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
            <Form.Item
              required
              name={'customer_term'}
              label={boldText(
                t('quotas.action.basic_info.fields.customer_term'),
              )}
              labelCol={{ span: 3 }}
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
                    value: 'short_term',
                    label: t(
                      'quotas.action.basic_info.customer_term.short_term',
                    ),
                  },
                  {
                    value: 'long_term',
                    label: t(
                      'quotas.action.basic_info.customer_term.long_term',
                    ),
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={16}
            md={5}
            lg={5}
            xl={5}
            style={{ paddingLeft: '0px' }}
          >
            <Form.Item
              required
              name={'category'}
              label={boldText(
                t('quotas.action.basic_info.fields.estimate_category'),
              )}
              labelCol={{ span: 3 }}
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
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            {/* Display selected contact information with validation */}
            <Form.Item
              label={boldText(
                t(
                  'quotas.action.customer_contact_modal.selected_contact_label',
                ),
              )}
              name="customer_contact_id"
              labelCol={{ span: 3 }}
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
                  </strong>{' '}
                  {selectedContact?.email || ''}
                </Col>
              </Row>
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={16}
            md={10}
            lg={10}
            xl={2}
            style={{ paddingLeft: '0px', marginLeft: '-20px' }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                color="primary"
                variant="outlined"
                onClick={handleOpenContactModal}
                disabled={!selectedCustomerId}
                size="small"
                className="text-sm"
              >
                {t('quotas.action.customer_contact_modal.select_button')}
              </Button>
              <Button
                color="danger"
                variant="outlined"
                onClick={() => {
                  setSelectedContact(null)
                  form.setFieldsValue({ customer_contact_id: null })
                }}
                disabled={!selectedContact}
                size="small"
                className="text-sm"
              >
                クリア
              </Button>
            </div>
          </Col>
        </Row>

        {/* Row 3: Title + Delivery Date */}
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              required
              label={boldText(t('quotas.action.basic_info.fields.title'))}
              name={'title'}
              labelCol={{ span: 3 }}
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
              name={'delivery_date'}
              label={boldText(
                t('quotas.action.basic_info.fields.delivery_date'),
              )}
              labelCol={{ span: 3 }}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder={FORMAT_DATE_CROSS}
                format={FORMAT_DATE_CROSS}
                minDate={issueDate ? issueDate.add(1, 'day') : undefined}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 4: Estimate Date + Payment Due Date */}
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'issue_date'}
              label={boldText(
                t('quotas.action.basic_info.fields.estimate_date'),
              )}
              labelCol={{ span: 3 }}
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
              <DatePicker
                style={{ width: '100%' }}
                placeholder={FORMAT_DATE_CROSS}
                format={FORMAT_DATE_CROSS}
                maxDate={
                  deliveryDate ? deliveryDate.subtract(1, 'day') : undefined
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'payment_due_date'}
              label={boldText(
                t('quotas.action.basic_info.fields.payment_due_date'),
              )}
              labelCol={{ span: 3 }}
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

        {/* Row 5: Delivery Method + Department Name */}
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'delivery_method'}
              label={boldText(
                t('quotas.action.basic_info.fields.delivery_method'),
              )}
              labelCol={{ span: 3 }}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item name={'department_id'} className="hidden">
              <Input style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name={'department_name'}
              label={boldText(
                t('quotas.action.basic_info.fields.department_name'),
              )}
              labelCol={{ span: 3 }}
            >
              <Input
                readOnly
                tabIndex={-1}
                className="quota-basic-info-department-readonly"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 6: Expiration Date + Approve Route */}
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              label={boldText(
                t('quotas.action.basic_info.fields.expiration_date'),
              )}
              labelCol={{ span: 3 }}
            >
              <div style={{ alignItems: 'center', gap: 12 }}>
                <Form.Item
                  className="no-margin-bottom-important"
                  name={'expiration_date'}
                  style={{ flex: 1 }}
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
                <Form.Item>
                  {expirationDate && (
                    <span style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                      {dayjs(getExpiryDate(expirationDate, issueDate)).format(
                        'YYYY/MM/DD',
                      )}
                      {t('quotas.action.basic_info.labels.until')}
                    </span>
                  )}
                </Form.Item>
              </div>
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            {(() => {
              const approveRoutes = parameterSettings.get('approve-routes')
                ? form.getFieldValue('approve_routes')
                : []
              const isSingleRoute = approveRoutes?.length === 1

              if (isSingleRoute) {
                const singleRoute = approveRoutes[0]

                return (
                  <>
                    <Form.Item
                      name={'approve_route_id'}
                      className="hidden"
                      initialValue={
                        parameterSettings.get('approve-routes')
                          ? singleRoute?.id
                          : ''
                      }
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={'approve_route_name'}
                      label={boldText(
                        t('quotas.action.basic_info.fields.approve_route'),
                      )}
                      labelCol={{ span: 3 }}
                      initialValue={
                        parameterSettings.get('approve-routes')
                          ? singleRoute?.name
                          : ''
                      }
                    >
                      <Input disabled readOnly style={{ width: '100%' }} />
                    </Form.Item>
                  </>
                )
              }

              return (
                <Form.Item
                  name={'approve_route_id'}
                  label={boldText(
                    t('quotas.action.basic_info.fields.approve_route'),
                  )}
                  labelCol={{ span: 3 }}
                >
                  <Select
                    disabled={!parameterSettings.get('approve-routes')}
                    style={{ width: '100%' }}
                    options={
                      approveRoutes?.map((route: any) => ({
                        value: route.id,
                        label: route.name,
                      })) || []
                    }
                  />
                </Form.Item>
              )
            })()}
            {(() => {
              const approveRoutes = form.getFieldValue('approve_routes')
              if (
                (!approveRoutes || approveRoutes.length === 0) &&
                parameterSettings.get('approve-routes')
              ) {
                return (
                  <div
                    style={{
                      color: '#ff4d4f',
                      fontSize: '12px',
                      marginTop: '4px',
                    }}
                  >
                    ⚠️{' '}
                    {t('quotas.action.basic_info.warnings.no_approve_routes') ||
                      'No approve routes available'}
                  </div>
                )
              }
              return null
            })()}
            {/* hidden form */}
            <Form.Item
              name="consumption_tax"
              className="hidden"
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
                  {
                    value: 'external',
                    label: t('tenant_settings.consumptionTax.taxExempt'),
                  },
                ]}
              />
            </Form.Item>
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

      {openModalCreateCustomer && (
        <CreateCustomerModal
          open={openModalCreateCustomer}
          onClose={() => setOpenModalCreateCustomer(false)}
        />
      )}
    </Card>
  )
}

export default BasicInfo

/* eslint-disable */
import { useForm, useModalForm } from '@refinedev/antd'
import { useApiUrl, useCustom, useModal, useTranslate } from '@refinedev/core'
import type { CodeIssueSetting } from '@sdk/hey-api/types.gen'
import { validateCustomerRule } from '@validate/customer'
import { useState } from 'react'
import { axiosInstance } from '@providers/data-provider/rest-data-provider/utils/axios'
import { message } from 'antd'

export const useCustomerCreate = () => {
  const t = useTranslate()
  const apiUrl = useApiUrl()
  const [deletedReceiverIds, setDeletedReceiverIds] = useState<number[]>([])

  const {
    formProps,
    saveButtonProps,
    form,
    formLoading: isLoading,
    onFinish,
  } = useForm({
    action: 'create',
    redirect: false,
  })

  const handleFinish = async (values: any) => {
    try {
      // Validate form fields first
      await form.validateFields()

      // Extract receivers and validate
      const receivers = values?.receivers || []

      // Validate that at least 1 receiver exists
      if (receivers.length < 1) {
        message.error(t('customers.receivers.min_one_required'))
        return
      }

      // Validate each receiver
      for (let i = 0; i < receivers.length; i++) {
        const receiver = receivers[i]

        // Check contact_person_name
        if (
          !receiver.contact_person_name ||
          !receiver.contact_person_name.trim()
        ) {
          message.error(
            `${t('customers.receivers.contact_person_name')}: ${t('validation.required')}`,
          )
          return
        }

        // Check email format
        if (!receiver.email || !receiver.email.trim()) {
          message.error(
            `${t('customers.receivers.email')}: ${t('validation.required')}`,
          )
          return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(receiver.email)) {
          message.error(
            `${t('customers.receivers.email')}: ${t('validation.email_format')}`,
          )
          return
        }
      }

      let company_type = values?.company_type
      let industry = values?.industry
      if (values?.company_type == 'other' && values?.temp_company_type) {
        company_type = values?.temp_company_type
      }
      if (!values?.industry && values?.temp_industry) {
        industry = values?.temp_industry
      }

      // Remove receivers and other fields from customer data
      const {
        receivers: _,
        person_in_charge_name,
        person_in_charge_department,
        person_in_charge_mail,
        ...customerData
      } = values

      // Step 1: Create customer
      const customerResponse = await onFinish({
        ...customerData,
        company_type,
        industry,
      })
      const customerId = customerResponse?.data?.id

      if (!customerId) {
        throw new Error('Failed to create customer')
      }

      // Step 2: Create customer contacts
      const contacts = receivers.map((receiver: any) => ({
        customer_id: customerId,
        department_name: receiver.department_name,
        contact_person_name: receiver.contact_person_name,
        email: receiver.email,
      }))

      await axiosInstance.patch(`${apiUrl}/customer-contacts`, { contacts })

      message.success(t('notifications.createSuccess'))
      window.location.href = `/customers/show/${customerId}`
    } catch (error: any) {
      console.error('Error creating customer:', error)
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        t('notifications.createError')
      message.error(errorMessage)
    }
  }

  const {
    data: codeGenData,
    refetch: refetchCodeGen,
    isLoading: isCodeGenLoading,
  } = useCustom<CodeIssueSetting>({
    url: `${apiUrl}/code-issue-settings/by-code/customers`,
    method: 'get',
  })
  const isAutomatic = codeGenData?.data?.issue_method === 'automatic'

  const modalFormProps = useModalForm({
    action: 'edit',
    resource: 'code-issue-settings',
    autoResetFormWhenClose: true,
    redirect: false,
    warnWhenUnsavedChanges: false,
    onMutationSuccess: () => {
      refetchCodeGen()
    },
  })

  const modalFormCorporate = useModal()

  const handleAutoNumber = () => {
    const code = codeGenData?.data?.preview_code
    if (code) {
      form.setFieldsValue({ customer_code: code })
    }
  }

  const rule = validateCustomerRule(t)

  const handleCopyContact = () => {
    const mainContact = form.getFieldsValue(['mail', 'phone'])
    form.setFieldsValue({
      person_in_charge_mail: mainContact.mail,
      person_in_charge_phone: mainContact.phone,
    })
  }

  return {
    t,
    form,
    rule,
    isLoading,
    handleCopyContact,
    handleAutoNumber,
    modalFormProps,
    isCodeGenLoading,
    codeGenData,
    refetchCodeGen,
    formProps,
    saveButtonProps,
    modalFormCorporate,
    handleFinish,
    isAutomatic,
    deletedReceiverIds,
    setDeletedReceiverIds,
  }
}

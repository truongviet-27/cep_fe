/* eslint-disable */
import { useForm, useModalForm } from '@refinedev/antd'
import {
  useApiUrl,
  useCustom,
  useCustomMutation,
  useGo,
  useModal,
  useTranslate,
} from '@refinedev/core'
import type { CodeIssueSetting } from '@sdk/hey-api/types.gen'
import { validateCustomerRule } from '@validate/customer'
import { axiosInstance } from '@providers/data-provider/rest-data-provider/utils/axios'
import { message } from 'antd'
import { useEffect } from 'react'

export const useCustomerCreate = () => {
  const t = useTranslate()
  const apiUrl = useApiUrl()
  const go = useGo()

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
      await form.validateFields()

      const receivers = values?.receivers || []

      let company_type = values?.company_type
      let industry = values?.industry
      if (values?.company_type == 'other' && values?.temp_company_type) {
        company_type = values?.temp_company_type
      }
      if (!values?.industry && values?.temp_industry) {
        industry = values?.temp_industry
      }

      // Prepare contacts data for API
      const contacts = receivers
        .filter(
          (receiver: any) => receiver.contact_person_name || receiver.email,
        ) // Filter out empty contacts
        .map((receiver: any) => ({
          contact_person_name: receiver.contact_person_name,
          email: receiver.email,
          department_name: receiver.department_name,
        }))

      // Remove receivers from customer data
      const { receivers: _, ...customerData } = values

      // Create customer with contacts in single API call
      const customerResponse = await onFinish({
        ...customerData,
        contacts,
        company_type,
        industry,
      })
      go({
        to: `/customers`,
        type: 'push',
      })
    } catch (error: any) {
      console.error('Error creating customer:', error)

      // Parse and set field errors from API response
      const apiErrors = error?.response?.data?.errors
      const fieldErrors: Array<{
        name: (string | number)[]
        errors: string[]
      }> = []

      if (apiErrors && typeof apiErrors === 'object') {
        // Convert API error format (contacts.0.email) to form field path (receivers[0].email)
        Object.keys(apiErrors).forEach((errorKey) => {
          // Match pattern: contacts.0.email, contacts.1.email, etc.
          const match = errorKey.match(/^contacts\.(\d+)\.(.+)$/)
          if (match) {
            const index = parseInt(match[1], 10)
            const fieldName = match[2] // 'email', 'contact_person_name', etc.
            const errorMessages = Array.isArray(apiErrors[errorKey])
              ? apiErrors[errorKey]
              : [String(apiErrors[errorKey])]

            fieldErrors.push({
              name: ['receivers', index, fieldName],
              errors: errorMessages,
            })
          }
        })
      }

      // Set field errors to highlight invalid fields
      if (fieldErrors.length > 0) {
        form.setFields(fieldErrors)
      }

      // Only show error message if there are no field-specific errors
      // If field errors exist, they will be displayed at the field level
      if (fieldErrors.length === 0) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          t('notifications.createError')
        message.error(errorMessage)
      }
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

  const handleAutoNumber = async () => {
    const { data: latestData } = await refetchCodeGen()
    const code = latestData?.data?.preview_code
    if (code) {
      form.setFieldsValue({ customer_code: code })
    }
  }

  useEffect(() => {
    if (isAutomatic && !form.getFieldValue('customer_code')) {
      refetchCodeGen().then(({ data: latestData }) => {
        const code = latestData?.data?.preview_code
        if (code) {
          form.setFieldsValue({ customer_code: code })
        }
      })
    }
  }, [isAutomatic, form, refetchCodeGen])

  const rule = validateCustomerRule(t)

  return {
    t,
    form,
    rule,
    isLoading,
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
  }
}

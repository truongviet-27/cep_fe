/* eslint-disable */
import { defaultCustomerCompanyResearchInformation } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/components/instances'
import { useForm } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'

import { message } from 'antd'

interface UseCreateCustomerModalProps {
  closeModal: () => void
}

export const useCreateCustomerModal = ({
  closeModal,
}: UseCreateCustomerModalProps) => {
  const t = useTranslate()

  const {
    formProps,
    saveButtonProps,
    form,
    formLoading: isLoading,
    onFinish,
  } = useForm({
    resource: 'customers',
    action: 'create',
    redirect: false,
  })

  const initialValues = {
    company_research_information: defaultCustomerCompanyResearchInformation,
    customer_code: null,
    name: null,
    department_in_charge_id: null,
    post_code: null,
    address: null,
    phone: null,
    mail: null,
    receivers: [
      {
        department_name: null,
        contact_person_name: null,
        email: null,
      },
    ],
  }

  const handleFinish = async (values: any) => {
    try {
      await form.validateFields()

      const receivers = values?.receivers || []

      let company_type = values?.company_type
      if (values?.company_type == 'other' && values?.temp_company_type) {
        company_type = values?.temp_company_type
      }

      const contacts = receivers
        .filter(
          (receiver: any) => receiver.contact_person_name || receiver.email,
        )
        .map((receiver: any) => ({
          contact_person_name: receiver.contact_person_name,
          email: receiver.email,
          department_name: receiver.department_name,
        }))

      const { receivers: _, ...customerData } = values

      await onFinish({
        ...customerData,
        contacts,
        company_type,
      })

      closeModal()
    } catch (error: any) {
      console.error('Error creating customer:', error)
      const apiErrors = error?.response?.data?.errors
      const fieldErrors: Array<{
        name: (string | number)[]
        errors: string[]
      }> = []

      if (apiErrors && typeof apiErrors === 'object') {
        Object.keys(apiErrors).forEach((errorKey) => {
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

      if (fieldErrors.length > 0) {
        form.setFields(fieldErrors)
      }

      if (fieldErrors.length === 0) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          t('notifications.createError')
        message.error(errorMessage)
      }
    }
  }

  return {
    t,
    form,
    isLoading,
    formProps,
    saveButtonProps,
    handleFinish,
    initialValues,
  }
}

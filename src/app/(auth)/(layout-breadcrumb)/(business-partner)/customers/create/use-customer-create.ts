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
import { useState } from 'react'
import { axiosInstance } from '@providers/data-provider/rest-data-provider/utils/axios'
import { message } from 'antd'

export const useCustomerCreate = () => {
  const t = useTranslate()
  const apiUrl = useApiUrl()
  const go = useGo()
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

  const { mutateAsync: createContacts } = useCustomMutation()

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

      // Remove receivers from customer data
      const { receivers: _, ...customerData } = values

      // Step 1: Create customer
      const customerResponse = await onFinish({
        ...customerData,
        company_type,
        industry,
      })
      const customerId = customerResponse?.data?.id

      // Step 2: Create customer contacts
      const contacts = receivers.map((receiver: any) => ({
        customer_id: customerId,
        department_name: receiver.department_name,
        contact_person_name: receiver.contact_person_name,
        email: receiver.email,
      }))

      await createContacts({
        url: `${apiUrl}/customer-contacts`,
        method: 'patch',
        values: { contacts },
      })

      message.success(t('notifications.createSuccess'))
      go({
        to: `/customers/show/${customerId}`,
        type: 'push',
      })
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
    deletedReceiverIds,
    setDeletedReceiverIds,
  }
}

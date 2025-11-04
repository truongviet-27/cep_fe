/* eslint-disable */
'use client'

import { useForm, useModalForm } from '@refinedev/antd'
import {
  useApiUrl,
  useCustom,
  useCustomMutation,
  useModal,
  useTranslate,
} from '@refinedev/core'
import type { CodeIssueSetting } from '@sdk/hey-api/types.gen'
import { validateCustomerRule } from '@validate/customer'
import { useEffect, useState } from 'react'
import { axiosInstance } from '@providers/data-provider/rest-data-provider/utils/axios'
import { message } from 'antd'
import { useParams } from 'next/navigation'

export const useCustomerEdit = () => {
  const t = useTranslate()
  const apiUrl = useApiUrl()
  const params = useParams()
  const customerId = params?.id as string
  const [deletedReceiverIds, setDeletedReceiverIds] = useState<number[]>([])

  const {
    formProps,
    saveButtonProps,
    form,
    onFinish,
    formLoading: isLoading,
    queryResult,
  } = useForm({
    action: 'edit',
    redirect: false,
  })

  const { mutateAsync: updateContacts } = useCustomMutation()

  // Fetch customer contacts
  const { data: contactsData, refetch: refetchContacts } = useCustom({
    url: `${apiUrl}/customer-contacts`,
    method: 'get',
    config: {
      query: {
        customer_id: customerId,
      },
    },
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
      if (values?.temp_company_type) {
        company_type = values?.temp_company_type
      }
      if (!values?.industry && values?.temp_industry) {
        industry = values?.temp_industry
      }

      // Remove receivers from customer data
      const { receivers: _, ...customerData } = values

      // Step 1: Update customer
      await onFinish({ ...customerData, company_type, industry })

      // Step 2: Delete contacts if any
      if (deletedReceiverIds.length > 0) {
        await axiosInstance.delete(`${apiUrl}/customer-contacts`, {
          data: { ids: deletedReceiverIds },
        })
      }

      // Step 3: Update/Create customer contacts
      const contacts = receivers.map((receiver: any) => {
        const contact: any = {
          customer_id: Number(customerId),
          department_name: receiver.department_name,
          contact_person_name: receiver.contact_person_name,
          email: receiver.email,
        }
        // Include id if exists (for update)
        if (receiver.id) {
          contact.id = receiver.id
        }
        return contact
      })

      await updateContacts({
        url: `${apiUrl}/customer-contacts`,
        method: 'patch',
        values: { contacts },
      })

      message.success(t('notifications.updateSuccess'))
      window.location.href = `/customers/show/${customerId}`
    } catch (error: any) {
      console.error('Error updating customer:', error)
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        t('notifications.updateError')
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

  const record = queryResult?.data?.data

  useEffect(() => {
    if (record) {
      form.setFieldsValue({ ...record })
    }
  }, [record])

  // Load contacts into form
  useEffect(() => {
    if (contactsData?.data) {
      form.setFieldsValue({ receivers: contactsData.data })
    }
  }, [contactsData])

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

/* eslint-disable */
'use client'

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
import { useEffect } from 'react'
import { message } from 'antd'
import { useParams } from 'next/navigation'

export const useCustomerEdit = () => {
  const t = useTranslate()
  const apiUrl = useApiUrl()
  const go = useGo()
  const params = useParams()
  const customerId = params?.id as string

  const {
    formProps,
    saveButtonProps,
    form,
    onFinish,
    formLoading: isLoading,
    query,
    queryResult,
  } = useForm({
    action: 'edit',
    redirect: false,
  })

  const record = queryResult?.data?.data

  // TODO: Remove this when customer API show endpoint includes contacts in response
  // Fetch customer contacts only after customer data is loaded
  const { data: contactsData } = useCustom({
    url: `${apiUrl}/customer-contacts`,
    method: 'get',
    config: {
      query: {
        customer_id: customerId,
      },
    },
    queryOptions: {
      enabled: !!customerId && !!record && !!query?.data?.data, // Only fetch when customerId exists AND customer data is loaded
    },
  })

  const handleFinish = async (values: any) => {
    try {
      // Validate form fields (all validation rules in Form will be checked)
      // await form.validateFields()

      const receivers = values?.receivers || []

      let company_type =
        values?.company_type === 'other'
          ? values?.temp_company_type
          : values?.company_type
      let industry = values?.industry
      if (!values?.industry && values?.temp_industry) {
        industry = values?.temp_industry
      }

      // Prepare contacts data for API
      const contacts = receivers
        .filter(
          (receiver: any) => receiver.contact_person_name || receiver.email,
        ) // Filter out empty contacts
        .map((receiver: any) => ({
          id: receiver.id, // Include id for updates, omit for new contacts
          contact_person_name: receiver.contact_person_name,
          email: receiver.email,
          department_name: receiver.department_name,
        }))

      // Remove receivers from customer data
      const { receivers: _, ...customerData } = values

      // Update customer with contacts in single API call
      await onFinish({
        ...customerData,
        contacts,
        company_type,
        industry,
      })

      go({
        to: `/customers/show/${customerId}`,
        type: 'push',
      })
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

  // Set customer record into form (excluding receivers as they come from separate API)
  useEffect(() => {
    if (record) {
      const { receivers: _, ...recordWithoutReceivers } = record as any
      form.setFieldsValue(recordWithoutReceivers)
    }
  }, [record, form])
  // Set receivers into form only after customer data is loaded and contacts are fetched
  useEffect(() => {
    if (record && contactsData?.data !== undefined) {
      const receivers = contactsData.data
      if (!receivers || receivers.length === 0) {
        form.setFieldsValue({
          receivers: [
            {
              department_name: null,
              contact_person_name: null,
              email: null,
            },
          ],
        })
      } else {
        form.setFieldsValue({ receivers: contactsData.data })
      }
    }
  }, [record, contactsData, form])

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

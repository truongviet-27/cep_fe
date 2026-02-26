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
import { useEffect, useRef } from 'react'
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

  // Track if receivers have been initialized to prevent overwriting user input
  const receiversInitialized = useRef(false)
  // Store receivers before submit to restore on error
  const receiversBeforeSubmit = useRef<any[] | null>(null)

  // TODO: Remove this when customer API show endpoint includes contacts in response
  // Fetch customer contacts only after customer data is loaded
  const { data: contactsData, refetch: refetchContacts } = useCustom({
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
      // Save receivers before submit to restore on error
      const receivers = values?.receivers || []
      receiversBeforeSubmit.current = receivers

      let company_type =
        values?.company_type === 'other'
          ? values?.temp_company_type
          : values?.company_type
      let industry = values?.industry
      if (values?.industry === -1 && values?.temp_industry) {
        industry = values?.temp_industry
      } else if (values?.industry === -1) {
        industry = null
      } else {
        industry = values?.industry ?? null
      }

      // Prepare contacts data for API
      const contacts = receivers
        .filter(
          (receiver: any) => receiver.contact_person_name || receiver.email,
        )
        .map((receiver: any) => ({
          id: receiver.id,
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

      // Only refetch contacts when save is successful
      try {
        const response = await refetchContacts()
        const freshContacts = response?.data?.data
        if (freshContacts) {
          form.setFieldsValue({ receivers: freshContacts })
        }
      } catch (refetchError) {
        console.error('Failed to refetch contacts:', refetchError)
      }

      // Navigate to list page on success
      go({
        to: `/customers`,
        type: 'push',
      })
    } catch (error: any) {
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

      // Restore receivers to preserve user's input when error occurs
      // Use setTimeout to ensure form values are restored after any potential refetch
      setTimeout(() => {
        if (
          receiversBeforeSubmit.current &&
          receiversBeforeSubmit.current.length > 0
        ) {
          form.setFieldsValue({ receivers: receiversBeforeSubmit.current })
        } else {
          // If no receivers were saved, get current receivers from form
          const currentReceivers = form.getFieldValue('receivers')
          if (currentReceivers && currentReceivers.length > 0) {
            // Keep current receivers if they exist
            form.setFieldsValue({ receivers: currentReceivers })
          }
        }

        // Set field errors to highlight invalid fields
        if (fieldErrors.length > 0) {
          form.setFields(fieldErrors)
        }
      }, 100)

      // Don't refetch contacts on error - preserve user's input so they can fix it
      // Only show error message if there are no field-specific errors
      // If field errors exist, they will be displayed at the field level
      if (fieldErrors.length === 0) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          t('notifications.updateError')
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

  const rule = validateCustomerRule(t)

  // Set customer record into form (excluding receivers as they come from separate API)
  // Always preserve receivers if they have been initialized
  useEffect(() => {
    if (record) {
      const { receivers: _, ...recordWithoutReceivers } = record as any
      // Get current receivers from form to preserve them
      const currentReceivers = form.getFieldValue('receivers')
      // If receivers are already initialized, always preserve them when setting other fields
      if (receiversInitialized.current) {
        // Always preserve receivers, even if they're empty array (user might have cleared them)
        form.setFieldsValue({
          ...recordWithoutReceivers,
          receivers: currentReceivers || receiversBeforeSubmit.current || [],
        })
      } else {
        // If receivers not initialized yet, only set other fields (receivers will be set by next useEffect)
        form.setFieldsValue(recordWithoutReceivers)
      }
    }
  }, [record, form])

  // Reset receiversInitialized when customerId changes (navigate to different customer)
  useEffect(() => {
    receiversInitialized.current = false
    receiversBeforeSubmit.current = null
  }, [customerId])

  // Set receivers into form when contacts data is loaded
  // Only set if not already initialized or if form doesn't have receivers
  useEffect(() => {
    if (contactsData?.data !== undefined) {
      const currentReceivers = form.getFieldValue('receivers')
      const hasReceivers =
        currentReceivers &&
        Array.isArray(currentReceivers) &&
        currentReceivers.length > 0

      // Only set receivers if not initialized yet or form doesn't have receivers
      if (!receiversInitialized.current || !hasReceivers) {
        const receivers = contactsData.data
        const initialReceivers =
          Array.isArray(receivers) && receivers.length > 0
            ? receivers
            : [
                {
                  department_name: null,
                  contact_person_name: null,
                  email: null,
                },
              ]

        form.setFieldsValue({ receivers: initialReceivers })
        // Mark receivers as initialized
        receiversInitialized.current = true
      }
    }
  }, [contactsData, form])

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

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
import { useEffect, useState } from 'react'
import { axiosInstance } from '@providers/data-provider/rest-data-provider/utils/axios'
import { message } from 'antd'
import { useParams } from 'next/navigation'

export const useCustomerEdit = () => {
  const t = useTranslate()
  const apiUrl = useApiUrl()
  const go = useGo()
  const params = useParams()
  const customerId = params?.id as string
  const [deletedReceiverIds, setDeletedReceiverIds] = useState<number[]>([])

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

  const { mutateAsync: updateContacts } = useCustomMutation()

  const record = queryResult?.data?.data

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

      // Filter to get only new contacts (contacts without id)
      const newContacts = receivers.filter((receiver: any) => !receiver.id)
      const newContactEmails = newContacts.map((contact: any) => contact.email)

      // Remove receivers from customer data
      const { receivers: _, ...customerData } = values

      // Step 1: Update customer with new contacts emails for validation
      await onFinish({
        ...customerData,
        new_contacts_emails: newContactEmails, // Send only new contact emails
        company_type,
        industry,
      })

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

      // Handle duplicate contact errors
      const errorData = error?.response?.data

      // Check for new_contacts_emails error (duplicate emails)
      if (errorData?.errors?.new_contacts_emails) {
        const errorFields: any[] = []
        const newContactsEmailsError =
          errorData.errors.new_contacts_emails[0] ||
          errorData.errors.new_contacts_emails

        // Extract duplicate emails from error message like: "(3333@gmail.com, sfsdfssssdf@gmail.com)"
        const emailRegex = /\(([^)]+)\)/
        const match = newContactsEmailsError.match(emailRegex)

        if (match) {
          const duplicateEmailsStr = match[1]
          const duplicateEmails = duplicateEmailsStr
            .split(', ')
            .map((email: string) => email.trim())

          // Find receivers with duplicate emails and highlight them
          values.receivers.forEach((receiver: any, index: number) => {
            if (duplicateEmails.includes(receiver.email)) {
              errorFields.push({
                name: ['receivers', index, 'email'],
                errors: [t('')],
                value: receiver.email,
              })
            }
          })
        }

        if (errorFields.length > 0) {
          try {
            form.setFields(errorFields)
          } catch (e) {
            console.error('Error setting field validation:', e)
          }
        }
      }

      // Remove error message notification - only show field validation errors
      // message.error(errorMessage)
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
  // Set receivers into form only after customer data is loaded
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
    deletedReceiverIds,
    setDeletedReceiverIds,
  }
}

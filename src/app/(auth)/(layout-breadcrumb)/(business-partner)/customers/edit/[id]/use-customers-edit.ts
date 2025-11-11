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
    queryOptions: {
      onSuccess: (data) => {
        const currentReceivers = form.getFieldValue('receivers')

        if (currentReceivers === undefined) {
          const receivers = data?.data

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
            form.setFieldsValue({ receivers: receivers })
          }
        }
      },
    },
  })

  const handleFinish = async (values: any) => {
    try {
      // Validate form fields (all validation rules in Form will be checked)
      // await form.validateFields()

      const receivers = values?.receivers || []

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

  const record = queryResult?.data?.data

  useEffect(() => {
    if (record) {
      form.setFieldsValue({ ...record })
    }
  }, [record])

  // Load contacts into form
  // useEffect(() => {
  //   if (contactsData?.data) {
  //     const receivers = contactsData.data
  //     // If no contacts, set one empty row
  //     if (!receivers || receivers.length === 0) {
  //       form.setFieldsValue({
  //         receivers: [
  //           {
  //             department_name: null,
  //             contact_person_name: null,
  //             email: null,
  //           },
  //         ],
  //       })
  //     } else {
  //       form.setFieldsValue({ receivers: contactsData.data })
  //     }
  //   }
  // }, [contactsData])

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

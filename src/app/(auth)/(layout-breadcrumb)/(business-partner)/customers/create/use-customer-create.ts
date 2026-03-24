/* eslint-disable */
import { useForm, useModalForm } from '@refinedev/antd'
import {
  useApiUrl,
  useCustom,
  useCustomMutation,
  useGo,
  useModal,
  useNotification,
  useTranslate,
} from '@refinedev/core'
import type {
  CodeIssueSetting,
  DraftControllerIndexResponse,
} from '@sdk/hey-api/types.gen'
import { validateCustomerRule } from '@validate/customer'
import { useEffect, useMemo, useRef, useState } from 'react'
import { DEPARTMENT_DEFAULT } from '@utility/constant'
import type { CrudFilter } from '@refinedev/core'
import { useUserStore } from '@stores/useUserStore'

export const useCustomerCreate = () => {
  const t = useTranslate()
  const apiUrl = useApiUrl()
  const go = useGo()
  const { open: openNotification } = useNotification()
  const { permission } = useUserStore.getState()
  const saveDraftLockRef = useRef(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isRedirectingAfterDraftSave, setIsRedirectingAfterDraftSave] =
    useState(false)

  const { mutate: mutateDraft, isPending: isPendingDraft } = useCustomMutation()

  const { data: dataCustomerDraft, isFetching: isFetchingCustomerDraft } =
    useCustom<DraftControllerIndexResponse>({
      method: 'get',
      url: `${apiUrl}/drafts`,
      config: {
        query: {
          type: 'customer',
        },
      },
    })

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

  const queryOptions: CrudFilter[] = useMemo(() => {
    if (permission?.department) {
      return [
        {
          field: 'id',
          operator: 'eq',
          value: permission.department.id,
        },
      ]
    } else {
      return [
        {
          field: 'name',
          operator: 'eq',
          value: DEPARTMENT_DEFAULT,
        },
      ]
    }
  }, [permission])

  const { data: departmentData } = useCustom({
    method: 'get',
    url: `${apiUrl}/departments/find-first`,
    queryOptions: {
      enabled: true,
    },
    config: {
      filters: queryOptions,
      query: { only_enabled_approve_routes: '1' },
    },
  })

  useEffect(() => {
    if (departmentData?.data) {
      form.setFieldsValue({
        department_in_charge_id: departmentData.data.id,
        department_in_charge: {
          name: departmentData.data.name,
          deleted_at: departmentData.data.deleted_at,
        },
      })
    }
  }, [departmentData, form])

  const handleSaveDraft = () => {
    if (saveDraftLockRef.current || isRedirectingAfterDraftSave) return
    saveDraftLockRef.current = true
    setIsSavingDraft(true)

    const values: any = form.getFieldsValue()

    let company_type = values?.company_type
    let industry = values?.industry
    if (values?.company_type == 'other' && values?.temp_company_type) {
      company_type = values?.temp_company_type
    }
    if (values?.industry === -1 && values?.temp_industry) {
      industry = values?.temp_industry
    } else if (values?.industry === -1) {
      industry = null
    } else {
      industry = values?.industry ?? null
    }

    const receivers = values?.receivers || []
    const contacts = receivers
      .filter((receiver: any) => receiver.contact_person_name || receiver.email)
      .map((receiver: any) => ({
        contact_person_name: receiver.contact_person_name,
        email: receiver.email,
        department_name: receiver.department_name,
      }))

    const { receivers: _, ...customerData } = values

    const payload = {
      ...customerData,
      contacts,
      company_type,
      industry,
    }

    try {
      mutateDraft(
        {
          url: `${apiUrl}/drafts`,
          method: 'put',
          values: {
            type: 'customer',
            payload,
          },
        },
        {
          onSuccess() {
            setIsRedirectingAfterDraftSave(true)
            openNotification?.({
              message: t('notifications.draftSaveSuccess'),
              description: t('notifications.draftSaveSuccess'),
              type: 'success',
            })
            go({
              to: `/customers`,
            })
          },
          onError(error: any) {
            openNotification?.({
              message:
                error?.response?.data?.message ||
                t('notifications.draftSaveError'),
              description:
                error?.response?.data?.message ||
                t('notifications.draftSaveError'),
              type: 'error',
            })
            saveDraftLockRef.current = false
            setIsSavingDraft(false)
          },
        },
      )
    } catch (error) {
      saveDraftLockRef.current = false
      setIsSavingDraft(false)
      throw error
    }
  }

  const handleApplyDraft = () => {
    if (
      !dataCustomerDraft?.data ||
      (dataCustomerDraft.data as any[]).length === 0
    ) {
      return
    }

    const draft: any = (dataCustomerDraft.data as any[])[0]
    const draftPayload = draft.payload || draft

    const receivers = draftPayload.contacts?.length
      ? draftPayload.contacts?.map((contact: any) => ({
          department_name: contact.department_name,
          contact_person_name: contact.contact_person_name,
          email: contact.email,
        }))
      : [
          {
            department_name: null,
            contact_person_name: null,
            email: null,
          },
        ]

    const { contacts, ...restPayload } = draftPayload

    form.setFieldsValue({
      ...restPayload,
      country: draftPayload?.country,
      department_in_charge_id: draftPayload?.department_in_charge_id,
      receivers,
    })

    openNotification?.({
      description: t('notifications.draftApplySuccess'),
      message: t('notifications.draftApplySuccess'),
      type: 'success',
    })
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
    handleSaveDraft,
    handleApplyDraft,
    isPendingDraft,
    isSavingDraft,
    isRedirectingAfterDraftSave,
    dataCustomerDraft,
    isFetchingCustomerDraft,
  }
}

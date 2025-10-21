/* eslint-disable */
'use client'

import { useForm, useModalForm } from '@refinedev/antd'
import { useApiUrl, useCustom, useModal, useTranslate } from '@refinedev/core'
import type { CodeIssueSetting } from '@sdk/hey-api/types.gen'
import { validateCustomerRule } from '@validate/customer'
import { useEffect } from 'react'

export const useCustomerEdit = () => {
  const t = useTranslate()
  const {
    formProps,
    saveButtonProps,
    form,
    onFinish,
    formLoading: isLoading,
    queryResult,
  } = useForm({
    action: 'edit',
    redirect: 'show',
  })

  const handleFinish = async (values: any) => {
    let company_type = values?.company_type
    let industry = values?.industry
    if (values?.temp_company_type) {
      company_type = values?.temp_company_type
    }
    if (!values?.industry && values?.temp_industry) {
      industry = values?.temp_industry
    }

    await onFinish({ ...values, company_type, industry })
  }

  const apiUrl = useApiUrl()

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

  const record = queryResult?.data?.data

  useEffect(() => {
    if (record) {
      form.setFieldsValue({ ...record })
    }
  }, [record])

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
  }
}

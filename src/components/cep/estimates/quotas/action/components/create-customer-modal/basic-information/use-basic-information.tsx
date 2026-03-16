/* eslint-disable */
import { useModalForm } from '@refinedev/antd'
import { useApiUrl, useCustom } from '@refinedev/core'
import {
  ParameterResourceEnum,
  type CodeIssueSetting,
} from '@sdk/hey-api/types.gen'
import { useUserStore } from '@stores/useUserStore'
import { typesCompanyOptions } from '@utility/options'
import { Form } from 'antd'
import React from 'react'
import { useEffect } from 'react'

export const useBasicInformation = () => {
  const apiUrl = useApiUrl()
  const form = Form.useFormInstance()

  /**
   * Fetch code generation settings to determine if the customer code
   * should be generated automatically or manually.
   */
  const {
    data: codeGenData,
    refetch: refetchCodeGen,
    isLoading: isCodeGenLoading,
  } = useCustom<CodeIssueSetting>({
    url: `${apiUrl}/code-issue-settings/by-code/customers`,
    method: 'get',
  })
  const isAutomatic = codeGenData?.data?.issue_method === 'automatic'

  /**
   * Modal form configuration for editing code issue settings.
   * Refetches data upon successful mutation to keep the UI in sync.
   */
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
  const { close: closeModal, open: modalOpen } = modalFormProps

  /**
   * Logic to fetch the latest preview code and update the form field.
   */
  const handleAutoNumber = async () => {
    const { data: latestData } = await refetchCodeGen()
    const code = latestData?.data?.preview_code
    if (code) {
      form.setFieldsValue({ customer_code: code })
    }
  }

  /**
   * Automatically populate the customer code field if the generation method
   * is set to 'automatic' and the field is currently empty.
   */
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

  /**
   * Sync company type logic: If the current value is not in the predefined options,
   * it maps it to 'other' and stores the custom value in a temporary field.
   */
  const companyType = Form.useWatch('company_type', form)
  React.useEffect(() => {
    const companyType = form.getFieldValue('company_type')
    if (companyType) {
      const isKnownType = typesCompanyOptions.some(
        (opt) => opt.value === companyType,
      )
      if (!isKnownType && companyType !== 'other') {
        form.setFieldsValue({
          company_type: 'other',
          temp_company_type: companyType,
        })
      }
    }
  }, [companyType, typesCompanyOptions])

  /**
   * UI Display logic: Determines how the company name and type should be
   * concatenated based on the selected display format (before vs after).
   */
  const isOtherSelected = companyType === 'other'
  const tempCompanyType = Form.useWatch('temp_company_type', form)
  const nameDisplay = isOtherSelected ? tempCompanyType : companyType
  const isNameAfter =
    Form.useWatch('company_name_display_format', form) === 'after'
  const name = Form.useWatch('name', form)
  const parts = isNameAfter ? [name, nameDisplay] : [nameDisplay, name]
  const isCompany = Form.useWatch('customer_type', form) === 'company'

  /**
   * Permissions and global settings: Check if the user has access
   * to rank-related resources via the global store.
   */
  const parameterSettings = useUserStore((state) => state.parameterSettings)
  const allowRankResource = parameterSettings?.get?.(
    ParameterResourceEnum.RANKS,
  )

  return {
    form,
    handleAutoNumber,
    modalFormProps,
    closeModal,
    modalOpen,
    isCodeGenLoading,
    codeGenData,
    refetchCodeGen,
    isAutomatic,
    isCompany,
    isOtherSelected,
    companyType,
    parts,
    allowRankResource,
    name,
  }
}

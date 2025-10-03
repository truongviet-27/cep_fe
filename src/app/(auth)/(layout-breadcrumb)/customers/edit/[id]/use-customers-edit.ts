/* eslint-disable */
import { useForm, useModalForm } from '@refinedev/antd'
import { useApiUrl, useCustom, useModal, useTranslate } from '@refinedev/core'
import type { CodeIssueSetting } from '@sdk/hey-api/types.gen'
import { validateCustomerRule } from '@validate/customer'
import { defaultCustomerCompanyResearchInformation } from '@app/(auth)/(layout-breadcrumb)/customers/components/instances'

export const useCustomerEdit = () => {
  const t = useTranslate()
  const {
    formProps,
    saveButtonProps,
    form,
    onFinish,
    formLoading: isLoading,
  } = useForm({
    action: 'edit',
    redirect: 'edit',
    defaultFormValues: {
      company_research_information: defaultCustomerCompanyResearchInformation,
      customer_code: null,
      person_in_charge_name: null,
      person_in_charge_department: null,
      person_in_charge_mail: null,
      name: null,
      price_rank_id: null,
      department_in_charge: null,
      post_code: null,
      address: null,
      phone: null,
      mail: null,
    } as any,
  })

  const handleFinish = async (values: any) => {
    const val = form.getFieldsValue()

    console.log('here', val)
    let company_type = values?.company_type
    let temp_industry = values?.temp_industry
    if (values?.temp_company_type) {
      company_type = values?.temp_company_type
    }
    if (values?.temp_industry) {
      temp_industry = values?.temp_industry
    }

    console.log(values, 'values')

    await onFinish({ ...values, company_type, temp_industry })
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

  const modalFormProps = useModalForm({
    action: 'edit',
    resource: 'code-issue-settings',
    autoResetFormWhenClose: true,
    redirect: false,
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
  }
}

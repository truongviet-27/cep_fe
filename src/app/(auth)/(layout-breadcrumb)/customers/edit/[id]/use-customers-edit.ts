import { useForm, useModalForm } from '@refinedev/antd'
import { useApiUrl, useCreate, useCustom, useTranslate } from '@refinedev/core'
import type {
  CodeIssueSetting,
  CustomerStoreRequest,
  Department,
} from '@sdk/hey-api/types.gen'
import { zCustomerStoreRequest } from '@sdk/hey-api/zod.gen'
import { createSchemaFieldRule } from 'antd-zod'

export const useCustomerEdit = () => {
  const t = useTranslate()
  const { formProps, saveButtonProps, form } = useForm<Department>({
    action: 'edit',
    redirect: 'show',
  })

  const { mutate, isLoading } = useCreate<CustomerStoreRequest>()

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
  })

  const handleAutoNumber = () => {
    const code = codeGenData?.data?.preview_code
    if (code) {
      form.setFieldsValue({ customer_code: code })
    }
  }

  const rule = createSchemaFieldRule(zCustomerStoreRequest)

  const onFinish = (values: CustomerStoreRequest) => {
    console.log('Form Values:', values)
    mutate({
      resource: 'customers',
      values,
    })
  }

  const handleCopyContact = () => {
    const mainContact = form.getFieldsValue([
      'person_in_charge_name',
      'person_in_charge_department',
      'person_in_charge_mail',
      'person_in_charge_phone',
    ])
    form.setFieldsValue({
      person_in_charge_name: mainContact.person_in_charge_name,
      person_in_charge_department: mainContact.person_in_charge_department,
      person_in_charge_mail: mainContact.person_in_charge_mail,
      person_in_charge_phone: mainContact.person_in_charge_phone,
    })
  }

  return {
    t,
    form,
    rule,
    isLoading,
    onFinish,
    handleCopyContact,
    handleAutoNumber,
    modalFormProps,
    isCodeGenLoading,
    codeGenData,
    refetchCodeGen,
    formProps,
    saveButtonProps,
  }
}

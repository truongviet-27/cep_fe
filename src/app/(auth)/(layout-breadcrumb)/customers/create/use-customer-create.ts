import { useForm, useModalForm } from '@refinedev/antd'
import { useApiUrl, useCustom, useTranslate } from '@refinedev/core'
import type {
  CodeIssueSetting,
  CustomerUpdateRequest,
} from '@sdk/hey-api/types.gen'
import { validateCustomerRule } from '@validate/customer'

export const useCustomerCreate = () => {
  const t = useTranslate()
  // const [form] = Form.useForm<CustomerUpdateRequest>()
  const {
    formProps,
    formLoading: isLoading,
    form,
    saveButtonProps,
  } = useForm<CustomerUpdateRequest>({
    resource: 'customers',
    action: 'create',
  })

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
    saveButtonProps,
    formProps,
  }
}

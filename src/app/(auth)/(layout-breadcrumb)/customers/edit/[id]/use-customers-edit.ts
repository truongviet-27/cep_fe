import { useForm, useModalForm } from '@refinedev/antd'
import { useApiUrl, useCreate, useCustom, useTranslate } from '@refinedev/core'
import type {
  CodeIssueSetting,
  CustomerStoreRequest,
  CustomerUpdateRequest,
} from '@sdk/hey-api/types.gen'
import { validateCustomerRule } from '@validate/customer'

export const useCustomerEdit = () => {
  const t = useTranslate()
  const { formProps, saveButtonProps, form } = useForm({
    action: 'edit',
    redirect: 'show',
  })

  const { mutate, isLoading } = useCreate<CustomerUpdateRequest>()

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

  const onFinish = (values: CustomerStoreRequest) => {
    mutate({
      resource: 'customers',
      values,
    })
  }

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

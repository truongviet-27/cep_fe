import { useForm, useModalForm } from '@refinedev/antd'
import { useApiUrl, useCustom, useTranslate } from '@refinedev/core'
import type {
  CodeIssueSetting,
  CustomerStoreRequest,
} from '@sdk/hey-api/types.gen'
import { zCustomerStoreRequest } from '@sdk/hey-api/zod.gen'
import { Form } from 'antd'
import { createSchemaFieldRule } from 'antd-zod'

export const useCustomerCreate = () => {
  const t = useTranslate()
  const [form] = Form.useForm<CustomerStoreRequest>()
  const { onFinish: handleSubmit, formLoading: isLoading } =
    useForm<CustomerStoreRequest>({
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

  const rule = createSchemaFieldRule(zCustomerStoreRequest)

  const onFinish = (values: CustomerStoreRequest) => {
    handleSubmit(values)
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
  }
}

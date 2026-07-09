import { useForm } from '@refinedev/antd'
import { useApiUrl, useCreate, useCustom, useTranslate } from '@refinedev/core'
import { useCallback, useEffect, useState } from 'react'

type Form = {
  title_1: string
  content_1: string
  signature_1: string
  pdf_file_name_1: string
  title_2: string
  content_2: string
  signature_2: string
}

function useMailTemplates() {
  const t = useTranslate()

  const methods = useForm<Form>()
  const {
    form: { setFieldsValue, validateFields },
  } = methods
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [indexTab, setIndexTab] = useState<number>(1)
  const [codeTab, setCodeTab] = useState<string>('quota_mail')

  const [openReset, setOpenReset] = useState<boolean>(false)
  const [openCancel, setOpenCancel] = useState<boolean>(false)

  const apiUrl = useApiUrl()

  const { data, isLoading, isFetching, refetch } = useCustom({
    url: `${apiUrl}/mail-templates/${codeTab}`,
    method: 'get',
  })

  const { mutate, isPending: isLoadingSubmit } = useCreate({
    resource: 'mail-templates',
  })

  const onChangeTabs = useCallback((value: string) => {
    setCodeTab(value)
    if (value === 'quota_mail') {
      setIndexTab(1)
    } else {
      setIndexTab(2)
    }
  }, [])

  const onSubmit = async () => {
    if (indexTab === 1 || indexTab === 2) {
      try {
        const values = (await validateFields()) as Form

        mutate(
          {
            values: {
              code: codeTab,
              title: values[`title_${indexTab}`],
              body: values[`content_${indexTab}`],
              signature: values[`signature_${indexTab}`],
              ...(indexTab === 1
                ? { pdf_file_name: values.pdf_file_name_1 }
                : {}),
            },
          },
          {
            onSuccess: () => {
              setIsEdit(false)
              refetch()
            },
          },
        )
      } catch (errorInfo) {
        console.log('validate failed:', errorInfo)
      }
    }
  }

  useEffect(() => {
    if (data && (indexTab === 1 || indexTab === 2)) {
      setFieldsValue({
        [`title_${indexTab}`]: data.data.title,
        [`content_${indexTab}`]: data.data.body,
        [`signature_${indexTab}`]: data.data.signature,
        ...(indexTab === 1 ? { pdf_file_name_1: data.data.pdf_file_name } : {}),
      })
    }
  }, [data, indexTab])

  return [
    {
      methods,
      isEdit,
      openReset,
      openCancel,
      indexTab,
      isLoading,
      isFetching,
      data: data?.data,
      isLoadingSubmit,
    },
    { t, setIsEdit, onSubmit, onChangeTabs, setOpenReset, setOpenCancel },
  ] as const
}

export default useMailTemplates

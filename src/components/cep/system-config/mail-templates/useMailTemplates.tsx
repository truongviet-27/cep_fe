import { useForm } from '@refinedev/antd'
import { useApiUrl, useCreate, useCustom } from '@refinedev/core'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

type Form = {
  title_1: string
  content_1: string
  signature_1: string
  title_2: string
  content_2: string
  signature_2: string
}

function useMailTemplates() {
  const t = useTranslations()
  const methods = useForm<Form>({
    defaultFormValues: {
      title_1: '',
      content_1: '',
      signature_1: `─ Commerce Robotics Inc 株式会社コマースロボティクス─
Sales Team mail: info@commerce-robotics.com
【東京本社】 〒105-0021 東京都港区東新橋2-11-4 マキヤ汐留プラザ 5F
TEL: 03-4431-1337`,
      title_2: '',
      content_2: '',
      signature_2: `─ Commerce Robotics Inc 株式会社コマースロボティクス─
Sales Team mail: info@commerce-robotics.com
【東京本社】 〒105-0021 東京都港区東新橋2-11-4 マキヤ汐留プラザ 5F
TEL: 03-4431-1337`,
    },
  })
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

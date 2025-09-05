import { useApiUrl, useCreate, useCustom } from '@refinedev/core'
import { useForm } from '@refinedev/react-hook-form'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

function useMailTemplates() {
  const t = useTranslations()
  const methods = useForm({
    defaultValues: {
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
  const { handleSubmit, reset } = methods
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [indexTab, setIndexTab] = useState<number>(1)
  const [codeTab, setCodeTab] = useState<string>('quota_mail')

  const [openReset, setOpenReset] = useState<boolean>(false)
  const [openCancel, setOpenCancel] = useState<boolean>(false)

  const { mutate, isPending } = useCreate({
    resource: 'mail-templates',
    mutationOptions: {
      onSuccess: () => {
        setIsEdit(false)
      },
      onError: (error) => {
        console.log(error.response.data, 'error')
        // setError(error)
      },
    },
  })

  const apiUrl = useApiUrl()

  const { data, isLoading, isFetching } = useCustom({
    url: `${apiUrl}/mail-templates/${codeTab}`,
    method: 'get',
  })

  const onChangeTabs = useCallback((value: string) => {
    setCodeTab(value)
    if (value === 'quota_mail') {
      setIndexTab(1)
    } else {
      setIndexTab(2)
    }
  }, [])

  const onSubmit = handleSubmit(async (data) => {
    if (indexTab === 1 || indexTab === 2) {
      mutate({
        values: {
          code: codeTab,
          title: data[`title_${indexTab}`],
          body: data[`content_${indexTab}`],
          signature: data[`signature_${indexTab}`],
        },
      })
    }
  })

  useEffect(() => {
    if (data && (indexTab === 1 || indexTab === 2)) {
      reset({
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
      isPending,
    },
    { t, setIsEdit, onSubmit, onChangeTabs, setOpenReset, setOpenCancel },
  ] as const
}

export default useMailTemplates

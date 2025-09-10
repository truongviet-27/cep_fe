import Step1 from '@components/cep/system-config/product-categories/csv/step1'
import Step4 from '@components/cep/system-config/product-categories/csv/step4'
import { useForm } from '@refinedev/antd'
import { useCreate } from '@refinedev/core'
import type { RcFile } from 'antd/es/upload'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

type Form = {
  type: string
  file: RcFile
}
function useCSVContainer() {
  const t = useTranslations()
  const methods = useForm<Form>({
    defaultFormValues: {
      type: '',
      file: '',
      data: [],
    },
  })

  const { form } = methods

  const { getFieldsValue } = form
  const [currentStep, setCurrentStep] = useState(0)

  const {} = useCreate({
    resource: 'csv-imports/validate',
  })

  const onSubmit = () => {
    console.log(getFieldsValue(), 'xxxxxxxxxxxxxxxx')
  }

  const onChangeStep = (step: number) => {
    setCurrentStep(step)
  }

  const steps = useMemo(() => {
    return [
      { title: t('product_categories.csv.step_1.title'), content: <Step1 /> },
      { title: t('product_categories.csv.step_2.title'), content: <Step4 /> },
    ]
  }, [])
  return [
    { methods, steps, currentStep },
    { t, setCurrentStep, onSubmit, onChangeStep },
  ] as const
}

export default useCSVContainer

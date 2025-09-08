import Step1 from '@components/cep/system-config/product-categories/csv/step1'
import Step2 from '@components/cep/system-config/product-categories/csv/step2'
import Step3 from '@components/cep/system-config/product-categories/csv/step3'
import Step4 from '@components/cep/system-config/product-categories/csv/step4'
import { useForm } from '@refinedev/react-hook-form'
import { useTranslations } from 'next-intl'
import React, { useMemo, useState } from 'react'

function useCSVContainer() {
  const t = useTranslations()
  const methods = useForm({})
  const [currentStep, setCurrentStep] = useState(0)

  const steps = useMemo(() => {
    return [
      { title: 'ファイル選択', content: <Step1 /> },
      { title: 'データ確認', content: <Step2 /> },
      { title: 'バリデーション', content: <Step3 /> },
      { title: '登録完了', content: <Step4 /> },
    ]
  }, [])
  return [
    { methods, steps, currentStep },
    { t, setCurrentStep },
  ] as const
}

export default useCSVContainer

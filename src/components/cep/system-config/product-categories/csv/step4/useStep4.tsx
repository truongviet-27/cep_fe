import { Form } from 'antd'
import { useTranslations } from 'next-intl'

function useStep4() {
  const t = useTranslations()
  const form = Form.useFormInstance()

  return [{ form }, { t }] as const
}

export default useStep4

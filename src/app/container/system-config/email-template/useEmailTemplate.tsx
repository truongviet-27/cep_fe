import { useForm } from '@refinedev/antd'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

function useEmailTemplate() {
  const t = useTranslations()
  const methods = useForm({
    defaultFormValues: {
      title1: '',
      content1: '',
      signature_1: `─ Commerce Robotics Inc 株式会社コマースロボティクス─
Sales Team mail: info@commerce-robotics.com
【東京本社】 〒105-0021 東京都港区東新橋2-11-4 マキヤ汐留プラザ 5F
TEL: 03-4431-1337`,
      title2: '',
      content2: '',
      signature_2: `─ Commerce Robotics Inc 株式会社コマースロボティクス─
Sales Team mail: info@commerce-robotics.com
【東京本社】 〒105-0021 東京都港区東新橋2-11-4 マキヤ汐留プラザ 5F
TEL: 03-4431-1337`,
    },
  })
  const { form } = methods

  const [isEdit, setIsEdit] = useState<boolean>(false)

  const onSubmit = async () => {
    try {
      const values = await form?.validateFields() // validate + lấy giá trị
      console.log(values) // dữ liệu từ Input
      // gửi data tới API hoặc Refine mutation
    } catch (error) {
      console.log('Validation failed', error)
    }
  }

  return [
    { methods, isEdit },
    { t, setIsEdit, onSubmit },
  ] as const
}

export default useEmailTemplate

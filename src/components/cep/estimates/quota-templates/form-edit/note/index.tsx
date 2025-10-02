import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Form, Input, Typography } from 'antd'

const { Title } = Typography

const NoteForm: React.FC = () => {
  const t = useTranslate()
  return (
    <>
      <Title
        level={5}
        style={{ color: PRIMARY }}
        className="!mt-6 !mb-2 border-b-1 border-gray-200 pb-2 text-[14px]"
      >
        {t('quota_templates.form.titleDetailInfo')}
      </Title>
      <Form.Item name={'note'}>
        <Input.TextArea
          style={{ marginTop: 20 }}
          rows={6}
          className="!resize-none"
        />
      </Form.Item>
    </>
  )
}

export default NoteForm

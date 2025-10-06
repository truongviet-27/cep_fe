import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Typography } from 'antd'

const { Title } = Typography

interface Props {
  note: string
}

const NoteForm: React.FC<Props> = ({ note }) => {
  const t = useTranslate()
  return (
    <>
      <Title
        level={5}
        style={{ color: PRIMARY }}
        className="!mt-6 !mb-2 border-b-1 border-gray-200 pb-2 text-[14px]"
      >
        {t('quota_templates.form.titleSpecificationsAndConditions')}
      </Title>
      <div className="p-4">{note}</div>
    </>
  )
}

export default NoteForm

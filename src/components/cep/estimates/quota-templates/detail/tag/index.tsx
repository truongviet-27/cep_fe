import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Tag, Typography } from 'antd'

const { Title } = Typography

const TagForm: React.FC = () => {
  const t = useTranslate()

  return (
    <>
      <Title
        level={5}
        style={{ color: PRIMARY }}
        className="!mt-6 !mb-2 border-b-1 border-gray-200 pb-2 text-[14px]"
      >
        {t('quota_templates.form.titleTag')}
      </Title>
      <Tag
        style={{
          borderRadius: '20px',
          padding: '10px 20px',
          fontSize: '14px',
          border: '2px solid #000',
        }}
      >
        第1営業部
      </Tag>
    </>
  )
}

export default TagForm

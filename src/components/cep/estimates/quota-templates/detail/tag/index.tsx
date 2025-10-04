import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Space, Tag, Typography } from 'antd'

const { Title } = Typography

interface Props {
  tags: Array<{ id?: number; name?: string }>
}

const TagForm: React.FC<Props> = (props) => {
  const t = useTranslate()
  const { tags } = props

  return (
    <>
      <Title
        level={5}
        style={{ color: PRIMARY }}
        className="!mt-6 !mb-2 border-b-1 border-gray-200 pb-2 text-[14px]"
      >
        {t('quota_templates.form.titleTag')}
      </Title>
      <Space wrap>
        {tags.map((tag) => (
          <Tag
            key={tag.id}
            style={{
              borderRadius: '20px',
              padding: '10px 20px',
              fontSize: '14px',
              border: '2px solid #000',
            }}
          >
            {tag.name}
          </Tag>
        ))}
      </Space>
    </>
  )
}

export default TagForm

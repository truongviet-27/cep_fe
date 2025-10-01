import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Typography } from 'antd'
import type { FC } from 'react'

const { Title } = Typography

const QuoteTemplateDetailContainer: FC = () => {
  const t = useTranslate()

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('quota_templates.breadcrumb.home')}
                </Title>
              ),
            },
            {
              title: (
                <Title level={5}>
                  {t('quota_templates.breadcrumb.quotasDetail')}
                </Title>
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={t('quota_templates.detail.title')}
    >
      <>QuoteTemplateDetailContainer</>
    </PageContainer>
  )
}

export default QuoteTemplateDetailContainer

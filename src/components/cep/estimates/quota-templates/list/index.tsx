import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Typography } from 'antd'

import { useController } from './controller'
import QuotaTemplateFilterForm from './filter-form'
import QuotaTemplateTable from './table'

const { Title } = Typography

const QuotaTemplateListContainer: React.FC = () => {
  const { tableProps, searchFormProps, t } = useController()

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
                  {t('quota_templates.breadcrumb.quotasList')}
                </Title>
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={t('quota_templates.list.title')}
    >
      <QuotaTemplateFilterForm searchFormProps={searchFormProps} />
      <QuotaTemplateTable tableProps={tableProps} />
    </PageContainer>
  )
}

export default QuotaTemplateListContainer

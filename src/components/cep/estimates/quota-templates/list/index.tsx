import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Breadcrumb } from 'antd'

import { useController } from './controller'
import QuotaTemplateFilterForm from './filter-form'
import QuotaTemplateTable from './table'

const QuotaTemplateListContainer: React.FC = () => {
  const { tableProps, searchFormProps, t, setFilters } = useController()

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: boldText(t('quota_templates.breadcrumb.home', PRIMARY)),
            },
            {
              title: boldText(t('quota_templates.breadcrumb.quotasList')),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={t('quota_templates.list.title')}
    >
      <QuotaTemplateFilterForm
        searchFormProps={searchFormProps}
        clearFilters={() => setFilters([], 'replace')}
      />
      <QuotaTemplateTable tableProps={tableProps} />
    </PageContainer>
  )
}

export default QuotaTemplateListContainer

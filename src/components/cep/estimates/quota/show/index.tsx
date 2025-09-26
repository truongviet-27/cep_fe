import BasicInfo from '@components/cep/estimates/quota/components/basic-info'
import DetailInfo from '@components/cep/estimates/quota/components/detail-info'
import History from '@components/cep/estimates/quota/components/history'
import Conditions from '@components/cep/estimates/quota/components/note'
import OptionalInfo from '@components/cep/estimates/quota/components/optional-info'
import Tags from '@components/cep/estimates/quota/components/tags'
import { Show } from '@components/crud/show'
import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Typography } from 'antd'

const { Title } = Typography

function QuotaDetail() {
  const t = useTranslate()
  return (
    <Show
      title={
        <Breadcrumb
          items={[
            {
              title: (
                <Title
                  level={5}
                  style={{
                    color: PRIMARY,
                  }}
                >
                  {t('estimates.estimates')}
                </Title>
              ),
            },
            {
              title: <Title level={5}>{t('quota.detail')}</Title>,
            },
          ]}
        />
      }
      i18nHeading={t('quota.detail')}
    >
      <BasicInfo />
      <DetailInfo />
      <OptionalInfo />
      <Conditions />
      <Tags />
      <History />
    </Show>
  )
}

export default QuotaDetail

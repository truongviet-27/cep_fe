import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { DeleteButton } from '@refinedev/antd'
import { useGo, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Button, Divider, Flex, Space, Typography } from 'antd'
import Link from 'next/link'
import type { FC } from 'react'

import BasicInfo from './basic-info'
import DetailInfo from './detail-info'
import NoteForm from './note'
import OptionalInfo from './optional-info'
import TagForm from './tag'

const { Title } = Typography

const QuoteTemplateDetailContainer: FC = () => {
  const t = useTranslate()
  const go = useGo()

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/quota-templates">
                  <Title level={5} style={{ color: PRIMARY }}>
                    {t('quota_templates.breadcrumb.home')}
                  </Title>
                </Link>
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
      <>
        <BasicInfo />
        <DetailInfo />
        <OptionalInfo />
        <NoteForm />
        <TagForm />
        <Divider />
        <ShowMoreInfo
          descriptions={[
            {
              title: t('approve_routes.show.creator'),
              value: '',
            },
            {
              title: t('approve_routes.show.updater'),
              value: '',
            },
          ]}
        />
        <Flex
          justify="space-between"
          style={{
            marginTop: 40,
          }}
        >
          <Space>
            <DeleteButton
              icon={null}
              size={'small'}
              onSuccess={() => {
                go({
                  to: '/quota-templates',
                })
              }}
            />
          </Space>
          <Space className="items-end">
            <Button color="primary" variant="outlined">
              見積作成
            </Button>

            <Button
              type="primary"
              onClick={() => {
                go({
                  to: `/quota-templates/edit/1`,
                })
              }}
            >
              {t('buttons.edit')}
            </Button>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => {
                go({
                  to: '/quotas',
                })
              }}
            >
              {t('buttons.back')}
            </Button>
          </Space>
        </Flex>
      </>
    </PageContainer>
  )
}

export default QuoteTemplateDetailContainer

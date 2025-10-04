import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import type { QuoteTemplateDetailType } from '@interfaces/quota-templates'
import { DeleteButton } from '@refinedev/antd'
import { useGo, useShow, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Divider,
  Flex,
  Space,
  Spin,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useParams } from 'next/navigation'
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
  const { id } = useParams<{ id: string }>()

  const { query } = useShow<QuoteTemplateDetailType>({
    resource: 'quota-templates',
    id: Number(id),
    queryOptions: {
      enabled: !!id,
    },
  })

  const quoteTemplateDetail = query.data?.data

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
      {quoteTemplateDetail ? (
        <Spin spinning={query.isLoading}>
          <BasicInfo detail={quoteTemplateDetail} />
          <DetailInfo detail={quoteTemplateDetail} />
          <OptionalInfo
            optionalProducts={quoteTemplateDetail?.optional_product ?? []}
          />
          <NoteForm note={quoteTemplateDetail?.note ?? ''} />
          <TagForm tags={quoteTemplateDetail?.tags ?? []} />
          <Divider />
          <ShowMoreInfo
            descriptions={[
              {
                title: t('common.created_by'),
                value: quoteTemplateDetail?.author?.name
                  ? `${quoteTemplateDetail.author.name} ${dayjs(quoteTemplateDetail?.created_at).format('YYYY/MM/DD HH:mm')}`
                  : '---',
              },
              {
                title: t('common.updated_by'),
                value: quoteTemplateDetail?.editor?.name
                  ? `${quoteTemplateDetail.editor.name} ${dayjs(quoteTemplateDetail?.updated_at).format('YYYY/MM/DD HH:mm')}`
                  : '---',
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
              <Button
                color="primary"
                variant="outlined"
                onClick={() => {
                  go({
                    to: `/quotas/create?templateId=${quoteTemplateDetail.id}`,
                  })
                }}
              >
                見積作成
              </Button>

              <Button
                type="primary"
                onClick={() => {
                  go({
                    to: `/quota-templates/edit/${quoteTemplateDetail.id}`,
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
        </Spin>
      ) : (
        <></>
      )}
    </PageContainer>
  )
}

export default QuoteTemplateDetailContainer

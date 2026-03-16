/* eslint-disable simple-import-sort/imports */
import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import type { QuoteTemplateDetailType } from '@interfaces/quota-templates'
import { DeleteButton } from '@refinedev/antd'
import { useGo, useShow, useTranslate } from '@refinedev/core'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Button, Divider, Flex, Form, Space } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { FC } from 'react'
import type { RoundingMethodEnumType } from '@sdk/hey-api'
import { RoundingMethodEnumType as RoundingMethodEnum } from '@sdk/hey-api'
import { useEffect, useState } from 'react'
import BasicInfo from './basic-info'
import DetailInfo from './detail-info'
import NoteForm from './note'
import OptionalInfo from './optional-info'
import TagForm from './tag'

const QuoteTemplateDetailContainer: FC = () => {
  const t = useTranslate()
  const go = useGo()
  const { id } = useParams<{ id: string }>()
  const [taxRoundingMethod, setTaxRoundingMethod] =
    useState<RoundingMethodEnumType>(RoundingMethodEnum.ROUND_UP)

  const { permission } = useUserStore()

  const { query } = useShow<QuoteTemplateDetailType>({
    resource: 'quota-templates',
    id: Number(id),
    queryOptions: {
      enabled: !!id,
    },
  })

  useEffect(() => {
    if (query.data?.data) {
      setTaxRoundingMethod(query.data?.data.tax_rounding_method)
    }
  }, [query.data?.data])

  const quoteTemplateDetail = query.data?.data

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/quota-templates">
                  {boldText(t('quota_templates.breadcrumb.parent'))}
                </Link>
              ),
            },
            {
              title: boldText(
                t('quota_templates.breadcrumb.quotasDetail'),
                PRIMARY,
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={t('quota_templates.breadcrumb.quotasDetail')}
      loading={query.isFetching}
    >
      {quoteTemplateDetail && (
        <Form
          labelCol={{ xs: 24, sm: 8, md: 8, lg: 6, xl: 6, xxl: 5 }}
          labelAlign="left"
          layout="horizontal"
          colon={false}
          autoComplete="off"
          initialValues={{
            name: '',
            description: '',
            type: 'normal',
            category: 'merchandise',
            delivery_method: '',
            payment_due_date: '',
            consumption_tax: 'exclusive',
            tax_rate: 0,
            note: '',
            number_product: 0,
            total_price: 0,
            total_price_tax_included: 0,
            total_profit_margin: 0,
            consumption_tax_amount: 0,
            tags: [],
            main_product: [],
            optional_product: [],
            created_at: '',
            updated_at: '',
            author: null,
            editor: null,
          }}
        >
          <BasicInfo detail={quoteTemplateDetail} />
          <DetailInfo
            detail={quoteTemplateDetail}
            taxRoundingMethod={taxRoundingMethod}
          />
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
              {(permission?.is_module_admin ||
                permission?.user?.id === quoteTemplateDetail?.author?.id) && (
                <DeleteButton
                  icon={null}
                  size={'small'}
                  onSuccess={() => {
                    go({
                      to: '/quota-templates',
                    })
                  }}
                />
              )}
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

              {(permission?.is_module_admin ||
                permission?.user?.id === quoteTemplateDetail?.author?.id) && (
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
              )}

              <Button
                color="default"
                variant="outlined"
                onClick={() => {
                  go({
                    to: '/quota-templates',
                  })
                }}
              >
                {t('buttons.back')}
              </Button>
            </Space>
          </Flex>
        </Form>
      )}
    </PageContainer>
  )
}

export default QuoteTemplateDetailContainer

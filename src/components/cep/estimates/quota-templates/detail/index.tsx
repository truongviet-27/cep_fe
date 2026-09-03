/* eslint-disable simple-import-sort/imports */
import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import type { QuoteTemplateDetailType } from '@interfaces/quota-templates'
import {
  useApiUrl,
  useCustom,
  useGo,
  useShow,
  useTranslate,
} from '@refinedev/core'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Alert, Breadcrumb, Button, Divider, Flex, Form, Space } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { FC } from 'react'
import type { RoundingMethodEnumType } from '@sdk/hey-api'
import { RoundingMethodEnumType as RoundingMethodEnum } from '@sdk/hey-api'
import { useEffect, useMemo, useState } from 'react'
import BasicInfo from './basic-info'
import DetailInfo from './detail-info'
import NoteForm from './note'
import OptionalInfo from './optional-info'
import TagForm from './tag'
import { computeTemplatePriceChanges } from '../utils/price-changes'

const QuoteTemplateDetailContainer: FC = () => {
  const t = useTranslate()
  const go = useGo()
  const apiUrl = useApiUrl()
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

  const priceCheckProductIds = useMemo(() => {
    const ids = new Set<number>()
    ;[
      ...(quoteTemplateDetail?.main_product ?? []),
      ...(quoteTemplateDetail?.optional_product ?? []),
    ].forEach((line: { product_id?: number | null }) => {
      if (line?.product_id) ids.add(line.product_id)
    })
    return Array.from(ids)
  }, [quoteTemplateDetail])

  const { data: priceCheckProductsData } = useCustom<{
    items?: Array<{ id?: number }>
  }>({
    url: `${apiUrl}/products/list-all`,
    method: 'get',
    queryOptions: {
      enabled: priceCheckProductIds.length > 0,
    },
    config: {
      query: {
        ids: priceCheckProductIds.join(','),
        _page: 1,
        _per_page: priceCheckProductIds.length,
      },
    },
  })

  const priceChanges = useMemo(() => {
    const items = priceCheckProductsData?.data?.items
    if (!items || priceCheckProductIds.length === 0) return []
    const productsById = new Map<number, (typeof items)[number]>(
      items
        .filter((item): item is { id: number } => item.id != null)
        .map((item) => [item.id, item]),
    )
    return computeTemplatePriceChanges(
      quoteTemplateDetail?.main_product,
      quoteTemplateDetail?.optional_product,
      productsById,
    )
  }, [priceCheckProductsData, priceCheckProductIds, quoteTemplateDetail])

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
      {priceChanges.length > 0 && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message={t('quota_templates.priceReflection.message')}
        />
      )}
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
            priceChanges={priceChanges}
          />
          <OptionalInfo
            optionalProducts={quoteTemplateDetail?.optional_product ?? []}
            priceChanges={priceChanges}
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
            justify="end"
            style={{
              marginTop: 40,
            }}
          >
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
                  autoInsertSpace={false}
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

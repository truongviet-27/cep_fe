import BasicInfo from '@components/cep/estimates/quotas/show/components/basic-info'
import DetailInfo from '@components/cep/estimates/quotas/show/components/detail-info'
import History from '@components/cep/estimates/quotas/show/components/history'
import Conditions from '@components/cep/estimates/quotas/show/components/note'
import OptionalInfo from '@components/cep/estimates/quotas/show/components/optional-info'
import Reason from '@components/cep/estimates/quotas/show/components/reason'
import Tags from '@components/cep/estimates/quotas/show/components/tags'
import ShowMoreInfo from '@components/common/show-more-info'
import { Show } from '@components/crud/show'
import { DeleteButton } from '@refinedev/antd'
import {
  useApiUrl,
  useCustom,
  useGo,
  useParsed,
  useShow,
  useTranslate,
} from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Divider,
  Flex,
  Form,
  Space,
  Typography,
} from 'antd'
import dayjs from 'dayjs'

const { Title } = Typography

function QuotaDetail() {
  const t = useTranslate()

  const { id } = useParsed()
  const apiUrl = useApiUrl()

  const go = useGo()

  const { query: queryBasic } = useShow({
    id,
  })

  const { data: dataProducts, isFetching: isFetchingProducts } = useCustom({
    url: `${apiUrl}/quotas/${id}/products`,
    method: 'get',
  })

  const { data: dataHistory, isFetching: isFetchingHistory } = useCustom({
    url: `${apiUrl}/quotas/${id}/history`,
    method: 'get',
  })

  console.log(dataHistory, 'dataHistory')

  return (
    <Show
      isLoading={
        queryBasic.isFetching || isFetchingProducts || isFetchingHistory
      }
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
                  {t('quotas.quotas')}
                </Title>
              ),
            },
            {
              title: <Title level={5}>{t('quotas.detail')}</Title>,
            },
          ]}
        />
      }
      hiddenButtonBack
      i18nHeading={t('quotas.detail')}
    >
      <Form
        labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
        labelAlign="left"
        layout="horizontal"
        colon={false}
        autoComplete="off"
        style={{
          marginTop: 30,
        }}
      >
        <BasicInfo data={queryBasic?.data?.data} />
        <DetailInfo
          data={dataProducts?.data?.main_product}
          basicInfo={queryBasic?.data?.data}
        />
        <OptionalInfo data={dataProducts?.data?.optional_product} />
        <Conditions note={queryBasic?.data?.data?.note} />
        <Tags tags={queryBasic?.data?.data?.tags} />
        <History />

        <Reason reason="差戻の理由を入力してください" />

        <Divider />
        <ShowMoreInfo
          descriptions={[
            {
              title: t('approve_routes.show.creator'),
              value:
                (queryBasic.data?.data?.author?.name ?? '---') +
                ' ' +
                dayjs(queryBasic.data?.data?.created_at).format(
                  'YYYY/MM/DD HH:mm',
                ),
            },
            {
              title: t('approve_routes.show.updater'),
              value:
                (queryBasic.data?.data?.editor?.name ?? '---') +
                ' ' +
                dayjs(queryBasic.data?.data?.updated_at).format(
                  'YYYY/MM/DD HH:mm',
                ),
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
                  to: '/quotas',
                })
              }}
            />
          </Space>
          <Space className="items-end">
            <Button
              type="default"
              onClick={() => {
                go({
                  to: '/quotas',
                })
              }}
            >
              {t('buttons.back')}
            </Button>

            <Button
              type="primary"
              onClick={() => {
                go({
                  to: `/quotas/edit/${id}`,
                })
              }}
            >
              {t('buttons.edit')}
            </Button>
          </Space>
        </Flex>
      </Form>
    </Show>
  )
}

export default QuotaDetail

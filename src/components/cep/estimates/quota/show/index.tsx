import DetailInfo from '@components/cep/estimates/quota/action/components/detail-info'
import History from '@components/cep/estimates/quota/action/components/history'
import Conditions from '@components/cep/estimates/quota/action/components/note'
import OptionalInfo from '@components/cep/estimates/quota/action/components/optional-info'
import Tags from '@components/cep/estimates/quota/action/components/tags'
import BasicInfo from '@components/cep/estimates/quota/show/components/basic-info'
import ShowMoreInfo from '@components/common/show-more-info'
import { Show } from '@components/crud/show'
import { DeleteButton } from '@refinedev/antd'
import { useGo, useParsed, useShow, useTranslate } from '@refinedev/core'
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
  const { query } = useShow()
  const { id } = useParsed()

  const go = useGo()

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
                  {t('quota.quota')}
                </Title>
              ),
            },
            {
              title: <Title level={5}>{t('quota.detail')}</Title>,
            },
          ]}
        />
      }
      hiddenButtonBack
      i18nHeading={t('quota.detail')}
    >
      <Form
        initialValues={query.data?.data}
        labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
        labelAlign="left"
        layout="horizontal"
        colon={false}
        autoComplete="off"
      >
        <BasicInfo />
        <DetailInfo />
        <OptionalInfo />
        <Conditions />
        <Tags />
        <History />

        <Divider />
        <ShowMoreInfo
          descriptions={[
            {
              title: t('approve_routes.show.creator'),
              value:
                (query.data?.data?.author?.name ?? '---') +
                ' ' +
                dayjs(query.data?.data?.create_at).format('YYYY/MM/DD HH:mm'),
            },
            {
              title: t('approve_routes.show.updater'),
              value:
                (query.data?.data?.editor?.name ?? '---') +
                ' ' +
                dayjs(query.data?.data?.update_at).format('YYYY/MM/DD HH:mm'),
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
                  to: '/quota',
                })
              }}
            />
          </Space>
          <Space className="items-end">
            <Button
              type="default"
              onClick={() => {
                go({
                  to: '/quota',
                })
              }}
            >
              {t('buttons.back')}
            </Button>

            <Button
              type="primary"
              onClick={() => {
                go({
                  to: `/quota/edit/${id}`,
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

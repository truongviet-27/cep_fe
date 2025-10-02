/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuotaStatus } from '@components/cep/estimates/quotas/enum'
import BasicInfo from '@components/cep/estimates/quotas/show/components/basic-info'
import DetailInfo from '@components/cep/estimates/quotas/show/components/detail-info'
import History from '@components/cep/estimates/quotas/show/components/history'
import Conditions from '@components/cep/estimates/quotas/show/components/note'
import OptionalInfo from '@components/cep/estimates/quotas/show/components/optional-info'
import Reason from '@components/cep/estimates/quotas/show/components/reason'
import Tags from '@components/cep/estimates/quotas/show/components/tags'
import ShowMoreInfo from '@components/common/show-more-info'
import { Show } from '@components/crud/show'
import { DeleteButton, useForm } from '@refinedev/antd'
import {
  type OpenNotificationParams,
  useApiUrl,
  useCustom,
  useCustomMutation,
  useGo,
  useParsed,
  useShow,
  useTranslate,
} from '@refinedev/core'
import { PRIMARY, WHITE } from '@utility/color'
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
import { useCallback, useEffect } from 'react'

const { Title } = Typography

function QuotaDetail() {
  const t = useTranslate()

  const { form, formProps } = useForm()

  const { id } = useParsed()
  const apiUrl = useApiUrl()

  const go = useGo()

  const { mutate } = useCustomMutation()

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

  console.log(dataHistory)

  const notificationFunction = useCallback(
    (message: string): OpenNotificationParams | false | undefined => {
      queryBasic.refetch()
      return {
        message: t('notifications.success'),
        description: message ?? 'Success',
        type: 'success',
      }
    },
    [t],
  )

  const handleChangeStatus = useCallback(
    (resource: string, values: any) => {
      mutate({
        values,
        method: 'put',
        url: `${apiUrl}/quotas/${resource}`,
        successNotification: (data) => {
          return notificationFunction(data?.data.message)
        },
      })
    },
    [t],
  )

  useEffect(() => {
    if (queryBasic.data?.data) {
      form.setFieldValue('reason', queryBasic.data.data.reason)
    }
  })

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
        form={formProps.form}
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

        <Reason display={!queryBasic?.data?.data.display} />

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

          <Space>
            {queryBasic?.data?.data.status === QuotaStatus.Creating && (
              <Button
                style={{
                  background: '#10B981',
                  color: WHITE,
                }}
                icon={null}
                size={'middle'}
                onClick={() => {
                  handleChangeStatus('send-to-approver', {
                    quota_ids: [queryBasic.data?.data.id],
                  })
                }}
              >
                承認依頼
              </Button>
            )}
            {queryBasic?.data?.data.status === QuotaStatus.WaitingApproval &&
              queryBasic.data.data.display && (
                <>
                  <Button
                    style={{
                      background: '#721C24',
                      color: WHITE,
                    }}
                    icon={null}
                    size={'middle'}
                    onClick={() => {
                      handleChangeStatus('approval-steps', [
                        {
                          quota_id: queryBasic.data?.data?.id,
                          status: 'rejected',
                          comment: form.getFieldValue('reason'),
                        },
                      ])
                    }}
                  >
                    差戻
                  </Button>
                  <Button
                    style={{
                      background: '#10B981',
                      color: WHITE,
                    }}
                    icon={null}
                    size={'middle'}
                    onClick={() => {
                      handleChangeStatus('approval-steps', [
                        {
                          quota_id: queryBasic.data?.data?.id,
                          status: 'approved',
                          comment: '',
                        },
                      ])
                    }}
                  >
                    承認
                  </Button>
                </>
              )}

            {queryBasic?.data?.data.status === QuotaStatus.Approved && (
              <Button
                style={{
                  background: '#10B981',
                  color: WHITE,
                }}
                icon={null}
                size={'middle'}
                onClick={() => {
                  handleChangeStatus('send-to-customer', {
                    quota_ids: [queryBasic.data?.data.id],
                  })
                }}
              >
                送信
              </Button>
            )}

            {queryBasic?.data?.data.status === QuotaStatus.SentToCustomer && (
              <>
                <Button
                  style={{
                    background: '#721C24',
                    color: WHITE,
                  }}
                  icon={null}
                  size={'middle'}
                  onClick={() => {
                    handleChangeStatus('mark-completed', {
                      quota_ids: [queryBasic.data?.data.id],
                    })
                  }}
                >
                  失注へ移動
                </Button>
                <Button
                  style={{
                    background: '#10B981',
                    color: WHITE,
                  }}
                  icon={null}
                  size={'middle'}
                  onClick={() => {
                    handleChangeStatus('cancel-quota', {
                      quota_ids: [queryBasic.data?.data.id],
                    })
                  }}
                >
                  受注へ移動
                </Button>
              </>
            )}

            {(queryBasic?.data?.data.status === QuotaStatus.Completed ||
              queryBasic?.data?.data.status === QuotaStatus.Cancelled) &&
              queryBasic.data.data.display && (
                <Button
                  style={{
                    background: '#721C24',
                    color: WHITE,
                  }}
                  icon={null}
                  size={'middle'}
                  onClick={() => {
                    handleChangeStatus('send-to-approver', {
                      quota_ids: [queryBasic.data?.data.id],
                    })
                  }}
                >
                  送信へ移動
                </Button>
              )}
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

            {(queryBasic?.data?.data.status === QuotaStatus.Creating ||
              queryBasic?.data?.data.status === QuotaStatus.Rejected) && (
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
            )}
          </Space>
        </Flex>
      </Form>
    </Show>
  )
}

export default QuotaDetail

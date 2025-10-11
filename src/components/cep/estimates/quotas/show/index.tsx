/* eslint-disable @typescript-eslint/no-explicit-any */
import { RightOutlined } from '@ant-design/icons'
import { QuotaStatus } from '@components/cep/estimates/quotas/enum'
import BasicInfo from '@components/cep/estimates/quotas/show/components/basic-info'
import DetailInfo from '@components/cep/estimates/quotas/show/components/detail-info'
import History from '@components/cep/estimates/quotas/show/components/history'
import Conditions from '@components/cep/estimates/quotas/show/components/note'
import OptionalInfo from '@components/cep/estimates/quotas/show/components/optional-info'
import Reason from '@components/cep/estimates/quotas/show/components/reason'
import Tags from '@components/cep/estimates/quotas/show/components/tags'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { DeleteButton, useForm } from '@refinedev/antd'
import {
  type OpenNotificationParams,
  useApiUrl,
  useCustom,
  useCustomMutation,
  useGo,
  useParsed,
  useTranslate,
} from '@refinedev/core'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { PRIMARY, WHITE } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Divider,
  Flex,
  Form,
  Modal,
  Space,
  Spin,
} from 'antd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'

function QuotaDetail() {
  const t = useTranslate()

  const { permission } = useUserStore.getState()

  const { form, formProps } = useForm()

  const [isPdf, setIsPdf] = useState(false)
  const [previewPdf, setPreviewPdf] = useState('')

  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const { id } = useParsed()
  const apiUrl = useApiUrl()

  const go = useGo()

  const { mutate } = useCustomMutation()

  const {
    data: queryBasic,
    isFetching,
    refetch,
  } = useCustom({
    url: `${apiUrl}/quotas/${id}`,
    method: 'get',
  })

  const {
    data: dataProducts,
    isFetching: isFetchingProducts,
    refetch: refetchProducts,
  } = useCustom({
    url: `${apiUrl}/quotas/${id}/products`,
    method: 'get',
  })

  const {
    data: dataHistory,
    isFetching: isFetchingHistory,
    refetch: refetchHistory,
  } = useCustom({
    url: `${apiUrl}/quotas/${id}/history`,
    method: 'get',
  })

  console.log(dataHistory)

  const notificationFunction = useCallback(
    (message: string): OpenNotificationParams | false | undefined => {
      refetch()
      refetchProducts()
      refetchHistory()
      return {
        message: t('notifications.success'),
        description: message ?? t('notifications.success'),
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
    if (queryBasic?.data) {
      form.setFieldValue('reason', queryBasic.data.reason)
    }
  }, [queryBasic])

  const { mutate: mutatePreviewPdf, isPending: isPendingPreviewPdf } =
    useCustomMutation()

  const handlePreviewPdf = () => {
    const customValues = {
      ...queryBasic?.data,
      ...dataProducts?.data,
      ...dataHistory?.data,
    }

    mutatePreviewPdf(
      {
        values: customValues,
        url: `${apiUrl}/quotas/preview-pdf/${customValues?.id}`,
        method: 'post',
      },
      {
        onSuccess(data) {
          setPreviewPdf(data.data?.pdf_base64 ?? '')
        },
      },
    )
  }

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: boldText(t('estimates.estimates')),
            },
            {
              title: boldText(t('quotas.detail'), PRIMARY),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={
        <div className="flex justify-between">
          {t('quotas.detail')}
          <Button
            color="primary"
            variant="outlined"
            onClick={async () => {
              await form.validateFields()
              setIsPdf(!isPdf)
              handlePreviewPdf()
            }}
          >
            {t('quotas.show.preview')}
          </Button>
        </div>
      }
    >
      <Spin spinning={isFetching || isFetchingProducts || isFetchingHistory}>
        <Form
          labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
          labelAlign="left"
          layout="horizontal"
          colon={false}
          autoComplete="off"
          form={formProps.form}
        >
          <BasicInfo data={queryBasic?.data} />
          <DetailInfo
            data={dataProducts?.data?.main_product}
            basicInfo={queryBasic?.data}
          />
          <OptionalInfo data={dataProducts?.data?.optional_product} />
          <Conditions note={queryBasic?.data?.note} />
          <Tags tags={queryBasic?.data?.tags} />
          <History data={dataHistory?.data} />

          {(permission?.is_module_admin || queryBasic?.data?.display) && (
            <Reason />
          )}

          <Divider />
          <ShowMoreInfo
            descriptions={[
              {
                title: t('approve_routes.show.creator'),
                value:
                  (queryBasic?.data?.author?.name ?? '---') +
                  ' ' +
                  dayjs(queryBasic?.data?.created_at).format(
                    'YYYY/MM/DD HH:mm',
                  ),
              },
              {
                title: t('approve_routes.show.updater'),
                value:
                  (queryBasic?.data?.editor?.name ?? '---') +
                  ' ' +
                  dayjs(queryBasic?.data?.updated_at).format(
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
              {(permission?.is_module_admin || queryBasic?.data?.is_author) && (
                <DeleteButton
                  icon={null}
                  size={'small'}
                  onSuccess={() => {
                    go({
                      to: '/quotas',
                    })
                  }}
                />
              )}
            </Space>

            <Space>
              {queryBasic?.data?.has_approval_route &&
                queryBasic?.data?.status === QuotaStatus.Creating &&
                (permission?.is_module_admin ||
                  queryBasic?.data?.is_author) && (
                  <Button
                    style={{
                      background: '#10B981',
                      color: WHITE,
                    }}
                    icon={null}
                    size={'middle'}
                    onClick={() => {
                      handleChangeStatus('send-to-approver', {
                        quota_ids: [queryBasic?.data.id],
                      })
                    }}
                  >
                    {t('quotas.show.actions.request_approval')}
                  </Button>
                )}
              {queryBasic?.data?.status === QuotaStatus.SentToCustomer && (
                <Button
                  type="default"
                  style={{
                    background: '#faad14',
                    color: WHITE,
                  }}
                  size="middle"
                  onClick={() => {
                    go({
                      to: `quotas/clone/${id}?actionType=VERSION`,
                    })
                  }}
                >
                  {t('quotas.actions.re_estimate')}
                </Button>
              )}
              {queryBasic?.data?.has_approval_route &&
                queryBasic?.data?.status === QuotaStatus.WaitingApproval &&
                (permission?.is_module_admin || queryBasic?.data?.display) && (
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
                            quota_id: queryBasic?.data?.id,
                            status: 'rejected',
                            comment: form.getFieldValue('reason'),
                          },
                        ])
                      }}
                    >
                      {t('quotas.show.actions.reject')}
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
                            quota_id: queryBasic?.data?.id,
                            status: 'approved',
                            comment: form.getFieldValue('reason'),
                          },
                        ])
                      }}
                    >
                      {t('quotas.show.actions.approve')}
                    </Button>
                  </>
                )}

              {queryBasic?.data?.status === QuotaStatus.Approved &&
                (permission?.is_module_admin ||
                  queryBasic?.data?.is_author) && (
                  <Button
                    style={{
                      background: '#10B981',
                      color: WHITE,
                    }}
                    icon={null}
                    size={'middle'}
                    onClick={() => {
                      handleChangeStatus('send-to-customer', {
                        quota_ids: [queryBasic?.data.id],
                        status: 'sent_to_customer',
                      })
                    }}
                  >
                    {t('quotas.show.actions.send')}
                  </Button>
                )}

              {queryBasic?.data?.status === QuotaStatus.SentToCustomer &&
                (permission?.is_module_admin ||
                  queryBasic.data?.display ||
                  queryBasic?.data?.is_author) && (
                  <>
                    <Button
                      style={{
                        background: '#721C24',
                        color: WHITE,
                      }}
                      icon={null}
                      size={'middle'}
                      onClick={() => {
                        handleChangeStatus('cancel-quota', {
                          quota_ids: [queryBasic?.data.id],
                        })
                      }}
                    >
                      {t('quotas.show.actions.move_to_cancel')}
                    </Button>
                    <Button
                      style={{
                        background: '#10B981',
                        color: WHITE,
                      }}
                      icon={null}
                      size={'middle'}
                      onClick={() => {
                        handleChangeStatus('mark-completed', {
                          quota_ids: [queryBasic?.data.id],
                        })
                      }}
                    >
                      {t('quotas.show.actions.move_to_order')}
                    </Button>
                  </>
                )}

              {(queryBasic?.data?.status === QuotaStatus.Completed ||
                queryBasic?.data?.status === QuotaStatus.Cancelled) &&
                (permission?.is_module_admin || queryBasic.data?.display) && (
                  <Button
                    style={{
                      background: '#721C24',
                      color: WHITE,
                    }}
                    icon={null}
                    size={'middle'}
                    onClick={() => {
                      handleChangeStatus('back-to-sent-customer', {
                        quota_ids: [queryBasic?.data.id],
                      })
                    }}
                  >
                    {t('quotas.show.actions.move_to_send')}
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

              {(queryBasic?.data?.status === QuotaStatus.Creating ||
                queryBasic?.data?.status === QuotaStatus.Rejected) &&
                (permission?.is_module_admin || queryBasic.data?.is_author) && (
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
      </Spin>
      <Modal
        title={t('quotas.show.preview_pdf')}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isPdf}
        onCancel={() => {
          setIsPdf(false)
        }}
        footer={null}
        style={{ top: 20 }}
        width={{
          xs: '90%',
          sm: '80%',
          xxl: '50%',
        }}
      >
        <div>
          <Spin spinning={isPendingPreviewPdf}>
            {!isPendingPreviewPdf && (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={`data:application/pdf;base64,${previewPdf}`}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </Worker>
            )}
          </Spin>

          {/* <PreviewPdf previewPdf={previewPdf} /> */}
        </div>
      </Modal>
    </PageContainer>
  )
}

export default QuotaDetail

/* eslint-disable @typescript-eslint/no-explicit-any */
import { RightOutlined } from '@ant-design/icons'
import { QuotaStatus } from '@components/cep/estimates/quotas/enum'
import BasicInfo from '@components/cep/estimates/quotas/show/components/basic-info'
import DetailInfo from '@components/cep/estimates/quotas/show/components/detail-info'
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
import { PRIMARY, WHITE } from '@utility/color'
import {
  Breadcrumb,
  Button,
  DatePicker,
  Divider,
  Flex,
  Form,
  Modal,
  Space,
  Spin,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'

const { Title } = Typography

function AgreedPriceQuotaDetail() {
  const t = useTranslate()
  const { form, formProps } = useForm()

  const [isPdf, setIsPdf] = useState(false)
  const [previewPdf, setPreviewPdf] = useState('')

  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const { id } = useParsed()
  const apiUrl = useApiUrl()
  const go = useGo()

  const { mutate } = useCustomMutation()

  // Fetch agreed price record for this quota to get agreed price id and expiration_date
  const { data: agreedPriceList, refetch: refetchAgreedPrice } = useCustom({
    url: `${apiUrl}/quota/agreed-prices?quota_id=${id}`,
    method: 'get',
    queryOptions: {
      enabled: !!id,
    },
  })

  const agreedPriceItem: any = Array.isArray(agreedPriceList?.data)
    ? agreedPriceList?.data?.[0]
    : (agreedPriceList as any)?.data?.items?.[0]

  const agreedPriceId: number | undefined = agreedPriceItem?.id
  const agreedPriceExpiration: string | null | undefined =
    agreedPriceItem?.expiration_date

  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [updateForm] = Form.useForm()
  const { mutate: mutateUpdateExpiration, isPending: isUpdatingExpiration } =
    useCustomMutation()

  const openUpdateExpiration = () => {
    const start = agreedPriceExpiration
      ? dayjs(agreedPriceExpiration).add(1, 'day')
      : null
    updateForm.setFieldsValue({ start_date: start, end_date: null })
    setIsUpdateOpen(true)
  }

  const handleSubmitUpdateExpiration = () => {
    updateForm.validateFields().then((values) => {
      if (!agreedPriceId) return
      const end: dayjs.Dayjs | undefined = values.end_date
      if (!end) return
      const expiration = end.format('YYYY/MM/DD')
      mutateUpdateExpiration(
        {
          method: 'put',
          url: `${apiUrl}/quota/agreed-prices/${agreedPriceId}/expiration-date`,
          values: { expiration_date: expiration },
          successNotification: () => ({
            message: t('notifications.success'),
            description: t('notifications.editSuccess'),
            type: 'success',
          }),
        },
        {
          onSuccess: () => {
            setIsUpdateOpen(false)
            refetchAgreedPrice?.()
          },
        },
      )
    })
  }

  const {
    data: queryBasic,
    isFetching,
    refetch,
  } = useCustom({
    url: `${apiUrl}/quotas/${id}`,
    method: 'get',
    queryOptions: {
      enabled: !!id,
    },
  })

  const {
    data: dataProducts,
    isFetching: isFetchingProducts,
    refetch: refetchProducts,
  } = useCustom({
    url: `${apiUrl}/quotas/${id}/products`,
    method: 'get',
    queryOptions: {
      enabled: !!id,
    },
  })

  const notificationFunction = useCallback(
    (message: string): OpenNotificationParams | false | undefined => {
      refetch()
      refetchProducts()
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
    if (queryBasic?.data) {
      form.setFieldValue('reason', queryBasic.data.reason)
    }
  }, [queryBasic])

  const { mutate: mutatePreviewPdf, isPending: isPendingPreviewPdf } =
    useCustomMutation()

  const handlePreviewPdf = () => {
    const customValues = {
      ...queryBasic?.data,
    }

    mutatePreviewPdf(
      {
        values: customValues,
        url: `${apiUrl}/quotas/preview-pdf`,
        method: 'post',
      },
      {
        onSuccess(data) {
          setPreviewPdf(data.data?.pdf_base64 ?? '')
        },
      },
    )
  }

  // No extra resolving step; the route id is the quota id

  return (
    <PageContainer
      breadcrumbs={
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
          separator={<RightOutlined />}
        />
      }
      title={
        <div className="flex justify-between">
          <span>{t('quotas.detail')}</span>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              setIsPdf(!isPdf)
              handlePreviewPdf()
            }}
          >
            プレビュー
          </Button>
        </div>
      }
    >
      <Spin spinning={isFetching || isFetchingProducts}>
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
          <BasicInfo data={queryBasic?.data} />
          {/* Applicable period with Update button (after delivery_date display) */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="mr-2 font-medium">適用期間</span>
              <span>
                {queryBasic?.data?.created_at
                  ? dayjs(queryBasic?.data?.created_at).format('YYYY/MM/DD')
                  : '---'}{' '}
                〜{' '}
                {agreedPriceExpiration
                  ? dayjs(agreedPriceExpiration).format('YYYY/MM/DD')
                  : '---'}
              </span>
            </div>
            <Button
              type="link"
              size="small"
              onClick={openUpdateExpiration}
              disabled={!agreedPriceId}
            >
              更新
            </Button>
          </div>
          <DetailInfo
            data={dataProducts?.data?.main_product}
            basicInfo={queryBasic?.data}
          />
          <OptionalInfo data={dataProducts?.data?.optional_product} />
          <Conditions note={queryBasic?.data?.note} />
          <Tags tags={queryBasic?.data?.tags} />

          {queryBasic?.data?.display && <Reason />}

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
              {queryBasic?.data?.is_author && (
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
              {queryBasic?.data?.status === QuotaStatus.Creating &&
                queryBasic?.data?.is_author && (
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
                    承認依頼
                  </Button>
                )}
              {queryBasic?.data?.status === QuotaStatus.WaitingApproval &&
                queryBasic?.data?.display && (
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
                            quota_id: queryBasic?.data?.id,
                            status: 'approved',
                            comment: form.getFieldValue('reason'),
                          },
                        ])
                      }}
                    >
                      承認
                    </Button>
                  </>
                )}

              {queryBasic?.data?.status === QuotaStatus.Approved &&
                queryBasic?.data?.is_author && (
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
                    送信
                  </Button>
                )}

              {queryBasic?.data?.status === QuotaStatus.SentToCustomer &&
                (queryBasic.data?.display || queryBasic?.data?.is_author) && (
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
                        handleChangeStatus('mark-completed', {
                          quota_ids: [queryBasic?.data.id],
                        })
                      }}
                    >
                      受注へ移動
                    </Button>
                  </>
                )}

              {(queryBasic?.data?.status === QuotaStatus.Completed ||
                queryBasic?.data?.status === QuotaStatus.Cancelled) &&
                queryBasic.data?.display && (
                  <Button
                    style={{
                      background: '#721C24',
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
                    送信へ移動
                  </Button>
                )}
            </Space>

            <Space className="items-end">
              <Button
                type="default"
                onClick={() => {
                  go({
                    to: '/agreed-prices',
                  })
                }}
              >
                {t('buttons.back')}
              </Button>

              {(queryBasic?.data?.status === QuotaStatus.Creating ||
                queryBasic?.data?.status === QuotaStatus.Rejected) &&
                queryBasic.data?.is_author && (
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
      {/* Update expiration modal */}
      <Modal
        title={t('agreed_prices.modal.update_title') || '有効期限の更新'}
        open={isUpdateOpen}
        onCancel={() => setIsUpdateOpen(false)}
        onOk={handleSubmitUpdateExpiration}
        okButtonProps={{ loading: isUpdatingExpiration }}
        destroyOnClose
      >
        <Form form={updateForm} layout="vertical">
          <Form.Item label="適用開始日" name="start_date">
            <DatePicker className="w-full" format="YYYY/MM/DD" disabled />
          </Form.Item>
          <Form.Item
            label="適用終了日"
            name="end_date"
            rules={[
              { required: true, message: t('errors.required') || '必須' },
            ]}
          >
            <DatePicker className="w-full" format="YYYY/MM/DD" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Preview PDF"
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
        </div>
      </Modal>
    </PageContainer>
  )
}

export default AgreedPriceQuotaDetail

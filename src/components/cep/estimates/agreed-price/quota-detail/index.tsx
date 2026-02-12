/* eslint-disable @typescript-eslint/no-explicit-any */
import { RightOutlined } from '@ant-design/icons'
import BasicInfoExtended from '@components/cep/estimates/agreed-price/basic-info-extended'
import { QuotaStatus } from '@components/cep/estimates/quotas/enum'
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
import type { RoundingMethodEnumType } from '@sdk/hey-api'
import { RoundingMethodEnumType as RoundingMethodEnum } from '@sdk/hey-api'
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
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

function AgreedPriceQuotaDetail() {
  const t = useTranslate()
  const { form, formProps } = useForm()
  const [taxRoundingMethod, setTaxRoundingMethod] =
    useState<RoundingMethodEnumType>(RoundingMethodEnum.ROUND_UP)

  const [isPdf, setIsPdf] = useState(false)

  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const { id } = useParsed()
  const apiUrl = useApiUrl()
  const go = useGo()

  const { mutate } = useCustomMutation()

  const {
    data: agreedPriceList,
    refetch: refetchAgreedPrice,
    isFetching: isFetchingAgreedPrice,
  } = useCustom({
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
  const agrredPriceValidTo: string | null | undefined =
    agreedPriceItem?.valid_to ?? agreedPriceItem?.expiration_date
  const agreedPriceValidFrom: string | null | undefined =
    agreedPriceItem?.valid_from

  const { mutate: mutateUpdateExpiration, isPending: isUpdatingExpiration } =
    useCustomMutation()

  const openUpdateExpiration = (
    newStartDate?: dayjs.Dayjs,
    newEndDate?: dayjs.Dayjs,
    isUnlimited?: boolean,
  ) => {
    if (!agreedPriceId) return

    const values: any = {
      is_unlimited: isUnlimited ?? false,
    }

    if (isUnlimited) {
      values.valid_from = newStartDate
        ? newStartDate.format('YYYY/MM/DD')
        : null
      values.valid_to = newEndDate ? newEndDate.format('YYYY/MM/DD') : null
    } else if (newEndDate) {
      values.valid_to = newEndDate.format('YYYY/MM/DD')
      values.valid_from = newStartDate
        ? newStartDate.format('YYYY/MM/DD')
        : dayjs(agreedPriceValidFrom).format('YYYY/MM/DD')
    } else {
      return
    }

    mutateUpdateExpiration(
      {
        method: 'put',
        url: `${apiUrl}/quota/agreed-prices/${agreedPriceId}/expiration-date`,
        values,
        successNotification: () => ({
          message: t('notifications.success'),
          description: t('notifications.editSuccess'),
          type: 'success',
        }),
      },
      {
        onSuccess: () => {
          refetchAgreedPrice?.()
        },
      },
    )
    // } else {
    //   // Open modal for update (fallback)
    //   const end = agrredPriceValidTo ? dayjs(agrredPriceValidTo) : null
    //   const start = end ? end.add(1, 'day') : null
    //   updateForm.setFieldsValue({ valid_from: start, valid_to: null })
    //   setIsUpdateOpen(true)
    // }
  }

  // const handleSubmitUpdateExpiration = () => {
  //   updateForm.validateFields().then((values) => {
  //     if (!agreedPriceId) return
  //     const start: dayjs.Dayjs | undefined = values.valid_from
  //     const end: dayjs.Dayjs | undefined = values.valid_to
  //     if (!end || !start) return
  //     const validFrom = start.format('YYYY/MM/DD')
  //     const validTo = end.format('YYYY/MM/DD')
  //     mutateUpdateExpiration(
  //       {
  //         method: 'put',
  //         url: `${apiUrl}/quota/agreed-prices/${agreedPriceId}/expiration-date`,
  //         values: { valid_from: validFrom, valid_to: validTo },
  //         successNotification: () => ({
  //           message: t('notifications.success'),
  //           description: t('notifications.editSuccess'),
  //           type: 'success',
  //         }),
  //       },
  //       {
  //         onSuccess: () => {
  //           setIsUpdateOpen(false)
  //           refetchAgreedPrice?.()
  //         },
  //       },
  //     )
  //   })
  // }

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

  useEffect(() => {
    if (queryBasic?.data) {
      setTaxRoundingMethod(queryBasic.data.tax_rounding_method)
    }
  }, [queryBasic?.data])

  const pdfUrl = queryBasic?.data?.pdf_path

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

  const { isPending: isPendingPreviewPdf } = useCustomMutation()

  // No extra resolving step; the route id is the quota id

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/agreed-prices">
                  {boldText(t('quotas.confirmed_quota'))}
                </Link>
              ),
            },
            {
              title: boldText(t('quotas.confirmed_quota_detail'), PRIMARY),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={
        <div className="flex justify-between">
          <span>{t('quotas.confirmed_quota_detail')}</span>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              setIsPdf(!isPdf)
            }}
            disabled={isFetching || isFetchingProducts || !queryBasic?.data}
          >
            プレビュー
          </Button>
        </div>
      }
    >
      <Spin
        spinning={
          isFetching ||
          isFetchingProducts ||
          isUpdatingExpiration ||
          isFetchingAgreedPrice
        }
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
          <BasicInfoExtended
            data={queryBasic?.data}
            showApplicablePeriod={true}
            agrredPriceValidTo={agrredPriceValidTo || undefined}
            agreedPriceId={agreedPriceId}
            agreedPriceValidFrom={agreedPriceValidFrom || undefined}
            onUpdateExpiration={openUpdateExpiration}
            agreedPriceItem={agreedPriceItem}
          />
          <DetailInfo
            taxRoundingMethod={taxRoundingMethod}
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
                    {t('quotas.actions.move_to_send')}
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
      {/* <Modal
        title={t('agreed_prices.modal.update_title') || '有効期限の更新'}
        open={isUpdateOpen}
        onCancel={() => setIsUpdateOpen(false)}
        onOk={handleSubmitUpdateExpiration}
        okButtonProps={{ loading: isUpdatingExpiration }}
        destroyOnClose
      >
        <Form form={updateForm} layout="vertical">
          <Form.Item label="適用開始日" name="valid_from">
            <DatePicker className="w-full" format="YYYY/MM/DD" disabled />
          </Form.Item>
          <Form.Item
            label="適用終了日"
            name="valid_to"
            rules={[
              { required: true, message: t('errors.required') || '必須' },
            ]}
          >
            <DatePicker className="w-full" format="YYYY/MM/DD" />
          </Form.Item>
        </Form>
      </Modal> */}
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
                  fileUrl={pdfUrl}
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

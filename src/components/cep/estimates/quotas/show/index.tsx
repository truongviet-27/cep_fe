/* eslint-disable @typescript-eslint/no-explicit-any */
import { RightOutlined } from '@ant-design/icons'
import {
  QuotaStatus,
  STATUS_DISABLED_WHEN_OFF_APPROVE_ROUTE,
} from '@components/cep/estimates/quotas/enum'
import BasicInfo from '@components/cep/estimates/quotas/show/components/basic-info'
import DetailInfo from '@components/cep/estimates/quotas/show/components/detail-info'
import History from '@components/cep/estimates/quotas/show/components/history'
import Conditions from '@components/cep/estimates/quotas/show/components/note'
import OptionalInfo from '@components/cep/estimates/quotas/show/components/optional-info'
import Reason from '@components/cep/estimates/quotas/show/components/reason'
import Tags from '@components/cep/estimates/quotas/show/components/tags'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { usePdfViewerLayoutPlugin } from '@hooks/usePdfViewerLayout'
import { Viewer, Worker } from '@react-pdf-viewer/core'
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
import {
  ParameterResourceEnum,
  RoundingMethodEnumType as RoundingMethodEnum,
} from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import boldText from '@utility/bold-text'
import { PRIMARY, WHITE } from '@utility/color'
import { Breadcrumb, Button, Divider, Form, Modal, Select, Spin } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

function QuotaDetail() {
  const t = useTranslate()
  const router = useRouter()
  const { permission, parameterSettings } = useUserStore.getState()
  const [taxRoundingMethod, setTaxRoundingMethod] =
    useState<RoundingMethodEnumType>(RoundingMethodEnum.ROUND_UP)

  const { form, formProps } = useForm()

  const [isPdf, setIsPdf] = useState(false)

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

  const pdfViewerLayoutPlugin = usePdfViewerLayoutPlugin(() => {
    const data = queryBasic?.data
    const sanitize = (value?: string | null) =>
      value?.replace(/[\\/:*?"<>|]/g, '')
    const parts = [
      '見積書',
      sanitize(data?.code),
      sanitize(data?.customer_name)
        ? `${sanitize(data?.customer_name)}様`
        : undefined,
      sanitize(data?.title),
    ].filter(Boolean)

    return `${parts.join('_')}.pdf`
  })
  useEffect(() => {
    // khi quota show, lay setting cua quota, khong lay setting cua tenant
    if (queryBasic?.data) {
      setTaxRoundingMethod(queryBasic.data.tax_rounding_method)
    }
  }, [queryBasic?.data])

  useEffect(() => {
    // neu khong su dung luong duyet, va status cua quota nam trong array disable,
    // thi phai chuyen ve page 404
    if (
      !parameterSettings?.get?.(ParameterResourceEnum.APPROVE_ROUTES) &&
      queryBasic?.data?.status &&
      STATUS_DISABLED_WHEN_OFF_APPROVE_ROUTE.indexOf(queryBasic.data.status) >
        -1
    ) {
      // todo check nhung action cua man show/edit. Khi thoa man dieu kien nay, thi khong cho thuc hien action
      router.replace('/404')
    }
  }, [parameterSettings, queryBasic])
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

  const hasEmbeddedContact =
    queryBasic?.data?.customer_contact_department !== undefined ||
    queryBasic?.data?.customer_contact_name !== undefined ||
    queryBasic?.data?.customer_contact_email !== undefined

  const { data: dataCustomerContact, isFetching: isFetchingCustomerContact } =
    useCustom({
      url: (queryBasic?.data?.customer_contact_id
        ? `${apiUrl}/customer-contacts/${queryBasic.data.customer_contact_id}`
        : '') as string,
      method: 'get',
      queryOptions: {
        enabled: !!queryBasic?.data?.customer_contact_id && !hasEmbeddedContact,
      },
    })

  const customerContactDisplay = hasEmbeddedContact
    ? {
        department_name: queryBasic?.data?.customer_contact_department ?? '---',
        contact_person_name: queryBasic?.data?.customer_contact_name ?? '---',
        email: queryBasic?.data?.customer_contact_email ?? '---',
      }
    : dataCustomerContact?.data?.data || dataCustomerContact?.data

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
    (resource: string, values: any, method?: any, successMessage?: string) => {
      mutate(
        {
          values,
          method: method ? method : 'put',
          url: `${apiUrl}/quotas/${resource}`,
          successNotification: (data) => {
            return notificationFunction(successMessage ?? data?.data.message)
          },
        },
        {
          onSuccess: () => {
            go({ to: '/quotas' })
          },
        },
      )
    },
    [t],
  )

  useEffect(() => {
    if (queryBasic?.data) {
      form.setFieldValue('reason', queryBasic.data.reason)
    }
  }, [queryBasic])

  const getAvailableActions = () => {
    const actions = []
    const data = queryBasic?.data
    const status = data?.status
    const isAuthor = data?.is_author
    const isAdmin = permission?.is_module_admin
    const hasRoute = data?.has_approval_route

    if (!data) return []

    if (hasRoute && status === QuotaStatus.Creating && (isAdmin || isAuthor)) {
      actions.push({
        value: 'send-to-approver',
        label: t('quotas.show.actions.request_approval'),
      })
    }

    if (hasRoute && status === QuotaStatus.WaitingApproval && data?.display) {
      actions.push({
        value: 'approve',
        label: t('quotas.show.actions.approve'),
      })
      actions.push({ value: 'reject', label: t('quotas.show.actions.reject') })
    }

    const canSend = hasRoute
      ? status === QuotaStatus.Approved
      : status === QuotaStatus.Creating
    if (canSend && (isAdmin || isAuthor)) {
      actions.push({
        value: 'send-to-customer',
        label: t('quotas.show.actions.send'),
      })
    }

    if (
      status === QuotaStatus.SentToCustomer &&
      (isAdmin || data?.display || isAuthor)
    ) {
      actions.push({
        value: 'resend-email-to-customer',
        label: t('quotas.show.actions.resend_email_to_customer'),
      })
      actions.push({
        value: 'mark-completed',
        label: t('quotas.show.actions.move_to_order'),
      })
      actions.push({
        value: 'cancel-quota',
        label: t('quotas.show.actions.move_to_cancel'),
      })
    }

    if (
      (status === QuotaStatus.Completed || status === QuotaStatus.Cancelled) &&
      (isAdmin || data?.display) &&
      !data?.has_agreed_price
    ) {
      actions.push({
        value: 'back-to-sent-customer',
        label: t('quotas.show.actions.move_to_send'),
      })
    }

    return actions
  }

  const currentActions = getAvailableActions()

  const [selectedValue, setSelectedValue] = useState<string | undefined>()

  useEffect(() => {
    if (currentActions.length > 0) {
      setSelectedValue(currentActions[0].value)
    }
  }, [queryBasic?.data])

  const handleUpdateStatus = () => {
    const action =
      currentActions.length === 1 ? currentActions[0].value : selectedValue

    if (!action) return

    const quotaId = queryBasic?.data?.id

    switch (action) {
      case 'send-to-approver':
        handleChangeStatus('send-to-approver', {
          quota_ids: [quotaId],
        })
        break

      case 'approve':
        handleChangeStatus('approval-steps', [
          {
            quota_id: quotaId,
            status: 'approved',
            comment: form.getFieldValue('reason'),
          },
        ])
        break

      case 'reject':
        handleChangeStatus('approval-steps', [
          {
            quota_id: quotaId,
            status: 'rejected',
            comment: form.getFieldValue('reason'),
          },
        ])
        break

      case 'send-to-customer':
        handleChangeStatus('send-to-customer', {
          quota_ids: [quotaId],
          status: 'sent_to_customer',
        })
        break

      case 'cancel-quota':
        handleChangeStatus('cancel-quota', {
          quota_ids: [quotaId],
        })
        break

      case 'mark-completed':
        handleChangeStatus('mark-completed', {
          quota_ids: [quotaId],
        })
        break

      case 'resend-email-to-customer':
        handleChangeStatus(
          'resend-email-to-customer',
          {
            quota_ids: [quotaId],
          },
          'post',
        )
        break

      case 'back-to-sent-customer':
        handleChangeStatus('back-to-sent-customer', {
          quota_ids: [quotaId],
        })
        break

      default:
        console.warn('Undefined', action)
        break
    }
  }

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/quotas">{boldText(t('estimates.estimates'))}</Link>
              ),
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
          <div className="flex justify-end gap-2">
            {currentActions.length > 0 && (
              <div className="flex gap-2">
                {currentActions.length === 1 ? (
                  <span className="flex items-center rounded-[6px] border border-gray-300 px-3 text-[15px] font-normal text-black">
                    {currentActions[0].label}
                  </span>
                ) : (
                  <Select
                    style={{ minWidth: '150px' }}
                    value={selectedValue}
                    onChange={(val) => setSelectedValue(val)}
                    options={currentActions}
                  />
                )}
                <Button
                  type="primary"
                  onClick={handleUpdateStatus}
                  autoInsertSpace={false}
                  disabled={
                    isFetching ||
                    isFetchingProducts ||
                    isFetchingHistory ||
                    isFetchingCustomerContact ||
                    !queryBasic?.data
                  }
                >
                  {t('quotas.action.update_status')}
                </Button>
              </div>
            )}
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
              color="primary"
              variant="outlined"
              onClick={async () => {
                await form.validateFields()
                setIsPdf(!isPdf)
              }}
              disabled={
                isFetching ||
                isFetchingProducts ||
                isFetchingHistory ||
                isFetchingCustomerContact ||
                !queryBasic?.data
              }
            >
              {t('quotas.show.preview')}
            </Button>
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
                    to: `/quotas/clone/${id}?actionType=VERSION`,
                  })
                }}
              >
                {t('quotas.actions.re_estimate')}
              </Button>
            )}

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
                  autoInsertSpace={false}
                >
                  {t('buttons.edit')}
                </Button>
              )}

            {(permission?.is_module_admin || queryBasic?.data?.is_author) &&
              (queryBasic?.data?.status === QuotaStatus.Creating ||
                queryBasic?.data?.status === QuotaStatus.Rejected ||
                queryBasic?.data?.status === QuotaStatus.Cancelled) && (
                <DeleteButton
                  icon={null}
                  autoInsertSpace={false}
                  onSuccess={() => {
                    go({
                      to: '/quotas',
                    })
                  }}
                />
              )}
          </div>
        </div>
      }
    >
      <Spin
        spinning={
          isFetching ||
          isFetchingProducts ||
          isFetchingHistory ||
          isFetchingCustomerContact
        }
      >
        <Form
          labelCol={{ xs: 24, sm: 8, md: 6, lg: 5, xl: 4 }}
          labelAlign="left"
          layout="horizontal"
          colon={false}
          autoComplete="off"
          form={formProps.form}
        >
          <BasicInfo
            data={queryBasic?.data}
            customerContact={customerContactDisplay}
          />
          <DetailInfo
            taxRoundingMethod={taxRoundingMethod}
            data={dataProducts?.data?.main_product}
            basicInfo={queryBasic?.data}
          />
          <OptionalInfo data={dataProducts?.data?.optional_product} />
          <Conditions note={queryBasic?.data?.note} />
          <Tags tags={queryBasic?.data?.tags} />
          <History data={dataHistory?.data} />

          {(permission?.is_module_admin || queryBasic?.data?.display) &&
            queryBasic?.data.status === QuotaStatus.WaitingApproval && (
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
          {
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer
                fileUrl={queryBasic?.data.pdf_path}
                plugins={[pdfViewerLayoutPlugin]}
              />
            </Worker>
          }

          {/* <PreviewPdf previewPdf={previewPdf} /> */}
        </div>
      </Modal>
    </PageContainer>
  )
}

export default QuotaDetail

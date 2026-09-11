/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getExpirationDate,
  getExpiryDate,
  getPaymentDueDateLabel,
  getQuotaStatusStyle,
} from '@components/cep/estimates/quotas/utils'
import { useApiUrl, useCustom, useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Form,
  message,
  Row,
} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'

interface BasicInfoExtendedProps {
  data: any
  showApplicablePeriod?: boolean
  agrredPriceValidTo?: string
  agreedPriceId?: number
  onUpdateExpiration?: (
    startNewDate?: dayjs.Dayjs,
    newEndDate?: dayjs.Dayjs,
    isUnlimited?: boolean,
  ) => void
  agreedPriceValidFrom?: string
  agreedPriceItem?: any
}

function BasicInfoExtended({
  data,
  showApplicablePeriod = false,
  agrredPriceValidTo,
  agreedPriceId,
  onUpdateExpiration,
  agreedPriceValidFrom,
  agreedPriceItem,
}: BasicInfoExtendedProps) {
  const t = useTranslate()
  const apiUrl = useApiUrl()
  const [isEditingPeriod, setIsEditingPeriod] = useState(false)
  const [periodValue, setPeriodValue] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null)
  const [isUnlimited, setIsUnlimited] = useState(false)

  const hasEmbeddedContact =
    data?.customer_contact_department !== undefined ||
    data?.customer_contact_name !== undefined ||
    data?.customer_contact_email !== undefined

  const { data: customerContactData } = useCustom({
    url: data?.customer_contact_id
      ? `${apiUrl}/customer-contacts/${data.customer_contact_id}`
      : '',
    method: 'get',
    queryOptions: {
      enabled: !!data?.customer_contact_id && !hasEmbeddedContact,
    },
  })

  const customerContact = hasEmbeddedContact
    ? {
        department_name: data?.customer_contact_department ?? '---',
        contact_person_name: data?.customer_contact_name ?? '---',
        email: data?.customer_contact_email ?? '---',
      }
    : customerContactData?.data?.data || customerContactData?.data

  const handleEditPeriod = () => {
    const end = agrredPriceValidTo ? dayjs(agrredPriceValidTo) : null
    const start = agreedPriceValidFrom ? dayjs(agreedPriceValidFrom) : null
    const isUnlimitedValue =
      agreedPriceItem?.is_unlimited ??
      (!agreedPriceValidFrom && !agrredPriceValidTo)
    setPeriodValue([start, end])
    setIsUnlimited(isUnlimitedValue)
    setIsEditingPeriod(true)
  }

  const handleSavePeriod = () => {
    // Validation: nếu không phải unlimited và không có end date, hiển thị lỗi
    if (!isUnlimited && !periodValue?.[1]) {
      message.error(
        '終了日を選択するか、「無制限」にチェックを入れてください。',
      )
      return
    }

    if (onUpdateExpiration) {
      // Luôn truyền periodValue (có thể là null nếu isUnlimited) và isUnlimited flag
      onUpdateExpiration(
        periodValue?.[0] ?? undefined,
        periodValue?.[1] ?? undefined,
        isUnlimited,
      )
    }
    setIsEditingPeriod(false)
  }

  const handleCancelEdit = () => {
    setIsEditingPeriod(false)
    setPeriodValue(null)
    setIsUnlimited(false)
  }

  return (
    <Card
      title={
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <div>{boldText(t('quotas.show.basic_info'), PRIMARY, 16)}</div>
          {showApplicablePeriod && agreedPriceItem?.is_active && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: '#000',
                  lineHeight: '32px',
                }}
              >
                適用期間
              </span>
              {isEditingPeriod ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <DatePicker
                        value={periodValue?.[0]}
                        onChange={(date) =>
                          setPeriodValue([date, periodValue?.[1] || null])
                        }
                        format="YYYY/MM/DD"
                        placeholder="開始日"
                        disabled={isUnlimited}
                        style={{ fontWeight: 'normal' }}
                        disabledDate={(current) =>
                          current && current < dayjs().startOf('day')
                        }
                      />
                      <span>〜</span>
                      <DatePicker
                        value={periodValue?.[1]}
                        onChange={(date) =>
                          setPeriodValue([periodValue?.[0] || null, date])
                        }
                        format="YYYY/MM/DD"
                        placeholder="終了日"
                        disabled={isUnlimited}
                        style={{ fontWeight: 'normal' }}
                        disabledDate={(current) => {
                          if (!current) return false
                          const today = dayjs().startOf('day')
                          const start = agreedPriceValidFrom
                            ? dayjs(agreedPriceValidFrom).startOf('day')
                            : today
                          return current < today || current < start
                        }}
                      />
                    </div>
                    <Checkbox
                      checked={isUnlimited}
                      onChange={(e) => {
                        const checked = e.target.checked
                        setIsUnlimited(checked)
                        if (!checked) {
                          const hasData = periodValue?.[0] || periodValue?.[1]
                          if (!hasData) {
                            const today = dayjs()
                            setPeriodValue([today, today])
                          }
                        }
                      }}
                    >
                      無制限
                    </Checkbox>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      height: '32px',
                    }}
                  >
                    <Button
                      type="primary"
                      size="small"
                      onClick={handleSavePeriod}
                      style={{
                        background: '#52c41a',
                        borderColor: '#52c41a',
                        borderRadius: '6px',
                        padding: '4px 12px',
                        height: 'auto',
                      }}
                    >
                      保存
                    </Button>
                    <Button
                      size="small"
                      onClick={handleCancelEdit}
                      style={{
                        borderRadius: '6px',
                        padding: '4px 12px',
                        height: 'auto',
                      }}
                    >
                      キャンセル
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <span
                    style={{
                      fontWeight: 'normal',
                      color: '#000',
                      lineHeight: '32px',
                      fontSize: 14,
                    }}
                  >
                    {agreedPriceItem?.is_unlimited ||
                    (!agreedPriceValidFrom && !agrredPriceValidTo)
                      ? '無制限'
                      : `${agreedPriceValidFrom ? dayjs(agreedPriceValidFrom).format('YYYY/MM/DD') : data?.created_at ? dayjs(data?.created_at).format('YYYY/MM/DD') : '---'} 〜 ${agrredPriceValidTo ? dayjs(agrredPriceValidTo).format('YYYY/MM/DD') : '---'}`}
                  </span>
                  <Button
                    type="link"
                    size="small"
                    onClick={handleEditPeriod}
                    disabled={!agreedPriceId}
                    style={{
                      background: '#1890ff',
                      color: 'white',
                      border: '1px solid #1890ff',
                      borderRadius: '6px',
                      padding: '4px 12px',
                      height: 'auto',
                    }}
                  >
                    更新
                  </Button>
                </>
              )}
            </div>
          )}
        </Flex>
      }
      style={{
        border: 'none',
      }}
      styles={{
        header: {
          padding: 0,
          minHeight: 0,
        },
        body: { padding: 0 },
      }}
    >
      <div className="mt-4">
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item label={boldText(t('quotas.show.estimate_number'))}>
              {data?.code}
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'status'}
              label={boldText(t('quotas.show.status'))}
            >
              {getQuotaStatusStyle(data?.status, t).text}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'customer_term'}
              label={boldText(t('quotas.show.customer_term'))}
            >
              {data?.customer_term === 'long_term'
                ? t('quotas.show.customer_terms.long_term')
                : t('quotas.show.customer_terms.short_term')}
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'category'}
              label={boldText(t('quotas.show.estimate_category'))}
            >
              {data?.category === 'merchandise'
                ? t('quotas.show.category.merchandise')
                : t('quotas.show.category.service')}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item label={boldText(t('quotas.show.title'))}>
              {data?.title}
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item label={boldText(t('quotas.show.customer'))}>
              {data?.customer_name}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'issue_date'}
              label={boldText(t('quotas.show.estimate_date'))}
            >
              {dayjs(data?.issue_date).format('YYYY/MM/DD')}
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              label={boldText(
                t(
                  'quotas.action.customer_contact_modal.selected_contact_label',
                ),
              )}
              style={{ marginBottom: 0 }}
            >
              <Row gutter={[8, 0]} align="middle">
                <Col
                  flex="auto"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t('quotas.action.customer_contact_modal.department_name')}:{' '}
                  {customerContact?.department_name || '---'}
                </Col>
                <Col
                  flex="auto"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t(
                    'quotas.action.customer_contact_modal.contact_person_name',
                  )}
                  : {customerContact?.contact_person_name || '---'}
                </Col>
                <Col
                  flex="auto"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t('quotas.action.customer_contact_modal.email')}:{' '}
                  {customerContact?.email || '---'}
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'delivery_method'}
              label={boldText(t('quotas.show.delivery_method'))}
            >
              {data?.delivery_method}
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              label={boldText(
                t('quotas.action.basic_info.fields.delivery_date'),
              )}
            >
              {data?.delivery_date
                ? dayjs(data.delivery_date).format('YYYY/MM/DD')
                : ''}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Form.Item
                name={'expiration_date'}
                label={boldText(t('quotas.show.expiration_date'))}
                style={{ marginBottom: 0, flex: 1 }}
              >
                {getExpirationDate(data?.expiration_date, t)}
                <span
                  style={{
                    whiteSpace: 'nowrap',
                    fontWeight: 500,
                    marginLeft: 10,
                  }}
                >
                  {data?.expiration_date &&
                    dayjs(
                      getExpiryDate(data?.expiration_date, data?.issue_date),
                    ).format('YYYY/MM/DD') + 'まで'}
                </span>
              </Form.Item>
            </div>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'payment_due_date'}
              label={boldText(t('quotas.show.payment_due_date'))}
            >
              {getPaymentDueDateLabel(data?.payment_due_date, t)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <div className="flex items-center">
              <Form.Item
                name="department"
                label={boldText(t('quotas.show.department_name'))}
                style={{ marginBottom: 0, flex: 1 }}
              >
                {agreedPriceItem?.creator?.department_name || '---'}
              </Form.Item>
            </div>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name="approve_route"
              label={boldText(t('quotas.show.approve_route'))}
              style={{ marginBottom: 0 }}
            >
              {data?.approve_route?.name || '---'}
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Card>
  )
}

export default BasicInfoExtended

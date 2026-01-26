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
import { Button, Card, Col, DatePicker, Form, Row, Tag } from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

const { RangePicker } = DatePicker

type ConsumptionTaxKey = 'exclusive' | 'inclusive' | 'external'

interface BasicInfoExtendedProps {
  data: any
  showApplicablePeriod?: boolean
  agrredPriceValidTo?: string
  agreedPriceId?: number
  onUpdateExpiration?: (newEndDate: dayjs.Dayjs) => void
  agreedPriceValidFrom?: string
}

function BasicInfoExtended({
  data,
  showApplicablePeriod = false,
  agrredPriceValidTo,
  agreedPriceId,
  onUpdateExpiration,
  agreedPriceValidFrom,
}: BasicInfoExtendedProps) {
  const t = useTranslate()
  const apiUrl = useApiUrl()
  const [isEditingPeriod, setIsEditingPeriod] = useState(false)
  const [periodValue, setPeriodValue] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null)

  const { data: customerContactData } = useCustom({
    url: data?.customer_contact_id
      ? `${apiUrl}/customer-contacts/${data.customer_contact_id}`
      : '',
    method: 'get',
    queryOptions: {
      enabled: !!data?.customer_contact_id,
    },
  })

  const customerContact =
    customerContactData?.data?.data || customerContactData?.data

  const consumptionTax: Record<ConsumptionTaxKey, string> = useMemo(() => {
    return {
      exclusive: t('tenant_settings.consumptionTax.taxExclusive'),
      inclusive: t('tenant_settings.consumptionTax.taxInclusive'),
      external: t('tenant_settings.consumptionTax.taxExempt'),
    }
  }, [t])

  const handleEditPeriod = () => {
    const end = agrredPriceValidTo ? dayjs(agrredPriceValidTo) : null
    const start = end ? end.add(1, 'day') : null
    setPeriodValue([start, null])
    setIsEditingPeriod(true)
  }

  const handleSavePeriod = () => {
    if (periodValue && periodValue[1] && onUpdateExpiration) {
      onUpdateExpiration(periodValue[1])
    }
    setIsEditingPeriod(false)
  }

  const handleCancelEdit = () => {
    setIsEditingPeriod(false)
    setPeriodValue(null)
  }

  return (
    <Card
      title={boldText('基本情報', PRIMARY, 16)}
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
      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText('見積番号')}
            style={{ marginTop: 20, marginBottom: 0 }}
          >
            <Row align="middle" gutter={20}>
              <Col>
                <Form.Item>{data?.code}</Form.Item>
              </Col>

              <Col>
                <Form.Item>
                  <Tag
                    color={getQuotaStatusStyle(data?.status, t).background}
                    style={{
                      color: getQuotaStatusStyle(data?.status, t).color,
                      marginRight: 0,
                    }}
                  >
                    {getQuotaStatusStyle(data?.status, t).text}
                  </Tag>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item name={'type'} label={boldText('見積種類')}>
            {data?.type === 'normal' ? '通常' : '販路限定'}
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item name={'category'} label={boldText('見積区分')}>
            {data?.category === 'merchandise' ? '物販' : '役務'}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item label={boldText('タイトル')}>{data?.title}</Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          {showApplicablePeriod && (
            <Form.Item label={boldText('適用期間')} style={{ marginBottom: 0 }}>
              <Row align="middle" gutter={20}>
                <Col>
                  <Form.Item>
                    {isEditingPeriod ? (
                      <RangePicker
                        value={periodValue}
                        onChange={(dates) => setPeriodValue(dates)}
                        format="YYYY/MM/DD"
                        style={{ width: '100%' }}
                        placeholder={['YYYY/MM/DD', 'YYYY/MM/DD']}
                      />
                    ) : (
                      <>
                        {agreedPriceValidFrom
                          ? dayjs(agreedPriceValidFrom).format('YYYY/MM/DD')
                          : data?.created_at
                            ? dayjs(data?.created_at).format('YYYY/MM/DD')
                            : '---'}{' '}
                        〜{' '}
                        {agrredPriceValidTo
                          ? dayjs(agrredPriceValidTo).format('YYYY/MM/DD')
                          : '---'}
                      </>
                    )}
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    {isEditingPeriod ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
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
                    ) : (
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
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          )}
        </Col>
      </Row>

      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item label={boldText('取引先')}>
            {data?.customer_name}
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(
              t('quotas.action.customer_contact_modal.selected_contact_label'),
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
                {t('quotas.action.customer_contact_modal.contact_person_name')}:{' '}
                {customerContact?.contact_person_name || '---'}
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

      <Row gutter={[100, 0]} wrap>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item name={'created_at'} label={boldText('見積日')}>
            {dayjs(data?.issue_date).format('YYYY/MM/DD')}
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item label={boldText('納入期日')}>
            {data?.delivery_date &&
              dayjs(data.delivery_date).format('YYYY/MM/DD')}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item name={'delivery_method'} label={boldText('納品方法')}>
            {data?.delivery_method}
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item name={'payment_due_date'} label={boldText('支払期日')}>
            {getPaymentDueDateLabel(data?.payment_due_date, t)}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Form.Item
              name={'expiration_date'}
              label={boldText('有効期限')}
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
                    getExpiryDate(data?.expiration_date, data?.created_at),
                  ).format('YYYY/MM/DD') + 'まで'}
              </span>
            </Form.Item>
          </div>
        </Col>

        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <div className="flex items-center">
            <Form.Item
              name="consumption_tax"
              label={boldText('消費税')}
              style={{ marginBottom: 0, flex: 1 }}
            >
              {consumptionTax[data?.consumption_tax as ConsumptionTaxKey]}
            </Form.Item>
            {/* <Form.Item
              label={t('tenant_settings.consumptionTax.taxRateLabel')}
              name="tax_rate"
              style={{ marginBottom: 0 }}
            ></Form.Item> */}
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default BasicInfoExtended

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getExpirationDate,
  getExpiryDate,
  getPaymentDueDateLabel,
  getQuotaStatusStyle,
} from '@components/cep/estimates/quotas/utils'
import { useTranslate } from '@refinedev/core'
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
  const [isEditingPeriod, setIsEditingPeriod] = useState(false)
  const [periodValue, setPeriodValue] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null)

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

      <Form.Item label={boldText('見積種類')} style={{ marginBottom: 0 }}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item>
              {data?.type === 'normal' ? '通常' : '販路限定'}
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('見積区分')} style={{ marginBottom: 0 }}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item>
              {data?.category === 'merchandise' ? '物販' : '役務'}
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('タイトル')} style={{ marginBottom: 0 }}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item>{data?.title}</Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('取引先')} style={{ marginBottom: 0 }}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item>{data?.customer_name}</Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('見積日')} style={{ marginBottom: 0 }}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item>
              {dayjs(data?.created_at).format('YYYY/MM/DD')}
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('納入期日')} style={{ marginBottom: 0 }}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item>
              {dayjs(data?.delivery_date).format('YYYY/MM/DD')}
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

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

      <Form.Item label={boldText('納品方法')} style={{ marginBottom: 0 }}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item>{data?.delivery_method}</Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('支払期日')} style={{ marginBottom: 0 }}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item name={'payment_due_date'}>
              {getPaymentDueDateLabel(data?.payment_due_date, t)}
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('有効期限')} style={{ marginBottom: 0 }}>
        <Row>
          <Col xs={24} sm={10} md={6} lg={4} xl={2}>
            <Form.Item name={'expiration_date'}>
              {getExpirationDate(data?.expiration_date, t)}
            </Form.Item>
          </Col>
          <Col xl={8}>
            <Form.Item>
              (
              {dayjs(
                getExpiryDate(data?.expiration_date, data?.created_at),
              ).format('YYYY/MM/DD')}
              )
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('消費税')} style={{ marginBottom: 0 }}>
        <Row>
          <Col xs={24} sm={10} md={6} lg={4} xl={2}>
            <Form.Item>
              {consumptionTax[data?.consumption_tax as ConsumptionTaxKey]}
            </Form.Item>
          </Col>
          {/* <Form.Item
            label={t('tenant_settings.consumptionTax.taxRateLabel')}
            layout="horizontal"
          >
            {data?.tax_rate}%
          </Form.Item> */}
        </Row>
      </Form.Item>
    </Card>
  )
}

export default BasicInfoExtended

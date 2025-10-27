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
import { Card, Col, Form, Row, Tag } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useMemo } from 'react'

dayjs.extend(utc)
dayjs.extend(timezone)

type ConsumptionTaxKey = 'exclusive' | 'inclusive' | 'external'

function BasicInfo({ data }: { data: any }) {
  const t = useTranslate()

  const consumptionTax: Record<ConsumptionTaxKey, string> = useMemo(() => {
    return {
      exclusive: t('tenant_settings.consumptionTax.taxExclusive'),
      inclusive: t('tenant_settings.consumptionTax.taxInclusive'),
      external: t('tenant_settings.consumptionTax.taxExempt'),
    }
  }, [t])

  return (
    <Card
      title={boldText(t('quotas.show.basic_info'), PRIMARY, 16)}
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
              <Tag
                color={getQuotaStatusStyle(data?.status, t).background}
                style={{
                  color: getQuotaStatusStyle(data?.status, t).color,
                  marginLeft: 10,
                }}
              >
                {getQuotaStatusStyle(data?.status, t).text}
              </Tag>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'type'}
              label={boldText(t('quotas.show.estimate_type'))}
            >
              {data?.type === 'normal'
                ? t('quotas.show.type.normal')
                : t('quotas.show.type.limited')}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'type'}
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

        <Row gutter={[100, 0]} wrap>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name={'created_at'}
              label={boldText(t('quotas.show.estimate_date'))}
            >
              {dayjs(data?.created_at).format('YYYY/MM/DD')}
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              label={boldText(
                t('quotas.action.basic_info.fields.delivery_date'),
              )}
            >
              {data?.delivery_date
                ? dayjs(data?.delivery_date)
                    .tz('Asia/Tokyo')
                    .format('YYYY/MM/DD')
                : ''}
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
              name={'payment_due_date'}
              label={boldText(t('quotas.show.payment_due_date'))}
            >
              {getPaymentDueDateLabel(data?.payment_due_date, t)}
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
                      getExpiryDate(data?.expiration_date, data?.created_at),
                    ).format('YYYY/MM/DD') + `${'まで'}`}
                </span>
              </Form.Item>
            </div>
          </Col>

          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <div className="flex items-center">
              <Form.Item
                name="consumption_tax"
                label={boldText(t('quotas.show.consumption_tax'))}
                style={{ marginBottom: 0, flex: 1 }}
              >
                {consumptionTax[data?.consumption_tax as ConsumptionTaxKey]}
              </Form.Item>
              {/* <Form.Item
                label={boldText(
                  t('tenant_settings.consumptionTax.taxRateLabel'),
                )}
                name="tax_rate"
                style={{ marginBottom: 0 }}
              ></Form.Item> */}
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  )
}

export default BasicInfo

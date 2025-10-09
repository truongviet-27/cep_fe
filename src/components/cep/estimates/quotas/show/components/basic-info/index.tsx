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
import { useMemo } from 'react'

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
      {/* <Form.Item
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
                color={getQuotaStatusStyle(data?.status).background}
                style={{
                  color: getQuotaStatusStyle(data?.status).color,
                  marginRight: 0,
                }}
              >
                {getQuotaStatusStyle(data?.status).text}
              </Tag>
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('見積区分')} style={{ marginBottom: 0 }}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item>
              {data?.type === 'normal' ? '通常' : '販路限定'}
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
          <Form.Item
            label={t('tenant_settings.consumptionTax.taxRateLabel')}
            layout="horizontal"
          >
            {data?.tax_rate}%
          </Form.Item>
        </Row>
      </Form.Item> */}

      <div className="mt-4">
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item label={boldText('見積番号')}>
              {data?.code}
              <Tag
                color={getQuotaStatusStyle(data?.status).background}
                style={{
                  color: getQuotaStatusStyle(data?.status).color,
                  marginLeft: 10,
                }}
              >
                {getQuotaStatusStyle(data?.status).text}
              </Tag>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item name={'type'} label={boldText('見積区分')}>
              {data?.type === 'normal' ? '通常' : '販路限定'}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item label={boldText('タイトル')}>{data?.title}</Form.Item>
          </Col>

          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item label={boldText('取引先')}>
              {data?.customer_name}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[100, 0]} wrap>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item name={'created_at'} label={boldText('見積日')}>
              {dayjs(data?.created_at).format('YYYY/MM/DD')}
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item label={boldText('納入期日')}>
              {dayjs(data?.delivery_date).format('YYYY/MM/DD')}
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
                  (
                  {dayjs(
                    getExpiryDate(data?.expiration_date, data?.created_at),
                  ).format('YYYY/MM/DD')}
                  )
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
                <span className="ml-20">
                  {boldText(t('tenant_settings.consumptionTax.taxRateLabel'))}
                  <span className="ml-10">{data?.tax_rate}%</span>
                </span>
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

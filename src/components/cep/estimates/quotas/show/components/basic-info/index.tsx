/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getExpirationDate,
  getPaymentDueDateLabel,
} from '@components/cep/estimates/quotas/utils'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Card, Col, Form, Row } from 'antd'
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
      headStyle={{
        padding: 0,
        minHeight: 0,
      }}
      bodyStyle={{
        padding: 0,
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
              {dayjs(data?.delivery_date).format('YYYY/MM/DD')}
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
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item name={'expiration_date'}>
              {getExpirationDate(data?.expiration_date, t)}
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={boldText('消費税')} style={{ marginBottom: 0 }}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Form.Item>
              {consumptionTax[data?.consumption_tax as ConsumptionTaxKey]}
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item
        label={boldText(t('tenant_settings.consumptionTax.taxRateLabel'))}
        style={{ marginBottom: 0 }}
      >
        <Row>
          <Col xs={24} sm={16} md={10} lg={8}>
            <Form.Item layout="horizontal">{data?.tax_rate}</Form.Item>
          </Col>
        </Row>
      </Form.Item>
    </Card>
  )
}

export default BasicInfo

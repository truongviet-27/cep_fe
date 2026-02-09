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

function BasicInfo({
  data,
  customerContact,
}: {
  data: any
  customerContact?: any
}) {
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
        {/* Row 1: 見積番号 + 見積区分 */}
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

        {/* Row 2: 取引区分 + 支払期日 */}
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
              name={'payment_due_date'}
              label={boldText(t('quotas.show.payment_due_date'))}
            >
              {getPaymentDueDateLabel(data?.payment_due_date, t)}
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3: タイトル + 消費税 */}
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item label={boldText(t('quotas.show.title'))}>
              {data?.title}
            </Form.Item>
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
            </div>
          </Col>
        </Row>

        {/* Row 4: 取引先 + 見積送付先 */}
        <Row gutter={[100, 0]}>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item label={boldText(t('quotas.show.customer'))}>
              {data?.customer_name}
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

        {/* Row 5: 見積日 + 納入期日 */}
        <Row gutter={[100, 0]} wrap>
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
                t('quotas.action.basic_info.fields.delivery_date'),
              )}
            >
              {data?.delivery_date
                ? dayjs(data?.delivery_date).format('YYYY/MM/DD')
                : ''}
            </Form.Item>
          </Col>
        </Row>

        {/* Row 6: 納品方法 + 部門 */}
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
              name="department"
              label={boldText(t('quotas.show.department_name'))}
            >
              {data?.department.name}
            </Form.Item>
          </Col>
        </Row>

        {/* Row 7: 有効期限 + 承認ルート */}
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
                    ).format('YYYY/MM/DD') + `${'まで'}`}
                </span>
              </Form.Item>
            </div>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name="approve_route"
              label={boldText(t('quotas.show.approve_route'))}
            >
              {data?.approve_route.name}
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Card>
  )
}

export default BasicInfo

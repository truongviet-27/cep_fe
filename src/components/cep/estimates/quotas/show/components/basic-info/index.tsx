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
import { Card, Col, Form, Row } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

function BasicInfo({
  data,
  customerContact,
}: {
  data: any
  customerContact?: any
}) {
  const t = useTranslate()

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
                ? dayjs(data?.delivery_date).format('YYYY/MM/DD')
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
                    ).format('YYYY/MM/DD') + `${'まで'}`}
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
            <Form.Item
              name={'delivery_method'}
              label={boldText(
                t('quotas.action.customer_contact_modal.department_name'),
              )}
            >
              {data?.department?.name || '---'}
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={10} lg={10} xl={10}>
            <Form.Item
              name="approve_route"
              label={boldText(t('quotas.show.approve_route'))}
            >
              {data?.approve_route?.name}
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Card>
  )
}

export default BasicInfo

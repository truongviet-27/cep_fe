import { getExpiryDate } from '@components/cep/estimates/quotas/utils'
import type { QuoteTemplateDetailType } from '@interfaces/quota-templates'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { DISABLE_LABEL, PRIMARY } from '@utility/color'
import {
  CONSUMPTION_TAX,
  EXPIRATION_DATE,
  PAYMENT_DUE_DATE,
} from '@utility/constant'
import { Col, Flex, Form, Row, Typography } from 'antd'
import dayjs from 'dayjs'

const { Title } = Typography

interface Props {
  detail: QuoteTemplateDetailType
}

const BasicInfo: React.FC<Props> = (props) => {
  const { detail } = props
  const t = useTranslate()

  return (
    <>
      <Title
        level={5}
        style={{ color: PRIMARY }}
        className="!mb-2 border-b-1 border-gray-200 pb-2 text-[14px]"
      >
        {t('quota_templates.form.titleBasicInfo')}
      </Title>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold text-gray-400">
          {t('quota_templates.form.label.quote_number')}
        </label>
      </Flex>
      <Row>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(t('quota_templates.form.label.quote_type'))}
          >
            {detail.type === 'normal' ? '通常' : '販路限定'}
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(t('quota_templates.form.label.quote_category'))}
          >
            {detail.category === 'merchandise' ? '物販' : '役務'}
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(t('quota_templates.form.label.template_name'))}
          >
            {detail.name}
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(t('quota_templates.form.label.description'))}
          >
            {detail.description}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(
              t('quota_templates.form.label.customer'),
              DISABLE_LABEL,
            )}
          />
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(
              t('quota_templates.form.label.quote_date'),
              DISABLE_LABEL,
            )}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(
              t('quota_templates.form.label.delivery_date'),
              DISABLE_LABEL,
            )}
          />
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(t('quota_templates.form.label.delivery_method'))}
          >
            {detail.delivery_method}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(t('quota_templates.form.label.payment_due_date'))}
          >
            {PAYMENT_DUE_DATE?.[detail.payment_due_date ?? '']?.label}
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(t('quota_templates.form.label.validity_period'))}
          >
            {EXPIRATION_DATE?.[detail.expiration_date ?? '']?.label}
            <span
              style={{
                whiteSpace: 'nowrap',
                fontWeight: 500,
                marginLeft: 10,
              }}
            >
              (
              {EXPIRATION_DATE?.[detail.expiration_date ?? ''] &&
                dayjs(
                  getExpiryDate(
                    EXPIRATION_DATE?.[detail.expiration_date ?? ''].value,
                    detail?.created_at,
                  ),
                ).format('YYYY/MM/DD') + `${'まで'}`}
              )
            </span>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(t('quota_templates.form.label.consumption_tax'))}
          >
            <Flex gap={30}>
              <Form.Item>
                {CONSUMPTION_TAX?.[detail.consumption_tax ?? '']?.label}
              </Form.Item>

              <Form.Item
                label={boldText(
                  t('quota_templates.form.label.consumption_tax_rate'),
                )}
              >
                {detail.tax_rate}%
              </Form.Item>
            </Flex>
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}

export default BasicInfo

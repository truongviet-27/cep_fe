import type { QuoteTemplateDetailType } from '@interfaces/quota-templates'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { DISABLE_LABEL, PRIMARY } from '@utility/color'
import { EXPIRATION_DATE, PAYMENT_DUE_DATE } from '@utility/constant'
import { Col, Flex, Form, Row, Typography } from 'antd'

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
            label={boldText(t('quotas.action.basic_info.fields.customer_term'))}
          >
            {detail.customer_term === 'short_term' ? '個別' : '継続'}
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
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}

export default BasicInfo

import CoreInput from '@components/common/core-input'
import { useTranslate } from '@refinedev/core'
import { ConsumptionTaxEnum } from '@sdk/hey-api'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import {
  CONSUMPTION_TAX,
  EXPIRATION_DATE,
  PAYMENT_DUE_DATE,
} from '@utility/constant'
import {
  Col,
  DatePicker,
  Flex,
  Form,
  InputNumber,
  Radio,
  Row,
  Select,
  Typography,
} from 'antd'

const { Title } = Typography

const BasicInfo = () => {
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
      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <CoreInput
            label={
              <label className="!text-gray-400">
                {t('quota_templates.form.label.quote_number')}
              </label>
            }
            required={true}
            layout="horizontal"
            disabled
          />
        </Col>
      </Row>
      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(t('quota_templates.form.label.quote_type'))}
            colon={false}
            required
            name="type"
            rules={[
              {
                required: true,
                message: t('validation.required'),
              },
            ]}
          >
            <Radio.Group
              defaultValue={'normal'}
              options={[
                {
                  value: 'normal',
                  label: '通常',
                },
                {
                  value: 'channel_limited',
                  label: '販路限定',
                },
              ]}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(t('quota_templates.form.label.quote_category'))}
            colon={false}
            required
            name="category"
            rules={[
              {
                required: true,
                message: t('validation.required'),
              },
            ]}
          >
            <Radio.Group
              defaultValue={'merchandise'}
              options={[
                {
                  value: 'merchandise',
                  label: t('quotas.action.basic_info.categories.merchandise'),
                },
                {
                  value: 'service',
                  label: t('quotas.action.basic_info.categories.service'),
                },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <CoreInput
            name="name"
            label={t('quota_templates.form.label.template_name')}
            required={true}
            layout="horizontal"
            rules={[
              {
                required: true,
                message: 'テンプレート名は必須です。',
              },
            ]}
          />
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <CoreInput
            name="description"
            label={t('quota_templates.form.label.description')}
            layout="horizontal"
          />
        </Col>
      </Row>

      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(
              <span className="!text-gray-400">
                {t('quota_templates.form.label.customer')}
              </span>,
            )}
            colon={false}
          >
            <Select disabled />
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(
              <span className="!text-gray-400">
                {t('quota_templates.form.label.quote_date')}
              </span>,
            )}
            colon={false}
          >
            <DatePicker placeholder="YYYY/MM/DD" className="!w-full" disabled />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(
              <span className="!text-gray-400">
                {t('quota_templates.form.label.delivery_date')}
              </span>,
            )}
            colon={false}
          >
            <DatePicker placeholder="YYYY/MM/DD" className="!w-full" disabled />
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <CoreInput
            name="delivery_method"
            label={t('quota_templates.form.label.delivery_method')}
            layout="horizontal"
          />
        </Col>
      </Row>
      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            name="payment_due_date"
            label={boldText(t('quota_templates.form.label.payment_due_date'))}
            colon={false}
          >
            <Select
              allowClear
              showSearch
              options={Object.values(PAYMENT_DUE_DATE)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} xl={10} xxl={10}>
          <Form.Item
            label={boldText(t('quota_templates.form.label.validity_period'))}
            colon={false}
          >
            <Flex>
              <Form.Item name="expiration_date">
                <Select
                  className="!w-28 xl:!w-56"
                  allowClear
                  showSearch
                  options={Object.values(EXPIRATION_DATE)}
                />
              </Form.Item>
            </Flex>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(t('quota_templates.form.label.consumption_tax'))}
          >
            <Flex gap={12}>
              <Form.Item name="consumption_tax" colon={false}>
                <Radio.Group
                  defaultValue={ConsumptionTaxEnum.EXCLUSIVE}
                  options={Object.values(CONSUMPTION_TAX)}
                />
              </Form.Item>
              <Form.Item
                name="tax_rate"
                layout="horizontal"
                label={boldText(
                  t('quota_templates.form.label.consumption_tax_rate'),
                )}
                labelCol={{ flex: '0 0 70px' }}
                normalize={(val) => val ?? 0}
                colon={false}
              >
                <InputNumber
                  controls={false}
                  min={0}
                  max={100}
                  className="!mr-2 !w-[75px]"
                  suffix="%"
                />
              </Form.Item>
            </Flex>
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}

export default BasicInfo

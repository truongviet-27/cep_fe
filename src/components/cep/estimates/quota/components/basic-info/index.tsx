import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
} from 'antd'

function BasicInfo() {
  const t = useTranslate()
  return (
    <Card
      title={'基本情報'}
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
        required
        style={{ marginTop: 20 }}
      >
        <Row align="middle" gutter={20}>
          <Col>
            <Form.Item rules={[]} name={'title'} required noStyle>
              <Input style={{ width: 240 }} />
            </Form.Item>
          </Col>
          <Col>
            <Button onClick={() => {}} loading={false}>
              {t('departments.create.auto_number')}
            </Button>
          </Col>
          <Col>
            <Button type="link" onClick={() => {}}>
              {t('departments.create.popup_number_setting')}
            </Button>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item name={'name'} required label={boldText('見積区分')}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Radio.Group
              defaultValue={'exclusive'}
              options={[
                {
                  value: 'exclusive',
                  label: '通常',
                },
                {
                  value: 'inclusive',
                  label: '販路限定',
                },
              ]}
            />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item required label={boldText('タイトル')}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Input />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={<span className="font-bold">取引先</span>}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Select allowClear showSearch />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={<span className="font-bold">見積日</span>}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <DatePicker style={{ width: '75%' }} />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={<span className="font-bold">納入期日</span>}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <DatePicker style={{ width: '75%' }} />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label={<span className="font-bold">納品方法</span>}>
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Input />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item
        name={'payment_due_date'}
        label={<span className="font-bold">支払期日</span>}
      >
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Select
              allowClear
              showSearch
              options={[
                {
                  value: 'monthly_25',
                  label: t(
                    'tenant_settings.paymentDueDate.options.monthly_25th',
                  ),
                },
                {
                  value: 'monthly_10',
                  label: t(
                    'tenant_settings.paymentDueDate.options.monthly_10th',
                  ),
                },
                {
                  value: 'net_30_from_delivery',
                  label: t(
                    'tenant_settings.paymentDueDate.options.30_days_after_delivery',
                  ),
                },
                {
                  value: 'net_30_from_invoice',
                  label: t(
                    'tenant_settings.paymentDueDate.options.30_days_after_invoice',
                  ),
                },
                {
                  value: 'end_of_month_next',
                  label: t(
                    'tenant_settings.paymentDueDate.options.eom_next_eom',
                  ),
                },
                {
                  value: 'end_of_month_after_next',
                  label: t(
                    'tenant_settings.paymentDueDate.options.eom_next_next_eom',
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item
        name={'expiration_date'}
        label={<span className="font-bold">有効期限</span>}
      >
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Select
              allowClear
              showSearch
              options={[
                {
                  value: 'days_7',
                  label: t('tenant_settings.validityPeriod.options.days_7'),
                },
                {
                  value: 'days_14',
                  label: t('tenant_settings.validityPeriod.options.days_14'),
                },
                {
                  value: 'days_30',
                  label: t('tenant_settings.validityPeriod.options.days_30'),
                },
                {
                  value: 'days_45',
                  label: t('tenant_settings.validityPeriod.options.days_45'),
                },
                {
                  value: 'days_60',
                  label: t('tenant_settings.validityPeriod.options.days_60'),
                },
                {
                  value: 'months_3',
                  label: t('tenant_settings.validityPeriod.options.months_3'),
                },
                {
                  value: 'months_6',
                  label: t('tenant_settings.validityPeriod.options.months_6'),
                },
                {
                  value: 'years_1',
                  label: t('tenant_settings.validityPeriod.options.year_1'),
                },
              ]}
            />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item
        label={<span className="font-bold">消費税</span>}
        name="consumption_tax"
      >
        <Row>
          <Col xs={24} sm={16} md={10} lg={8} xl={8}>
            <Radio.Group
              defaultValue={'exclusive'}
              options={[
                {
                  value: 'exclusive',
                  label: t('tenant_settings.consumptionTax.taxExclusive'),
                },
                {
                  value: 'inclusive',
                  label: t('tenant_settings.consumptionTax.taxInclusive'),
                },
                {
                  value: 'external',
                  label: t('tenant_settings.consumptionTax.taxExempt'),
                },
              ]}
            />
          </Col>
        </Row>
      </Form.Item>
      <Form.Item
        name="tax_rate"
        label={
          <span className="font-bold">
            {t('tenant_settings.consumptionTax.taxRateLabel')}
          </span>
        }
        layout="horizontal"
      >
        <Row>
          <Col xs={24} sm={16} md={10} lg={8}>
            <InputNumber controls={false} min={0} max={100} addonAfter="%" />
          </Col>
        </Row>
      </Form.Item>
    </Card>
  )
}

export default BasicInfo

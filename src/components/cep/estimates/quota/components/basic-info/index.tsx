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
import React from 'react'

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
        minHeight: 'none',
      }}
      bodyStyle={{
        padding: 0,
      }}
    >
      <Form.Item
        label={boldText(t('customers.fields.code'))}
        required
        style={{ marginTop: 20 }}
      >
        <Row align="middle" gutter={20}>
          <Col>
            <Form.Item rules={[]} name="customer_code" required noStyle>
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

      <Form.Item required label={<span className="font-bold">見積区分</span>}>
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
      </Form.Item>

      <Form.Item required label={<span className="font-bold">タイトル</span>}>
        <Input />
      </Form.Item>

      <Form.Item label={<span className="font-bold">取引先</span>}>
        <Select allowClear showSearch />
      </Form.Item>

      <Form.Item label={<span className="font-bold">見積日</span>}>
        <DatePicker />
      </Form.Item>

      <Form.Item label={<span className="font-bold">納入期日</span>}>
        <DatePicker />
      </Form.Item>

      <Form.Item label={<span className="font-bold">納品方法</span>}>
        <Input />
      </Form.Item>

      <Form.Item label={<span className="font-bold">支払期日</span>}>
        <Select allowClear showSearch />
      </Form.Item>

      <Form.Item label={<span className="font-bold">有効期限</span>}>
        <Select allowClear showSearch />
      </Form.Item>

      <Form.Item
        label={<span className="font-bold">消費税</span>}
        name="consumption_tax"
      >
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
      </Form.Item>
      <Form.Item
        name="tax_rate"
        label={
          <span className="font-bold">
            {t('tenant_settings.consumptionTax.taxRateLabel')}
          </span>
        }
        layout="horizontal"
        style={{
          marginBottom: 0,
          marginLeft: 'auto',
        }}
        getValueFromEvent={(value) => Number(value)}
      >
        <Row>
          <InputNumber controls={false} min={0} max={100} addonAfter="%" />
        </Row>
      </Form.Item>
    </Card>
  )
}

export default BasicInfo

import { useTranslate } from '@refinedev/core'
import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
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
        marginTop: 40,
      }}
      headStyle={{
        padding: 0,
        minHeight: 'none',
      }}
      bodyStyle={{
        padding: 0,
      }}
    >
      <Col>
        <Form.Item
          colon={false}
          required
          label={<span className="font-bold">見積番号</span>}
        >
          <Input />
        </Form.Item>
      </Col>

      <Form.Item
        colon={false}
        required
        label={<span className="font-bold">見積区分</span>}
      >
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

      <Form.Item
        colon={false}
        required
        label={<span className="font-bold">タイトル</span>}
      >
        <Input />
      </Form.Item>

      <Form.Item
        colon={false}
        label={<span className="font-bold">取引先</span>}
      >
        <Select allowClear showSearch />
      </Form.Item>

      <Form.Item
        colon={false}
        label={<span className="font-bold">見積日</span>}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        colon={false}
        label={<span className="font-bold">納入期日</span>}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        colon={false}
        label={<span className="font-bold">納品方法</span>}
      >
        <Input />
      </Form.Item>

      <Form.Item
        colon={false}
        label={<span className="font-bold">支払期日</span>}
      >
        <Select allowClear showSearch />
      </Form.Item>

      <Form.Item
        colon={false}
        label={<span className="font-bold">有効期限</span>}
      >
        <Select allowClear showSearch />
      </Form.Item>

      <Form.Item
        colon={false}
        label={<span className="font-bold">消費税</span>}
        name="consumption_tax"
        style={{
          margin: 0,
        }}
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
        colon={false}
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
        <InputNumber controls={false} min={0} max={100} addonAfter="%" />
      </Form.Item>
    </Card>
  )
}

export default BasicInfo

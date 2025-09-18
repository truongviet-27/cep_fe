'use client'

import { DownOutlined } from '@ant-design/icons'
import type { useCustomerCreateForm } from '@app/(auth)/(layout-breadcrumb)/customers/create/use-customer'
import boldText from '@utility/bold-text'
import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Typography,
} from 'antd'
import React from 'react'

import styles from '../styles.module.css'

const { Title } = Typography
const { Panel } = Collapse

function BasicInformation(props: ReturnType<typeof useCustomerCreateForm>) {
  const {
    t,
    rule,
    handleAutoNumber,
    isCodeGenLoading,
    modalFormProps,
    codeGenData,
  } = props

  return (
    <Collapse
      expandIconPosition="end"
      defaultActiveKey={['1']}
      className={`mb-4 ${styles.formPanel}`}
      expandIcon={({ isActive }) => (
        <DownOutlined
          style={{ transition: '0.3s' }}
          rotate={isActive ? 0 : 180}
        />
      )}
    >
      <Panel
        header={<Title level={5}>{t('customers.show.basic_info')}</Title>}
        key="1"
      >
        <Form.Item label={boldText(t('customers.fields.code'))} required>
          <Row align="middle" gutter={8}>
            <Col>
              <Form.Item rules={[rule]} name="customer_code" required noStyle>
                <Input style={{ width: 240 }} />
              </Form.Item>
            </Col>
            <Col>
              <Button onClick={handleAutoNumber} loading={isCodeGenLoading}>
                {t('departments.create.auto_number')}
              </Button>
            </Col>
            <Col>
              <Button
                type="link"
                onClick={() => modalFormProps.show(codeGenData?.data?.id)}
              >
                {t('departments.create.popup_number_setting')}
              </Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.fields.company_classification'))}
          name="company_classification"
          rules={[rule]}
          initialValue="corporation"
        >
          <Radio.Group>
            <Radio value="corporation">
              {t('customers.enums.corporation')}
            </Radio>
            <Radio value="individual">{t('customers.enums.individual')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.fields.name'))}
          name="name"
          rules={[rule]}
          required
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.fields.name_kana'))}
          name="customer_name_by_kana"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.fields.country'))}
          name="country"
          rules={[rule]}
        >
          <Select
            placeholder={t('placeholders.select')}
            options={[{ value: 'JP', label: '日本' }]}
            style={{ maxWidth: 560 }}
          />
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.fields.corporate_number'))}
          name="corporate_number"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.fields.unit_price_rank'))}
          name="price_rank_id"
          rules={[rule]}
          required
        >
          <Select
            placeholder={t('placeholders.select')}
            options={[{ value: 1, label: 'Rank A' }]}
            style={{ maxWidth: 560 }}
          />
        </Form.Item>
      </Panel>
    </Collapse>
  )
}

export default BasicInformation

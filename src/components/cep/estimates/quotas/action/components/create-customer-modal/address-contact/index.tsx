/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line simple-import-sort/imports */

import { DownOutlined } from '@ant-design/icons'
import styles from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/styles.module.css'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import requiredLabel from '@utility/required-label'
import { validateCustomerRule } from '@validate/customer'
import { Collapse, Form, Input } from 'antd'
import React from 'react'

export default function AddressContact() {
  const t = useTranslate()
  const rule = validateCustomerRule(t)
  const { Panel } = Collapse

  return (
    <Collapse
      expandIconPosition="end"
      defaultActiveKey={['1']}
      className={`mb-4 ${styles.formPanel}`}
      expandIcon={({ isActive }) => (
        <DownOutlined
          style={{ transition: '0.3s' }}
          rotate={isActive ? 180 : 0}
        />
      )}
    >
      <Panel header={boldText(t('customers.show.address_contact'))} key="1">
        <Form.Item
          required
          label={boldText(requiredLabel(t('customers.show.postal_code')))}
          name="post_code"
          rules={[rule]}
        >
          <Input
            style={{ maxWidth: 560 }}
            placeholder={t('customers.show.postal_code_placeholder')}
          />
        </Form.Item>
        <Form.Item
          required
          label={boldText(requiredLabel(t('customers.show.address')))}
          name="address"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>
      </Panel>
    </Collapse>
  )
}

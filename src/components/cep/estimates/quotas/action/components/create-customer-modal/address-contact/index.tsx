/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line simple-import-sort/imports */

import { DownOutlined } from '@ant-design/icons'
import styles from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/styles.module.css'
import { CoreAutocompleteAPI } from '@components/common/autocomplete-api'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { validateCustomerRule } from '@validate/customer'
import { Col, Collapse, Form, Input, Row } from 'antd'
import React from 'react'

export default function AddressContact() {
  const t = useTranslate()
  const rule = validateCustomerRule(t)
  const { Panel } = Collapse
  const form = Form.useFormInstance()

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
          label={boldText(t('customers.show.postal_code'))}
          name="post_code"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>
        <Form.Item
          required
          label={boldText(t('customers.show.address'))}
          name="address"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>
        <Form.Item
          label={boldText(t('customers.show.department_in_charge'))}
          required
        >
          <Row gutter={8} align={'middle'}>
            <Col>
              <CoreAutocompleteAPI
                name={'department_in_charge_id'}
                rules={[rule]}
                labelInValue={false}
                resource="departments"
                placeholder={t(
                  'quotas.action.detail_info.placeholders.product_search',
                )}
                layout="horizontal"
                style={{ maxWidth: 560, width: '250px' }}
                defaultValue={{
                  value: form.getFieldValue('department_in_charge_id'),
                  label: form.getFieldValue(['department_in_charge', 'name']),
                }}
                onChangeValue={(valueOption) => {
                  form.setFieldValue(
                    ['department_in_charge', 'deleted_at'],
                    null,
                  )
                  form.setFieldValue(
                    ['department_in_charge', 'name'],
                    valueOption.name,
                  )
                }}
                overwriteOptionsOnSearch={true}
              />
            </Col>

            <Col>
              <Form.Item className="ant-form-item-hidden-margin">
                ※当社の部署
              </Form.Item>
            </Col>
            {form.getFieldValue(['department_in_charge', 'deleted_at']) && (
              <span className="ml-4 rounded-full bg-red-500 px-2 text-white">
                {t('departments.is_deleted')}
              </span>
            )}
          </Row>
        </Form.Item>
      </Panel>
    </Collapse>
  )
}

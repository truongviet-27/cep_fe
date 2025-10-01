'use client'

import { DownOutlined } from '@ant-design/icons'
import type { useCustomerCreate } from '@app/(auth)/(layout-breadcrumb)/customers/create/use-customer-create'
import type { useCustomerEdit } from '@app/(auth)/(layout-breadcrumb)/customers/edit/[id]/use-customers-edit'
import { useSelect } from '@refinedev/antd'
import boldText from '@utility/bold-text'
import { FORMAT_DATE } from '@utility/instances'
import { fieldDistinctionOptions, industryOptions } from '@utility/options'
import {
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import React from 'react'

import styles from '../styles.module.css'

const { Title } = Typography
const { Panel } = Collapse

function AddressContact(
  props: ReturnType<typeof useCustomerCreate | typeof useCustomerEdit>,
) {
  const { t, rule, form } = props

  const industry = Form.useWatch('industry', form)

  const { selectProps: departmentSelectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'name',
  })

  const isOtherSelected = industry === null

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
      <Panel
        header={<Title level={5}>{t('customers.show.address_contact')}</Title>}
        key="1"
      >
        <Form.Item
          label={boldText(t('customers.show.postal_code'))}
          name="post_code"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.show.address'))}
          name="address"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.show.building_name'))}
          name="building"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.show.phone'))}
          name="phone"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.show.fax'))}
          name="fax"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.delivery.email'))}
          name="mail"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.show.industry'))}
          name="temp_industry"
          rules={[rule]}
          hidden={!isOtherSelected}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.show.industry'))}
          name="industry"
          rules={[rule]}
          hidden={isOtherSelected}
        >
          <Select
            placeholder={t('placeholders.select')}
            options={industryOptions}
            style={{ maxWidth: 560 }}
          />
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.show.listing_classification'))}
          name="listing_classification"
          rules={[rule]}
        >
          <Select
            placeholder={t('placeholders.select')}
            options={fieldDistinctionOptions}
            style={{ maxWidth: 560 }}
          />
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.show.date_of_establishment'))}
          name="date_of_establishment"
          rules={[rule]}
          getValueProps={(value) => ({
            value: value ? dayjs(value, FORMAT_DATE) : null,
          })}
        >
          <DatePicker
            placeholder={FORMAT_DATE}
            // format={FORMAT_DATE}
            onChange={(date) =>
              date ? dayjs(date, FORMAT_DATE).toString() : null
            }
          />
        </Form.Item>

        <Form.Item label={boldText(t('customers.show.department_in_charge'))}>
          <Row gutter={8} align={'middle'}>
            <Col>
              <Form.Item name="department_in_charge" rules={[rule]}>
                <Select
                  {...departmentSelectProps}
                  placeholder={t('placeholders.select')}
                  style={{ minWidth: 300 }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>※当社の部署</Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Panel>
    </Collapse>
  )
}

export default AddressContact

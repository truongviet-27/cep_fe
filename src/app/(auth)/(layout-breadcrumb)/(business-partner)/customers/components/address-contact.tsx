'use client'
import { DownOutlined } from '@ant-design/icons'
import type { useCustomerCreate } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/create/use-customer-create'
import type { useCustomerEdit } from '@app/(auth)/(layout-breadcrumb)/(business-partner)/customers/edit/[id]/use-customers-edit'
import { CoreAutocompleteAPI } from '@components/common/autocomplete-api'
import boldText from '@utility/bold-text'
import { FORMAT_DATE_CROSS } from '@utility/instances'
import {
  fieldDistinctionOptions,
  INDUSTRY_OTHER_VALUE,
  industryOptions,
} from '@utility/options'
import requiredLabel from '@utility/required-label'
import { Col, Collapse, DatePicker, Form, Input, Row, Select } from 'antd'
import dayjs from 'dayjs'

import styles from '../styles.module.css'

const { Panel } = Collapse

function AddressContact(
  props: ReturnType<typeof useCustomerCreate | typeof useCustomerEdit>,
) {
  const { t, rule, form } = props

  const industry = Form.useWatch('industry', form)
  const temp_industry = Form.useWatch('temp_industry', form)

  const isOtherSelected =
    industry === INDUSTRY_OTHER_VALUE ||
    (industry != null &&
      industry !== '' &&
      !industryOptions.some(({ value }) => value === industry))

  if (
    industry != null &&
    industry !== '' &&
    industry !== INDUSTRY_OTHER_VALUE &&
    !industryOptions.some(({ value }) => value === industry) &&
    !temp_industry
  ) {
    form.setFieldValue('temp_industry', industry)
    form.setFieldValue('industry', INDUSTRY_OTHER_VALUE)
  }
  Form.useWatch('department_in_charge_id')

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
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
        >
          <Input
            style={{ maxWidth: 560 }}
            placeholder={t('customers.show.postal_code_placeholder')}
          />
        </Form.Item>
        <Form.Item
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
          required
          label={boldText(requiredLabel(t('customers.show.address')))}
          name="address"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>
        <Form.Item
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
          label={boldText(t('customers.show.building_name'))}
          name="building"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>
        <Form.Item
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
          label={boldText(t('customers.show.phone'))}
          name="phone"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>
        <Form.Item
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
          label={boldText(t('customers.show.fax'))}
          name="fax"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>

        <Form.Item
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
          label={boldText(t('customers.delivery.email'))}
          name="mail"
          rules={[rule]}
        >
          <Input style={{ maxWidth: 560 }} />
        </Form.Item>

        <Form.Item
          label={boldText(t('customers.show.industry'))}
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
        >
          <Row align="middle" gutter={8}>
            <Col>
              <Form.Item name="industry" rules={[rule]}>
                <Select
                  placeholder={t('placeholders.select')}
                  options={industryOptions}
                  style={{ minWidth: 200 }}
                  onSelect={(value) => {
                    console.log(value, 'eeee')
                  }}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name="temp_industry"
                rules={[rule]}
                hidden={!isOtherSelected}
              >
                <Input style={{ maxWidth: 260 }} />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          className={'!-mt-3'}
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
          label={boldText(t('customers.show.listing_classification'))}
          name="listing_classification"
          rules={[rule]}
        >
          <Select
            placeholder={t('placeholders.select')}
            options={fieldDistinctionOptions}
            style={{ maxWidth: 560 }}
            allowClear
          />
        </Form.Item>
        <Form.Item
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
          label={boldText(t('customers.show.date_of_establishment'))}
          name="date_of_establishment"
          rules={[rule]}
          getValueProps={(value) => ({
            value: value ? dayjs(value, FORMAT_DATE_CROSS) : null,
          })}
        >
          <DatePicker
            placeholder={FORMAT_DATE_CROSS}
            format={FORMAT_DATE_CROSS}
            onChange={(date) =>
              date ? dayjs(date, FORMAT_DATE_CROSS).toString() : null
            }
          />
        </Form.Item>
        <Form.Item
          labelCol={{ xs: 24, sm: 24, md: 4, lg: 3, xl: 2 }}
          label={boldText(t('customers.show.department_in_charge'))}
        >
          <Row gutter={8} align={'middle'}>
            <Col>
              <CoreAutocompleteAPI
                name={'department_in_charge_id'}
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
                    valueOption?.name ?? null,
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

export default AddressContact

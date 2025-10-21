/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useTranslate } from '@refinedev/core'
import { Checkbox, Col, Form, Input, Select, Typography } from 'antd'

const { Text } = Typography

function Left() {
  const t = useTranslate()
  const form = Form.useFormInstance()
  const { getFieldValue } = form

  return (
    <Col xs={24} xl={12}>
      <div className="rounded-lg border border-[#D0D0D0]">
        <div className="flex h-[100px] border-b-[1px] border-solid border-[#D0D0D0]">
          <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
            <Text strong>{t('tenant_settings.greeting.label')}</Text>
          </div>
          <div className="flex-1 content-center px-4">
            <Form.Item
              name="greeting"
              style={{
                marginBottom: 0,
              }}
            >
              <Input
                placeholder={t('tenant_settings.greeting.placeholder')}
                style={{ height: 60, width: '75%' }}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
          <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
            <Text strong>{t('tenant_settings.deliveryDate.label')}</Text>
          </div>
          <div className="flex flex-1 content-center items-center">
            <div className="solid h-full w-3/4 content-center border-r-[1px] border-[#D0D0D0] px-4"></div>

            <Form.Item
              style={{
                marginBottom: 0,
                scale: 1.3,
                padding: '0 40px',
              }}
              name={'is_enable_delivery'}
              valuePropName="checked"
            >
              <Checkbox checked={getFieldValue('is_enable_delivery')}>
                {t('tenant_settings.hide')}
              </Checkbox>
            </Form.Item>
          </div>
        </div>

        <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
          <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
            <Text strong>{t('tenant_settings.deliveryMethod.label')}</Text>
          </div>
          <div className="flex flex-1 content-center items-center">
            <div className="solid h-full w-3/4 content-center border-r-[1px] border-[#D0D0D0] px-4">
              <Form.Item
                name="default_delivery_method"
                style={{
                  margin: 0,
                }}
              >
                <Input
                  placeholder={t('tenant_settings.deliveryMethod.placeholder')}
                  style={{ width: '70%' }}
                />
              </Form.Item>
            </div>

            <Form.Item
              style={{
                marginBottom: 0,
                scale: 1.3,
                padding: '0 40px',
              }}
              valuePropName="checked"
              name={'is_enable_delivery_method'}
            >
              <Checkbox checked={getFieldValue('is_enable_delivery_method')}>
                {t('tenant_settings.hide')}
              </Checkbox>
            </Form.Item>
          </div>
        </div>

        <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
          <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
            <Text strong>{t('tenant_settings.paymentDueDate.label')}</Text>
          </div>
          <div className="flex flex-1 content-center items-center">
            <div className="solid h-full w-3/4 content-center border-r-[1px] border-[#D0D0D0] px-4">
              <Form.Item
                name="default_payment_due_date"
                style={{
                  margin: 0,
                }}
              >
                <Select
                  placeholder={t('placeholders.select')}
                  style={{ width: '70%' }}
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
              </Form.Item>
            </div>

            <Form.Item
              style={{
                marginBottom: 0,
                scale: 1.3,
                padding: '0 40px',
              }}
              valuePropName="checked"
              name={'is_enable_payment_due_date'}
            >
              <Checkbox checked={getFieldValue('is_enable_payment_due_date')}>
                {t('tenant_settings.hide')}
              </Checkbox>
            </Form.Item>
          </div>
        </div>

        <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
          <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
            <Text strong>{t('tenant_settings.validityPeriod.label')}</Text>
          </div>
          <div className="flex flex-1 content-center items-center">
            <div className="solid h-full w-3/4 content-center border-r-[1px] border-[#D0D0D0] px-4">
              <Form.Item
                name="default_expiration_date"
                style={{
                  margin: 0,
                }}
              >
                <Select
                  placeholder={t('placeholders.select')}
                  style={{ width: '70%' }}
                  options={[
                    {
                      value: 'days_7',
                      label: t('tenant_settings.validityPeriod.options.days_7'),
                    },
                    {
                      value: 'days_14',
                      label: t(
                        'tenant_settings.validityPeriod.options.days_14',
                      ),
                    },
                    {
                      value: 'days_30',
                      label: t(
                        'tenant_settings.validityPeriod.options.days_30',
                      ),
                    },
                    {
                      value: 'days_45',
                      label: t(
                        'tenant_settings.validityPeriod.options.days_45',
                      ),
                    },
                    {
                      value: 'days_60',
                      label: t(
                        'tenant_settings.validityPeriod.options.days_60',
                      ),
                    },
                    {
                      value: 'months_3',
                      label: t(
                        'tenant_settings.validityPeriod.options.months_3',
                      ),
                    },
                    {
                      value: 'months_6',
                      label: t(
                        'tenant_settings.validityPeriod.options.months_6',
                      ),
                    },
                    {
                      value: 'years_1',
                      label: t('tenant_settings.validityPeriod.options.year_1'),
                    },
                  ]}
                />
              </Form.Item>
            </div>

            <Form.Item
              style={{
                marginBottom: 0,
                scale: 1.3,
                padding: '0 40px',
              }}
              valuePropName="checked"
              name={'is_enable_expiration_date'}
            >
              <Checkbox checked={getFieldValue('is_enable_expiration_date')}>
                {t('tenant_settings.hide')}
              </Checkbox>
            </Form.Item>
          </div>
        </div>

        <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
          <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
            <Text strong>{t('tenant_settings.companyName.label')}</Text>
          </div>
          <div className="flex-1 content-center px-4">
            <Form.Item
              name="company_name"
              style={{
                marginBottom: 0,
              }}
            >
              <Input style={{ width: '50%' }} />
            </Form.Item>
          </div>
        </div>

        <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
          <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
            <Text strong>{t('tenant_settings.postalCode.label')}</Text>
          </div>
          <div className="flex-1 content-center px-4">
            <Form.Item
              name="postal_code"
              style={{
                marginBottom: 0,
              }}
            >
              <Input style={{ width: '50%' }} />
            </Form.Item>
          </div>
        </div>

        <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
          <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
            <Text strong>{t('tenant_settings.address.label')}</Text>
          </div>
          <div className="flex-1 content-center px-4">
            <Form.Item
              name="address"
              style={{
                marginBottom: 0,
              }}
            >
              <Input style={{ width: '50%' }} />
            </Form.Item>
          </div>
        </div>

        <div className="flex h-[80px]">
          <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
            <Text strong>{t('tenant_settings.phoneNumber.label')}</Text>
          </div>
          <div className="flex-1 content-center px-4">
            <Form.Item
              name="phone_number"
              style={{
                marginBottom: 0,
              }}
            >
              <Input style={{ width: '50%' }} />
            </Form.Item>
          </div>
        </div>
      </div>
    </Col>
  )
}

export default Left

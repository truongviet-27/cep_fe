import CoreInput from '@components/common/core-input'
import { useTranslate } from '@refinedev/core'
import { ConsumptionTaxEnum } from '@sdk/hey-api'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import {
  DatePicker,
  Flex,
  Form,
  InputNumber,
  Radio,
  Select,
  Typography,
} from 'antd'

const { Title } = Typography

const BasicInfo: React.FC = () => {
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
      <CoreInput
        label={
          <label className="!text-gray-400">
            {t('quota_templates.form.label.quote_number')}
          </label>
        }
        required={true}
        layout="horizontal"
        classNameInput="!w-64"
        disabled
      />
      <Form.Item
        label={boldText(t('quota_templates.form.label.quote_category'))}
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
      <CoreInput
        name="name"
        label={t('quota_templates.form.label.template_name')}
        required={true}
        layout="horizontal"
        classNameInput="!w-96"
        rules={[
          {
            required: true,
            message: t('validation.required'),
          },
        ]}
      />
      <CoreInput
        name="description"
        label={t('quota_templates.form.label.description')}
        layout="horizontal"
        classNameInput="!w-96"
      />
      <Form.Item
        label={boldText(
          <span className="!text-gray-400">
            {t('quota_templates.form.label.customer')}
          </span>,
        )}
        colon={false}
      >
        <Select className="!w-96" disabled />
      </Form.Item>
      <Form.Item
        label={boldText(
          <span className="!text-gray-400">
            {t('quota_templates.form.label.quote_date')}
          </span>,
        )}
        colon={false}
      >
        <DatePicker placeholder="YYYY/MM/DD" className="!w-64" disabled />
      </Form.Item>
      <Form.Item
        label={boldText(
          <span className="!text-gray-400">
            {t('quota_templates.form.label.delivery_date')}
          </span>,
        )}
        colon={false}
      >
        <DatePicker placeholder="YYYY/MM/DD" className="!w-64" disabled />
      </Form.Item>
      <CoreInput
        name="delivery_method"
        label={t('quota_templates.form.label.delivery_method')}
        layout="horizontal"
        classNameInput="!w-96"
      />
      <Form.Item
        name="payment_due_date"
        label={boldText(t('quota_templates.form.label.payment_due_date'))}
        colon={false}
      >
        <Select
          className="!w-64"
          allowClear
          showSearch
          options={[
            {
              value: 'monthly_25',
              label: t('tenant_settings.paymentDueDate.options.monthly_25th'),
            },
            {
              value: 'monthly_10',
              label: t('tenant_settings.paymentDueDate.options.monthly_10th'),
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
              label: t('tenant_settings.paymentDueDate.options.eom_next_eom'),
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
      <Form.Item
        name="expiration_date"
        label={boldText(t('quota_templates.form.label.validity_period'))}
        colon={false}
      >
        <Select
          className="!w-64"
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
      </Form.Item>
      <Flex gap={16}>
        <div>
          <Form.Item
            name="consumption_tax"
            label={boldText(t('quota_templates.form.label.consumption_tax'))}
            colon={false}
            labelCol={{ span: 10, flex: '0 0 175px' }}
          >
            <Radio.Group
              defaultValue={ConsumptionTaxEnum.EXCLUSIVE}
              options={[
                {
                  value: ConsumptionTaxEnum.EXCLUSIVE,
                  label: '外税',
                },
                {
                  value: ConsumptionTaxEnum.INCLUSIVE,
                  label: '内税',
                },
                {
                  value: ConsumptionTaxEnum.EXTERNAL,
                  label: '税抜',
                },
              ]}
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            name="tax_rate"
            layout="horizontal"
            label={t('quota_templates.form.label.consumption_tax_rate')}
            labelCol={{ flex: '0 0 70px' }}
          >
            <InputNumber
              controls={false}
              min={0}
              max={100}
              className="!mr-2 !w-[75px]"
              suffix="%"
            />
          </Form.Item>
        </div>
      </Flex>
    </>
  )
}

export default BasicInfo

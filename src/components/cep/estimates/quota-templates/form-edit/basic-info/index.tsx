import { getExpiryDate } from '@components/cep/estimates/quotas/utils'
import CoreInput from '@components/common/core-input'
import { useTranslate } from '@refinedev/core'
import { ConsumptionTaxEnum } from '@sdk/hey-api'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import {
  CONSUMPTION_TAX,
  EXPIRATION_DATE,
  PAYMENT_DUE_DATE,
} from '@utility/constant'
import { DatePicker, Flex, Form, Radio, Select, Typography } from 'antd'
import dayjs from 'dayjs'

const { Title } = Typography

interface Props {
  expirationDate: string
}

const BasicInfo: React.FC<Props> = ({ expirationDate }) => {
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
        label={boldText(t('quota_templates.form.label.quote_type'))}
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
      <Form.Item
        label={boldText(t('quota_templates.form.label.quote_category'))}
        colon={false}
        required
        name="category"
        rules={[
          {
            required: true,
            message: t('validation.required'),
          },
        ]}
      >
        <Radio.Group
          defaultValue={'merchandise'}
          options={[
            {
              value: 'merchandise',
              label: t('quotas.action.basic_info.categories.merchandise'),
            },
            {
              value: 'service',
              label: t('quotas.action.basic_info.categories.service'),
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
            message: 'テンプレート名は必須です。',
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
          options={Object.values(PAYMENT_DUE_DATE)}
        />
      </Form.Item>
      <Flex gap={16}>
        <div>
          <Form.Item
            name="expiration_date"
            label={boldText(t('quota_templates.form.label.validity_period'))}
            colon={false}
            labelCol={{ span: 10, flex: '0 0 156px' }}
          >
            <Select
              className="!w-64"
              allowClear
              showSearch
              options={Object.values(EXPIRATION_DATE)}
            />
          </Form.Item>
        </div>
        <div
          style={{ whiteSpace: 'nowrap', fontWeight: 500, marginTop: '5px' }}
        >
          {dayjs(getExpiryDate(expirationDate, new Date())).format(
            'YYYY/MM/DD',
          )}
          まで
        </div>
      </Flex>
      <Flex gap={16}>
        <div>
          <Form.Item
            name="consumption_tax"
            label={boldText(t('quota_templates.form.label.consumption_tax'))}
            colon={false}
            labelCol={{ span: 10, flex: '0 0 180px' }}
          >
            <Radio.Group
              defaultValue={ConsumptionTaxEnum.EXCLUSIVE}
              options={Object.values(CONSUMPTION_TAX)}
            />
          </Form.Item>
        </div>
      </Flex>
    </>
  )
}

export default BasicInfo

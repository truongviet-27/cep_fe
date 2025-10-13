import { getExpiryDate } from '@components/cep/estimates/quotas/utils'
import type { QuoteTemplateDetailType } from '@interfaces/quota-templates'
import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import {
  CONSUMPTION_TAX,
  EXPIRATION_DATE,
  PAYMENT_DUE_DATE,
} from '@utility/constant'
import { Flex, Typography } from 'antd'
import dayjs from 'dayjs'

const { Title } = Typography

interface Props {
  detail: QuoteTemplateDetailType
}

const BasicInfo: React.FC<Props> = (props) => {
  const { detail } = props
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
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold text-gray-400">
          {t('quota_templates.form.label.quote_number')}
        </label>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold">
          {t('quota_templates.form.label.quote_category')}
        </label>
        <span>{detail.type === 'normal' ? '通常' : '販路限定'}</span>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold">
          {t('quota_templates.form.label.template_name')}
        </label>
        <span>{detail.name}</span>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold">
          {t('quota_templates.form.label.description')}
        </label>
        <span>{detail.description}</span>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold text-gray-400">
          {t('quota_templates.form.label.customer')}
        </label>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold text-gray-400">
          {t('quota_templates.form.label.quote_date')}
        </label>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold text-gray-400">
          {t('quota_templates.form.label.delivery_date')}
        </label>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold">
          {t('quota_templates.form.label.delivery_method')}
        </label>
        <span>{detail.delivery_method}</span>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold">
          {t('quota_templates.form.label.payment_due_date')}
        </label>
        <span>{PAYMENT_DUE_DATE?.[detail.payment_due_date ?? '']?.label}</span>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold">
          {t('quota_templates.form.label.validity_period')}
        </label>
        <span>
          {EXPIRATION_DATE?.[detail.expiration_date ?? '']?.label}
          <span
            style={{
              whiteSpace: 'nowrap',
              fontWeight: 500,
              marginLeft: 10,
            }}
          >
            (
            {dayjs(
              getExpiryDate(detail?.expiration_date ?? '', new Date()),
            ).format('YYYY/MM/DD')}
            )
          </span>
        </span>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold">
          {t('quota_templates.form.label.consumption_tax')}
        </label>
        <span>{CONSUMPTION_TAX?.[detail.consumption_tax ?? '']?.label}</span>
        <label className="ml-10">
          {t('quota_templates.form.label.consumption_tax_rate')}:
        </label>
        <span>{detail.tax_rate}%</span>
      </Flex>
    </>
  )
}

export default BasicInfo

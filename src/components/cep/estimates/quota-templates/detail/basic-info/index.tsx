import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Flex, Typography } from 'antd'

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
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold text-gray-400">
          {t('quota_templates.form.label.quote_number')}
        </label>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold">
          {t('quota_templates.form.label.quote_category')}
        </label>
        <span>普通</span>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold">
          {t('quota_templates.form.label.template_name')}
        </label>
        <span>システムカスタマイズ</span>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold">
          {t('quota_templates.form.label.description')}
        </label>
        <span>デザイン・開発・保守込み</span>
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
        <span>システム反映型納品</span>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold">
          {t('quota_templates.form.label.payment_due_date')}
        </label>
        <span>月末締め翌月末現金払い</span>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold">
          {t('quota_templates.form.label.validity_period')}
        </label>
        <span>45日</span>
      </Flex>
      <Flex className="!mb-4">
        <label className="w-[150px] font-bold">
          {t('quota_templates.form.label.consumption_tax')}
        </label>
        <span>外税</span>
        <label className="ml-10">
          {t('quota_templates.form.label.consumption_tax_rate')}:
        </label>
        <span>10%</span>
      </Flex>
    </>
  )
}

export default BasicInfo

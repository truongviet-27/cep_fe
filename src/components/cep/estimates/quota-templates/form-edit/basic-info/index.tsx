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
import {
  Col,
  DatePicker,
  Flex,
  Form,
  Radio,
  Row,
  Select,
  Typography,
} from 'antd'
import type { MutableRefObject } from 'react'

const { Title } = Typography

interface Props {
  isCategoryChangedByUserRef: MutableRefObject<boolean>
}

const BasicInfo = ({ isCategoryChangedByUserRef }: Props) => {
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
      <Row>
        <Col>
          <Form.Item name={'tax_rounding_method'} hidden />
        </Col>
      </Row>
      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          {/* Row 1: 見積番号 + 説明 */}
          <CoreInput
            label={
              <label className="!text-gray-400">
                {t('quota_templates.form.label.quote_number')}
              </label>
            }
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            required={true}
            layout="horizontal"
            disabled
          />
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <CoreInput
            name="description"
            label={t('quota_templates.form.label.description')}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          />
        </Col>
      </Row>
      <Row gutter={[100, 0]}>
        <Col
          xs={24}
          sm={16}
          md={5}
          lg={5}
          xl={5}
          style={{ paddingRight: '5px' }}
        >
          {/* Row 2: 見積タイプ (非表示) + 取引条件 + カテゴリ + 見積日(cột phải) */}
          <Form.Item
            className="hidden"
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
            required
            labelCol={{ span: 11 }}
            wrapperCol={{ span: 16 }}
            name={'customer_term'}
            label={boldText(t('quotas.action.basic_info.fields.customer_term'))}
            rules={[
              {
                required: true,
                message: t('validations.required'),
              },
            ]}
          >
            <Radio.Group
              options={[
                {
                  value: 'short_term',
                  label: t('quotas.action.basic_info.customer_term.short_term'),
                },
                {
                  value: 'long_term',
                  label: t('quotas.action.basic_info.customer_term.long_term'),
                },
              ]}
            />
          </Form.Item>
        </Col>
        <Col
          xs={24}
          sm={16}
          md={5}
          lg={5}
          xl={5}
          style={{ paddingRight: '5px' }}
        >
          <Form.Item
            label={boldText(t('quota_templates.form.label.quote_transaction'))}
            colon={false}
            required
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
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
              onChange={() => {
                isCategoryChangedByUserRef.current = true
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <Form.Item
            label={boldText(
              <span className="!text-gray-400">
                {t('quota_templates.form.label.quote_date')}
              </span>,
            )}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            colon={false}
          >
            <DatePicker placeholder="YYYY/MM/DD" className="!w-full" disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          {/* Row 3: テンプレート名 + 納品方法 */}
          <CoreInput
            name="name"
            label={t('quota_templates.form.label.template_name')}
            required={true}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            rules={[
              {
                required: true,
                message: 'テンプレート名は必須です。',
              },
            ]}
          />
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          <CoreInput
            name="delivery_method"
            label={t('quota_templates.form.label.delivery_method')}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          />
        </Col>
      </Row>

      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          {/* Row 4: 顧客 (無効) + 有効期限 */}
          <Form.Item
            label={boldText(
              <span className="!text-gray-400">
                {t('quota_templates.form.label.customer')}
              </span>,
            )}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            colon={false}
          >
            <Select disabled />
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          {/* Row 6:  */}
          <Form.Item
            name="payment_due_date"
            label={boldText(t('quota_templates.form.label.payment_due_date'))}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            colon={false}
          >
            <Select
              allowClear
              showSearch
              options={Object.values(PAYMENT_DUE_DATE)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          {/* Row 5: 配送日 (無効) + 支払期日 */}
          <Form.Item
            label={boldText(
              <span className="!text-gray-400">
                {t('quota_templates.form.label.delivery_date')}
              </span>,
            )}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            colon={false}
          >
            <DatePicker placeholder="YYYY/MM/DD" className="!w-full" disabled />
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} xl={10} xxl={10}>
          <Form.Item
            label={boldText(t('quota_templates.form.label.validity_period'))}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            colon={false}
          >
            <Flex>
              <Form.Item name="expiration_date">
                <Select
                  className="!w-28 xl:!w-56"
                  allowClear
                  showSearch
                  options={Object.values(EXPIRATION_DATE)}
                />
              </Form.Item>
            </Flex>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[100, 0]}>
        <Col xs={24} sm={16} md={10} lg={10} xl={10}>
          {/* Row 7: 消費税 (非表示) */}
          <Form.Item
            className="hidden"
            name="consumption_tax"
            label={boldText(t('quota_templates.form.label.consumption_tax'))}
            colon={false}
          >
            <Flex gap={12}>
              <Radio.Group
                defaultValue={ConsumptionTaxEnum.EXCLUSIVE}
                options={Object.values(CONSUMPTION_TAX)}
              />
            </Flex>
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}

export default BasicInfo

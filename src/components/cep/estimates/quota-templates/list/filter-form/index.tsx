import CoreInput from '@components/common/core-input'
import type { SearchQuotaTemplateType } from '@interfaces/quota-templates'
import { useTranslate } from '@refinedev/core'
import { Button, Col, DatePicker, Flex, Form, Row, Space } from 'antd'
import type { FormProps } from 'antd/lib'
import type { FC } from 'react'

interface Props {
  searchFormProps: FormProps<SearchQuotaTemplateType>
}

const QuotaTemplateFilterForm: FC<Props> = ({ searchFormProps }) => {
  const t = useTranslate()

  return (
    <Form {...searchFormProps}>
      <Row gutter={16}>
        <Col sm={12} md={6} lg={4}>
          <CoreInput
            name="name_lk"
            label={
              <span className="font-bold">
                {t('quota_templates.list.templateName')}
              </span>
            }
            placeholder={t('quota_templates.list.placeholderPartialMatch')}
          />
        </Col>
        <Col sm={12} md={6} lg={4}>
          <CoreInput
            name="creator"
            label={
              <span className="font-bold">
                {t('quota_templates.list.creator')}
              </span>
            }
            placeholder={t('quota_templates.list.placeholderPartialMatch')}
          />
        </Col>
        <Col sm={12} md={6} lg={4}>
          <Flex>
            <Form.Item
              label={
                <span className="font-bold">
                  {t('quota_templates.list.creationDate')}
                </span>
              }
              colon={false}
              name="start_to_end_date"
              layout="vertical"
            >
              <DatePicker.RangePicker
                placeholder={['YYYY/MM/DD', 'YYYY/MM/DD']}
                className="w-full"
              />
            </Form.Item>
          </Flex>
        </Col>
        <Col sm={12} md={6} lg={4}>
          <Space size="small" className="!mt-[30px]">
            <Button type="primary" htmlType="submit">
              {t('quota_templates.button.search')}
            </Button>
            <Button color="primary" variant="outlined" htmlType="reset">
              {t('quota_templates.button.clear')}
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  )
}

export default QuotaTemplateFilterForm

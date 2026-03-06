import CoreInput from '@components/common/core-input'
import type { SearchQuotaTemplateType } from '@interfaces/quota-templates'
import { useSelect } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import { Button, Col, DatePicker, Flex, Form, Row, Select, Space } from 'antd'
import type { FormProps } from 'antd/lib'
import type { FC } from 'react'

interface Props {
  searchFormProps: FormProps<SearchQuotaTemplateType>
  clearFilters: () => void
}

const QuotaTemplateFilterForm: FC<Props> = ({
  searchFormProps,
  clearFilters,
}) => {
  const t = useTranslate()

  const { selectProps: creatorSelectProps } = useSelect({
    resource: 'employees',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: {
      mode: 'server',
      pageSize: 100,
    },
  })

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
          <Form.Item
            label={
              <span className="font-bold">
                {t('quota_templates.list.creator')}
              </span>
            }
            layout="vertical"
            name={'created_by'}
          >
            <Select
              {...creatorSelectProps}
              allowClear
              showSearch
              onSearch={() => {}}
              filterOption={(input, option) =>
                ((option?.label ?? '') as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              labelInValue={true}
              placeholder={t('agreed_prices.search.please_select')}
            />
          </Form.Item>
        </Col>
        <Col sm={12} md={6} lg={6}>
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
              className="w-full"
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
            <Button type="primary" htmlType="submit" autoInsertSpace={false}>
              {t('quota_templates.button.search')}
            </Button>
            <Button
              color="primary"
              variant="outlined"
              htmlType="reset"
              onClick={clearFilters}
            >
              {t('quota_templates.button.clear')}
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  )
}

export default QuotaTemplateFilterForm

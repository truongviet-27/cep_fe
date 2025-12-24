import useImportHistory from '@components/cep/import-history/useImportHistory'
import CoreInput from '@components/common/core-input'
import PageContainer from '@components/common/page-container'
import CommonTable from '@components/common/table'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { FORMAT_DATE_TIME } from '@utility/instances'
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
} from 'antd'

const { RangePicker } = DatePicker

function ImportHistory() {
  const [{ columns, tableProps, searchFormProps }, { t, onReset }] =
    useImportHistory()

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: boldText(t('import_history.import_history'), PRIMARY),
            },
          ]}
        />
      }
      title={t('import_history.import_history')}
    >
      <Form {...searchFormProps}>
        <Row gutter={[16, 0]}>
          <Col xs={24} md={8}>
            <CoreInput
              name="id"
              label={
                <span className="font-bold">
                  {t('import_history.label.id')}
                </span>
              }
              placeholder={t('import_history.placeholder.id')}
            />
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t('import_history.label.status')}
                </span>
              }
              name="status"
              layout="vertical"
            >
              <Select
                showSearch
                placeholder={t('import_history.placeholder.status')}
              >
                <Select.Option value="PROCESSING">
                  {t('import_history.text.status.PROCESSING')}
                </Select.Option>
                <Select.Option value="COMPLETED">
                  {t('import_history.text.status.COMPLETED')}
                </Select.Option>
                <Select.Option value="FAILED">
                  {t('import_history.text.status.FAILED')}
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="common_name"
              label={
                <span className="font-bold">
                  {t('import_history.label.common_name')}
                </span>
              }
              layout="vertical"
            >
              <Select
                showSearch
                placeholder={t('import_history.placeholder.common_name')}
              >
                <Select.Option value="PRODUCTS">
                  {t('import_history.text.category.PRODUCTS')}
                </Select.Option>
                <Select.Option value="CATEGORY_PRODUCTS">
                  {t('import_history.text.category.CATEGORY_PRODUCTS')}
                </Select.Option>
                <Select.Option value="CUSTOMERS">
                  {t('import_history.text.category.CUSTOMERS')}
                </Select.Option>
                <Select.Option value="DEPARTMENTS">
                  {t('import_history.text.category.DEPARTMENTS')}
                </Select.Option>
                <Select.Option value="OTHER">
                  {t('import_history.text.category.OTHER')}
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="created_by"
              label={
                <span className="font-bold">
                  {t('import_history.label.created_by')}
                </span>
              }
              layout="vertical"
            >
              {/* <Select
                placeholder={t('import_history.placeholder.created_by')}
                showSearch
                allowClear
                {...employeeSelectProps}
              /> */}
              <Input placeholder={t('import_history.placeholder.created_by')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              layout="vertical"
              label={
                <span className="font-bold">
                  {t('import_history.label.date')}
                </span>
              }
              colon={false}
              name={'date'}
            >
              <RangePicker
                style={{
                  width: '100%',
                }}
                showTime
                placeholder={[FORMAT_DATE_TIME, FORMAT_DATE_TIME]}
              />
            </Form.Item>
          </Col>

          <Col xs={12} md={4}>
            <div className="mt-7 mb-4 flex items-center gap-4">
              <Button type="primary" htmlType="submit" autoInsertSpace={false}>
                {t('buttons.search')}
              </Button>
              <Button variant="outlined" onClick={onReset}>
                {t('buttons.clear')}
              </Button>
            </div>
          </Col>
        </Row>

        <CommonTable columns={columns} {...tableProps} />
      </Form>
    </PageContainer>
  )
}

export default ImportHistory

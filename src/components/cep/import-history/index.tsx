import useImportHistory from '@components/cep/import-history/useImportHistory'
import CoreInput from '@components/common/core-input'
import PageContainer from '@components/common/page-container'
import CommonTable from '@components/common/table'
import { PRIMARY } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from 'antd'

const { Title } = Typography
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
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('import_history.import_history')}
                </Title>
              ),
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
              name="q"
              label={<span className="font-bold">{t('タスクコード')}</span>}
              placeholder={t('検索キーワード')}
            />
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label={
                <span className="font-bold">
                  {t('approve_routes.filters.statusLabel')}
                </span>
              }
              name="status"
              layout="vertical"
            >
              <Select
                showSearch
                placeholder={t('approve_routes.filters.selectPlaceholder')}
              >
                <Select.Option value="PENDING">
                  {t('import_history.text.status.PENDING')}
                </Select.Option>
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
              label={<span className="font-bold">種別</span>}
              layout="vertical"
            >
              <Select showSearch placeholder="サブカテゴリーを選択">
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
              name="code"
              label={<span className="font-bold">処理ID</span>}
              layout="vertical"
            >
              <Input placeholder="コード入力" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              layout="vertical"
              label={<span className="font-bold">登録日時</span>}
              colon={false}
            >
              <RangePicker
                showTime
                style={{
                  width: '100%',
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={12} md={4}>
            <div className="mt-7 mb-4 flex items-center gap-4">
              <Button type="primary" htmlType="submit">
                {t('buttons.search')}
              </Button>
              <Button onClick={onReset}>{t('buttons.back')}</Button>
            </div>
          </Col>
        </Row>

        <CommonTable columns={columns} {...tableProps} />
      </Form>
    </PageContainer>
  )
}

export default ImportHistory

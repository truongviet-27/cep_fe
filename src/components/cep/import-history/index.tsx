import { CaretDownOutlined } from '@ant-design/icons'
import useImportHistory from '@components/cep/import-history/useImportHistory'
import CoreInput from '@components/common/core-input'
import PageContainer from '@components/common/page-container'
import CommonTable from '@components/common/table'
import { PRIMARY } from '@utility/color'
import {
  AutoComplete,
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Typography,
} from 'antd'

const { Title } = Typography

function ImportHistory() {
  const [
    { methods, columns, isLoading, tableProps },
    { t, onSubmit, onReset },
  ] = useImportHistory()
  const { formProps } = methods

  return (
    <PageContainer
      title={
        <Breadcrumb
          items={[
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('import_history')}
                </Title>
              ),
            },
          ]}
        />
      }
    >
      <Form {...formProps}>
        <Row gutter={[16, 0]}>
          <Col xs={12} sm={6}>
            <CoreInput
              name="search"
              label={<span className="font-bold">{t('タスクコード')}</span>}
              placeholder={t('検索キーワード')}
            />
          </Col>

          <Col xs={12} sm={6}>
            <Form.Item
              name="category"
              label={<span className="font-bold">{t('ステータス')}</span>}
              layout="vertical"
            >
              <AutoComplete
                options={[
                  {
                    label: 'tes1',
                    value: '123',
                  },
                  {
                    label: 'tes2',
                    value: '1234',
                  },
                ]}
                placeholder={t('カテゴリーを選択')}
                optionFilterProp="label"
                filterOption={(inputValue, option) =>
                  option!.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
                suffixIcon={<CaretDownOutlined />}
              />
            </Form.Item>
          </Col>

          <Col xs={12} sm={6}>
            <Form.Item
              name="subCategory"
              label={<span className="font-bold">種別</span>}
              layout="vertical"
            >
              <AutoComplete
                options={[
                  {
                    label: 'tes1',
                    value: '123',
                  },
                  {
                    label: 'tes2',
                    value: '1234',
                  },
                ]}
                placeholder="サブカテゴリーを選択"
                filterOption={(inputValue, option) => {
                  return (
                    option!.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  )
                }}
                maxCount={1}
                suffixIcon={<CaretDownOutlined />}
              />
            </Form.Item>
          </Col>

          <Col xs={12} sm={6}>
            <Form.Item
              name="code"
              label={<span className="font-bold">処理ID</span>}
              layout="vertical"
            >
              <Input placeholder="コード入力" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={12} lg={10}>
            <Row gutter={[16, 0]}>
              <Col xs={24} lg={4} style={{ marginTop: 4 }}>
                <span className="font-bold">登録日時</span>
              </Col>
              <Col xs={12} lg={10}>
                <Form.Item name="dateFrom">
                  <DatePicker
                    showTime
                    style={{ width: '100%' }}
                    format="DD/MM/YY HH:mm:ss"
                    placeholder="DD/MM/YY hh:mm:ss"
                  />
                </Form.Item>
              </Col>
              <Col xs={12} lg={10}>
                <Form.Item name="dateTo">
                  <DatePicker
                    showTime
                    style={{ width: '100%' }}
                    format="DD/MM/YY HH:mm:ss"
                    placeholder="DD/MM/YY hh:mm:ss"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={12} lg={10}>
            <Row gutter={[16, 0]}>
              <Col xs={24} lg={4} style={{ marginTop: 4 }}>
                <span className="font-bold">完了日時</span>
              </Col>
              <Col xs={12} lg={10}>
                <Form.Item name="updatedFrom">
                  <DatePicker
                    showTime
                    style={{ width: '100%' }}
                    format="DD/MM/YY HH:mm:ss"
                    placeholder="DD/MM/YY hh:mm:ss"
                  />
                </Form.Item>
              </Col>
              <Col xs={12} lg={10}>
                <Form.Item name="updatedTo">
                  <DatePicker
                    showTime
                    style={{ width: '100%' }}
                    format="DD/MM/YY HH:mm:ss"
                    placeholder="DD/MM/YY hh:mm:ss"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col xs={12} md={4}>
            <div className="mb-4 flex items-center gap-4">
              <Button type="primary" onClick={onSubmit}>
                {t('buttons.search')}
              </Button>
              <Button onClick={onReset}>{t('buttons.back')}</Button>
            </div>
          </Col>
        </Row>

        <CommonTable
          bordered
          columns={columns}
          loading={isLoading}
          {...tableProps}
        />
      </Form>
    </PageContainer>
  )
}

export default ImportHistory

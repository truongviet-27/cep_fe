import { CaretDownOutlined } from '@ant-design/icons'
import useImportHistory from '@components/cep/system-config/product-categories/csv/import-history/useImportHistory'
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
    { methods, columns, dataSource, isLoading, page, pageSize, total },
    { t, onSubmit, onChangePageSize, onReset },
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
        <Row gutter={16}>
          <Col span={4}>
            <CoreInput
              name="search"
              label={<span className="font-bold">{t('タスクコード')}</span>}
              placeholder={t('検索キーワード')}
            />
          </Col>

          <Col span={4}>
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

          <Col span={4}>
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

          <Col span={4}>
            <Form.Item
              name="code"
              label={<span className="font-bold">処理ID</span>}
              layout="vertical"
            >
              <Input placeholder="コード入力" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={5}>
            <Form.Item
              name="dateFrom"
              label={<span className="font-bold">登録日時</span>}
            >
              <DatePicker
                showTime
                style={{ width: '100%' }}
                format="DD/MM/YY HH:mm:ss"
                placeholder="DD/MM/YY hh:mm:ss"
              />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item name="dateTo">
              <DatePicker
                showTime
                style={{ width: '100%' }}
                format="DD/MM/YY HH:mm:ss"
                placeholder="DD/MM/YY hh:mm:ss"
              />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item
              name="updatedFrom"
              label={<span className="font-bold">完了日時</span>}
            >
              <DatePicker
                showTime
                style={{ width: '100%' }}
                format="DD/MM/YY HH:mm:ss"
                placeholder="DD/MM/YY hh:mm:ss"
              />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item name="updatedTo">
              <DatePicker
                showTime
                style={{ width: '100%' }}
                format="DD/MM/YY HH:mm:ss"
                placeholder="DD/MM/YY hh:mm:ss"
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <div className="flex items-center gap-4">
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
          dataSource={dataSource}
          loading={isLoading}
          pagination={{
            pageSize,
            current: page,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}件`,
            total: total,
            onChange: onChangePageSize,
            showSizeChanger: true,
          }}
        />
      </Form>
    </PageContainer>
  )
}

export default ImportHistory

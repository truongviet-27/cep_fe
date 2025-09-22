'use client'

import { RightOutlined } from '@ant-design/icons'
import { Create } from '@components/crud/create'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useForm } from '@refinedev/antd'
import { useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from 'antd'

const { Title, Text } = Typography
const { Group } = Radio

function Page() {
  const t = useTranslate()
  const { formProps, saveButtonProps, form } = useForm()

  const { getFieldValue } = form

  return (
    <Create
      isLoading={false}
      title={
        <Breadcrumbs
          items={[
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('system_config.system_config')}
                </Title>
              ),
            },
            {
              title: (
                <Title level={5}>{t('tenant_settings.tenant_settings')}</Title>
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      hiddenButtonBack={true}
      rightFooterButtons={
        <Space>
          <Button type="default" size="large">
            {'キャンセル'}
          </Button>
          <Button type="default" size="large">
            {'プレビュー'}
          </Button>
          <Button type="primary" size="large" {...saveButtonProps}>
            {t('buttons.save')}
          </Button>
        </Space>
      }
    >
      <Form {...formProps} layout="vertical">
        <Row gutter={[16, 16]}>
          {/* Left Column */}
          <Col xs={24} xxl={12}>
            <div className="rounded-lg border border-[#D0D0D0]">
              <div className="flex h-[100px] border-b-[1px] border-solid border-[#D0D0D0]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
                  <Text strong>あいさつ文</Text>
                </div>
                <div className="flex-1 content-center px-4">
                  <Form.Item
                    name="greeting"
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Input
                      placeholder="下記の通りお見積り申し上げます。"
                      style={{ height: 60, width: '75%' }}
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
                  <Text strong>納入期日</Text>
                </div>
                <div className="flex flex-1 content-center items-center">
                  <div className="solid h-full w-3/4 content-center border-r-[1px] border-[#D0D0D0] px-4"></div>

                  <Form.Item
                    style={{
                      marginBottom: 0,
                      scale: 1.3,
                      padding: '0 40px',
                    }}
                    name={'is_enable_delivery'}
                    valuePropName="checked"
                  >
                    <Checkbox checked={getFieldValue('is_enable_delivery')}>
                      非表示
                    </Checkbox>
                  </Form.Item>
                </div>
              </div>

              <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
                  <Text strong>納品方法</Text>
                </div>
                <div className="flex flex-1 content-center items-center">
                  <div className="solid h-full w-3/4 content-center border-r-[1px] border-[#D0D0D0] px-4">
                    <Form.Item
                      name="default_delivery_method"
                      style={{
                        margin: 0,
                      }}
                    >
                      <Input placeholder="納品方法" style={{ width: '70%' }} />
                    </Form.Item>
                  </div>

                  <Form.Item
                    style={{
                      marginBottom: 0,
                      scale: 1.3,
                      padding: '0 40px',
                    }}
                    valuePropName="checked"
                    name={'is_enable_delivery_method'}
                  >
                    <Checkbox
                      checked={getFieldValue('is_enable_delivery_method')}
                    >
                      非表示
                    </Checkbox>
                  </Form.Item>
                </div>
              </div>

              <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
                  <Text strong>支払期日</Text>
                </div>
                <div className="flex flex-1 content-center items-center">
                  <div className="solid h-full w-3/4 content-center border-r-[1px] border-[#D0D0D0] px-4">
                    <Form.Item
                      name="default_payment_due_date"
                      style={{
                        margin: 0,
                      }}
                    >
                      <Select
                        placeholder="下記の通りお見積り申し上げます。"
                        style={{ width: '70%' }}
                        options={[
                          { value: 'monthly_25', label: '毎月25日' },
                          { value: 'monthly_10', label: '毎月10日' },
                          {
                            value: 'net_30_from_delivery',
                            label: '納品日後30日',
                          },
                          {
                            value: 'net_30_from_invoice',
                            label: '請求日後30日',
                          },
                          {
                            value: 'end_of_month_next',
                            label: '月末締め、翌月末支払い',
                          },
                          {
                            value: 'end_of_month_after_next',
                            label: '月末締め、翌々月末支払い',
                          },
                        ]}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    style={{
                      marginBottom: 0,
                      scale: 1.3,
                      padding: '0 40px',
                    }}
                    valuePropName="checked"
                    name={'is_enable_payment_due_date'}
                  >
                    <Checkbox
                      checked={getFieldValue('is_enable_payment_due_date')}
                    >
                      非表示
                    </Checkbox>
                  </Form.Item>
                </div>
              </div>

              <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
                  <Text strong>有効期限</Text>
                </div>
                <div className="flex flex-1 content-center items-center">
                  <div className="solid h-full w-3/4 content-center border-r-[1px] border-[#D0D0D0] px-4">
                    <Form.Item
                      name="default_expiration_date"
                      style={{
                        margin: 0,
                      }}
                    >
                      <Select
                        placeholder="下記の通りお見積り申し上げます。"
                        style={{ width: '70%' }}
                        options={[
                          { value: 'days_7', label: '7日' },
                          { value: 'days_14', label: '14日' },
                          { value: 'days_45', label: '45日' },
                          { value: 'days_60', label: '60日' },
                          { value: 'months_3', label: '3月' },
                          { value: 'months_6', label: '6月' },
                          { value: 'years_1', label: '1年' },
                        ]}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    style={{
                      marginBottom: 0,
                      scale: 1.3,
                      padding: '0 40px',
                    }}
                    valuePropName="checked"
                    name={'is_enable_expiration_date'}
                  >
                    <Checkbox
                      checked={getFieldValue('is_enable_expiration_date')}
                    >
                      非表示
                    </Checkbox>
                  </Form.Item>
                </div>
              </div>

              <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
                  <Text strong>郵便番号</Text>
                </div>
                <div className="flex-1 content-center px-4">
                  <Form.Item
                    name="postal_code"
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Input style={{ width: '50%' }} />
                  </Form.Item>
                </div>
              </div>

              <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
                  <Text strong>住所</Text>
                </div>
                <div className="flex-1 content-center px-4">
                  <Form.Item
                    name="address"
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Input style={{ width: '50%' }} />
                  </Form.Item>
                </div>
              </div>

              <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
                  <Text strong>会社名</Text>
                </div>
                <div className="flex-1 content-center px-4">
                  <Form.Item
                    name="company_name"
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Input style={{ width: '50%' }} />
                  </Form.Item>
                </div>
              </div>

              <div className="flex h-[80px]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
                  <Text strong>電話番号</Text>
                </div>
                <div className="flex-1 content-center px-4">
                  <Form.Item
                    name="phone_number"
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Input style={{ width: '50%' }} />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Col>

          {/* Right Column */}
          <Col xs={24} xxl={12}>
            <div className="rounded-lg border border-[#D0D0D0]">
              <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
                  <Text strong>会社ロゴ</Text>
                </div>
                <div className="flex flex-1 content-center items-center">
                  <div className="w-3/4 content-center px-4">
                    <Form.Item
                      name="company_logo_image"
                      style={{
                        margin: 0,
                      }}
                    ></Form.Item>
                  </div>

                  <Form.Item
                    style={{
                      marginBottom: 0,
                      scale: 1.3,
                      padding: '0 40px',
                    }}
                  >
                    <Checkbox>非表示</Checkbox>
                  </Form.Item>
                </div>
              </div>

              <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
                  <Text strong>会社角印</Text>
                </div>
                <div className="flex flex-1 content-center items-center">
                  <div className="w-3/4 content-center px-4">
                    <Form.Item
                      name="company_seal_image"
                      style={{
                        margin: 0,
                      }}
                    ></Form.Item>
                  </div>

                  <Form.Item
                    style={{
                      marginBottom: 0,
                      scale: 1.3,
                      padding: '0 40px',
                    }}
                  >
                    <Checkbox>非表示</Checkbox>
                  </Form.Item>
                </div>
              </div>

              <div className="flex h-[100px] border-b-[1px] border-solid border-[#D0D0D0]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
                  <Text strong>プレビュー</Text>
                </div>
                <div className="flex-1 content-center px-4">
                  <Form.Item
                    name="preview_image"
                    style={{
                      marginBottom: 0,
                    }}
                  ></Form.Item>
                </div>
              </div>

              <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pl-4 text-left">
                  <Text strong>担当者デジタル捺印</Text>
                </div>
                <div className="flex flex-1 content-center items-center">
                  <div className="solid content-center px-4">
                    <Form.Item
                      name="is_display_manger_seal"
                      style={{
                        margin: 0,
                      }}
                    >
                      <Group
                        defaultValue={true}
                        options={[
                          {
                            value: true,
                            label: '捺印あり',
                          },
                          {
                            value: false,
                            label: '捺印なし',
                          },
                        ]}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pl-4 text-left">
                  <Text strong>消費税（デフォルト）</Text>
                </div>
                <div className="flex flex-1 items-center px-4">
                  <Form.Item
                    name="consumption_tax"
                    style={{
                      margin: 0,
                    }}
                  >
                    <Group
                      defaultValue={'exclusive'}
                      options={[
                        {
                          value: 'exclusive',
                          label: '外税',
                        },
                        {
                          value: 'inclusive',
                          label: '内税',
                        },
                        {
                          value: 'external',
                          label: '税抜',
                        },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    name="tax_rate"
                    label="消費税率"
                    colon={false}
                    layout="horizontal"
                    style={{
                      marginBottom: 0,
                      marginLeft: 'auto',
                    }}
                    getValueFromEvent={(value) => Number(value)}
                  >
                    <InputNumber
                      controls={false}
                      min={0}
                      max={100}
                      addonAfter="%"
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
                  <Text strong>税額の端数処理</Text>
                </div>
                <div className="flex-1 content-center px-4">
                  <Form.Item
                    name="tax_rounding_method"
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Select
                      style={{ width: '50%' }}
                      options={[
                        { value: 'round_down', label: '切り捨て' },
                        { value: 'round_up', label: '切り上げ' },
                        { value: 'round_nearest', label: '四捨五入' },
                      ]}
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="flex h-[80px]">
                <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
                  <Text strong>売価の端数処理</Text>
                </div>
                <div className="flex-1 content-center px-4">
                  <Form.Item
                    name="sale_price_rounding_method"
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Select
                      style={{ width: '50%' }}
                      options={[
                        { value: 'round_down', label: '切り捨て' },
                        { value: 'round_up', label: '切り上げ' },
                        { value: 'round_nearest', label: '四捨五入' },
                      ]}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </Create>
  )
}

export default Page

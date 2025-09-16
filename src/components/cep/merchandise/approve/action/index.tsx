/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CloseOutlined, RightOutlined } from '@ant-design/icons'
import useApproveAction from '@components/cep/merchandise/approve/action/use-approve-action'
import { Action } from '@components/common/action'
import CoreAutoComplete from '@components/common/auto-complete'
import CoreInput from '@components/common/core-input'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import boldText from '@utility/bold-text'
import { PRIMARY, WHITE } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd'

const { Title } = Typography

function ApproveAction() {
  const [{ methods, isMultiAppover, isUpdate }, { t, setIsMultiApprove }] =
    useApproveAction()

  const { formProps, saveButtonProps, form } = methods

  const { getFieldValue, setFieldValue } = form

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('merchandise.merchandise')}
                </Title>
              ),
            },
            {
              title: <Title level={5}>{t('approve.approve')}</Title>,
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={<Title level={5}>{t('approve.approve')}</Title>}
    >
      <Form
        {...formProps}
        initialValues={{
          code: '',
          name: '',
          status: 'active',
          steps: [
            {
              name: '',
              step_order: '',
              is_multi_appover: false,
              employees: [
                {
                  name: '',
                  code: '',
                },
              ],
            },
          ],
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        labelAlign="left"
      >
        <Row>
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <CoreInput
              name={'code'}
              label={'ルートコード'}
              required
              layout="horizontal"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <CoreInput
              name={'name'}
              label={'ルート名'}
              required
              layout="horizontal"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <CoreInput
              name={'salesPrice'}
              label={'部門（支社/部/課）'}
              required
              layout="horizontal"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <Form.Item
              name={'status'}
              label={'ステータス'}
              required
              layout="horizontal"
            >
              <Radio.Group
                options={[
                  {
                    value: 'active',
                    label: t('products.text.active'),
                  },
                  {
                    value: 'inactive',
                    label: t('products.text.inactive'),
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.List name={'steps'}>
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((item, index) => {
                  return (
                    <Card
                      key={item.key}
                      style={{
                        marginBottom: '10px',
                      }}
                      headStyle={{
                        borderBottom: 'none',
                      }}
                      title={
                        <Space className="w-full justify-between">
                          <Space
                            style={{
                              background: PRIMARY,
                              color: WHITE,
                              padding: '4px 16px',
                              borderRadius: '4px',
                              fontSize: 12,
                              fontWeight: 700,
                              zIndex: 99,
                            }}
                          >
                            ステップ1
                          </Space>
                          {fields.length > 1 && (
                            <Space
                              style={{
                                borderRadius: '4px',
                                fontSize: 12,
                                fontWeight: 700,
                                zIndex: 99,
                              }}
                            >
                              <Button
                                type="text"
                                variant="text"
                                icon={<CloseOutlined />}
                                onClick={() => {
                                  remove(index)
                                }}
                              />
                            </Space>
                          )}
                        </Space>
                      }
                    >
                      <div className="">
                        <Row>
                          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
                            <CoreInput
                              name={[item.name, 'name']}
                              label={'ステップ名'}
                              required
                              layout="horizontal"
                            />
                          </Col>
                        </Row>

                        <Row>
                          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
                            <Form.Item
                              name={[item.name, 'is_multi_appover']}
                              layout="horizontal"
                              label={
                                <span className="font-bold">承認者の指定</span>
                              }
                              colon={false}
                              valuePropName="checked"
                            >
                              <Checkbox
                                style={{
                                  transform: 'scale(1.3)',
                                  marginBottom: 0,
                                }}
                                checked={getFieldValue([
                                  item.name,
                                  'is_multi_appover',
                                ])}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setIsMultiApprove((prev) => ({
                                      ...prev,
                                      [index]: true,
                                    }))
                                  } else {
                                    setIsMultiApprove((prev) => ({
                                      ...prev,
                                      [index]: false,
                                    }))
                                  }
                                }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.List name={[item.name, 'employees']}>
                          {(fields2, { add, remove }) => {
                            return (
                              <div className="flex flex-col">
                                {fields2.map((item2, index2) => {
                                  return (
                                    <Space
                                      key={item2.key}
                                      className="flex items-center md:ml-10"
                                    >
                                      <Row gutter={[12, 12]}>
                                        <Col xs={24} lg={6}>
                                          {boldText('承認者')}
                                        </Col>
                                        <Col xs={10} lg={8}>
                                          <Form.Item
                                            label={boldText(
                                              '部門（支社/部/課）',
                                            )}
                                            name={[item2.name, 'name']}
                                            labelCol={{ span: 24 }}
                                          >
                                            <CoreAutoComplete
                                              name="q"
                                              resource="departments"
                                            />
                                          </Form.Item>
                                        </Col>
                                        <Col xs={10} lg={8}>
                                          <Form.Item
                                            label={boldText(
                                              '社員・社員コード ',
                                            )}
                                            name={[item2.name, 'code']}
                                            labelCol={{ span: 24 }}
                                            required
                                          >
                                            <CoreAutoComplete
                                              name="q"
                                              resource="departments"
                                            />
                                          </Form.Item>
                                        </Col>

                                        {fields2.length > 1 && (
                                          <Col className="mt-10" xs={4} lg={2}>
                                            <Action
                                              actionList={['delete']}
                                              onDeleteAction={() => {
                                                remove(index2)
                                              }}
                                            />
                                          </Col>
                                        )}
                                      </Row>
                                    </Space>
                                  )
                                })}

                                {isMultiAppover[index] && (
                                  <Row>
                                    <Col>
                                      <Button
                                        type="primary"
                                        onClick={() => {
                                          add({})
                                        }}
                                      >
                                        承認者を追加
                                      </Button>
                                    </Col>
                                  </Row>
                                )}
                              </div>
                            )
                          }}
                        </Form.List>
                      </div>
                    </Card>
                  )
                })}

                <Button
                  type="primary"
                  className="w-full"
                  style={{
                    marginTop: '20px',
                    padding: '20px 0',
                  }}
                  onClick={() => {
                    add({
                      name: '',
                      step_order: '',
                      is_multi_appover: false,
                      employees: [{}],
                    })
                  }}
                >
                  ＋ ステップを追加
                </Button>
              </div>
            )
          }}
        </Form.List>

        <Divider />
        <ShowMoreInfo descriptions={[{ title: '123', value: '1231' }]} />

        <Flex
          justify="space-between"
          style={{
            marginTop: 40,
          }}
        >
          <Button color="danger" variant="filled">
            {t('buttons.delete')}
          </Button>
          <Space>
            <Button type="default">{t('buttons.back')}</Button>

            <Button {...saveButtonProps} type="primary">
              {t('buttons.save')}
            </Button>
          </Space>
        </Flex>
      </Form>
    </PageContainer>
  )
}

export default ApproveAction

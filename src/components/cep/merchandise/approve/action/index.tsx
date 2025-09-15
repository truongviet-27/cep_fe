/* eslint-disable @typescript-eslint/no-unused-vars */
import { CloseOutlined, RightOutlined } from '@ant-design/icons'
import useApproveAction from '@components/cep/merchandise/approve/action/use-approve-action'
import CoreInput from '@components/organism/CoreInput'
import PageContainer from '@components/organism/PageContainer'
import { PRIMARY, WHITE } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Radio,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd'
import { P } from 'framer-motion/dist/types.d-Cjd591yU'
import { useRef } from 'react'

const { Title } = Typography

function ApproveAction() {
  const [{ methods }, { t }] = useApproveAction()
  const addRef = useRef<(defaultValue?: object, insertIndex?: number) => void>()
  const removeRef = useRef<(index: number | number[]) => void>()

  const { formProps } = methods

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
          status: true,
          steps: [
            {
              name: '',
              step_order: '',
              is_multi_appover: false,
              employees: [{}],
            },
          ],
        }}
      >
        <Row>
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <CoreInput
              name={'salesPrice'}
              label={'ルートコード'}
              required
              layout="horizontal"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <CoreInput
              name={'salesPrice'}
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
              name={'salesPrice'}
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
        <div className="relative">
          <Form.List name={'steps'}>
            {(fields, { add, remove }) => {
              addRef.current = add
              removeRef.current = remove

              return fields.map((item, index) => {
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
                              if (removeRef.current) removeRef.current(index)
                            }}
                          />
                        </Space>
                      </Space>
                    }
                  >
                    <div className="mt-8">
                      <Row>
                        <Col>
                          <CoreInput
                            name={'name'}
                            label={'ステップ名'}
                            required
                            layout="horizontal"
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <Form.Item
                            name={'is_multi_appover'}
                            layout="horizontal"
                            label={'承認者の指定'}
                          >
                            <Checkbox />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.List name={['steps', index, 'employees']}>
                        {(fields, { add, remove }) => {
                          return (
                            <Space className="ml-4">
                              <Row gutter={[24, 24]}>
                                <Col>承認者</Col>
                                <Col>
                                  <CoreInput
                                    name={''}
                                    label={'部門（支社/部/課）'}
                                  />
                                </Col>
                                <Col>
                                  <CoreInput
                                    name={''}
                                    label={'社員・社員コード '}
                                    required
                                  />
                                </Col>
                              </Row>
                            </Space>
                          )
                        }}
                      </Form.List>
                    </div>
                  </Card>
                )
              })
            }}
          </Form.List>

          <Button
            type="primary"
            className="w-full"
            style={{
              marginTop: '20px',
              padding: '10px 0',
            }}
            onClick={() => {
              if (addRef.current) addRef?.current()
            }}
          >
            ＋ ステップを追加
          </Button>
        </div>
      </Form>
    </PageContainer>
  )
}

export default ApproveAction

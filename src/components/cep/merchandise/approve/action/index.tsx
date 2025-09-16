/* eslint-disable @typescript-eslint/no-unused-vars */
import { CloseOutlined, RightOutlined } from '@ant-design/icons'
import useApproveAction from '@components/cep/merchandise/approve/action/use-approve-action'
import { Action } from '@components/common/action'
import ShowMoreInfo from '@components/common/show-more-info'
import CoreInput from '@components/organism/CoreInput'
import PageContainer from '@components/organism/PageContainer'
import { PRIMARY, WHITE } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd'
import { useRef } from 'react'

const { Title } = Typography

function ApproveAction() {
  const [{ methods, isMultiAppover, isUpdate }, { t, setIsMultiApprove }] =
    useApproveAction()
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
          code: '123',
          name: '123',
          status: true,
          steps: [
            {
              name: '4',
              step_order: '5',
              is_multi_appover: false,
              employees: [
                {
                  id: 1,
                  department: 1,
                },
              ],
            },
          ],
        }}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Row>
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <CoreInput
              name={'name'}
              label={'ルートコード'}
              required
              layout="horizontal"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <CoreInput
              name={'code'}
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
              label={<span className="font-bold">ステータス</span>}
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
                console.log(item, 'dsfsdfsdf')
                return (
                  <Card
                    key={item.key}
                    style={{
                      marginBottom: '10px',
                    }}
                    headStyle={{
                      borderBottom: 'none',
                      minHeight: '0',
                      fontSize: '0',
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
                        {index !== 0 && (
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
                        )}
                      </Space>
                    }
                  >
                    <div className="mt-8">
                      <Row>
                        <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
                          <CoreInput
                            name={'name'}
                            label={'ステップ名'}
                            required
                            layout="horizontal"
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
                          <Form.Item
                            name={'is_multi_appover'}
                            layout="horizontal"
                            label={'承認者の指定'}
                          >
                            <Checkbox
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setIsMultiApprove(true)
                                } else {
                                  setIsMultiApprove(false)
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.List name={[item.name, 'employees']}>
                        {(fields2, { add: addEp, remove: removeEp }) => {
                          return (
                            <div className="flex flex-col">
                              {fields2.map((item2, index2) => {
                                return (
                                  <Space key={item2.key} className="ml-4">
                                    <Row gutter={[24, 24]}>
                                      <Col
                                        xs={24}
                                        sm={22}
                                        md={20}
                                        lg={16}
                                        xl={12}
                                        xxl={10}
                                      >
                                        承認者
                                      </Col>
                                      <Col
                                        xs={24}
                                        sm={22}
                                        md={20}
                                        lg={16}
                                        xl={12}
                                        xxl={10}
                                      >
                                        <CoreInput
                                          name={''}
                                          label={'部門（支社/部/課）'}
                                        />
                                      </Col>
                                      <Col
                                        xs={24}
                                        sm={22}
                                        md={20}
                                        lg={16}
                                        xl={12}
                                        xxl={10}
                                      >
                                        <CoreInput
                                          name={''}
                                          label={'社員・社員コード '}
                                          required
                                        />
                                      </Col>
                                      {index2 !== 0 && (
                                        <Col
                                          xs={24}
                                          sm={22}
                                          md={20}
                                          lg={16}
                                          xl={12}
                                          xxl={10}
                                        >
                                          <div className="mt-7">
                                            <Action
                                              actionList={['delete']}
                                              onDeleteAction={() => {
                                                removeEp(index2)
                                              }}
                                            />
                                          </div>
                                        </Col>
                                      )}
                                    </Row>
                                  </Space>
                                )
                              })}

                              {isMultiAppover && (
                                <Row>
                                  <Col>
                                    <Button
                                      type="primary"
                                      onClick={() => {
                                        addEp({})
                                      }}
                                    >
                                      ＋ 承認者を追加
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
              })
            }}
          </Form.List>

          <Button
            type="primary"
            className="w-full"
            style={{
              marginTop: '20px',
              padding: '20px 0',
            }}
            onClick={() => {
              if (addRef.current) addRef?.current()
            }}
          >
            ＋ ステップを追加
          </Button>
        </div>

        {isUpdate && (
          <>
            <Divider />

            <ShowMoreInfo
              descriptions={[
                {
                  title: t('common.created_by'),
                  value: '',
                  // data?.author?.name ??
                  // '---' +
                  //   ' ' +
                  //   dayjs(data?.created_at).format('YYYY/MM/DD HH:mm'),
                },
                {
                  title: t('common.updated_by'),
                  value: '',
                  // data?.editor?.name ??
                  // '---' +
                  //   ' ' +
                  //   dayjs(data?.updated_at).format('YYYY/MM/DD HH:mm'),
                },
              ]}
            />
          </>
        )}
      </Form>
    </PageContainer>
  )
}

export default ApproveAction

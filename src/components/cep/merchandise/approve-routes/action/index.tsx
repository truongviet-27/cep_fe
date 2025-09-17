/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CloseOutlined, RightOutlined } from '@ant-design/icons'
import { Action } from '@components/common/action'
import CoreAutoComplete from '@components/common/auto-complete'
import CoreInput from '@components/common/core-input'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { DeleteButton, useForm, useSelect } from '@refinedev/antd'
import {
  useGo,
  useParsed,
  useResource,
  useShow,
  useTranslate,
} from '@refinedev/core'
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
  Select,
  Space,
  Spin,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'

const { Title } = Typography

type Form = {
  id: number
  code: string
  name: string
  department: number
  status: 'active' | 'inactive'
  steps: {
    name: string
    step_order: number
    is_multi_appover: boolean
    employees: {
      employee_id: number | null
      code: string
      name: string
      department_id: number | null
      department: string
    }[]
  }[]
}

function ApproveAction() {
  const t = useTranslate()
  const { params } = useParsed()
  const [isMultiAppover, setIsMultiApprove] = useState<{
    [index: number]: boolean
  }>({})

  const go = useGo()

  const isUpdate = !!params?.id

  const methods = useForm<Form>({
    resource: 'approve-routes',
  })

  const { formProps, saveButtonProps, form, mutation } = methods

  const { getFieldValue, setFieldsValue, setFieldValue } = form

  const { resource } = useResource()

  const { query } = useShow({
    queryOptions: { enabled: isUpdate },
  })

  const { selectProps: selectPropsDp } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
    filters: [
      {
        field: 'without_approve_route',
        operator: 'eq',
        value: true,
      },
    ],
    onSearch: (value) => {
      return [
        {
          field: 'q',
          operator: 'eq',
          value,
        },
      ]
    },
  })

  const { selectProps: selectPropsDp2 } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
    onSearch: (value) => {
      return [
        {
          field: 'q',
          operator: 'eq',
          value,
        },
      ]
    },
  })

  useEffect(() => {
    if (query?.data?.data) {
      setFieldsValue({
        ...query?.data?.data,
        department: query.data.data.department?.id,
      })
    }
  }, [query?.data?.data])

  const onFinish = (values: any) => {
    if (isUpdate) {
      mutation.mutate(
        {
          resource: resource?.name,
          values: {
            ...values,
            department_id: values.department,
            steps: values.steps.map((item: any, index: number) => ({
              ...item,
              employees: item.employees.map((item: any) => ({
                department_id: item.department_id,
                id: item.employee_id,
              })),
              step_order: index + 1,
            })),
          },
          id: params?.id,
        },
        {
          onSuccess(data) {
            go({
              to: `/approve-routes/show/${data.data.id}`,
            })
          },
        },
      )
    } else {
      mutation.mutate(
        {
          resource: resource?.name,
          values: {
            ...values,
            department_id: values.department,
            steps: values.steps.map((item: any, index: number) => ({
              ...item,
              employees: item.employees.map((item: any) => ({
                department_id: item.department_id,
                id: item.employee_id,
              })),
              step_order: index + 1,
            })),
          },
        },
        {
          onSuccess(data) {
            go({
              to: `/approve-routes/show/${data.data.id}`,
            })
          },
        },
      )
    }
  }

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
              title: (
                <Title level={5}>{t('approve_routes.approve_routes')}</Title>
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={<Title level={5}>{t('approve_routes.approve_routes')}</Title>}
    >
      <Spin
        spinning={
          isUpdate
            ? query.isLoading || selectPropsDp.loading || selectPropsDp2.loading
            : false
        }
      >
        <Form
          {...formProps}
          initialValues={{
            code: '',
            name: '',
            department_id: null,
            status: 'active',
            steps: [
              {
                name: '',
                step_order: null,
                is_multi_appover: false,
                employees: [
                  {
                    employee_id: null,
                    code: '',
                    name: '',
                    department_id: null,
                    department: '',
                  },
                ],
              },
            ],
          }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
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
              <Form.Item
                name={'department'}
                label={boldText('部門（支社/部/課）')}
                required
                layout="horizontal"
                colon={false}
              >
                <Select
                  {...selectPropsDp}
                  // mode="multiple"
                  maxTagCount={'responsive'}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
              <Form.Item
                name={'status'}
                label={boldText('ステータス')}
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
                            <Col
                              xs={24}
                              sm={22}
                              md={20}
                              lg={16}
                              xl={12}
                              xxl={10}
                            >
                              <CoreInput
                                name={[item.name, 'name']}
                                label={'ステップ名'}
                                required
                                layout="horizontal"
                              />
                            </Col>
                          </Row>

                          <Row>
                            <Col
                              xs={24}
                              sm={22}
                              md={20}
                              lg={16}
                              xl={12}
                              xxl={10}
                            >
                              <Form.Item
                                name={[item.name, 'is_multi_appover']}
                                layout="horizontal"
                                label={
                                  <span className="font-bold">
                                    承認者の指定
                                  </span>
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
                                          <Col xs={24} md={4}>
                                            {boldText('承認者')}
                                          </Col>
                                          <Col xs={10} md={8}>
                                            <Form.Item
                                              label={boldText(
                                                '部門（支社/部/課）',
                                              )}
                                              name={[
                                                item2.name,
                                                'department_id',
                                              ]}
                                              labelCol={{ span: 24 }}
                                            >
                                              <Select
                                                {...selectPropsDp2}
                                                allowClear
                                                style={{
                                                  width: 200,
                                                }}
                                                onClear={() => {
                                                  setFieldValue(
                                                    [
                                                      'steps',
                                                      item.name,
                                                      'employee',
                                                      item2.name,
                                                      'employee_id',
                                                    ],
                                                    null,
                                                  )
                                                }}
                                              />
                                            </Form.Item>
                                          </Col>
                                          <Col xs={10} md={8}>
                                            <Form.Item
                                              label={boldText(
                                                '部門（支社/部/課）',
                                              )}
                                              name={[item2.name, 'employee_id']}
                                              labelCol={{ span: 24 }}
                                              required
                                            >
                                              <CoreAutoComplete
                                                nameFilter="department_id"
                                                filterPath={[
                                                  'steps',
                                                  item.name,
                                                  'employees',
                                                  item2.name,
                                                  'department_id',
                                                ]}
                                                resource="employees"
                                                style={{ width: 200 }}
                                              />
                                            </Form.Item>
                                          </Col>

                                          {fields2.length > 1 && (
                                            <Col
                                              className="mt-10"
                                              xs={4}
                                              md={2}
                                            >
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

                                  {(isMultiAppover[index] ||
                                    getFieldValue([
                                      'steps',
                                      item.name,
                                      'is_multi_appover',
                                    ])) && (
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
          {isUpdate && (
            <ShowMoreInfo
              descriptions={[
                {
                  title: '作成者',
                  value: (
                    <Space>
                      {query.data?.data?.author?.name}
                      {query.data?.data?.create_at}
                    </Space>
                  ),
                },
                {
                  title: '更新者',
                  value: (
                    <Space>
                      {query.data?.data?.editor?.name}
                      {query.data?.data?.update_at}
                    </Space>
                  ),
                },
              ]}
            />
          )}

          <Flex
            justify="space-between"
            style={{
              marginTop: 40,
            }}
          >
            <DeleteButton icon={null} size={'small'} />
            <Space>
              <Button
                type="default"
                onClick={() => {
                  go({
                    to: '/approve-routes',
                  })
                }}
              >
                {t('buttons.back')}
              </Button>

              <Button {...saveButtonProps} type="primary">
                {isUpdate ? t('buttons.edit') : t('buttons.create')}
              </Button>
            </Space>
          </Flex>
        </Form>
      </Spin>
    </PageContainer>
  )
}

export default ApproveAction

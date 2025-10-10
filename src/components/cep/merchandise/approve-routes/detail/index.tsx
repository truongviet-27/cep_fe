/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { DeleteButton, EditButton, useForm } from '@refinedev/antd'
import { useGo, useParsed, useShow, useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { BLACK, PRIMARY, WHITE } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect } from 'react'

const { Title } = Typography

type Form = {
  id: number
  code: string
  name: string
  departments: any
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

function ApproveDetail() {
  const t = useTranslate()
  const { params } = useParsed()

  const go = useGo()

  const isUpdate = !!params?.id

  const methods = useForm<Form>({
    resource: 'approve-routes',
    queryOptions: { enabled: false },
  })

  const { formProps, saveButtonProps, form } = methods

  const { setFieldsValue } = form

  const { query } = useShow({
    queryOptions: { enabled: isUpdate },
  })

  // const query = {} as any

  useEffect(() => {
    if (query?.data?.data) {
      setFieldsValue({ ...query?.data?.data })
    }
  }, [query])

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: boldText(t('approve_routes.parent')),
            },
            {
              title: boldText(t('approve_routes.detail'), PRIMARY),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={t('approve_routes.detail')}
    >
      <Spin spinning={query.isLoading}>
        <Form
          {...formProps}
          initialValues={{
            code: '',
            name: '',
            department: null,
            status: '',
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
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          labelAlign="left"
          style={{
            padding: 10,
          }}
        >
          <Row>
            <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
              <Form.Item
                label={boldText(t('approve_routes.labels.routeCode'))}
                layout="horizontal"
                colon={false}
                name={'code'}
              >
                {query.data?.data.name}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
              <Form.Item
                label={boldText(t('approve_routes.labels.routeName'))}
                layout="horizontal"
                colon={false}
                name={'name'}
              >
                {query.data?.data.code}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
              <Form.Item
                label={boldText(t('approve_routes.labels.department'))}
                layout="horizontal"
                colon={false}
                name={'departments'}
              >
                {query.data?.data.departments
                  ?.map((item: any) => item.name)
                  .join(', ')}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
              <Form.Item
                label={boldText(t('approve_routes.labels.status'))}
                layout="horizontal"
                colon={false}
                name={'status'}
              >
                {query.data?.data.status === 'active'
                  ? t('products.text.active')
                  : t('products.text.inactive')}
              </Form.Item>
            </Col>
          </Row>
          <Form.List name={'steps'}>
            {(fields) => {
              return fields.map((item, index) => {
                return (
                  <Card
                    key={item.key}
                    style={{
                      marginBottom: '10px',
                    }}
                    headStyle={{ borderBottom: 'none', minHeight: 'auto' }}
                    title={
                      <Space
                        style={{
                          background: PRIMARY,
                          color: WHITE,
                          padding: '5px 16px',
                          fontSize: 12,
                          fontWeight: 700,
                          borderRadius: '0 0px 4px 4px',
                        }}
                      >
                        {t('approve_routes.steps.step')}
                        {index + 1}
                      </Space>
                    }
                  >
                    <div className="">
                      <Row>
                        <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
                          <Form.Item
                            label={boldText(
                              t('approve_routes.labels.stepName'),
                            )}
                            name={[item.name, 'name']}
                            layout="horizontal"
                            colon={false}
                          >
                            {boldText(
                              form.getFieldValue(['steps', item.name, 'name']),
                              PRIMARY,
                            )}
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
                          {boldText(
                            t('approve_routes.labels.approverDesignation'),
                          )}
                        </Col>
                      </Row>

                      <Form.List name={[item.name, 'employees']}>
                        {(fields2) => {
                          return (
                            <div className="mt-4 ml-6 flex flex-col gap-4">
                              {fields2.map((item2) => {
                                return (
                                  <Row key={item2.key}>
                                    <Col xs={24} md={4}>
                                      {boldText(
                                        t(
                                          'approve_routes.show.employeeNameExample',
                                        ),
                                      )}
                                    </Col>
                                    <Col xs={24} md={20}>
                                      <Space>
                                        {form.getFieldValue([
                                          'steps',
                                          item.name,
                                          'employees',
                                          item2.name,
                                          'name',
                                        ])}
                                        {` (${form.getFieldValue([
                                          'steps',
                                          item.name,
                                          'employees',
                                          item2.name,
                                          'department',
                                        ])}
                                        ${form.getFieldValue([
                                          'steps',
                                          item.name,
                                          'employees',
                                          item2.name,
                                          'code',
                                        ])})`}
                                      </Space>
                                    </Col>
                                  </Row>
                                )
                              })}
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

          <Divider />
          <ShowMoreInfo
            descriptions={[
              {
                title: t('approve_routes.show.creator'),
                value:
                  (query.data?.data?.editor?.name ?? '--') +
                  ' ' +
                  dayjs(query.data?.data?.create_at).format('YYYY/MM/DD HH:mm'),
              },
              {
                title: t('approve_routes.show.updater'),
                value:
                  (query.data?.data?.editor?.name ?? '--') +
                  ' ' +
                  dayjs(query.data?.data?.update_at).format('YYYY/MM/DD HH:mm'),
              },
            ]}
          />

          <Flex
            justify="space-between"
            style={{
              marginTop: 40,
            }}
          >
            <DeleteButton
              icon={null}
              size={'small'}
              onSuccess={() => {
                go({
                  to: '/approve-routes',
                })
              }}
            />
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

              <EditButton
                type="primary"
                icon={false}
                onClick={() => {
                  go({
                    to: `/approve-routes/edit/${params?.id}`,
                  })
                }}
              >
                {t('buttons.edit')}
              </EditButton>
            </Space>
          </Flex>
        </Form>
      </Spin>
    </PageContainer>
  )
}

export default ApproveDetail

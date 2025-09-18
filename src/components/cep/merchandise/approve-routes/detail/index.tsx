/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { DeleteButton, useForm } from '@refinedev/antd'
import { useGo, useParsed, useShow, useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY, WHITE } from '@utility/color'
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

function ApproveDetail() {
  const t = useTranslate()
  const { params } = useParsed()

  const go = useGo()

  const isUpdate = !!params?.id

  const methods = useForm<Form>({
    resource: 'approve-routes',
  })

  const { formProps, saveButtonProps, form } = methods

  const { query } = useShow({
    queryOptions: { enabled: isUpdate },
  })

  console.log(form.getFieldsValue(), 'getFieldsValue')
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
      <Spin spinning={query.isLoading}>
        <Form
          {...formProps}
          initialValues={{ ...query?.data?.data }}
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
              >
                {form.getFieldValue('code')}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
              <Form.Item
                label={boldText(t('approve_routes.labels.routeName'))}
                layout="horizontal"
                colon={false}
              >
                {form.getFieldValue('name')}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
              <Form.Item
                label={boldText(t('approve_routes.labels.department'))}
                layout="horizontal"
                colon={false}
              >
                {form.getFieldValue('department')?.name}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
              <Form.Item
                label={boldText(t('approve_routes.labels.status'))}
                layout="horizontal"
                colon={false}
              >
                {form.getFieldValue('status')}
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
                                        -
                                        {form.getFieldValue([
                                          'steps',
                                          item.name,
                                          'employees',
                                          item2.name,
                                          'code',
                                        ])}
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
                value: (
                  <Space>
                    {query.data?.data?.author?.name}
                    {query.data?.data?.create_at}
                  </Space>
                ),
              },
              {
                title: t('approve_routes.show.updater'),
                value: (
                  <Space>
                    {query.data?.data?.editor?.name}
                    {query.data?.data?.update_at}
                  </Space>
                ),
              },
            ]}
          />

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

export default ApproveDetail

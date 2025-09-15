import { RightOutlined } from '@ant-design/icons'
import useApproveAction from '@components/cep/merchandise/approve/action/use-approve-action'
import PageContainer from '@components/organism/PageContainer'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Col, Form, Row, Typography } from 'antd'

const { Title } = Typography

function ApproveAction() {
  const [{ methods }, { t }] = useApproveAction()

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
      <Form {...formProps}>
        <Row>
          <Col></Col>
          <Col></Col>
        </Row>
        <Row>
          <Col></Col>
          <Col></Col>
        </Row>
        <Row>
          <Col></Col>
          <Col></Col>
        </Row>
        <Row>
          <Col></Col>
          <Col></Col>
        </Row>
      </Form>
    </PageContainer>
  )
}

export default ApproveAction

import { RightOutlined } from '@ant-design/icons'
import useApprove from '@components/cep/merchandise/approve/use-approve'
import CoreAutoComplete from '@components/common/auto-complete'
import PageContainer from '@components/common/page-container'
import CommonTable from '@components/common/table'
import { useGo } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Row,
  Select,
  Space,
  Typography,
} from 'antd'

const { Title } = Typography

function Approve() {
  const [{ methods, columns, dataSource }, { t }] = useApprove()

  const go = useGo()

  const { formProps, saveButtonProps } = methods

  return (
    <PageContainer
      title={
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
    >
      <Form
        layout="vertical"
        {...formProps}
        style={{
          marginBottom: '10px',
        }}
      >
        <Title
          level={5}
          style={{
            color: PRIMARY,
          }}
        >
          {t('approve.title')}
        </Title>
        <Row gutter={[16, 16]}>
          <Col md={24} xl={4}>
            <Form.Item label="ルートコード・ルート名" name="q">
              <CoreAutoComplete name="q" resource="departments" />
            </Form.Item>
          </Col>
          <Col md={24} xl={4}>
            <Form.Item label="部門 (支社/部/課)" name="department">
              <Select showSearch allowClear placeholder="選択してください">
                <Select.Option value="gijutsu">技術部</Select.Option>
                <Select.Option value="marketing">
                  マーケティング部
                </Select.Option>
                <Select.Option value="kaikei">会計部</Select.Option>
                <Select.Option value="koubai">購買部</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col md={24} xl={4}>
            <Form.Item label="ステータス" name="status">
              <Select showSearch placeholder="選択してください">
                <Select.Option value="valid">有効</Select.Option>
                <Select.Option value="invalid">無効</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col
            md={24}
            xl={12}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Space className="mt-[3px]">
              <Button {...saveButtonProps} type="primary">
                {t('buttons.search')}
              </Button>
              <Button onClick={() => formProps.form?.resetFields()}>
                {t('buttons.clear')}
              </Button>
            </Space>

            <Space className="mt-[3px]">
              <Button
                type="primary"
                size="middle"
                onClick={() => {
                  go({
                    to: '/approve/create',
                  })
                }}
              >
                {t('buttons.add')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      <CommonTable
        columns={columns}
        dataSource={dataSource}
        isPagination={true}
      />
    </PageContainer>
  )
}

export default Approve

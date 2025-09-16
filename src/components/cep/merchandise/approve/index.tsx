import { RightOutlined } from '@ant-design/icons'
import useApprove from '@components/cep/merchandise/approve/use-approve'
import CommonTable from '@components/common/table'
import PageContainer from '@components/organism/PageContainer'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Typography } from 'antd'

const { Title } = Typography

function Approve() {
  const [{}, { t }] = useApprove()

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
      <CommonTable columns={[]} dataSource={[]} />
    </PageContainer>
  )
}

export default Approve

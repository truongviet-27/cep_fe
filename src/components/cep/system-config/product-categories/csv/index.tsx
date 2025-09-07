import { RightOutlined } from '@ant-design/icons'
import useCSVContainer from '@components/cep/system-config/product-categories/csv/useCSVContainer'
import CoreStep from '@components/organism/CoreSteps'
import PageContainer from '@components/organism/PageContainer'
import { PRIMARY } from '@utility/color'
import { Breadcrumb } from 'antd'
import Title from 'antd/lib/typography/Title'

function CSVContainer() {
  const [{ steps, currentStep }, { t, setCurrentStep }] = useCSVContainer()
  return (
    <PageContainer
      title={
        <Breadcrumb
          items={[
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('123')}
                </Title>
              ),
            },
            {
              title: <Title level={5}>{t('456')}</Title>,
            },
          ]}
          separator={<RightOutlined />}
        />
      }
    >
      <Title level={4}>商品カテゴリCSV一括登録</Title>
      <CoreStep
        steps={steps}
        onChange={(value) => {
          setCurrentStep(value)
        }}
        currentStep={currentStep}
      />
    </PageContainer>
  )
}

export default CSVContainer

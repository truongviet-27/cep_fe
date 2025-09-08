import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import useCSVContainer from '@components/cep/system-config/product-categories/csv/useCSVContainer'
import CoreStep from '@components/organism/CoreSteps'
import PageContainer from '@components/organism/PageContainer'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Button, Form } from 'antd'
import Title from 'antd/lib/typography/Title'

function CSVContainer() {
  const [
    { methods, steps, currentStep },
    { t, setCurrentStep, onSubmit, onChangeStep },
  ] = useCSVContainer()
  const { formProps, saveButtonProps } = methods
  return (
    <PageContainer
      title={
        <Breadcrumb
          items={[
            {
              title: (
                <Title level={5} style={{ color: PRIMARY }}>
                  {t('system_config.system_config')}
                </Title>
              ),
            },
            {
              title: (
                <Title level={5}>{t('product_categories.csv.title')}</Title>
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
    >
      <Form {...formProps}>
        <Title level={4}>{t('product_categories.csv.title')}</Title>
        <CoreStep
          steps={steps}
          onChange={(value) => {
            setCurrentStep(value)
          }}
          currentStep={currentStep}
        />

        <div className="mt-4 flex justify-between">
          <div>
            {currentStep > 0 && (
              <Button
                type="link"
                onClick={() => {
                  onChangeStep(currentStep - 1)
                }}
              >
                <LeftOutlined />
                {t('product_categories.csv.buttons.back')}
              </Button>
            )}
          </div>
          <div className="flex justify-between gap-4">
            <Button>{t('product_categories.csv.buttons.cancel')}</Button>

            {currentStep === steps.length - 1 ? (
              <Button type="primary" {...saveButtonProps} onClick={onSubmit}>
                {t('product_categories.csv.buttons.submit')}
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  onChangeStep(currentStep + 1)
                }}
              >
                {t('product_categories.csv.buttons.nextStep')}
              </Button>
            )}
          </div>
        </div>
      </Form>
    </PageContainer>
  )
}

export default CSVContainer

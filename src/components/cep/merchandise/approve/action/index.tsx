/* eslint-disable @typescript-eslint/no-unused-vars */
import { RightOutlined } from '@ant-design/icons'
import useApproveAction from '@components/cep/merchandise/approve/action/use-approve-action'
import PageContainer from '@components/organism/PageContainer'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Typography } from 'antd'
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
      123
    </PageContainer>
  )
}

export default ApproveAction

import { MailFilled } from '@ant-design/icons'
import Tabs1 from '@app/container/system-config/email-template/tabs/content/tabs1'
import Tabs2 from '@app/container/system-config/email-template/tabs/content/tabs2'
import type { FormProps } from 'antd'
import { Card, Tabs } from 'antd'
import { useMemo } from 'react'

function TabsEmailTemplate({
  formProps,
  isEdit,
}: {
  formProps: FormProps
  isEdit: boolean
}) {
  const tags = useMemo(() => {
    return [
      '取引先会社名',
      '取引先部署名',
      '取引先担当者名',
      '自社名',
      '自社担当者名',
      '自社担当者メールアドレス',
      '自社担当者電話番号',
    ]
  }, [])

  const items = useMemo(() => {
    return [
      {
        key: '1',
        label: '見積書送付メール',
        children: (
          <Card
            styles={{
              header: {
                backgroundColor: '#F0F9FF',
              },
            }}
            title={
              <div className="flex items-center justify-start gap-4">
                <MailFilled
                  style={{
                    fontSize: '20px',
                    color: '#1890FF',
                  }}
                />
                見積書送付メール
              </div>
            }
          >
            <Tabs1 formProps={formProps} isEdit={isEdit} tags={tags} />
          </Card>
        ),
      },
      {
        key: '2',
        label: '見積書パスワード送付メール',
        children: (
          <Card
            styles={{
              header: {
                backgroundColor: '#F0F9FF',
              },
            }}
            title={
              <div className="flex items-center justify-start gap-4">
                <MailFilled
                  style={{
                    fontSize: '20px',
                    color: '#1890FF',
                  }}
                />
                見積書送付メール
              </div>
            }
          >
            <Tabs2 formProps={formProps} isEdit={isEdit} tags={tags} />
          </Card>
        ),
      },
    ]
  }, [isEdit])

  return (
    <Tabs
      destroyOnHidden
      items={items}
      onChange={(value) => {
        console.log(+value, 'xxxxxxxxx')
      }}
    />
  )
}

export default TabsEmailTemplate

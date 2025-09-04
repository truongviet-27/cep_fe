import { MailFilled } from '@ant-design/icons'
import TabsContent from '@app/container/system-config/mail-templates/tabs/content'
import { Card, Tabs } from 'antd'
import { useMemo } from 'react'

function TabsEmailTemplate({
  isEdit,
  onChange,
}: {
  isEdit: boolean
  onChange: (value: string) => void
}) {
  const tags = useMemo(() => {
    return [
      {
        value: 1,
        text: '取引先部署名',
      },
      {
        value: 2,
        text: '取引先担当者名',
      },
      {
        value: 3,
        text: '自社名',
      },
      {
        value: 4,
        text: '自社担当者名',
      },
      {
        value: 5,
        text: '自社担当者メールアドレス',
      },
      {
        value: 6,
        text: '自社担当者電話番号',
      },
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
            <TabsContent index={1} isEdit={isEdit} tags={tags} />
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
                見積書パスワード送付メール
              </div>
            }
          >
            <TabsContent index={2} isEdit={isEdit} tags={tags} />
          </Card>
        ),
      },
    ]
  }, [isEdit])

  return <Tabs destroyOnHidden items={items} onChange={onChange} />
}

export default TabsEmailTemplate

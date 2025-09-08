import { MailFilled } from '@ant-design/icons'
import TabsContent from '@components/cep/system-config/mail-templates/tabs/content'
import { useTranslate } from '@refinedev/core'
import { Card, Tabs } from 'antd'
import { useMemo } from 'react'

function TabsEmailTemplate({
  isEdit,
  onChange,
  isLoading,
}: {
  isEdit: boolean
  onChange: (value: string) => void
  isLoading: boolean
}) {
  const t = useTranslate()
  const tags = useMemo(() => {
    return [
      {
        value: 1,
        text: t('mail_templates.tags.customerCompany'),
      },
      {
        value: 2,
        text: t('mail_templates.tags.customerDepartment'),
      },
      {
        value: 3,
        text: t('mail_templates.tags.customerName'),
      },
      {
        value: 4,
        text: t('mail_templates.tags.selfCompany'),
      },
      {
        value: 5,
        text: t('mail_templates.tags.selfDepartment'),
      },
      {
        value: 6,
        text: t('mail_templates.tags.selfEmail'),
      },
      {
        value: 7,
        text: t('mail_templates.tags.selfTel'),
      },
    ]
  }, [])

  const items = useMemo(() => {
    return [
      {
        key: 'quota_mail',
        label: t('mail_templates.tab.quotation'),
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
                {t('mail_templates.tab.quotation')}
              </div>
            }
          >
            <TabsContent
              index={1}
              isEdit={isEdit}
              tags={tags}
              loading={isLoading}
            />
          </Card>
        ),
      },
      {
        key: 'quota_file_password',
        label: t('mail_templates.tab.password'),
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
                {t('mail_templates.tab.password')}
              </div>
            }
          >
            <TabsContent
              index={2}
              isEdit={isEdit}
              tags={tags}
              loading={isLoading}
            />
          </Card>
        ),
      },
    ]
  }, [isEdit, isLoading])

  return <Tabs destroyOnHidden items={items} onChange={onChange} />
}

export default TabsEmailTemplate

import { MailFilled } from '@ant-design/icons'
import TabsContent from '@components/cep/system-config/mail-templates/tabs/content'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { Card, Form, Input, Tabs } from 'antd'
import { useMemo } from 'react'

function TabsEmailTemplate({
  isEdit,
  onChange,
  isLoading,
  indexTab,
}: {
  isEdit: boolean
  onChange: (value: string) => void
  isLoading: boolean
  indexTab: number
}) {
  const t = useTranslate()
  const tags = useMemo(() => {
    return indexTab === 1
      ? [
          {
            value: 1,
            text: t('mail_templates.tags_mail.customerCompany'),
          },
          {
            value: 2,
            text: t('mail_templates.tags_mail.customerDepartment'),
          },
          {
            value: 3,
            text: t('mail_templates.tags_mail.customerName'),
          },
          {
            value: 4,
            text: t('mail_templates.tags_mail.selfCompany'),
          },
          {
            value: 5,
            text: t('mail_templates.tags_mail.selfDepartment'),
          },
          {
            value: 6,
            text: t('mail_templates.tags_mail.contactCompany'),
          },
          {
            value: 7,
            text: t('mail_templates.tags_mail.selfEmail'),
          },
          // {
          //   value: 8,
          //   text: t('mail_templates.tags_mail.selfTel'),
          // },
        ]
      : [
          {
            value: 1,
            text: t('mail_templates.tags_password.customerCompany'),
          },
          {
            value: 2,
            text: t('mail_templates.tags_password.customerDepartment'),
          },
          {
            value: 3,
            text: t('mail_templates.tags_password.customerName'),
          },
          {
            value: 4,
            text: t('mail_templates.tags_password.selfCompany'),
          },
          {
            value: 5,
            text: t('mail_templates.tags_password.contactCompany'),
          },
          {
            value: 6,
            text: t('mail_templates.tags_password.selfDepartment'),
          },
          {
            value: 7,
            text: t('mail_templates.tags_password.selfPassword'),
          },
          {
            value: 8,
            text: t('mail_templates.tags_password.selfEmail'),
          },
        ]
  }, [t, indexTab])

  const items = useMemo(() => {
    return [
      {
        key: 'quota_mail',
        label: t('mail_templates.tab.quotation'),
        children: (
          <>
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

            <Form.Item
              layout="horizontal"
              name="pdf_file_name_1"
              label={boldText(t('mail_templates.form.pdfFileName'))}
              colon
              required={isEdit}
              labelCol={{ flex: '0 0 auto', style: { whiteSpace: 'nowrap' } }}
              wrapperCol={{ flex: '1 1 auto' }}
              style={{ marginTop: '16px', alignItems: 'center' }}
              className="pdf-file-name-item"
              rules={
                isEdit
                  ? [
                      {
                        required: true,
                        message: t(
                          'mail_templates.validation.pdfFileName.required',
                        ),
                      },
                      {
                        max: 255,
                        message: t(
                          'mail_templates.validation.pdfFileName.max255',
                        ),
                      },
                      {
                        pattern: /^(?!\s*$).+/,
                        message: t(
                          'mail_templates.validation.pdfFileName.notBlank',
                        ),
                      },
                      {
                        pattern: /\.pdf$/i,
                        message: t(
                          'mail_templates.validation.pdfFileName.invalidExtension',
                        ),
                      },
                    ]
                  : []
              }
            >
              <Input
                variant={isEdit ? 'outlined' : 'borderless'}
                readOnly={!isEdit}
                name="pdf_file_name_1"
              />
            </Form.Item>
          </>
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

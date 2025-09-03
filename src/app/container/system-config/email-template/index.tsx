import { MailFilled, RightOutlined } from '@ant-design/icons'
import TabsEmailTemplate from '@app/container/system-config/email-template/tabs'
import useEmailTemplate from '@app/container/system-config/email-template/useEmailTemplate'
import { Show } from '@components/crud/show'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Button, Card } from 'antd'
import Title from 'antd/es/typography/Title'

function EmailTemplate() {
  const [{ methods, isEdit }, { t, setIsEdit }] = useEmailTemplate()
  const { formProps } = methods

  console.log(formProps.form?.getFieldsValue(['title']), 'xxxxxxxxxx')

  return (
    <Show
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
            { title: <Title level={5}>メールテンプレート設定</Title> },
          ]}
          separator={<RightOutlined />}
        />
      }
      footerButtons={
        isEdit ? (
          <div className="flex items-center justify-between gap-4">
            <Button
              type="text"
              style={{
                background: '#721C24',
                color: '#fff',
                fontWeight: 600,
              }}
              onClick={() => {
                formProps.form?.resetFields()
              }}
            >
              初期設定に戻す
            </Button>
            <div className="flex items-center gap-4">
              <Button
                type="text"
                style={{
                  background: '#fff',
                  borderColor: PRIMARY,
                  color: PRIMARY,
                  fontWeight: 600,
                }}
                onClick={() => {
                  setIsEdit(false)
                  formProps.form?.resetFields()
                }}
              >
                戻る
              </Button>
              <Button type="primary" onClick={() => {}}>
                保存
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="default"
            style={{
              background: '#fff',
              borderColor: PRIMARY,
              color: PRIMARY,
              fontWeight: 600,
            }}
            onClick={() => {
              setIsEdit(true)
            }}
          >
            編集
          </Button>
        )
      }
    >
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
        <TabsEmailTemplate formProps={formProps} isEdit={isEdit} />
      </Card>
    </Show>
  )
}

export default EmailTemplate

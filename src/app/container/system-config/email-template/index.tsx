import { RightOutlined } from '@ant-design/icons'
import TabsEmailTemplate from '@app/container/system-config/email-template/tabs'
import useEmailTemplate from '@app/container/system-config/email-template/useEmailTemplate'
import { Show } from '@components/crud/show'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Button, Card } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import Title from 'antd/es/typography/Title'

function EmailTemplate() {
  const [{ methods, isEdit }, { t, setIsEdit, onSubmit }] = useEmailTemplate()
  const { formProps, saveButtonProps } = methods

  return (
    <Card>
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
                <Button {...saveButtonProps} type="primary" onClick={onSubmit}>
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
        <TabsEmailTemplate formProps={formProps} isEdit={isEdit} />
      </Show>
      {isEdit && (
        <TextArea
          rows={6}
          value={`タグは必ず[[]]で囲って入力してください。
・署名は自動的に追加されるため、テンプレート内に記載する必要はありません。
・変更したテンプレートは「更新」ボタンを押すまで保存されません。
・テンプレートは見積書送付時に自動的に適用されます。
・入力欄上部のボタンをクリックすると、テンプレート内の任意の位置にタグを埋め込むことができます。埋め込まれたタグは、メール送信実行時に登録して表示されます。
（例）[[取引先会社名]] → ○○商事株式会社`}
          style={{
            marginTop: '10px',
          }}
          readOnly
          className="!resize-none"
        />
      )}
    </Card>
  )
}

export default EmailTemplate

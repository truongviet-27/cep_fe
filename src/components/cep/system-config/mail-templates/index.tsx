import { RightOutlined } from '@ant-design/icons'
import TabsEmailTemplate from '@components/cep/system-config/mail-templates/tabs'
import useMailTemplates from '@components/cep/system-config/mail-templates/useMailTemplates'
import PageContainer from '@components/organism/PageContainer'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Button, Form, Popconfirm, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import Title from 'antd/es/typography/Title'

function MailTemplate() {
  const [
    {
      methods,
      isEdit,
      openReset,
      openCancel,
      isFetching,
      indexTab,
      data,
      isLoadingSubmit,
    },
    { t, setIsEdit, onSubmit, onChangeTabs, setOpenReset, setOpenCancel },
  ] = useMailTemplates()

  const { formProps, form, saveButtonProps } = methods
  const { resetFields } = form

  console.log(methods, 'methods')

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
            { title: <Title level={5}>メールテンプレート設定</Title> },
          ]}
          separator={<RightOutlined />}
        />
      }
    >
      <Form
        {...formProps}
        initialValues={{
          [`title_${indexTab}`]: data?.title,
          [`content_${indexTab}`]: data?.body,
          [`signature_${indexTab}`]: data?.signature,
        }}
      >
        <Typography.Title
          level={5}
          style={{
            color: '#1890FF',
          }}
        >
          メールテンプレート設定
        </Typography.Title>
        <TabsEmailTemplate
          isEdit={isEdit}
          onChange={onChangeTabs}
          isLoading={isFetching}
        />

        <div className="my-4 text-right">
          {isEdit ? (
            <div className="flex items-center justify-between gap-4">
              <Popconfirm
                title="確認する"
                description="データをリセットしてもよろしいですか?"
                open={openReset}
                onConfirm={() => {
                  // setFieldsValue({
                  //   [`title_${indexTab}`]: data?.title,
                  //   [`content_${indexTab}`]: data?.body,
                  //   [`signature_${indexTab}`]: data?.signature,
                  // })
                  resetFields()
                  setOpenReset(!openReset)
                }}
                onCancel={() => {
                  setOpenReset(!openReset)
                }}
                okText={'確認する'}
                cancelText={'キャンセル'}
              >
                <Button
                  style={{
                    backgroundColor: '#721C24',
                    color: '#fff',
                    border: 'none',
                  }}
                  onClick={() => {
                    setOpenReset(!openReset)
                  }}
                >
                  初期設定に戻す
                </Button>
              </Popconfirm>

              <div className="flex items-center gap-4">
                <Popconfirm
                  title="確認する"
                  description="本当に戻って来ますか？"
                  open={openCancel}
                  onConfirm={() => {
                    // setFieldsValue({
                    //   [`title_${indexTab}`]: data?.title,
                    //   [`content_${indexTab}`]: data?.body,
                    //   [`signature_${indexTab}`]: data?.signature,
                    // })
                    resetFields()
                    setOpenCancel(!openCancel)
                    setIsEdit(false)
                  }}
                  onCancel={() => {
                    setOpenCancel(!openCancel)
                  }}
                  okText={'確認する'}
                  cancelText={'キャンセル'}
                >
                  <Button
                    style={{
                      background: '#fff',
                      borderColor: PRIMARY,
                      color: PRIMARY,
                      fontWeight: 600,
                    }}
                    type="primary"
                    onClick={() => {
                      setOpenCancel(!openCancel)
                    }}
                  >
                    戻る
                  </Button>
                </Popconfirm>
                <Button
                  {...saveButtonProps}
                  type="primary"
                  onClick={onSubmit}
                  loading={isLoadingSubmit}
                >
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
          )}
        </div>
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
              backgroundColor: '#F6F8FF',
            }}
            readOnly
            className="!resize-none"
          />
        )}
      </Form>
    </PageContainer>
  )
}

export default MailTemplate

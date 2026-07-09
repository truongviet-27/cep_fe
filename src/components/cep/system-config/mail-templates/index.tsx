import { RightOutlined } from '@ant-design/icons'
import TabsEmailTemplate from '@components/cep/system-config/mail-templates/tabs'
import useMailTemplates from '@components/cep/system-config/mail-templates/useMailTemplates'
import PageContainer from '@components/common/page-container'
import { EditButton } from '@refinedev/antd'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Button, Form, Popconfirm } from 'antd'
import TextArea from 'antd/es/input/TextArea'

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

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: boldText(t('system_config.system_config')),
            },
            {
              title: boldText(t('mail_templates.mail_templates'), PRIMARY),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={t('mail_templates.mail_templates')}
    >
      <Form
        {...formProps}
        initialValues={{
          [`title_${indexTab}`]: data?.title,
          [`content_${indexTab}`]: data?.body,
          [`signature_${indexTab}`]: data?.signature,
          ...(indexTab === 1 ? { pdf_file_name_1: data?.pdf_file_name } : {}),
        }}
      >
        <TabsEmailTemplate
          isEdit={isEdit}
          onChange={onChangeTabs}
          isLoading={isFetching}
          indexTab={indexTab}
        />

        <div className="my-4 text-right">
          {isEdit ? (
            <div className="flex items-center justify-between gap-4">
              <Popconfirm
                title={t('mail_templates.popup.reset.title')}
                description={t('mail_templates.popup.reset.message')}
                open={openReset}
                onConfirm={() => {
                  form.setFieldsValue(
                    indexTab === 1
                      ? {
                          [`title_${indexTab}`]: t(
                            'mail_templates.form.titleMail',
                          ),
                          [`content_${indexTab}`]: t(
                            'mail_templates.form.quotationMailTemplate',
                          ),
                          [`signature_${indexTab}`]: t(
                            'mail_templates.form.signature.content',
                          ),
                          [`pdf_file_name_${indexTab}`]: t(
                            'mail_templates.form.pdfFileNameDefault',
                          ),
                        }
                      : {
                          [`title_${indexTab}`]: t(
                            'mail_templates.form.titlePassword',
                          ),
                          [`content_${indexTab}`]: t(
                            'mail_templates.form.quotationPasswordTemplate',
                          ),
                          [`signature_${indexTab}`]: t(
                            'mail_templates.form.signature.content',
                          ),
                        },
                  )
                  setOpenReset(!openReset)
                }}
                onCancel={() => {
                  setOpenReset(!openReset)
                }}
                okText={t('mail_templates.popup.reset.okText')}
                cancelText={t('mail_templates.popup.reset.cancelText')}
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
                  {t('mail_templates.buttons.resetDefault')}
                </Button>
              </Popconfirm>

              <div className="flex items-center gap-4">
                <Popconfirm
                  title={t('mail_templates.popup.reset.okText')}
                  description={t('mail_templates.popup.cancel.message')}
                  open={openCancel}
                  onConfirm={() => {
                    resetFields()
                    setOpenCancel(!openCancel)
                    setIsEdit(false)
                  }}
                  onCancel={() => {
                    setOpenCancel(!openCancel)
                  }}
                  okText={t('mail_templates.popup.reset.okText')}
                  cancelText={t('mail_templates.popup.reset.cancelText')}
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
                    {t('mail_templates.buttons.back')}
                  </Button>
                </Popconfirm>
                <Button
                  {...saveButtonProps}
                  type="primary"
                  onClick={onSubmit}
                  loading={isLoadingSubmit}
                  autoInsertSpace={false}
                >
                  {t('buttons.save')}
                </Button>
              </div>
            </div>
          ) : (
            <EditButton
              variant="outlined"
              color="primary"
              onClick={() => {
                setIsEdit(true)
              }}
              icon={null}
              autoInsertSpace={false}
            >
              {t('mail_templates.buttons.edit')}
            </EditButton>
          )}
        </div>
        {isEdit && (
          <TextArea
            rows={6}
            value={t('mail_templates.form.note')}
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

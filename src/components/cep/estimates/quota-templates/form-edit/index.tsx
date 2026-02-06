import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { DeleteButton } from '@refinedev/antd'
import { useGo, useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import { Breadcrumb, Button, Divider, Flex, Form, Space, Spin } from 'antd'
import Link from 'next/link'
import { type FC } from 'react'

import BasicInfo from './basic-info'
import { useController } from './controller'
import DetailInfo from './detail-info'
import NoteForm from './note'
import OptionalInfo from './optional-info'
import TagForm from './tag'

const QuoteTemplateFormEditContainer: FC = () => {
  const t = useTranslate()
  const go = useGo()
  const { isUpdateMode, isLoading, methods, taxRoundingMethod } =
    useController()

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/quota-templates">
                  {boldText(t('quota_templates.breadcrumb.parent'))}
                </Link>
              ),
            },
            {
              title: boldText(
                isUpdateMode
                  ? t('quota_templates.form.titleUpdate')
                  : t('quota_templates.form.titleRegister'),
                PRIMARY,
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={
        isUpdateMode
          ? t('quota_templates.form.titleUpdate')
          : t('quota_templates.form.titleRegister')
      }
    >
      <Spin spinning={isLoading}>
        <Form
          {...methods.formProps}
          labelCol={{ xs: 24, sm: 8, md: 8, xl: 6, xxl: 5 }}
          labelAlign="left"
          autoComplete="off"
          name="basic"
          layout="horizontal"
          scrollToFirstError={{
            behavior: 'smooth',
            block: 'center',
          }}
        >
          <BasicInfo />
          <DetailInfo taxRoundingMethod={taxRoundingMethod} />
          <OptionalInfo />
          <NoteForm />
          <TagForm />
          <Divider />
          {isUpdateMode && (
            <ShowMoreInfo
              descriptions={[
                {
                  title: t('approve_routes.show.creator'),
                  value: '---',
                },
                {
                  title: t('approve_routes.show.updater'),
                  value: '---',
                },
              ]}
            />
          )}

          <Flex
            justify="space-between"
            style={{
              marginTop: 40,
            }}
          >
            <Space>
              {isUpdateMode && (
                <DeleteButton
                  icon={null}
                  size={'small'}
                  onSuccess={() => {
                    go({
                      to: '/quota-templates',
                    })
                  }}
                />
              )}
            </Space>
            <Space className="items-end">
              <Button {...methods.saveButtonProps} type="primary">
                {isUpdateMode ? t('buttons.save') : t('buttons.create')}
              </Button>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => {
                  go({
                    to: '/quota-templates',
                  })
                }}
              >
                {t('buttons.back')}
              </Button>
            </Space>
          </Flex>
        </Form>
      </Spin>
    </PageContainer>
  )
}

export default QuoteTemplateFormEditContainer

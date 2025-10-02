import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { DeleteButton } from '@refinedev/antd'
import { useGo, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import {
  Breadcrumb,
  Button,
  Divider,
  Flex,
  Form,
  Space,
  Typography,
} from 'antd'
import Link from 'next/link'
import { type FC } from 'react'

import BasicInfo from './basic-info'
import { useController } from './controller'
import DetailInfo from './detail-info'
import NoteForm from './note'
import OptionalInfo from './optional-info'
import TagForm from './tag'

const { Title } = Typography

const QuoteTemplateFormEditContainer: FC = () => {
  const t = useTranslate()
  const go = useGo()
  const { isUpdateMode, methods } = useController()

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/quota-templates">
                  <Title level={5} style={{ color: PRIMARY }}>
                    {t('quota_templates.breadcrumb.home')}
                  </Title>
                </Link>
              ),
            },
            {
              title: (
                <Title level={5}>
                  {isUpdateMode
                    ? t('quota_templates.breadcrumb.quotasUpdate')
                    : t('quota_templates.breadcrumb.quotasRegister')}
                </Title>
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
      <Form {...methods.formProps} labelCol={{ span: 2 }} labelAlign="left">
        <BasicInfo />
        <DetailInfo />
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
            <Button
              type="default"
              onClick={() => {
                go({
                  to: '/quota-templates',
                })
              }}
            >
              {t('buttons.back')}
            </Button>

            <Button {...methods.saveButtonProps} type="primary">
              {isUpdateMode ? t('buttons.save') : t('buttons.create')}
            </Button>
          </Space>
        </Flex>
      </Form>
    </PageContainer>
  )
}

export default QuoteTemplateFormEditContainer

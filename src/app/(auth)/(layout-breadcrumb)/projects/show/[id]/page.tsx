'use client'

import { RightOutlined } from '@ant-design/icons'
import { CommonShow } from '@components/common/show'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { DateField, TextField } from '@refinedev/antd'
import { useGo, useParsed, useShow } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Button, Space, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'

const { Title } = Typography

const Page = () => {
  const { query } = useShow()
  const { data, isLoading } = query

  const record = data?.data

  const { t, t_breadcrumb, t_buttons } = {
    t: useTranslations('projects.create'),
    t_breadcrumb: useTranslations('breadcrumb'),
    t_buttons: useTranslations('buttons'),
  }
  const go = useGo()
  const { id } = useParsed()

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t_breadcrumb('projects')}
        </Title>
      ),
    },
    {
      title: <Title level={5}>{t('title')}</Title>,
    },
  ]

  return (
    <CommonShow
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      isLoading={isLoading}
      footerButtons={
        <Space>
          <Button
            onClick={() =>
              go({
                to: '/projects',
                type: 'push',
              })
            }
          >
            {t_buttons('back')}
          </Button>
          <Button
            onClick={() =>
              go({
                to: `/projects/edit/${id}`,
                type: 'push',
              })
            }
            type="primary"
          >
            {t_buttons('edit')}
          </Button>
        </Space>
      }
    >
      <Title level={5}>{t('fields.projectCode.label')}</Title>
      <TextField value={record?.projectCode} />
      <Title level={5}>{t('fields.projectName.label')}</Title>
      <TextField value={record?.projectName} />
      <Title level={5}>{t('fields.customer.label')}</Title>
      <TextField value={record?.customer} />
      <Title level={5}>{t('fields.author.label')}</Title>
      <TextField value={record?.author} />
      <Title level={5}>{t('fields.updatedDate')}</Title>
      <DateField value={record?.updatedDate} />
      <Title level={5}>{t('fields.createdAt')}</Title>
      <DateField value={record?.createdAt} />
      <Title level={5}>{t('fields.status')}</Title>
      <TextField value={record?.status} />
      <Title level={5}>{t('fields.remarks.label')}</Title>
      <TextField value={record?.description} />
    </CommonShow>
  )
}

export default Page

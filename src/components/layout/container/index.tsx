'use client'

import { PRIMARY } from '@utility/color'
import { Layout, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'

import Breadcrumb from '../breadcrumbs'

const { Content } = Layout
const { Title } = Typography

export default function AuthContainer({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const t = useTranslations('breadcrumb')
  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('system')}
        </Title>
      ),
    },
  ]

  return (
    <Content>
      <Breadcrumb items={breadcrumbItems} />
      <div className="px-6 pb-6">{children}</div>
    </Content>
  )
}

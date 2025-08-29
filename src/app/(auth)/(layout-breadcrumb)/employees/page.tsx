'use client'
import { RightOutlined } from '@ant-design/icons'
import { List } from '@components/crud/list'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { useTranslate } from '@refinedev/core'
import { AntdInferencer } from '@refinedev/inferencer/antd'
import { PRIMARY } from '@utility/color'
import { Typography } from 'antd'
import React from 'react'

const { Title } = Typography

function Page() {
  const t = useTranslate()

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('employees.employees')}
        </Title>
      ),
    },
  ]
  return (
    <List
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
    >
      <AntdInferencer />
    </List>
  )
}

export default Page

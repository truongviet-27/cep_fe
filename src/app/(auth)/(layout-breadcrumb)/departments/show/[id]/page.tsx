'use client'

import { RightOutlined } from '@ant-design/icons'
import { DetailItem } from '@components/common/detail-item'
import ShowMoreInfo from '@components/common/show-more-info'
import { Show } from '@components/crud/show'
import Breadcrumbs from '@components/layout/breadcrumbs'
import type { IDepartments } from '@interfaces/departments'
import { DeleteButton, EditButton } from '@refinedev/antd'
import { useShow, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

const { Title } = Typography

export default function Page() {
  const t = useTranslate()
  const { queryResult } = useShow<IDepartments>()

  const departmentData = queryResult?.data?.data

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('system_config.system_config')}
        </Title>
      ),
    },
    { title: <Title level={5}>部門登録</Title> },
  ]

  return (
    <Show
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={'部門登録'}
      footerButtons={
        <div>
          <ShowMoreInfo
            descriptions={[
              {
                title: t('common.created_by'),
                value: `${departmentData?.author?.name ?? '---'} ${dayjs(
                  departmentData?.created_at,
                ).format('YYYY/MM/DD HH:mm')}`,
              },
              {
                title: t('common.updated_by'),
                value: departmentData?.editor?.name
                  ? `${departmentData.editor.name} ${dayjs(
                      departmentData.updated_at,
                    ).format('YYYY/MM/DD HH:mm')}`
                  : '---',
              },
            ]}
          />
          <div className="mt-4 flex w-full justify-start pb-4">
            <DeleteButton icon={null} size={'small'} />
          </div>
        </div>
      }
      rightFooterButtons={<EditButton icon={null} type={'primary'} />}
    >
      <div className="flex flex-col space-y-6">
        <DetailItem label={'部門コード'}>{departmentData?.code}</DetailItem>
        <DetailItem label={'部門名（支社/部/課）'}>
          {departmentData?.name}
        </DetailItem>
        <DetailItem label={'部門コード'}>
          {departmentData?.number_of_employee}
        </DetailItem>
      </div>
    </Show>
  )
}

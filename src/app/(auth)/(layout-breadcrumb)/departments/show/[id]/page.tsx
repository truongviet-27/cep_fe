'use client'

import { RightOutlined } from '@ant-design/icons'
import { DetailItem } from '@components/common/detail-item'
import ShowMoreInfo from '@components/common/show-more-info'
import { Show } from '@components/crud/show'
import Breadcrumbs from '@components/layout/breadcrumbs'
import type { IDepartments } from '@interfaces/departments'
import { DeleteButton, EditButton } from '@refinedev/antd'
import { useGo, useShow, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { FORMAT_DATE_TIME } from '@utility/instances'
import { Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

const { Title } = Typography

export default function Page() {
  const t = useTranslate()
  const { queryResult } = useShow<IDepartments>()
  const go = useGo()

  const departmentData = queryResult?.data?.data

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('departments.departments')}
        </Title>
      ),
    },
    { title: <Title level={5}>{t('departments.show.show')}</Title> },
  ]

  return (
    <Show
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={t('departments.show.show')}
      footerButtons={
        <div>
          <ShowMoreInfo
            descriptions={[
              {
                title: t('approve_routes.show.creator'),
                value: `${departmentData?.author?.name ?? '---'} ${dayjs(
                  departmentData?.created_at,
                ).format(FORMAT_DATE_TIME)}`,
              },
              {
                title: t('common.updated_by'),
                value: departmentData?.editor?.name
                  ? `${departmentData.editor.name} ${dayjs(
                      departmentData.updated_at,
                    ).format(FORMAT_DATE_TIME)}`
                  : '---',
              },
            ]}
          />
          <div className="mt-4 flex w-full justify-start pb-4">
            <DeleteButton
              icon={null}
              size={'small'}
              onSuccess={() => go({ type: 'replace', to: '/departments' })}
            />
          </div>
        </div>
      }
      rightFooterButtons={<EditButton icon={null} type={'primary'} />}
    >
      <div className="flex flex-col space-y-6">
        <DetailItem label={t('departments.fields.code')}>
          {departmentData?.code}
        </DetailItem>
        <DetailItem label={t('departments.fields.name')}>
          {departmentData?.name}
        </DetailItem>
        <DetailItem label={t('departments.fields.number_of_employee')}>
          {departmentData?.number_of_employee}
        </DetailItem>
      </div>
    </Show>
  )
}

'use client'

import { RightOutlined, WarningOutlined } from '@ant-design/icons'
import { DetailItem } from '@components/common/detail-item'
import ShowMoreInfo from '@components/common/show-more-info'
import { Show } from '@components/crud/show'
import Breadcrumbs from '@components/layout/breadcrumbs'
import { EditButton, useSelect } from '@refinedev/antd'
import { useResource, useShow, useTranslate } from '@refinedev/core'
import type { Employee } from '@sdk/hey-api'
import { DARK_RED, GREY, PRIMARY, WARNING } from '@utility/color'
import { Space, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

const { Title, Text } = Typography

export default function EmployeeShow() {
  const t = useTranslate()
  const { id } = useResource()
  const { queryResult } = useShow<Employee>()
  const employeeData = queryResult?.data?.data

  const { selectProps: departmentSelectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
  })

  const departmentName = String(
    departmentSelectProps.options?.find(
      (option) => option.value === employeeData?.department?.id,
    )?.label ?? '---',
  )

  const colorMap: Record<'employee' | 'manager', string> = {
    manager: DARK_RED,
    employee: GREY,
  }

  const roleColor = employeeData?.role
    ? colorMap[employeeData?.role?.name as 'employee' | 'manager']
    : 'default'

  const renderValue = (value: string | undefined | null) => {
    if (!value || value === '---') {
      return (
        <Space>
          <Text>{t('common.not_set')}</Text>
          <WarningOutlined style={{ color: WARNING }} />
        </Space>
      )
    }
    return <Text>{value}</Text>
  }

  const breadcrumbItems = [
    {
      title: (
        <Title level={5} style={{ color: PRIMARY }}>
          {t('employees.employees')}
        </Title>
      ),
    },
    { title: <Title level={5}>{t('employees.show.show')}</Title> },
  ]

  return (
    <Show
      isLoading={queryResult?.isLoading}
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={t('employees.show.show')}
      footerButtons={
        <ShowMoreInfo
          descriptions={[
            {
              title: t('common.created_by'),
              value: `${employeeData?.created_by?.name ?? '---'} ${dayjs(
                employeeData?.created_by?.date,
              ).format('YYYY/MM/DD HH:mm')}`,
            },
            {
              title: t('common.updated_by'),
              value: employeeData?.updated_by
                ? `${employeeData.updated_by.name} ${dayjs(
                    employeeData.updated_by.date,
                  ).format('YYYY/MM/DD HH:mm')}`
                : '---',
            },
          ]}
        />
      }
      rightFooterButtons={
        <Space size={2} className="flex justify-end">
          <EditButton icon={null} recordItemId={id} type="primary" />
        </Space>
      }
    >
      <div className="flex flex-col space-y-6">
        <DetailItem label={t('employees.fields.code')}>
          {renderValue(employeeData?.code)}
        </DetailItem>
        <DetailItem label={t('employees.fields.name')}>
          {renderValue(employeeData?.name)}
        </DetailItem>
        <DetailItem label={t('employees.fields.email')}>
          {renderValue(employeeData?.email)}
        </DetailItem>
        <DetailItem label={t('employees.fields.department')}>
          {renderValue(departmentName)}
        </DetailItem>
        <DetailItem label={t('employees.fields.role')}>
          {employeeData?.role ? (
            <Tag color={roleColor}>
              {t(`employees.roles.${employeeData.role?.name}`)}
            </Tag>
          ) : (
            renderValue(undefined)
          )}
        </DetailItem>
      </div>
    </Show>
  )
}

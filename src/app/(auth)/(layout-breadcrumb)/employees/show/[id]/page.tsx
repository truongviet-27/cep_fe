'use client'

import { RightOutlined, WarningOutlined } from '@ant-design/icons'
import ShowMoreInfo from '@components/common/show-more-info'
import { Show } from '@components/crud/show'
import Breadcrumbs from '@components/layout/breadcrumbs'
import type { IEmployee } from '@interfaces/employee'
import { DeleteButton, EditButton, useSelect } from '@refinedev/antd'
import { useResource, useShow, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Col, Row, Space, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

const { Title, Text } = Typography

const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <Row align="middle" gutter={[16, 16]}>
    <Col xs={24} md={6}>
      <Text strong>{label}</Text>
    </Col>
    <Col xs={24} md={18}>
      {children}
    </Col>
  </Row>
)

export default function EmployeeShow() {
  const t = useTranslate()
  const { id } = useResource()
  const { queryResult } = useShow<IEmployee>()
  const employeeData = queryResult?.data?.data

  const { selectProps: departmentSelectProps } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
    defaultValue: employeeData?.department_id,
  })

  const departmentName = String(
    departmentSelectProps.options?.find(
      (option) => option.value === employeeData?.department_id,
    )?.label ?? '---',
  )

  const colorMap: Record<'manual' | 'automatic', string> = {
    automatic: '#9a2e2e',
    manual: '#808080',
  }

  const roleColor = employeeData?.role
    ? colorMap[employeeData?.role as 'manual' | 'automatic']
    : 'default'

  const renderValue = (value: string | undefined | null) => {
    if (!value || value === '---') {
      return (
        <Space>
          <Text>{t('common.not_set')}</Text>
          <WarningOutlined style={{ color: '#AC3C00' }} />
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
    { title: <Title level={5}>社員編集</Title> },
  ]

  return (
    <Show
      isLoading={queryResult?.isLoading}
      title={
        <Breadcrumbs items={breadcrumbItems} separator={<RightOutlined />} />
      }
      i18nHeading={'社員編集'}
      footerButtonProps={{
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          padding: 24,
        },
      }}
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
          <DeleteButton recordItemId={id} />
          <EditButton recordItemId={id} type="primary" />
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
              {t(`employees.roles.${employeeData.role}`)}
            </Tag>
          ) : (
            renderValue(undefined)
          )}
        </DetailItem>
      </div>
    </Show>
  )
}
